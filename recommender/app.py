# recommender/app.py
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os
from prisma import Prisma
import re
import asyncio

app = Flask(__name__)
prisma = Prisma()
MODEL_PATH = "recommender_model.pkl"
API_KEY = os.getenv("RECOMMENDER_API_KEY", "your-secret-key")

def clean_text(text):
    if not text:
        return ""
    text = str(text)
    text = re.sub(r"[^\w\s]", "", text)
    return text.lower()

async def load_products():
    await prisma.connect()
    products = await prisma.product.find_many(
        include={
            "reviews": {"select": {"comment": True}},
            "category": {"select": {"name": True}}
        }
    )
    await prisma.disconnect()
    
    df = pd.DataFrame([
        {
            "id": p.id,
            "title": p.name,
            "description": p.description or "",
            "category": p.category.name if p.category else "",
            "comments": " ".join([r.comment or "" for r in p.reviews])
        }
        for p in products
    ])
    
    df["combined_features"] = (
        df["title"].apply(clean_text) + " " +
        df["description"].apply(clean_text) + " " +
        df["category"].apply(clean_text) + " " +
        df["comments"].apply(clean_text)
    )
    
    return df

def train_model(df):
    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    tfidf_matrix = vectorizer.fit_transform(df["combined_features"])
    similarity_matrix = cosine_similarity(tfidf_matrix)
    return vectorizer, tfidf_matrix, similarity_matrix

def save_model(vectorizer, tfidf_matrix, similarity_matrix, df):
    with open(MODEL_PATH, "wb") as f:
        pickle.dump({
            "vectorizer": vectorizer,
            "tfidf_matrix": tfidf_matrix,
            "similarity_matrix": similarity_matrix,
            "df": df
        }, f)

def load_model():
    if not os.path.exists(MODEL_PATH):
        return None, None, None, None
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    return (
        model["vectorizer"],
        model["tfidf_matrix"],
        model["similarity_matrix"],
        model["df"]
    )

async def initialize_model():
    vectorizer, tfidf_matrix, similarity_matrix, df = load_model()
    if vectorizer is None:
        df = await load_products()
        if df.empty:
            return None, None, None, df
        vectorizer, tfidf_matrix, similarity_matrix = train_model(df)
        save_model(vectorizer, tfidf_matrix, similarity_matrix, df)
    return vectorizer, tfidf_matrix, similarity_matrix, df

def get_recommendations(product_id, num_recommendations=5):
    _, _, similarity_matrix, df = load_model()
    if df is None or product_id not in df["id"].values:
        return []
    
    idx = df.index[df["id"] == product_id].tolist()[0]
    sim_scores = list(enumerate(similarity_matrix[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    top_indices = [i[0] for i in sim_scores[1:num_recommendations+1]]
    
    return df.iloc[top_indices][["id", "title", "category"]].to_dict(orient="records")

@app.route("/recommend", methods=["POST"])
async def recommend():
    data = request.get_json()
    product_id = data.get("product_id")
    num_recommendations = data.get("num_recommendations", 5)
    
    if not product_id:
        return jsonify({"error": "product_id is required"}), 400
    
    recommendations = get_recommendations(product_id, num_recommendations)
    return jsonify({
        "product_id": product_id,
        "recommendations": recommendations
    }), 200

@app.route("/retrain", methods=["POST"])
async def retrain():
    api_key = request.headers.get("X-API-Key")
    if api_key != API_KEY:
        return jsonify({"error": "Invalid API key"}), 401
    
    try:
        df = await load_products()
        if df.empty:
            return jsonify({"error": "No products found"}), 400
        
        vectorizer, tfidf_matrix, similarity_matrix = train_model(df)
        save_model(vectorizer, tfidf_matrix, similarity_matrix, df)
        return jsonify({"message": "Model retrained successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrain model: {str(e)}"}), 500

if __name__ == "__main__":
    asyncio.run(prisma.connect())
    vectorizer, tfidf_matrix, similarity_matrix, df = asyncio.run(initialize_model())
    app.run(host="0.0.0.0", port=5000)