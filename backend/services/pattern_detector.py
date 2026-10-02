
import re
import string


def detect_patterns(password: str) -> list[str]:
    findings = []
    lower = password.lower()

    if re.search(r"(.)\1{2,}", password):
        findings.append("Repeated characters detected")

    sequences = [
        "0123456789",
        "abcdefghijklmnopqrstuvwxyz",
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm",
    ]

    for sequence in sequences:
        for i in range(len(sequence) - 2):
            part = sequence[i:i + 3]
            if part in lower:
                findings.append("Predictable sequence detected")
                break
        if "Predictable sequence detected" in findings:
            break

    common_words = [
        "password", "welcome", "admin",
        "letmein", "iloveyou", "qwerty",
    ]

    if any(word in lower for word in common_words):
        findings.append("Common password word detected")

    if re.search(r"(19|20)\d{2}", password):
        findings.append("Year-like number detected")

    if password.isalpha() or password.isdigit():
        findings.append("Only one character type is used")

    return findings