-- Create database (run in CockroachDB SQL shell)
CREATE DATABASE bookerino;

-- Connect to database
\c bookerino;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username STRING UNIQUE NOT NULL,
    email STRING UNIQUE NOT NULL,
    password_hash STRING NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Books table  
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title STRING NOT NULL,
    author STRING NOT NULL,
    isbn STRING,
    description TEXT,
    cover_url STRING,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT now()
);

-- Add other tables as needed for your application