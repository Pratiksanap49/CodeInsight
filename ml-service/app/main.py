from fastapi import FastAPI
from app.schemas import ConfidenceRequest, ConfidenceResponse, MisconceptionWithConfidence
from app.confidence import compute_confidence

app = FastAPI(title="CodeInsight ML Service")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/confidence", response_model=ConfidenceResponse)
def confidence(req: ConfidenceRequest):
    results = []

    for m in req.misconceptions:
        conf = compute_confidence(m.id, req.features)
        results.append(
            MisconceptionWithConfidence(
                id=m.id,
                confidence=conf
            )
        )

    return {"misconceptions": results}
