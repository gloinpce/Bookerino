
package com.bookerino.handlers;

import com.sun.net.httpserver.*;
import com.bookerino.database.DatabaseConnection;
import org.json.*;
import java.io.*;
import java.sql.*;

public class AnalyticsHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        try {
            Connection conn = DatabaseConnection.getConnection();
            JSONObject analytics = new JSONObject();
            
            // Total bookings
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as total FROM bookings");
            if (rs.next()) {
                analytics.put("totalBookings", rs.getInt("total"));
            }
            
            // Total revenue
            rs = stmt.executeQuery("SELECT SUM(total_price) as revenue FROM bookings WHERE status = 'confirmed'");
            if (rs.next()) {
                analytics.put("totalRevenue", rs.getDouble("revenue"));
            }
            
            // Average rating
            rs = stmt.executeQuery("SELECT AVG(rating) as avg_rating FROM reviews");
            if (rs.next()) {
                analytics.put("averageRating", rs.getDouble("avg_rating"));
            }
            
            // Occupancy rate
            rs = stmt.executeQuery("SELECT COUNT(*) as occupied FROM rooms WHERE status = 'occupied'");
            int occupied = 0;
            if (rs.next()) {
                occupied = rs.getInt("occupied");
            }
            rs = stmt.executeQuery("SELECT COUNT(*) as total FROM rooms");
            int total = 0;
            if (rs.next()) {
                total = rs.getInt("total");
            }
            analytics.put("occupancyRate", total > 0 ? (occupied * 100.0 / total) : 0);
            
            rs.close();
            stmt.close();
            
            sendResponse(exchange, 200, analytics.toString());
        } catch (Exception e) {
            sendResponse(exchange, 500, "{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, response.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
