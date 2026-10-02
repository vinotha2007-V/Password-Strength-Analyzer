# Password Strength Analyzer & Security Suggestion Tool

## About the Project

A web-based cybersecurity application that analyzes password strength, identifies common password patterns, estimates entropy, and provides actionable security suggestions. It also includes a secure password generator.

## Key Features

* Password strength score and classification
* Common password and predictable-pattern detection
* Password entropy estimation
* Personalized security suggestions
* Secure password generation using Python's `secrets` module
* React-based interactive dashboard
* FastAPI REST API
* Input validation and CORS configuration
* Unit testing with pytest
* Passwords are not intentionally stored by the analyzer

## Tech Stack

* **Frontend:** React, Vite, JavaScript, CSS
* **Backend:** Python, FastAPI
* **Testing:** pytest
* **Security:** Python `secrets` module
* **API Testing:** FastAPI Swagger UI

## Project Structure

```text
Password-Strength-Analyzer/
├── backend/
│   ├── app.py
│   └── services/
├── frontend/
│   └── src/
├── data/
│   └── common_passwords.txt
├── tests/
│   └── test_password_analyzer.py
├── screenshots/
├── docs/
├── reports/
└── README.md
```

## How to Run

### 1. Backend

Activate the Python virtual environment from the project root:

```bash
.venv\Scripts\activate.bat
```

Install dependencies if needed:

```bash
pip install fastapi "uvicorn[standard]" pydantic pytest httpx
```

Start the API:

```bash
cd backend
python -m uvicorn app:app --reload --port 8000
```

Open the API documentation at `http://127.0.0.1:8000/docs`.

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal.

### 3. Run Tests

From the project root:

```bash
python -m pytest -v
```

## Security Note

Use demonstration passwords for testing. This project is an educational password-strength assessment tool and does not replace professional security auditing. Entropy and strength scores are estimates, not guarantees of password security.

## Future Enhancements

* Expanded common-password datasets
* More comprehensive automated tests
* Improved accessibility and responsive design
* Security testing and deployment documentation

## Author

Vinotha
