# recommender/generate_products.py
import pandas as pd

products = [
    {"name": "Samsung Galaxy S24 Ultra", "description": "5G smartphone, 512GB, titanium black", "price": 1299.99, "discount": 10, "images": "https://m.media-amazon.com/images/I/71N+OxJ+rcL._AC_SL1500_.jpg", "stock": 50, "categoryId": "5851de94-4863-415e-a9da-a5b9f68cc9b2"},
    {"name": "Apple AirPods Pro 2", "description": "Wireless earbuds with MagSafe case", "price": 249.99, "discount": 5, "images": "https://m.media-amazon.com/images/I/61fUCBxMHrL._AC_SL1500_.jpg", "stock": 120, "categoryId": "5851de94-4863-415e-a9da-a5b9f68cc9b2"},
    {"name": "Sony 65\" OLED TV", "description": "4K HDR smart TV, Bravia XR", "price": 1999.99, "discount": 15, "images": "https://www.bestbuy.com/site/sku/6501495.p?skuId=6501495.jpg", "stock": 20, "categoryId": "5851de94-4863-415e-a9da-a5b9f68cc9b2"},
    {"name": "Ninja Air Fryer Max", "description": "5.5-quart air fryer, stainless steel", "price": 129.99, "discount": 0, "images": "https://m.media-amazon.com/images/I/71+5W4k8z3L._AC_SL1500_.jpg", "stock": 80, "categoryId": "5851de94-4863-415e-a9da-a5b9f68cc9b2"},
    {"name": "Dyson V15 Detect", "description": "Cordless vacuum with laser dust detection", "price": 699.99, "discount": 20, "images": "https://www.dyson.com/content/dam/dyson/products/vacuums/v15-detect.jpg", "stock": 30, "categoryId": "5851de94-4863-415e-a9da-a5b9f68cc9b2"},
    {"name": "Bose QuietComfort 45", "description": "Noise-canceling over-ear headphones", "price": 329.99, "discount": 10, "images": "https://m.media-amazon.com/images/I/51j3fP5q2PL._AC_SL1500_.jpg", "stock": 60, "categoryId": "5851de94-4863-415e-a9da-a5b9f68cc9b2"},
    {"name": "HP Spectre x360 14", "description": "2-in-1 laptop, Intel i7, 16GB RAM", "price": 1499.99, "discount": 5, "images": "https://store.hp.com/us/en/pdp/spectre-x360-14-ea0000.jpg", "stock": 25, "categoryId": "5851de94-4863-415e-a9da-a5b9f68cc9b2"},
    {"name": "Canon EOS R10", "description": "Mirrorless camera, 24.2MP", "price": 979.99, "discount": 0, "images": "https://i1.adis.ws/i/canon/eos-r10-front.jpg", "stock": 15, "categoryId": "5851de94-4863-415e-a9da-a5b9f68cc9b2"},
    {"name": "Fitbit Charge 6", "description": "Fitness tracker with heart rate monitoring", "price": 159.99, "discount": 5, "images": "https://m.media-amazon.com/images/I/61z4Xy5fW8L._AC_SL1500_.jpg", "stock": 100, "categoryId": "5851de94-4863-415e-a9da-a5b9f68cc9b2"},
    {"name": "Anker PowerCore 10000", "description": "Portable charger, 10000mAh", "price": 29.99, "discount": 0, "images": "https://m.media-amazon.com/images/I/61z4Xy5fW8L._AC_SL1500_.jpg", "stock": 200, "categoryId": "5851de94-4863-415e-a9da-a5b9f68cc9b2"},
]

# Generate 100 products
for i in range(len(products), 100):
    products.append({
        "name": f"Generic Product {i+1}",
        "description": f"Description for generic product {i+1}",
        "price": round(19.99 + (i % 50) * 10, 2),
        "discount": i % 20,
        "images": f"https://i5.walmartimages.com/asr/generic-{i%10}.jpg",
        "stock": 10 + (i % 90),
        "categoryId": "5851de94-4863-415e-a9da-a5b9f68cc9b2"
    })

# Ensure unique names
seen = set()
for i, p in enumerate(products):
    base_name = p["name"]
    count = 1
    while p["name"] in seen:
        p["name"] = f"{base_name} ({count})"
        count += 1
    seen.add(p["name"])

# Save to XLSX
df = pd.DataFrame(products)
df.to_excel("products.xlsx", index=False)
print("Created products.xlsx with 100 products")