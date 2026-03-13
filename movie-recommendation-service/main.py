from fastapi import FastAPI
import random

app = FastAPI()

# Dummy recommendation function – replace with real logic later
def get_recommendations(user_id: int):
    # For demo, return random movie IDs (1-20)
    # In reality, you'd query a database or run a machine learning model
    random.seed(user_id)  # make it consistent for the same user (optional)
    return random.sample(range(1, 21), 5)  # 5 random IDs from 1 to 20

@app.get("/recommend/{user_id}")
async def recommend(user_id: int):
    movies = get_recommendations(user_id)
    return {"user_id": user_id, "recommendations": movies}