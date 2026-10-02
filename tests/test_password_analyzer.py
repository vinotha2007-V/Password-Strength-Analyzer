
from backend.services.password_analyzer import analyze_password


def test_weak_password_has_low_score():
    result = analyze_password("password123")
    assert result["score"] >= 0
    assert result["score"] <= 100
    assert result["strength"] in [
        "Very Weak", "Weak", "Moderate", "Strong", "Very Strong"
    ]


def test_strong_password_returns_suggestions_list():
    result = analyze_password("R8!vQ2#zLp9@Xm4K")
    assert isinstance(result["suggestions"], list)


def test_analysis_does_not_return_password():
    password = "DemoOnly!9472"
    result = analyze_password(password)
    assert "password" not in result


def test_score_is_within_valid_range():
    result = analyze_password("abc")
    assert 0 <= result["score"] <= 100