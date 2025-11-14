
package com.bookerino.handlers;

import com.sun.net.httpserver.*;
import com.bookerino.database.DatabaseConnection;
import org.json.*;
import java.io.*;
import java.sql.*;

public class BookingHandler implements HttpHandler {
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
        ResultSet rs = stmt.executeQuery("SELECT * FROM bookings ORDER BY created_at DESC");
        
        JSONArray bookings = new JSONArray();
        while (rs.next()) {
            JSONObject booking = new JSONObject();
            booking.put("id", rs.getInt("id"));
            booking.put("guestName", rs.getString("guest_name"));
            booking.put("guestEmail", rs.getString("guest_email"));
            booking.put("roomId", rs.getInt("room_id"));
            booking.put("checkIn", rs.getDate("check_in").toString());
            booking.put("checkOut", rs.getDate("check_out").toString());
            booking.put("status", rs.getString("status"));
            booking.put("totalPrice", rs.getDouble("total_price"));
            bookings.put(booking);
        }
        
        rs.close();
        stmt.close();
        
        sendResponse(exchange, 200, bookings.toString());
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
            "INSERT INTO bookings (guest_name, guest_email, room_id, check_in, check_out, status, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
            Statement.RETURN_GENERATED_KEYS
        );
        
        pstmt.setString(1, json.getString("guestName"));
        pstmt.setString(2, json.getString("guestEmail"));
        pstmt.setInt(3, json.getInt("roomId"));
        pstmt.setDate(4, Date.valueOf(json.getString("checkIn")));
        pstmt.setDate(5, Date.valueOf(json.getString("checkOut")));
        pstmt.setString(6, json.optString("status", "pending"));
        pstmt.setDouble(7, json.getDouble("totalPrice"));
        
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
