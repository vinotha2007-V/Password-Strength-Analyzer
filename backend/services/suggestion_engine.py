
def generate_suggestions(
    password: str,
    findings: list[str],
    is_common: bool = False,
) -> list[str]:
    suggestions = []

    if len(password) < 12:
        suggestions.append("Use at least 12 characters; 16 or more is preferable.")

    if not any(c.islower() for c in password):
        suggestions.append("Add lowercase letters.")

    if not any(c.isupper() for c in password):
        suggestions.append("Add uppercase letters.")

    if not any(c.isdigit() for c in password):
        suggestions.append("Add numbers.")

    if not any(not c.isalnum() for c in password):
        suggestions.append("Consider adding symbols such as !, @, or #.")

    if is_common:
        suggestions.append("Avoid common or easily guessed passwords.")

    if "Repeated characters detected" in findings:
        suggestions.append("Avoid repeating the same character several times.")

    if "Predictable sequence detected" in findings:
        suggestions.append("Avoid keyboard patterns and sequential characters.")

    if "Common password word detected" in findings:
        suggestions.append("Avoid common password words.")

    if "Year-like number detected" in findings:
        suggestions.append("Avoid predictable years and dates.")

    if not suggestions:
        suggestions.append(
            "Use a unique password for every account and store it in a password manager."
        )

    return suggestions