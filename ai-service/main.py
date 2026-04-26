from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Aether AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Aether AI Service is running magically!"}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    # Placeholder for AI logic
    return {
        "tags": ["black backpack", "nike logo"],
        "color": "black",
        "object": "backpack",
        "confidence": 0.98
    }

@app.post("/predict-location")
async def predict_location(data: dict):
    # Placeholder for predictive logic
    return {
        "predicted_location": "Main Library",
        "probability": 0.75,
        "reason": "High loss density at this hour in previous data"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
