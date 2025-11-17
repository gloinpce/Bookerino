package com.bookerino.api;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import com.bookerino.database.DatabaseConnection;

/**
 * Simulated Google Ads API integration
 */
public class GoogleAdsApiSimulator {
    private static final String CLIENT_ID = "ga_test_9876543210fedcba";
    private static final String CLIENT_SECRET = "ga_secret_abcdef1234567890";
    private static final String CUSTOMER_ID = "123-456-7890";
    private static Random random = new Random();
    
    public static Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        try {
            Connection conn = DatabaseConnection.getConnection();
            
            // Get real data from database
            Statement stmt = conn.createStatement();
            
            // Impressions (simulated based on bookings)
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as total FROM bookings");
            int totalBookings = 0;
            if (rs.next()) {
                totalBookings = rs.getInt("total");
            }
            int impressions = totalBookings * 150 + random.nextInt(5000);
            stats.put("impressions", impressions);
            
            // Clicks (simulated - 2-5% CTR)
            double ctr = 0.02 + random.nextDouble() * 0.03;
            int clicks = (int)(impressions * ctr);
            stats.put("clicks", clicks);
            stats.put("ctr", ctr * 100);
            
            // Conversions (bookings from ads - simulated)
            int conversions = (int)(clicks * 0.15) + random.nextInt(10);
            stats.put("conversions", conversions);
            stats.put("conversionRate", clicks > 0 ? (conversions * 100.0 / clicks) : 0);
            
            // Cost (simulated - average CPC of 2-5 RON)
            double avgCpc = 2.0 + random.nextDouble() * 3.0;
            double cost = clicks * avgCpc;
            stats.put("cost", cost);
            stats.put("avgCpc", avgCpc);
            
            // Revenue from ads (simulated based on conversions)
            rs = stmt.executeQuery("SELECT COALESCE(AVG(total_price), 0) as avg_price FROM bookings WHERE status = 'confirmed'");
            double avgBookingPrice = 0;
            if (rs.next()) {
                avgBookingPrice = rs.getDouble("avg_price");
            }
            if (avgBookingPrice == 0) avgBookingPrice = 300; // Default
            double revenue = conversions * avgBookingPrice;
            stats.put("revenue", revenue);
            stats.put("roas", cost > 0 ? (revenue / cost) : 0);
            
            rs.close();
            stmt.close();
            
            stats.put("clientId", CLIENT_ID);
            stats.put("clientSecret", CLIENT_SECRET);
            stats.put("customerId", CUSTOMER_ID);
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
                "SELECT enabled FROM api_settings WHERE api_name = 'google_ads'"
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

