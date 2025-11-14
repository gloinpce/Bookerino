
package com.bookerino.database;

import java.sql.*;

public class DatabaseConnection {
    private static Connection connection;
    
    public static void initialize() throws SQLException {
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null) {
            throw new RuntimeException("DATABASE_URL environment variable not set");
        }
        
        connection = DriverManager.getConnection(dbUrl);
        createTables();
    }
    
    public static Connection getConnection() {
        return connection;
    }
    
    private static void createTables() throws SQLException {
        Statement stmt = connection.createStatement();
        
        // Create users table
        stmt.execute(
            "CREATE TABLE IF NOT EXISTS users (" +
            "id VARCHAR(255) PRIMARY KEY, " +
            "username VARCHAR(255) NOT NULL UNIQUE, " +
            "email VARCHAR(255), " +
            "profile_image_url TEXT, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
            "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
        );
        
        // Create rooms table
        stmt.execute(
            "CREATE TABLE IF NOT EXISTS rooms (" +
            "id SERIAL PRIMARY KEY, " +
            "name VARCHAR(255) NOT NULL, " +
            "type VARCHAR(100) NOT NULL, " +
            "capacity INTEGER NOT NULL, " +
            "price DECIMAL(10,2) NOT NULL, " +
            "status VARCHAR(50) DEFAULT 'available', " +
            "image_url TEXT, " +
            "description TEXT, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
        );
        
        // Create bookings table
        stmt.execute(
            "CREATE TABLE IF NOT EXISTS bookings (" +
            "id SERIAL PRIMARY KEY, " +
            "guest_name VARCHAR(255) NOT NULL, " +
            "guest_email VARCHAR(255) NOT NULL, " +
            "room_id INTEGER REFERENCES rooms(id), " +
            "check_in DATE NOT NULL, " +
            "check_out DATE NOT NULL, " +
            "status VARCHAR(50) DEFAULT 'pending', " +
            "total_price DECIMAL(10,2), " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
        );
        
        // Create reviews table
        stmt.execute(
            "CREATE TABLE IF NOT EXISTS reviews (" +
            "id SERIAL PRIMARY KEY, " +
            "room_id INTEGER REFERENCES rooms(id), " +
            "guest_name VARCHAR(255) NOT NULL, " +
            "rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), " +
            "comment TEXT, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
        );
        
        stmt.close();
        System.out.println("Database tables created successfully");
    }
}
