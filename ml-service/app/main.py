from fastapi import FastAPI, Body
from app.schemas import ConfidenceRequest, ConfidenceResponse, MisconceptionWithConfidence
from app.confidence import compute_confidence

app = FastAPI(title="CodeInsight ML Service")

@app.get("/health")
def health():
    return {"status": "ok"}

# 1. NEW: The Analyze Route that your Backend is likely calling
@app.post("/analyze")
def analyze(payload: dict = Body(...)):
    code = payload.get("code", "")
    detected = []
    
    # Simple Rule-Based Detection for "Missing Return"
    # In a full ML version, this would use an AST parser or model
    if "function" in code and "return" not in code:
        detected.append({
            "id": "missing_return",
            "confidence": 0.95
        })
        
    return {"misconceptions": detected}

# 2. Keep your existing confidence route if needed
@app.post("/confidence", response_model=ConfidenceResponse)
def confidence(req: ConfidenceRequest):
    results = []
    for m in req.misconceptions:
        conf = compute_confidence(m.id, req.features)
        results.append(
            MisconceptionWithConfidence(id=m.id, confidence=conf)
        )
    return {"misconceptions": results}