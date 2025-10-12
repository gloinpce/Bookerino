import os
import uuid
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import sql

# Prefer environment variable; fallback to the provided DSN if env not set.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://book:6j9T89b7jF3fjd1UN_XhLQ@street-fish-16944.j77.aws-eu-central-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full",
)

if not DATABASE_URL:
    raise SystemExit("DATABASE_URL is not set")

def ensure_tables(conn):
    with conn.cursor() as cur:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id BIGSERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT now()
            )
            """
        )
    conn.commit()

def insert_user(conn, username: str, email: str, password_hash: str):
    """
    Insert a user using psycopg2 parameterized query and return the new id.
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            """
            INSERT INTO users (username, email, password_hash)
            VALUES (%s, %s, %s)
            RETURNING id, username, email, created_at
            """,
            (username, email, password_hash),
        )
        row = cur.fetchone()
    conn.commit()
    return row

def select_now(conn):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT now() AS now")
        return cur.fetchall()

def main():
    # connect using psycopg2 with the DSN
    conn = psycopg2.connect(dsn=DATABASE_URL)
    try:
        ensure_tables(conn)

        # Example insert (change values as needed)
        new_user = insert_user(conn, "demo_user", "demo@example.com", "unsafe-placeholder-hash")
        print("Inserted user:", new_user)

        now_rows = select_now(conn)
        print("DB time:", now_rows)
    finally:
        conn.close()

if __name__ == "__main__":
    main()