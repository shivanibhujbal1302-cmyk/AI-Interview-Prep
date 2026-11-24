import os
import re
import sqlite3
from contextlib import contextmanager
from functools import wraps
from pathlib import Path

from flask import Flask, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("DATABASE_PATH", BASE_DIR / "interview_platform.db"))
app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.environ.get("SECRET_KEY", "dev-only-change-this-secret-key"),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("COOKIE_SECURE", "false").lower() == "true",
    MAX_CONTENT_LENGTH=1 * 1024 * 1024,
)

QUESTIONS = [
    {"id": 1, "category": "Programming", "question": "What is Object-Oriented Programming?"},
    {"id": 2, "category": "Java", "question": "What is inheritance in Java?"},
    {"id": 3, "category": "Programming", "question": "What is polymorphism?"},
    {"id": 4, "category": "Database", "question": "What is the difference between a primary key and a foreign key?"},
    {"id": 5, "category": "Web Development", "question": "What is the difference between frontend and backend development?"},
]


@contextmanager
def get_db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with get_db() as db:
        db.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS answers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                question_id INTEGER NOT NULL,
                question_text TEXT NOT NULL,
                answer_text TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
            CREATE INDEX IF NOT EXISTS idx_answers_user_created
            ON answers(user_id, created_at DESC);
        """)


def current_user():
    user_id = session.get("user_id")
    if not user_id:
        return None
    with get_db() as db:
        row = db.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (user_id,)).fetchone()
    return dict(row) if row else None


def login_required(function):
    @wraps(function)
    def wrapped(*args, **kwargs):
        if not session.get("user_id"):
            return jsonify({"error": "Please log in to continue."}), 401
        return function(*args, **kwargs)
    return wrapped


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "database": "SQLite", "database_file": DB_PATH.name})


@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    if len(name) < 2:
        return jsonify({"error": "Please enter a name with at least 2 characters."}), 400
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        return jsonify({"error": "Please enter a valid email address."}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must contain at least 8 characters."}), 400
    try:
        with get_db() as db:
            cursor = db.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                (name, email, generate_password_hash(password)),
            )
            user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        return jsonify({"error": "An account with this email already exists. Please log in."}), 409
    session.clear()
    session["user_id"] = user_id
    return jsonify({"message": "Account created successfully.", "user": current_user()}), 201


@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    with get_db() as db:
        user = db.execute("SELECT id, password_hash FROM users WHERE email = ?", (email,)).fetchone()
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Incorrect email or password."}), 401
    session.clear()
    session["user_id"] = user["id"]
    return jsonify({"message": "Logged in successfully.", "user": current_user()})


@app.post("/api/auth/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully."})


@app.get("/api/auth/me")
def me():
    user = current_user()
    if not user:
        return jsonify({"user": None}), 200
    return jsonify({"user": user})


@app.get("/api/questions")
@login_required
def questions():
    return jsonify({"questions": QUESTIONS})


@app.get("/api/answers")
@login_required
def list_answers():
    with get_db() as db:
        rows = db.execute(
            "SELECT id, question_id, question_text, answer_text, created_at FROM answers WHERE user_id = ? ORDER BY id DESC LIMIT 100",
            (session["user_id"],),
        ).fetchall()
    return jsonify({"answers": [dict(row) for row in rows]})


@app.post("/api/answers")
@login_required
def save_answer():
    data = request.get_json(silent=True) or {}
    try:
        question_id = int(data.get("question_id"))
    except (TypeError, ValueError):
        return jsonify({"error": "Choose a valid interview question."}), 400
    answer_text = str(data.get("answer", "")).strip()
    question = next((item for item in QUESTIONS if item["id"] == question_id), None)
    if not question:
        return jsonify({"error": "Question not found."}), 404
    if len(answer_text) < 3:
        return jsonify({"error": "Please write an answer of at least 3 characters."}), 400
    with get_db() as db:
        cursor = db.execute(
            "INSERT INTO answers (user_id, question_id, question_text, answer_text) VALUES (?, ?, ?, ?)",
            (session["user_id"], question_id, question["question"], answer_text),
        )
        row = db.execute(
            "SELECT id, question_id, question_text, answer_text, created_at FROM answers WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()
    return jsonify({"message": "Your answer has been saved to your account.", "answer": dict(row)}), 201


@app.errorhandler(413)
def too_large(_error):
    return jsonify({"error": "Request is too large."}), 413


init_db()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5000")), debug=os.environ.get("FLASK_DEBUG") == "1")
