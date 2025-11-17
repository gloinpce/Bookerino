package com.bookerino.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;
import com.bookerino.database.DatabaseConnection;

/**
 * Utility class to create a development account
 */
public class CreateDevAccount {
    
    public static void main(String[] args) {
        try {
            DatabaseConnection.initialize();
            createDevAccount();
        } catch (SQLException e) {
            System.err.println("Error creating development account: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public static void createDevAccount() throws SQLException {
        Connection conn = DatabaseConnection.getConnection();
        
        String username = "dev";
        String email = "dev@bookerino.local";
        String password = "dev1234"; // Password length >= 4 for local auth
        
        // Check if user already exists
        PreparedStatement checkStmt = conn.prepareStatement(
            "SELECT id FROM users WHERE username = ? OR email = ?"
        );
        checkStmt.setString(1, username);
        checkStmt.setString(2, email);
        ResultSet rs = checkStmt.executeQuery();
        
        if (rs.next()) {
            System.out.println("Development account already exists!");
            System.out.println("Username: " + username);
            System.out.println("Email: " + email);
            System.out.println("Password: " + password);
            rs.close();
            checkStmt.close();
            return;
        }
        rs.close();
        checkStmt.close();
        
        // Create new user
        String userId = UUID.randomUUID().toString();
        PreparedStatement insertStmt = conn.prepareStatement(
            "INSERT INTO users (id, username, email) VALUES (?, ?, ?)"
        );
        insertStmt.setString(1, userId);
        insertStmt.setString(2, username);
        insertStmt.setString(3, email);
        insertStmt.executeUpdate();
        insertStmt.close();
        
        System.out.println("========================================");
        System.out.println("Development Account Created Successfully!");
        System.out.println("========================================");
        System.out.println("Username: " + username);
        System.out.println("Email: " + email);
        System.out.println("Password: " + password);
        System.out.println("========================================");
        System.out.println("You can now use these credentials to login.");
    }
}

