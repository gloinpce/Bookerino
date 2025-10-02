
package com.bookerino;

import com.bookerino.database.DatabaseConnection;
import com.bookerino.server.HttpServer;

public class Main {
    public static void main(String[] args) {
        try {
            // Initialize database
            DatabaseConnection.initialize();
            System.out.println("Database initialized successfully");
            
            // Start HTTP server
            int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "5000"));
            HttpServer server = new HttpServer(port);
            server.start();
            
            System.out.println("BOOKERINO server running on port " + port);
        } catch (Exception e) {
            System.err.println("Error starting application: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
