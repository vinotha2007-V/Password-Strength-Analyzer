
import secrets
import string


def generate_password(length: int = 16) -> str:
    if not 16 <= length <= 64:
        raise ValueError("Password length must be between 16 and 64.")

    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits
    symbols = "!@#$%^&*()-_=+"

    all_chars = lowercase + uppercase + digits + symbols

    password_chars = [
        secrets.choice(lowercase),
        secrets.choice(uppercase),
        secrets.choice(digits),
        secrets.choice(symbols),
    ]

    password_chars.extend(
        secrets.choice(all_chars)
        for _ in range(length - len(password_chars))
    )

    # Securely shuffle the generated characters.
    for i in range(len(password_chars) - 1, 0, -1):
        j = secrets.randbelow(i + 1)
        password_chars[i], password_chars[j] = (
            password_chars[j],
            password_chars[i],
        )

    return "".join(password_chars)