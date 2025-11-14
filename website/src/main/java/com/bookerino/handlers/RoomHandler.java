
package com.bookerino.handlers;

import com.sun.net.httpserver.*;
import com.bookerino.database.DatabaseConnection;
import org.json.*;
import java.io.*;
import java.sql.*;
import java.util.*;

public class RoomHandler implements HttpHandler {
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
        ResultSet rs = stmt.executeQuery("SELECT * FROM rooms ORDER BY created_at DESC");
        
        JSONArray rooms = new JSONArray();
        while (rs.next()) {
            JSONObject room = new JSONObject();
            room.put("id", rs.getInt("id"));
            room.put("name", rs.getString("name"));
            room.put("type", rs.getString("type"));
            room.put("capacity", rs.getInt("capacity"));
            room.put("price", rs.getDouble("price"));
            room.put("status", rs.getString("status"));
            room.put("imageUrl", rs.getString("image_url"));
            room.put("description", rs.getString("description"));
            rooms.put(room);
        }
        
        rs.close();
        stmt.close();
        
        sendResponse(exchange, 200, rooms.toString());
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
            "INSERT INTO rooms (name, type, capacity, price, status, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
            Statement.RETURN_GENERATED_KEYS
        );
        
        pstmt.setString(1, json.getString("name"));
        pstmt.setString(2, json.getString("type"));
        pstmt.setInt(3, json.getInt("capacity"));
        pstmt.setDouble(4, json.getDouble("price"));
        pstmt.setString(5, json.optString("status", "available"));
        pstmt.setString(6, json.optString("imageUrl", ""));
        pstmt.setString(7, json.optString("description", ""));
        
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
