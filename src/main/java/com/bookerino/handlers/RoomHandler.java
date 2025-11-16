
package com.bookerino.handlers;

import com.sun.net.httpserver.*;
import com.bookerino.database.DatabaseConnection;
import org.json.*;
import java.io.*;
import java.sql.*;

public class RoomHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        
        try {
            // Extract room ID from path if present (e.g., /api/rooms/123)
            String roomId = extractRoomId(path);
            
            if ("GET".equals(method)) {
                if (roomId != null) {
                    handleGetById(exchange, roomId);
                } else {
                    handleGet(exchange);
                }
            } else if ("POST".equals(method)) {
                handlePost(exchange);
            } else if ("DELETE".equals(method)) {
                if (roomId != null) {
                    handleDelete(exchange, roomId);
                } else {
                    sendResponse(exchange, 400, "{\"error\": \"Room ID required\"}");
                }
            } else if ("PATCH".equals(method)) {
                if (roomId != null) {
                    handlePatch(exchange, roomId);
                } else {
                    sendResponse(exchange, 400, "{\"error\": \"Room ID required\"}");
                }
            } else {
                sendResponse(exchange, 405, "{\"error\": \"Method not allowed\"}");
            }
        } catch (Exception e) {
            sendResponse(exchange, 500, "{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    private String extractRoomId(String path) {
        // Path format: /api/rooms or /api/rooms/123
        String[] parts = path.split("/");
        if (parts.length >= 4 && !parts[3].isEmpty()) {
            return parts[3];
        }
        return null;
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
    
    private void handleGetById(HttpExchange exchange, String roomId) throws SQLException, IOException {
        Connection conn = DatabaseConnection.getConnection();
        PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM rooms WHERE id = ?");
        pstmt.setInt(1, Integer.parseInt(roomId));
        ResultSet rs = pstmt.executeQuery();
        
        if (rs.next()) {
            JSONObject room = new JSONObject();
            room.put("id", rs.getInt("id"));
            room.put("name", rs.getString("name"));
            room.put("type", rs.getString("type"));
            room.put("capacity", rs.getInt("capacity"));
            room.put("price", rs.getDouble("price"));
            room.put("status", rs.getString("status"));
            room.put("imageUrl", rs.getString("image_url"));
            room.put("description", rs.getString("description"));
            rs.close();
            pstmt.close();
            sendResponse(exchange, 200, room.toString());
        } else {
            rs.close();
            pstmt.close();
            sendResponse(exchange, 404, "{\"error\": \"Room not found\"}");
        }
    }
    
    private void handleDelete(HttpExchange exchange, String roomId) throws SQLException, IOException {
        Connection conn = DatabaseConnection.getConnection();
        PreparedStatement pstmt = conn.prepareStatement("DELETE FROM rooms WHERE id = ?");
        pstmt.setInt(1, Integer.parseInt(roomId));
        
        int rowsAffected = pstmt.executeUpdate();
        pstmt.close();
        
        if (rowsAffected > 0) {
            sendResponse(exchange, 200, "{\"success\": true}");
        } else {
            sendResponse(exchange, 404, "{\"error\": \"Room not found\"}");
        }
    }
    
    private void handlePatch(HttpExchange exchange, String roomId) throws IOException, SQLException {
        InputStreamReader isr = new InputStreamReader(exchange.getRequestBody());
        BufferedReader br = new BufferedReader(isr);
        StringBuilder body = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            body.append(line);
        }
        
        JSONObject json = new JSONObject(body.toString());
        
        Connection conn = DatabaseConnection.getConnection();
        StringBuilder sql = new StringBuilder("UPDATE rooms SET ");
        boolean first = true;
        
        if (json.has("name")) {
            if (!first) sql.append(", ");
            sql.append("name = ?");
            first = false;
        }
        if (json.has("type")) {
            if (!first) sql.append(", ");
            sql.append("type = ?");
            first = false;
        }
        if (json.has("capacity")) {
            if (!first) sql.append(", ");
            sql.append("capacity = ?");
            first = false;
        }
        if (json.has("price")) {
            if (!first) sql.append(", ");
            sql.append("price = ?");
            first = false;
        }
        if (json.has("status")) {
            if (!first) sql.append(", ");
            sql.append("status = ?");
            first = false;
        }
        if (json.has("imageUrl")) {
            if (!first) sql.append(", ");
            sql.append("image_url = ?");
            first = false;
        }
        if (json.has("description")) {
            if (!first) sql.append(", ");
            sql.append("description = ?");
            first = false;
        }
        
        if (first) {
            sendResponse(exchange, 400, "{\"error\": \"No fields to update\"}");
            return;
        }
        
        sql.append(" WHERE id = ?");
        
        PreparedStatement pstmt = conn.prepareStatement(sql.toString());
        int paramIndex = 1;
        
        if (json.has("name")) {
            pstmt.setString(paramIndex++, json.getString("name"));
        }
        if (json.has("type")) {
            pstmt.setString(paramIndex++, json.getString("type"));
        }
        if (json.has("capacity")) {
            pstmt.setInt(paramIndex++, json.getInt("capacity"));
        }
        if (json.has("price")) {
            pstmt.setDouble(paramIndex++, json.getDouble("price"));
        }
        if (json.has("status")) {
            pstmt.setString(paramIndex++, json.getString("status"));
        }
        if (json.has("imageUrl")) {
            pstmt.setString(paramIndex++, json.getString("imageUrl"));
        }
        if (json.has("description")) {
            pstmt.setString(paramIndex++, json.getString("description"));
        }
        
        pstmt.setInt(paramIndex, Integer.parseInt(roomId));
        
        int rowsAffected = pstmt.executeUpdate();
        pstmt.close();
        
        if (rowsAffected > 0) {
            // Return updated room
            handleGetById(exchange, roomId);
        } else {
            sendResponse(exchange, 404, "{\"error\": \"Room not found\"}");
        }
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
