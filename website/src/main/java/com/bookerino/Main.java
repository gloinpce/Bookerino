
package com.bookerino;

import com.bookerino.database.DatabaseConnection;
import java.sql.*;
import java.util.Scanner;

public class Main {
    private static Scanner scanner = new Scanner(System.in);
    
    public static void main(String[] args) {
        try {
            // Initialize database
            DatabaseConnection.initialize();
            System.out.println("✓ Baza de date inițializată cu succes");
            System.out.println("=====================================");
            System.out.println("   Bine ați venit la BOOKERINO!");
            System.out.println("=====================================\n");
            
            boolean running = true;
            while (running) {
                running = showMainMenu();
            }
            
            System.out.println("\nLa revedere!");
            scanner.close();
        } catch (Exception e) {
            System.err.println("Eroare la pornirea aplicației: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static boolean showMainMenu() {
        System.out.println("\n=== MENIU PRINCIPAL ===");
        System.out.println("1. Gestionare Camere");
        System.out.println("2. Gestionare Rezervări");
        System.out.println("3. Gestionare Recenzii");
        System.out.println("4. Analitică");
        System.out.println("5. Ieșire");
        System.out.print("\nAlegeți o opțiune (1-5): ");
        
        int choice = getIntInput();
        System.out.println();
        
        switch (choice) {
            case 1:
                manageRooms();
                break;
            case 2:
                manageBookings();
                break;
            case 3:
                manageReviews();
                break;
            case 4:
                showAnalytics();
                break;
            case 5:
                return false;
            default:
                System.out.println("Opțiune invalidă!");
        }
        return true;
    }
    
    private static void manageRooms() {
        System.out.println("=== GESTIONARE CAMERE ===");
        System.out.println("1. Afișare toate camerele");
        System.out.println("2. Adăugare cameră nouă");
        System.out.println("3. Înapoi");
        System.out.print("\nAlegeți o opțiune: ");
        
        int choice = getIntInput();
        
        switch (choice) {
            case 1:
                displayRooms();
                break;
            case 2:
                addRoom();
                break;
            case 3:
                return;
        }
    }
    
    private static void displayRooms() {
        try {
            Connection conn = DatabaseConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM rooms ORDER BY room_number");
            
            System.out.println("\n--- LISTA CAMERE ---");
            System.out.printf("%-10s %-15s %-10s %-12s %-10s\n", 
                "Nr. Cameră", "Tip", "Preț/Noapte", "Status", "Capacitate");
            System.out.println("─".repeat(70));
            
            while (rs.next()) {
                System.out.printf("%-10s %-15s %-10.2f RON %-12s %-10d\n",
                    rs.getString("room_number"),
                    rs.getString("room_type"),
                    rs.getDouble("price_per_night"),
                    rs.getString("status"),
                    rs.getInt("capacity")
                );
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.err.println("Eroare la afișarea camerelor: " + e.getMessage());
        }
    }
    
    private static void addRoom() {
        System.out.println("\n--- ADĂUGARE CAMERĂ NOUĂ ---");
        System.out.print("Număr cameră: ");
        String roomNumber = scanner.nextLine();
        
        System.out.print("Tip cameră (Single/Double/Suite): ");
        String roomType = scanner.nextLine();
        
        System.out.print("Preț pe noapte (RON): ");
        double price = getDoubleInput();
        
        System.out.print("Capacitate: ");
        int capacity = getIntInput();
        
        scanner.nextLine(); // consume newline
        
        try {
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(
                "INSERT INTO rooms (room_number, room_type, price_per_night, capacity, status) VALUES (?, ?, ?, ?, 'available')"
            );
            pstmt.setString(1, roomNumber);
            pstmt.setString(2, roomType);
            pstmt.setDouble(3, price);
            pstmt.setInt(4, capacity);
            pstmt.executeUpdate();
            pstmt.close();
            
            System.out.println("✓ Cameră adăugată cu succes!");
        } catch (SQLException e) {
            System.err.println("Eroare la adăugarea camerei: " + e.getMessage());
        }
    }
    
    private static void manageBookings() {
        System.out.println("=== GESTIONARE REZERVĂRI ===");
        System.out.println("1. Afișare toate rezervările");
        System.out.println("2. Adăugare rezervare nouă");
        System.out.println("3. Înapoi");
        System.out.print("\nAlegeți o opțiune: ");
        
        int choice = getIntInput();
        
        switch (choice) {
            case 1:
                displayBookings();
                break;
            case 2:
                addBooking();
                break;
            case 3:
                return;
        }
    }
    
    private static void displayBookings() {
        try {
            Connection conn = DatabaseConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                "SELECT b.*, r.room_number FROM bookings b JOIN rooms r ON b.room_id = r.id ORDER BY b.check_in DESC LIMIT 20"
            );
            
            System.out.println("\n--- LISTA REZERVĂRI (ultimele 20) ---");
            System.out.printf("%-15s %-10s %-12s %-12s %-12s %-10s\n", 
                "Nume Client", "Cameră", "Check-in", "Check-out", "Status", "Total");
            System.out.println("─".repeat(80));
            
            while (rs.next()) {
                System.out.printf("%-15s %-10s %-12s %-12s %-12s %-10.2f RON\n",
                    rs.getString("guest_name"),
                    rs.getString("room_number"),
                    rs.getString("check_in"),
                    rs.getString("check_out"),
                    rs.getString("status"),
                    rs.getDouble("total_price")
                );
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.err.println("Eroare la afișarea rezervărilor: " + e.getMessage());
        }
    }
    
    private static void addBooking() {
        System.out.println("\n--- ADĂUGARE REZERVARE NOUĂ ---");
        System.out.print("Nume client: ");
        String guestName = scanner.nextLine();
        
        System.out.print("Email client: ");
        String guestEmail = scanner.nextLine();
        
        System.out.print("Telefon client: ");
        String guestPhone = scanner.nextLine();
        
        displayRooms();
        System.out.print("\nNumăr cameră: ");
        String roomNumber = scanner.nextLine();
        
        System.out.print("Data check-in (YYYY-MM-DD): ");
        String checkIn = scanner.nextLine();
        
        System.out.print("Data check-out (YYYY-MM-DD): ");
        String checkOut = scanner.nextLine();
        
        System.out.print("Preț total (RON): ");
        double totalPrice = getDoubleInput();
        
        scanner.nextLine(); // consume newline
        
        try {
            Connection conn = DatabaseConnection.getConnection();
            
            // Get room ID
            PreparedStatement getRoomStmt = conn.prepareStatement("SELECT id FROM rooms WHERE room_number = ?");
            getRoomStmt.setString(1, roomNumber);
            ResultSet rs = getRoomStmt.executeQuery();
            
            if (rs.next()) {
                int roomId = rs.getInt("id");
                
                PreparedStatement pstmt = conn.prepareStatement(
                    "INSERT INTO bookings (room_id, guest_name, guest_email, guest_phone, check_in, check_out, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')"
                );
                pstmt.setInt(1, roomId);
                pstmt.setString(2, guestName);
                pstmt.setString(3, guestEmail);
                pstmt.setString(4, guestPhone);
                pstmt.setString(5, checkIn);
                pstmt.setString(6, checkOut);
                pstmt.setDouble(7, totalPrice);
                pstmt.executeUpdate();
                pstmt.close();
                
                System.out.println("✓ Rezervare adăugată cu succes!");
            } else {
                System.out.println("Camera nu a fost găsită!");
            }
            
            rs.close();
            getRoomStmt.close();
        } catch (SQLException e) {
            System.err.println("Eroare la adăugarea rezervării: " + e.getMessage());
        }
    }
    
    private static void manageReviews() {
        System.out.println("=== GESTIONARE RECENZII ===");
        System.out.println("1. Afișare toate recenziile");
        System.out.println("2. Înapoi");
        System.out.print("\nAlegeți o opțiune: ");
        
        int choice = getIntInput();
        
        if (choice == 1) {
            displayReviews();
        }
    }
    
    private static void displayReviews() {
        try {
            Connection conn = DatabaseConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                "SELECT r.*, rm.room_number FROM reviews r JOIN rooms rm ON r.room_id = rm.id ORDER BY r.created_at DESC LIMIT 20"
            );
            
            System.out.println("\n--- LISTA RECENZII (ultimele 20) ---");
            System.out.printf("%-15s %-10s %-7s %-40s\n", 
                "Nume Client", "Cameră", "Rating", "Comentariu");
            System.out.println("─".repeat(80));
            
            while (rs.next()) {
                String comment = rs.getString("comment");
                if (comment.length() > 37) {
                    comment = comment.substring(0, 37) + "...";
                }
                System.out.printf("%-15s %-10s %-7d %-40s\n",
                    rs.getString("guest_name"),
                    rs.getString("room_number"),
                    rs.getInt("rating"),
                    comment
                );
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.err.println("Eroare la afișarea recenziilor: " + e.getMessage());
        }
    }
    
    private static void showAnalytics() {
        try {
            Connection conn = DatabaseConnection.getConnection();
            
            // Total rooms
            Statement stmt1 = conn.createStatement();
            ResultSet rs1 = stmt1.executeQuery("SELECT COUNT(*) as total FROM rooms");
            rs1.next();
            int totalRooms = rs1.getInt("total");
            rs1.close();
            stmt1.close();
            
            // Total bookings
            Statement stmt2 = conn.createStatement();
            ResultSet rs2 = stmt2.executeQuery("SELECT COUNT(*) as total FROM bookings");
            rs2.next();
            int totalBookings = rs2.getInt("total");
            rs2.close();
            stmt2.close();
            
            // Total revenue
            Statement stmt3 = conn.createStatement();
            ResultSet rs3 = stmt3.executeQuery("SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE status = 'confirmed'");
            rs3.next();
            double totalRevenue = rs3.getDouble("total");
            rs3.close();
            stmt3.close();
            
            // Average rating
            Statement stmt4 = conn.createStatement();
            ResultSet rs4 = stmt4.executeQuery("SELECT COALESCE(AVG(rating), 0) as avg FROM reviews");
            rs4.next();
            double avgRating = rs4.getDouble("avg");
            rs4.close();
            stmt4.close();
            
            System.out.println("\n=== ANALITICĂ ===");
            System.out.println("─".repeat(40));
            System.out.printf("Total Camere:        %d\n", totalRooms);
            System.out.printf("Total Rezervări:     %d\n", totalBookings);
            System.out.printf("Venit Total:         %.2f RON\n", totalRevenue);
            System.out.printf("Rating Mediu:        %.2f/5\n", avgRating);
            System.out.println("─".repeat(40));
            
        } catch (SQLException e) {
            System.err.println("Eroare la afișarea analiticii: " + e.getMessage());
        }
    }
    
    private static int getIntInput() {
        while (!scanner.hasNextInt()) {
            System.out.print("Vă rugăm introduceți un număr valid: ");
            scanner.next();
        }
        int value = scanner.nextInt();
        return value;
    }
    
    private static double getDoubleInput() {
        while (!scanner.hasNextDouble()) {
            System.out.print("Vă rugăm introduceți un număr valid: ");
            scanner.next();
        }
        double value = scanner.nextDouble();
        return value;
    }
}
