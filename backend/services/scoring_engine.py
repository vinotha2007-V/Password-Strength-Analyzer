
def calculate_score(
    password: str,
    findings: list[str],
    is_common: bool = False,
) -> int:
    score = 0
    length = len(password)

    if length >= 16:
        score += 40
    elif length >= 12:
        score += 30
    elif length >= 8:
        score += 20
    else:
        score += length * 2

    if any(c.islower() for c in password):
        score += 10
    if any(c.isupper() for c in password):
        score += 10
    if any(c.isdigit() for c in password):
        score += 10
    if any(not c.isalnum() for c in password):
        score += 10

    if length >= 12 and len(set(password)) >= 8:
        score += 10

    score -= 10 * len(findings)

    if is_common:
        score -= 40

    return max(0, min(100, score))


def classify_strength(score: int) -> str:
    if score <= 20:
        return "Very Weak"
    if score <= 40:
        return "Weak"
    if score <= 60:
        return "Moderate"
    if score <= 80:
        return "Strong"
    return "Very Strong"