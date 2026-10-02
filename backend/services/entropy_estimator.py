
import math
import string


def estimate_entropy(password: str) -> float:
    """Estimate theoretical entropy in bits."""
    if not password:
        return 0.0

    pool_size = 0

    if any(c in string.ascii_lowercase for c in password):
        pool_size += 26
    if any(c in string.ascii_uppercase for c in password):
        pool_size += 26
    if any(c in string.digits for c in password):
        pool_size += 10
    if any(c in string.punctuation for c in password):
        pool_size += len(string.punctuation)
    if any(not c.isalnum() and c not in string.punctuation for c in password):
        pool_size += 100

    if pool_size == 0:
        return 0.0

    return round(len(password) * math.log2(pool_size), 2)