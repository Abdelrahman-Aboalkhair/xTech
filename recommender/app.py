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

def clean_text(text):
    if not text:
        return ""
    text = str(text)
    text = re.sub(r"[^\w\s]", "", text)
    return text.lower()

async def load_products():
    await prisma.connect()
    products = await prisma.product.find_many(
        include={"reviews": {"select": {"comment": True}}}
    )
    await prisma.disconnect()
    
    df = pd.DataFrame([
        {
            "id": p.id,
            "title": p.name,
            "description": p.description or "",
            "category": p.categoryId or "",
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

async def update_model(new_data):
    vectorizer, tfidf_matrix, similarity_matrix, df = load_model()
    if vectorizer is None:
        return False
    
    product = await prisma.product.find_unique(
        where={"id": new_data["id"]},
        include={"reviews": {"select": {"comment": True}}}
    )
    if not product:
        return False

    new_features = (
        clean_text(new_data["title"]) + " " +
        clean_text(new_data.get("description", "")) + " " +
        clean_text(new_data.get("category", "")) + " " +
        clean_text(" ".join([r.comment or "" for r in product.reviews]))
    )
    
    new_vector = vectorizer.transform([new_features])
    
    new_df = pd.DataFrame([{
        "id": new_data["id"],
        "title": new_data["title"],
        "description": new_data.get("description", ""),
        "category": new_data.get("category", ""),
        "comments": " ".join([r.comment or "" for r in product.reviews]),
        "combined_features": new_features
    }])
    
    # Check if product exists in DataFrame
    if new_data["id"] in df["id"].values:
        idx = df.index[df["id"] == new_data["id"]].tolist()[0]
        df.loc[idx] = new_df.iloc[0]
        tfidf_matrix[idx] = new_vector
        new_sim = cosine_similarity(new_vector, tfidf_matrix)[0]
        similarity_matrix[idx] = new_sim
        similarity_matrix[:, idx] = new_sim
    else:
        df = pd.concat([df, new_df], ignore_index=True)
        tfidf_matrix = np.vstack([tfidf_matrix.toarray(), new_vector.toarray()])
        new_sim = cosine_similarity(new_vector, tfidf_matrix[:-1])[0]
        new_sim = np.append(new_sim, 1.0)
        similarity_matrix = np.vstack([similarity_matrix, new_sim[:-1]])
        similarity_matrix = np.hstack([similarity_matrix, new_sim.reshape(-1, 1)])
    
    save_model(vectorizer, tfidf_matrix, similarity_matrix, df)
    return True

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

@app.route("/update", methods=["POST"])
async def update():
    data = request.get_json()
    product = {
        "id": data.get("id"),
        "title": data.get("title"),
        "description": data.get("description"),
        "category": data.get("category"),
        "comment": data.get("comment"), 
    }
    
    if not all([product["id"], product["title"]]):
        return jsonify({"error": "id and title are required"}), 400
    
    success = await update_model(product)
    if success:
        return jsonify({"message": "Model updated successfully"}), 200
    return jsonify({"error": "Failed to update model"}), 500

if __name__ == "__main__":
    asyncio.run(prisma.connect())
    vectorizer, tfidf_matrix, similarity_matrix, df = asyncio.run(initialize_model())
    app.run(host="0.0.0.0", port=5000)