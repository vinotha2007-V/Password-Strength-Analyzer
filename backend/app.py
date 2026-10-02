
from collections import Counter

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from services.password_analyzer import analyze_password
from services.password_generator import generate_password


app = FastAPI(
    title="Password Strength Analyzer API",
    description="A privacy-focused password analysis and generation tool.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# In-memory aggregate counts only; no passwords are stored.
stats = Counter()


class AnalyzeRequest(BaseModel):
    password: str = Field(min_length=1, max_length=256)
    context_terms: list[str] = Field(default_factory=list, max_length=10)


class GenerateRequest(BaseModel):
    length: int = Field(default=16, ge=16, le=64)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    # Do not return submitted input values in validation errors.
    return JSONResponse(
        status_code=422,
        content={"detail": "Invalid request. Check the input format."},
    )


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Password Strength Analyzer"}


@app.post("/api/analyze")
def analyze(request: AnalyzeRequest):
    result = analyze_password(
        password=request.password,
        context_terms=request.context_terms,
    )

    # Store only aggregate strength counts, never submitted passwords.
    stats[result["strength"]] += 1

    return result


@app.post("/api/generate-password")
def generate(request: GenerateRequest):
    password = generate_password(request.length)
    return {"password": password, "length": len(password)}


@app.get("/api/dashboard/stats")
def dashboard_stats():
    return {
        "total_analyses": sum(stats.values()),
        "strength_distribution": dict(stats),
        "passwords_stored": False,
    }