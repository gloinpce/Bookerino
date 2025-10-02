
package com.bookerino.handlers;

import com.sun.net.httpserver.*;
import com.bookerino.database.DatabaseConnection;
import org.json.*;
import java.io.*;
import java.sql.*;

public class ReviewHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        
        try {
            if ("GET".equals(method)) {
                handleGet(exchange);
            } else if ("POST".equals(method)) {
                handlePost(exchange);
            } else {
                sendResponse(exchange, 405, "{\"error\": \"Method not allowed\"}");
            }
        } catch (Exception e) {
            sendResponse(exchange, 500, "{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    private void handleGet(HttpExchange exchange) throws SQLException, IOException {
        Connection conn = DatabaseConnection.getConnection();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM reviews ORDER BY created_at DESC");
        
        JSONArray reviews = new JSONArray();
        while (rs.next()) {
            JSONObject review = new JSONObject();
            review.put("id", rs.getInt("id"));
            review.put("roomId", rs.getInt("room_id"));
            review.put("guestName", rs.getString("guest_name"));
            review.put("rating", rs.getInt("rating"));
            review.put("comment", rs.getString("comment"));
            reviews.put(review);
        }
        
        rs.close();
        stmt.close();
        
        sendResponse(exchange, 200, reviews.toString());
    }
    
    private void handlePost(HttpExchange exchange) throws IOException, SQLException {
        InputStreamReader isr = new InputStreamReader(exchange.getRequestBody());
        BufferedReader br = new BufferedReader(isr);
        StringBuilder body = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            body.append(line);
        }
        
        JSONObject json = new JSONObject(body.toString());
        
        Connection conn = DatabaseConnection.getConnection();
        PreparedStatement pstmt = conn.prepareStatement(
            "INSERT INTO reviews (room_id, guest_name, rating, comment) VALUES (?, ?, ?, ?)",
            Statement.RETURN_GENERATED_KEYS
        );
        
        pstmt.setInt(1, json.getInt("roomId"));
        pstmt.setString(2, json.getString("guestName"));
        pstmt.setInt(3, json.getInt("rating"));
        pstmt.setString(4, json.optString("comment", ""));
        
        pstmt.executeUpdate();
        ResultSet rs = pstmt.getGeneratedKeys();
        
        if (rs.next()) {
            json.put("id", rs.getInt(1));
        }
        
        rs.close();
        pstmt.close();
        
        sendResponse(exchange, 201, json.toString());
    }
    
    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, response.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
