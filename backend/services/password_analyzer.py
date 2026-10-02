
from pathlib import Path

from .pattern_detector import detect_patterns
from .entropy_estimator import estimate_entropy
from .scoring_engine import calculate_score, classify_strength
from .suggestion_engine import generate_suggestions


DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "common_passwords.txt"


def load_common_passwords() -> set[str]:
    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            return {
                line.strip().lower()
                for line in file
                if line.strip()
            }
    except FileNotFoundError:
        return set()


def analyze_password(
    password: str,
    context_terms: list[str] | None = None,
) -> dict:
    if not password:
        raise ValueError("Password cannot be empty.")

    common_passwords = load_common_passwords()
    findings = detect_patterns(password)

    is_common = password.lower() in common_passwords

    if is_common:
        findings.append("Password matches a common-password list")

    context_terms = context_terms or []
    lowered_password = password.lower()

    if any(
        term.strip() and term.strip().lower() in lowered_password
        for term in context_terms
    ):
        findings.append("Password contains a supplied personal/context term")

    score = calculate_score(
        password=password,
        findings=findings,
        is_common=is_common,
    )

    suggestions = generate_suggestions(
        password=password,
        findings=findings,
        is_common=is_common,
    )

    # Return analysis results only; never return the password itself.
    return {
        "score": score,
        "strength": classify_strength(score),
        "findings": findings,
        "suggestions": suggestions,
        "metrics": {
            "length": len(password),
            "estimated_entropy_bits": estimate_entropy(password),
            "character_types": sum([
                any(c.islower() for c in password),
                any(c.isupper() for c in password),
                any(c.isdigit() for c in password),
                any(not c.isalnum() for c in password),
            ]),
        },
    }