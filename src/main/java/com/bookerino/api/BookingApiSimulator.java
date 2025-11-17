package com.bookerino.api;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import com.bookerino.database.DatabaseConnection;

/**
 * Simulated Booking.com API integration
 */
public class BookingApiSimulator {
    private static final String API_KEY = "bk_test_1234567890abcdef";
    private static final String PROPERTY_ID = "prop_12345";
    private static Random random = new Random();
    
    public static Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        try {
            Connection conn = DatabaseConnection.getConnection();
            
            // Get real data from database
            Statement stmt = conn.createStatement();
            
            // Total bookings from Booking.com (simulated - 30% of total bookings)
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as total FROM bookings");
            int totalBookings = 0;
            if (rs.next()) {
                totalBookings = rs.getInt("total");
            }
            int bookingComBookings = (int)(totalBookings * 0.3) + random.nextInt(5);
            stats.put("totalBookings", bookingComBookings);
            
            // Revenue from Booking.com (simulated - 35% of total revenue)
            rs = stmt.executeQuery("SELECT COALESCE(SUM(total_price), 0) as revenue FROM bookings WHERE status = 'confirmed'");
            double totalRevenue = 0;
            if (rs.next()) {
                totalRevenue = rs.getDouble("revenue");
            }
            double bookingComRevenue = totalRevenue * 0.35 + random.nextDouble() * 1000;
            stats.put("totalRevenue", bookingComRevenue);
            
            // Occupancy rate
            rs = stmt.executeQuery("SELECT COUNT(*) as total FROM rooms");
            int totalRooms = 0;
            if (rs.next()) {
                totalRooms = rs.getInt("total");
            }
            rs = stmt.executeQuery("SELECT COUNT(DISTINCT room_id) as occupied FROM bookings WHERE status = 'confirmed'");
            int occupiedRooms = 0;
            if (rs.next()) {
                occupiedRooms = rs.getInt("occupied");
            }
            double occupancyRate = totalRooms > 0 ? (occupiedRooms * 100.0 / totalRooms) : 0;
            stats.put("occupancyRate", occupancyRate + random.nextDouble() * 5);
            
            // Average rating from Booking.com (simulated - slightly higher than local)
            rs = stmt.executeQuery("SELECT COALESCE(AVG(rating), 0) as avg FROM reviews");
            double avgRating = 0;
            if (rs.next()) {
                avgRating = rs.getDouble("avg");
            }
            stats.put("averageRating", Math.min(5.0, avgRating + 0.2 + random.nextDouble() * 0.3));
            
            rs.close();
            stmt.close();
            
            stats.put("apiKey", API_KEY);
            stats.put("propertyId", PROPERTY_ID);
            stats.put("status", "connected");
            
        } catch (Exception e) {
            stats.put("status", "error");
            stats.put("error", e.getMessage());
        }
        
        return stats;
    }
    
    public static boolean isEnabled() {
        try {
            Connection conn = DatabaseConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                "SELECT enabled FROM api_settings WHERE api_name = 'booking.com'"
            );
            if (rs.next()) {
                return rs.getInt("enabled") == 1;
            }
            rs.close();
            stmt.close();
        } catch (Exception e) {
            // Ignore
        }
        return false;
    }
}

