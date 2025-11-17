package com.bookerino;

import com.bookerino.database.DatabaseConnection;
import com.bookerino.auth.AuthManager;
import com.bookerino.util.IconLoader;
import com.bookerino.api.BookingApiSimulator;
import com.bookerino.api.GoogleAdsApiSimulator;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.sql.*;
import java.text.DecimalFormat;
import java.util.Map;

public class MainGUI extends JFrame {
    // Theme colors matching global.css - Updated to match React desktop app design system
    // Primary: hsl(210, 100%, 50%) = rgb(0, 136, 255) - #0088ff
    // Primary Dark: hsl(220, 90%, 60%) = rgb(51, 153, 255) - #3399ff
    // Accent/Ring: hsl(210, 100%, 50%) = rgb(0, 136, 255)
    // Green for demo button: rgb(34, 197, 94) - #22c55e
    private static final Color PRIMARY_COLOR = new Color(0, 136, 255); // hsl(210, 100%, 50%) - matches global.css primary
    private static final Color PRIMARY_DARK = new Color(51, 153, 255); // hsl(220, 90%, 60%)
    private static final Color ACCENT_COLOR = new Color(0, 136, 255); // hsl(210, 100%, 50%)
    private static final Color CARD_COLOR = new Color(255, 255, 255); // White cards
    private static final Color CARD_BORDER = new Color(210, 220, 230); // hsl(210, 30%, 90%)
    // Gradient subtle background colors matching global.css
    private static final Color BACKGROUND_LIGHT = new Color(240, 247, 255); // hsl(210, 40%, 98%) - #f0f7ff
    private static final Color BACKGROUND_DARK = new Color(201, 224, 255); // hsl(210, 40%, 98%) gradient end - #c9e0ff
    private static final Color TEXT_PRIMARY = new Color(51, 65, 85); // hsl(220, 15%, 20%)
    private static final Color TEXT_SECONDARY = new Color(100, 116, 139); // hsl(220, 15%, 47%)
    private static final Color TEXT_MUTED = new Color(115, 125, 135); // hsl(220, 10%, 45%)
    
    private JTabbedPane tabbedPane;
    private JTable roomsTable;
    private JTable bookingsTable;
    private JTable reviewsTable;
    private DefaultTableModel roomsModel;
    private DefaultTableModel bookingsModel;
    private DefaultTableModel reviewsModel;
    private JLabel totalRoomsLabel;
    private JLabel totalBookingsLabel;
    private JLabel totalRevenueLabel;
    private JLabel avgRatingLabel;
    private JLabel userLabel;
    private JButton loginLogoutBtn;
    
    public MainGUI() {
        // Set icon IMMEDIATELY before any GUI operations for Windows taskbar support
        IconLoader.setFrameIcon(this);
        
        // Check authentication first
        if (!AuthManager.isAuthenticated()) {
            if (!AuthManager.showLoginDialog(null)) {
                JOptionPane.showMessageDialog(null,
                    "Autentificare necesară pentru a utiliza aplicația.",
                    "Autentificare", JOptionPane.INFORMATION_MESSAGE);
                System.exit(0);
                return;
            }
        }
        
        initializeDatabase();
        initializeGUI();
        loadData();
    }
    
    private void initializeDatabase() {
        try {
            DatabaseConnection.initialize();
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, 
                "Eroare la inițializarea bazei de date: " + e.getMessage(),
                "Eroare", JOptionPane.ERROR_MESSAGE);
            System.exit(1);
        }
    }
    
    private void initializeGUI() {
        setTitle("Bookerino");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        // Window size increased by 20%: 1200x800 -> 1440x960
        setSize(1440, 960);
        setLocationRelativeTo(null);
        
        // Icon already set in constructor, but ensure it's set again here for Windows
        IconLoader.setFrameIcon(this);
        
        // Set custom look and feel
        setupCustomTheme();
        
        // Set background gradient
        setContentPane(new GradientPanel());
        
        // Create menu bar
        createMenuBar();
        
        // Create tabbed pane with custom styling
        tabbedPane = new JTabbedPane() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                // Draw gradient background matching global.css gradient-subtle
                GradientPaint gradient = new GradientPaint(
                    0, 0, BACKGROUND_LIGHT,
                    getWidth(), getHeight(), BACKGROUND_DARK
                );
                g2d.setPaint(gradient);
                g2d.fillRect(0, 0, getWidth(), getHeight());
                g2d.dispose();
                super.paintComponent(g);
            }
        };
        tabbedPane.setOpaque(false);
        tabbedPane.setBorder(new EmptyBorder(10, 10, 10, 10));
        
        // Customize tab appearance
        UIManager.put("TabbedPane.selected", PRIMARY_COLOR);
        UIManager.put("TabbedPane.background", new Color(0, 0, 0, 0));
        UIManager.put("TabbedPane.contentAreaColor", new Color(0, 0, 0, 0));
        
        // Rooms tab
        tabbedPane.addTab("Camere", createRoomsPanel());
        
        // Bookings tab
        tabbedPane.addTab("Rezervări", createBookingsPanel());
        
        // Reviews tab
        tabbedPane.addTab("Recenzii", createReviewsPanel());
        
        // Analytics tab
        tabbedPane.addTab("Analitică", createAnalyticsPanel());
        
        // Settings tab (moved next to Analytics)
        tabbedPane.addTab("Setări", createSettingsPanel());
        
        getContentPane().setLayout(new BorderLayout());
        getContentPane().add(tabbedPane, BorderLayout.CENTER);
    }
    
    private void setupCustomTheme() {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            
            // Customize button colors
            UIManager.put("Button.background", PRIMARY_COLOR);
            UIManager.put("Button.foreground", Color.WHITE);
            UIManager.put("Button.select", PRIMARY_DARK);
            UIManager.put("Button.focus", PRIMARY_COLOR);
            
            // Customize table colors
            UIManager.put("Table.background", Color.WHITE);
            UIManager.put("Table.foreground", TEXT_PRIMARY);
            UIManager.put("Table.selectionBackground", PRIMARY_COLOR);
            UIManager.put("Table.selectionForeground", Color.WHITE);
            UIManager.put("TableHeader.background", CARD_COLOR);
            UIManager.put("TableHeader.foreground", TEXT_PRIMARY);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private void createMenuBar() {
        JMenuBar menuBar = new JMenuBar();
        menuBar.setBackground(CARD_COLOR);
        menuBar.setBorder(new LineBorder(CARD_BORDER, 1));
        
        // Add logo to menu bar
        ImageIcon logoIcon = IconLoader.loadLogo(32, 32);
        if (logoIcon != null) {
            JLabel logoLabel = new JLabel(logoIcon);
            logoLabel.setBorder(new EmptyBorder(5, 10, 5, 10));
            menuBar.add(logoLabel);
        }
        
        JMenu fileMenu = new JMenu("Fișier");
        fileMenu.setForeground(TEXT_PRIMARY);
        JMenuItem exitItem = new JMenuItem("Ieșire");
        exitItem.addActionListener(e -> System.exit(0));
        fileMenu.add(exitItem);
        
        JMenu settingsMenu = new JMenu("Setări");
        settingsMenu.setForeground(TEXT_PRIMARY);
        JMenuItem integrationsItem = new JMenuItem("Integrări API");
        integrationsItem.addActionListener(e -> showSettingsDialog());
        settingsMenu.add(integrationsItem);
        
        JMenu helpMenu = new JMenu("Ajutor");
        helpMenu.setForeground(TEXT_PRIMARY);
        JMenuItem aboutItem = new JMenuItem("Despre");
        aboutItem.addActionListener(e -> {
            JOptionPane.showMessageDialog(this,
                "Bookerino - Sistem de Gestionare Hotel\nVersiunea 1.0.0",
                "Despre", JOptionPane.INFORMATION_MESSAGE);
        });
        helpMenu.add(aboutItem);
        
        // User info and logout
        userLabel = new JLabel("Utilizator: " + AuthManager.getCurrentUser());
        userLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        userLabel.setForeground(TEXT_SECONDARY);
        userLabel.setBorder(new EmptyBorder(0, 20, 0, 10));
        
        loginLogoutBtn = new JButton(AuthManager.isAuthenticated() ? "Deconectare" : "Autentificare");
        loginLogoutBtn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        loginLogoutBtn.setForeground(PRIMARY_COLOR);
        loginLogoutBtn.setBorderPainted(false);
        loginLogoutBtn.setContentAreaFilled(false);
        loginLogoutBtn.addActionListener(e -> {
            if (AuthManager.isAuthenticated()) {
                int confirm = JOptionPane.showConfirmDialog(this,
                    "Sigur doriți să vă deconectați?",
                    "Deconectare", JOptionPane.YES_NO_OPTION);
                if (confirm == JOptionPane.YES_OPTION) {
                    AuthManager.logout();
                    dispose();
                    if (!AuthManager.showLoginDialog(null)) {
                        System.exit(0);
                    } else {
                        new MainGUI().setVisible(true);
                    }
                }
            } else {
                if (AuthManager.showLoginDialog(this)) {
                    userLabel.setText("Utilizator: " + AuthManager.getCurrentUser());
                    loginLogoutBtn.setText("Deconectare");
                }
            }
        });
        
        menuBar.add(fileMenu);
        menuBar.add(settingsMenu);
        menuBar.add(helpMenu);
        menuBar.add(Box.createHorizontalGlue());
        menuBar.add(userLabel);
        menuBar.add(loginLogoutBtn);
        setJMenuBar(menuBar);
    }
    
    private JPanel createRoomsPanel() {
        JPanel panel = new RoundedPanel();
        panel.setLayout(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(20, 20, 20, 20));
        panel.setBackground(new Color(0, 0, 0, 0)); // Transparent
        
        // Header
        JLabel headerLabel = new JLabel("Gestionare Camere", JLabel.LEFT);
        headerLabel.setFont(new Font("Segoe UI", Font.BOLD, 24));
        headerLabel.setForeground(TEXT_PRIMARY);
        headerLabel.setBorder(new EmptyBorder(0, 0, 15, 0));
        
        // Table in a card
        String[] columns = {"ID", "Nume", "Tip", "Capacitate", "Preț (RON)", "Status", "Șterge"};
        roomsModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false; // No cells are editable - delete handled by mouse listener
            }
        };
        roomsTable = createStyledTable(roomsModel);
        // Set custom renderer for delete column
        roomsTable.getColumn("Șterge").setCellRenderer(new ButtonRenderer());
        // Add mouse listener to handle delete button clicks (double-click only)
        roomsTable.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                // CRITICAL: Only trigger on double-click, ignore single clicks
                if (evt.getClickCount() != 2) {
                    return; // Exit immediately for single clicks
                }
                
                int row = roomsTable.rowAtPoint(evt.getPoint());
                int col = roomsTable.columnAtPoint(evt.getPoint());
                
                if (row >= 0 && col >= 0 && row < roomsModel.getRowCount()) {
                    String columnName = roomsTable.getColumnName(col);
                    if ("Șterge".equals(columnName)) {
                        // Get the room ID from the first column (column index 0)
                        // Convert table row to model row in case of sorting/filtering
                        int modelRow = roomsTable.convertRowIndexToModel(row);
                        Object idValue = roomsModel.getValueAt(modelRow, 0);
                        
                        if (idValue != null) {
                            int roomId;
                            try {
                                if (idValue instanceof Integer) {
                                    roomId = (Integer) idValue;
                                } else if (idValue instanceof Number) {
                                    roomId = ((Number) idValue).intValue();
                                } else if (idValue instanceof String) {
                                    // Try to parse as integer
                                    String idStr = ((String) idValue).trim();
                                    if (idStr.isEmpty()) {
                                        throw new NumberFormatException("ID string is empty");
                                    }
                                    roomId = Integer.parseInt(idStr);
                                } else {
                                    throw new NumberFormatException("Unexpected ID type: " + idValue.getClass().getName());
                                }
                                
                                // Allow deletion of any valid ID (including 0 if it exists in database)
                                // The deleteRoom method will verify if the room exists
                                deleteRoom(roomId);
                            } catch (Exception e) {
                                JOptionPane.showMessageDialog(MainGUI.this,
                                    "Eroare la obținerea ID-ului camerei: " + e.getMessage() + 
                                    "\nValoare ID: " + idValue + " (tip: " + (idValue != null ? idValue.getClass().getName() : "null") + ")" +
                                    "\nRând tabel: " + row + ", Rând model: " + modelRow,
                                    "Eroare", JOptionPane.ERROR_MESSAGE);
                            }
                        } else {
                            JOptionPane.showMessageDialog(MainGUI.this,
                                "Eroare: ID-ul camerei este null la rândul " + row,
                                "Eroare", JOptionPane.ERROR_MESSAGE);
                        }
                    }
                }
            }
        });
        JScrollPane scrollPane = new JScrollPane(roomsTable) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                // Draw gradient border
                GradientPaint borderGradient = new GradientPaint(
                    0, 0, new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 30),
                    getWidth(), getHeight(), new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 15)
                );
                g2d.setPaint(borderGradient);
                g2d.setStroke(new BasicStroke(1.5f));
                g2d.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 12, 12);
                g2d.dispose();
            }
        };
        scrollPane.setBorder(new EmptyBorder(2, 2, 2, 2));
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.getViewport().setBackground(new Color(255, 255, 255, 0));
        
        // Buttons panel
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        buttonPanel.setOpaque(false);
        
        JButton refreshBtn = createStyledButton("Actualizează", false);
        refreshBtn.addActionListener(e -> loadRooms());
        
        JButton addBtn = createStyledButton("Adaugă Cameră", true);
        addBtn.addActionListener(e -> showAddRoomDialog());
        
        buttonPanel.add(refreshBtn);
        buttonPanel.add(addBtn);
        
        panel.add(headerLabel, BorderLayout.NORTH);
        panel.add(scrollPane, BorderLayout.CENTER);
        panel.add(buttonPanel, BorderLayout.SOUTH);
        
        return panel;
    }
    
    private JPanel createBookingsPanel() {
        JPanel panel = new RoundedPanel();
        panel.setLayout(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(20, 20, 20, 20));
        panel.setBackground(new Color(0, 0, 0, 0));
        
        // Header
        JLabel headerLabel = new JLabel("Gestionare Rezervări", JLabel.LEFT);
        headerLabel.setFont(new Font("Segoe UI", Font.BOLD, 24));
        headerLabel.setForeground(TEXT_PRIMARY);
        headerLabel.setBorder(new EmptyBorder(0, 0, 15, 0));
        
        // Table
        String[] columns = {"ID", "Nume Client", "Email", "Cameră", "Check-in", "Check-out", "Status", "Preț Total", "Șterge"};
        bookingsModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false; // No cells are editable - delete handled by mouse listener
            }
        };
        bookingsTable = createStyledTable(bookingsModel);
        // Set custom renderer for delete column
        bookingsTable.getColumn("Șterge").setCellRenderer(new ButtonRenderer());
        // Add mouse listener to handle delete button clicks (double-click only)
        bookingsTable.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                // CRITICAL: Only trigger on double-click, ignore single clicks
                if (evt.getClickCount() != 2) {
                    return; // Exit immediately for single clicks
                }
                
                int row = bookingsTable.rowAtPoint(evt.getPoint());
                int col = bookingsTable.columnAtPoint(evt.getPoint());
                
                if (row >= 0 && col >= 0 && row < bookingsModel.getRowCount()) {
                    String columnName = bookingsTable.getColumnName(col);
                    if ("Șterge".equals(columnName)) {
                        // Get the booking ID from the first column (column index 0)
                        // Convert table row to model row in case of sorting/filtering
                        int modelRow = bookingsTable.convertRowIndexToModel(row);
                        Object idValue = bookingsModel.getValueAt(modelRow, 0);
                        
                        if (idValue != null) {
                            int bookingId;
                            try {
                                if (idValue instanceof Integer) {
                                    bookingId = (Integer) idValue;
                                } else if (idValue instanceof Number) {
                                    bookingId = ((Number) idValue).intValue();
                                } else if (idValue instanceof String) {
                                    // Try to parse as integer
                                    String idStr = ((String) idValue).trim();
                                    if (idStr.isEmpty()) {
                                        throw new NumberFormatException("ID string is empty");
                                    }
                                    bookingId = Integer.parseInt(idStr);
                                } else {
                                    throw new NumberFormatException("Unexpected ID type: " + idValue.getClass().getName());
                                }
                                
                                if (bookingId > 0) {
                                    // Direct delete without any confirmation
                                    deleteBooking(bookingId);
                                } else {
                                    JOptionPane.showMessageDialog(MainGUI.this,
                                        "Eroare: ID-ul rezervării este invalid: " + bookingId + " (rând: " + row + ", modelRow: " + modelRow + ")",
                                        "Eroare", JOptionPane.ERROR_MESSAGE);
                                }
                            } catch (Exception e) {
                                JOptionPane.showMessageDialog(MainGUI.this,
                                    "Eroare la obținerea ID-ului rezervării: " + e.getMessage() + 
                                    "\nValoare ID: " + idValue + " (tip: " + (idValue != null ? idValue.getClass().getName() : "null") + ")" +
                                    "\nRând tabel: " + row + ", Rând model: " + modelRow,
                                    "Eroare", JOptionPane.ERROR_MESSAGE);
                            }
                        } else {
                            JOptionPane.showMessageDialog(MainGUI.this,
                                "Eroare: ID-ul rezervării este null la rândul " + row,
                                "Eroare", JOptionPane.ERROR_MESSAGE);
                        }
                    }
                }
            }
        });
        JScrollPane scrollPane = new JScrollPane(bookingsTable);
        scrollPane.setBorder(new RoundedBorder(CARD_BORDER, 11));
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setBackground(Color.WHITE);
        
        // Buttons panel
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        buttonPanel.setOpaque(false);
        
        JButton refreshBtn = createStyledButton("Actualizează", false);
        refreshBtn.addActionListener(e -> loadBookings());
        
        JButton addBtn = createStyledButton("Adaugă Rezervare", true);
        addBtn.addActionListener(e -> showAddBookingDialog());
        
        buttonPanel.add(refreshBtn);
        buttonPanel.add(addBtn);
        
        panel.add(headerLabel, BorderLayout.NORTH);
        panel.add(scrollPane, BorderLayout.CENTER);
        panel.add(buttonPanel, BorderLayout.SOUTH);
        
        return panel;
    }
    
    private JPanel createReviewsPanel() {
        JPanel panel = new RoundedPanel();
        panel.setLayout(new BorderLayout(15, 15));
        panel.setBorder(new EmptyBorder(20, 20, 20, 20));
        panel.setBackground(new Color(0, 0, 0, 0));
        
        // Header
        JLabel headerLabel = new JLabel("Gestionare Recenzii", JLabel.LEFT);
        headerLabel.setFont(new Font("Segoe UI", Font.BOLD, 24));
        headerLabel.setForeground(TEXT_PRIMARY);
        headerLabel.setBorder(new EmptyBorder(0, 0, 15, 0));
        
        // Table
        String[] columns = {"ID", "Cameră", "Nume Client", "Rating", "Comentariu", "Data"};
        reviewsModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        reviewsTable = createStyledTable(reviewsModel);
        JScrollPane scrollPane = new JScrollPane(reviewsTable);
        scrollPane.setBorder(new RoundedBorder(CARD_BORDER, 11));
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setBackground(Color.WHITE);
        
        // Buttons panel
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        buttonPanel.setOpaque(false);
        
        JButton refreshBtn = createStyledButton("Actualizează", false);
        refreshBtn.addActionListener(e -> loadReviews());
        
        JButton addBtn = createStyledButton("Adaugă Recenzie", true);
        addBtn.addActionListener(e -> showAddReviewDialog());
        
        buttonPanel.add(refreshBtn);
        buttonPanel.add(addBtn);
        
        panel.add(headerLabel, BorderLayout.NORTH);
        panel.add(scrollPane, BorderLayout.CENTER);
        panel.add(buttonPanel, BorderLayout.SOUTH);
        
        return panel;
    }
    
    private JPanel createAnalyticsPanel() {
        JPanel panel = new RoundedPanel();
        panel.setLayout(new GridBagLayout());
        panel.setBorder(new EmptyBorder(30, 30, 30, 30));
        panel.setBackground(new Color(0, 0, 0, 0));
        
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(20, 20, 20, 20);
        gbc.anchor = GridBagConstraints.WEST;
        
        // Header
        JLabel headerLabel = new JLabel("Statistici", JLabel.LEFT);
        headerLabel.setFont(new Font("Segoe UI", Font.BOLD, 28));
        headerLabel.setForeground(TEXT_PRIMARY);
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 2;
        panel.add(headerLabel, gbc);
        
        // API Status indicators
        JPanel apiStatusPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 5));
        apiStatusPanel.setOpaque(false);
        
        JLabel bookingStatus = new JLabel();
        bookingStatus.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        if (BookingApiSimulator.isEnabled()) {
            bookingStatus.setText("✓ Booking.com: Conectat");
            bookingStatus.setForeground(new Color(34, 139, 34));
        } else {
            bookingStatus.setText("✗ Booking.com: Neconectat");
            bookingStatus.setForeground(new Color(150, 150, 150));
        }
        
        JLabel adsStatus = new JLabel();
        adsStatus.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        if (GoogleAdsApiSimulator.isEnabled()) {
            adsStatus.setText("✓ Google Ads: Conectat");
            adsStatus.setForeground(new Color(34, 139, 34));
        } else {
            adsStatus.setText("✗ Google Ads: Neconectat");
            adsStatus.setForeground(new Color(150, 150, 150));
        }
        
        apiStatusPanel.add(bookingStatus);
        apiStatusPanel.add(adsStatus);
        gbc.gridy = 1;
        panel.add(apiStatusPanel, gbc);
        
        // Stat cards
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        
        gbc.gridx = 0; gbc.gridy = 2;
        panel.add(createStatCard("Total Camere", totalRoomsLabel = new JLabel("0")), gbc);
        
        gbc.gridx = 1; gbc.gridy = 2;
        panel.add(createStatCard("Total Rezervări", totalBookingsLabel = new JLabel("0")), gbc);
        
        gbc.gridx = 0; gbc.gridy = 3;
        panel.add(createStatCard("Venit Total", totalRevenueLabel = new JLabel("0.00 RON")), gbc);
        
        gbc.gridx = 1; gbc.gridy = 3;
        panel.add(createStatCard("Rating Mediu", avgRatingLabel = new JLabel("0.00/5")), gbc);
        
        // API Statistics section
        int nextRow = 4;
        if (BookingApiSimulator.isEnabled() || GoogleAdsApiSimulator.isEnabled()) {
            JLabel apiStatsLabel = new JLabel("Statistici API", JLabel.LEFT);
            apiStatsLabel.setFont(new Font("Segoe UI", Font.BOLD, 20));
            apiStatsLabel.setForeground(TEXT_PRIMARY);
            gbc.gridx = 0; gbc.gridy = nextRow++; gbc.gridwidth = 2;
            gbc.anchor = GridBagConstraints.WEST;
            gbc.fill = GridBagConstraints.NONE;
            panel.add(apiStatsLabel, gbc);
            
            // Booking.com stats
            if (BookingApiSimulator.isEnabled()) {
                Map<String, Object> bookingStats = BookingApiSimulator.getStatistics();
                JPanel bookingStatsPanel = new JPanel(new GridBagLayout());
                bookingStatsPanel.setOpaque(false);
                GridBagConstraints statsGbc = new GridBagConstraints();
                statsGbc.insets = new Insets(5, 10, 5, 10);
                statsGbc.anchor = GridBagConstraints.WEST;
                
                JLabel bookingTitle = new JLabel("Booking.com:");
                bookingTitle.setFont(new Font("Segoe UI", Font.BOLD, 14));
                statsGbc.gridx = 0; statsGbc.gridy = 0; statsGbc.gridwidth = 2;
                bookingStatsPanel.add(bookingTitle, statsGbc);
                
                statsGbc.gridwidth = 1;
                statsGbc.gridy = 1;
                bookingStatsPanel.add(new JLabel("Rezervări: " + bookingStats.get("totalBookings")), statsGbc);
                statsGbc.gridx = 1;
                bookingStatsPanel.add(new JLabel("Venit: " + String.format("%.2f RON", ((Number)bookingStats.get("totalRevenue")).doubleValue())), statsGbc);
                statsGbc.gridx = 0; statsGbc.gridy = 2;
                bookingStatsPanel.add(new JLabel("Rating: " + String.format("%.2f/5", ((Number)bookingStats.get("averageRating")).doubleValue())), statsGbc);
                statsGbc.gridx = 1;
                bookingStatsPanel.add(new JLabel("Ocupare: " + String.format("%.1f%%", ((Number)bookingStats.get("occupancyRate")).doubleValue())), statsGbc);
                
                gbc.gridy = nextRow++;
                panel.add(bookingStatsPanel, gbc);
            }
            
            // Google Ads stats
            if (GoogleAdsApiSimulator.isEnabled()) {
                Map<String, Object> adsStats = GoogleAdsApiSimulator.getStatistics();
                JPanel adsStatsPanel = new JPanel(new GridBagLayout());
                adsStatsPanel.setOpaque(false);
                GridBagConstraints statsGbc = new GridBagConstraints();
                statsGbc.insets = new Insets(5, 10, 5, 10);
                statsGbc.anchor = GridBagConstraints.WEST;
                
                JLabel adsTitle = new JLabel("Google Ads:");
                adsTitle.setFont(new Font("Segoe UI", Font.BOLD, 14));
                statsGbc.gridx = 0; statsGbc.gridy = 0; statsGbc.gridwidth = 2;
                adsStatsPanel.add(adsTitle, statsGbc);
                
                statsGbc.gridwidth = 1;
                statsGbc.gridy = 1;
                adsStatsPanel.add(new JLabel("Impresii: " + adsStats.get("impressions")), statsGbc);
                statsGbc.gridx = 1;
                adsStatsPanel.add(new JLabel("Click-uri: " + adsStats.get("clicks")), statsGbc);
                statsGbc.gridx = 0; statsGbc.gridy = 2;
                adsStatsPanel.add(new JLabel("Conversii: " + adsStats.get("conversions")), statsGbc);
                statsGbc.gridx = 1;
                adsStatsPanel.add(new JLabel("Cost: " + String.format("%.2f RON", ((Number)adsStats.get("cost")).doubleValue())), statsGbc);
                statsGbc.gridx = 0; statsGbc.gridy = 3;
                adsStatsPanel.add(new JLabel("ROAS: " + String.format("%.2f", ((Number)adsStats.get("roas")).doubleValue())), statsGbc);
                
                gbc.gridy = nextRow++;
                panel.add(adsStatsPanel, gbc);
            }
        }
        
        // Refresh button
        JButton refreshBtn = createStyledButton("Actualizează Statistici", true);
        refreshBtn.addActionListener(e -> loadAnalytics());
        gbc.gridx = 0; gbc.gridy = nextRow; gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        gbc.fill = GridBagConstraints.NONE;
        panel.add(refreshBtn, gbc);
        
        return panel;
    }
    
    private JPanel createStatCard(String title, JLabel valueLabel) {
        JPanel card = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                // Draw gradient background matching website card style
                GradientPaint gradient = new GradientPaint(
                    0, 0, CARD_COLOR,
                    getWidth(), getHeight(), BACKGROUND_LIGHT
                );
                g2d.setPaint(gradient);
                g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 12, 12);
                
                // Draw subtle border with gradient incorporating accent color
                Color accentWithAlpha = new Color(ACCENT_COLOR.getRed(), ACCENT_COLOR.getGreen(), ACCENT_COLOR.getBlue(), 50);
                Color primaryWithAlpha = new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 30);
                GradientPaint borderGradient = new GradientPaint(
                    0, 0, accentWithAlpha,
                    getWidth(), getHeight(), primaryWithAlpha
                );
                g2d.setPaint(borderGradient);
                g2d.setStroke(new BasicStroke(1.5f));
                g2d.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 12, 12);
                
                g2d.dispose();
            }
        };
        
        card.setLayout(new BorderLayout());
        card.setOpaque(false);
        card.setPreferredSize(new Dimension(280, 140));
        card.setBorder(new EmptyBorder(20, 20, 20, 20));
        
        JLabel titleLabel = new JLabel(title);
        titleLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        titleLabel.setForeground(TEXT_MUTED);
        
        valueLabel.setFont(new Font("Segoe UI", Font.BOLD, 32));
        valueLabel.setForeground(TEXT_PRIMARY);
        
        card.add(titleLabel, BorderLayout.NORTH);
        card.add(valueLabel, BorderLayout.CENTER);
        
        return card;
    }
    
    private JTable createStyledTable(DefaultTableModel model) {
        JTable table = new JTable(model) {
            @Override
            public void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                // Draw subtle gradient background matching website
                GradientPaint gradient = new GradientPaint(
                    0, 0, CARD_COLOR,
                    0, getHeight(), BACKGROUND_LIGHT
                );
                g2d.setPaint(gradient);
                g2d.fillRect(0, 0, getWidth(), getHeight());
                g2d.dispose();
                
                super.paintComponent(g);
            }
        };
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.setRowHeight(38);
        table.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        table.setForeground(TEXT_PRIMARY);
        table.setBackground(new Color(255, 255, 255, 0)); // Transparent to show gradient
        table.setGridColor(new Color(220, 230, 240));
        table.setShowGrid(true);
        table.setIntercellSpacing(new Dimension(0, 0));
        table.setOpaque(false);
        
        // Style header with gradient
        JTableHeader header = table.getTableHeader();
        header = new JTableHeader(table.getColumnModel()) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                // Draw gradient background for header matching website
                GradientPaint gradient = new GradientPaint(
                    0, 0, BACKGROUND_LIGHT,
                    0, getHeight(), new Color(245, 250, 255)
                );
                g2d.setPaint(gradient);
                g2d.fillRect(0, 0, getWidth(), getHeight());
                g2d.dispose();
                
                super.paintComponent(g);
            }
        };
        header.setFont(new Font("Segoe UI", Font.BOLD, 13));
        header.setForeground(TEXT_PRIMARY);
        header.setPreferredSize(new Dimension(header.getWidth(), 45));
        header.setOpaque(false);
        table.setTableHeader(header);
        
        return table;
    }
    
    private JButton createStyledButton(String text, boolean primary) {
        JButton button = new JButton(text) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                if (primary) {
                    // Primary button with gradient
                    GradientPaint gradient = new GradientPaint(
                        0, 0, PRIMARY_COLOR,
                        0, getHeight(), PRIMARY_DARK
                    );
                    g2d.setPaint(gradient);
                } else {
                    // Secondary button with subtle gradient
                    GradientPaint gradient = new GradientPaint(
                        0, 0, new Color(250, 252, 255),
                        0, getHeight(), new Color(240, 245, 250)
                    );
                    g2d.setPaint(gradient);
                }
                
                g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 10, 10);
                
                // Add subtle shadow
                if (primary) {
                    g2d.setColor(new Color(0, 0, 0, 10));
                    g2d.fillRoundRect(0, getHeight() - 3, getWidth(), 3, 10, 10);
                }
                
                g2d.dispose();
                
                super.paintComponent(g);
            }
        };
        
        button.setFont(new Font("Segoe UI", Font.BOLD, 14));
        button.setForeground(primary ? Color.WHITE : TEXT_PRIMARY);
        button.setBorder(new EmptyBorder(12, 28, 12, 28));
        button.setContentAreaFilled(false);
        button.setOpaque(false);
        button.setFocusPainted(false);
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));
        
        // Add hover effect
        button.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                if (primary) {
                    button.setForeground(new Color(255, 255, 255, 240));
                } else {
                    button.setForeground(PRIMARY_COLOR);
                }
                button.repaint();
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                if (primary) {
                    button.setForeground(Color.WHITE);
                } else {
                    button.setForeground(TEXT_PRIMARY);
                }
                button.repaint();
            }
        });
        
        return button;
    }
    
    // Custom panel with rounded corners
    private class RoundedPanel extends JPanel {
        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2d = (Graphics2D) g.create();
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            
            g2d.setColor(getBackground());
            g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 11, 11);
            g2d.dispose();
        }
    }
    
    // Custom border with rounded corners
    private class RoundedBorder implements javax.swing.border.Border {
        private Color color;
        private int radius;
        
        public RoundedBorder(Color color, int radius) {
            this.color = color;
            this.radius = radius;
        }
        
        @Override
        public void paintBorder(Component c, Graphics g, int x, int y, int width, int height) {
            Graphics2D g2d = (Graphics2D) g.create();
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2d.setColor(color);
            g2d.drawRoundRect(x, y, width - 1, height - 1, radius, radius);
            g2d.dispose();
        }
        
        @Override
        public Insets getBorderInsets(Component c) {
            return new Insets(radius / 2, radius / 2, radius / 2, radius / 2);
        }
        
        @Override
        public boolean isBorderOpaque() {
            return false;
        }
    }
    
    // Gradient background panel
    private class GradientPanel extends JPanel {
        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2d = (Graphics2D) g.create();
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            
            // Match the web app's gradient: hsl(220, 100%, 99%) to hsl(200, 100%, 98%)
            GradientPaint gradient = new GradientPaint(
                0, 0, BACKGROUND_LIGHT,
                getWidth(), getHeight(), BACKGROUND_DARK
            );
            g2d.setPaint(gradient);
            g2d.fillRect(0, 0, getWidth(), getHeight());
            g2d.dispose();
        }
    }
    
    private void loadData() {
        loadRooms();
        loadBookings();
        loadReviews();
        loadAnalytics();
    }
    
    private void loadRooms() {
        roomsModel.setRowCount(0);
        try {
            Connection conn = DatabaseConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT id, name, type, capacity, price, status FROM rooms ORDER BY id");
            
            while (rs.next()) {
                Object[] row = {
                    rs.getInt("id"),
                    rs.getString("name") != null ? rs.getString("name") : "",
                    rs.getString("type") != null ? rs.getString("type") : "",
                    rs.getInt("capacity"),
                    String.format("%.2f", rs.getDouble("price")),
                    rs.getString("status") != null ? rs.getString("status") : "available",
                    "Șterge" // Delete button text
                };
                roomsModel.addRow(row);
            }
            
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this,
                "Eroare la încărcarea camerelor: " + e.getMessage(),
                "Eroare", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void loadBookings() {
        bookingsModel.setRowCount(0);
        try {
            Connection conn = DatabaseConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                "SELECT b.*, r.name as room_name FROM bookings b " +
                "LEFT JOIN rooms r ON b.room_id = r.id ORDER BY b.id DESC LIMIT 50"
            );
            
            while (rs.next()) {
                Object[] row = {
                    rs.getInt("id"),
                    rs.getString("guest_name"),
                    rs.getString("guest_email"),
                    rs.getString("room_name") != null ? rs.getString("room_name") : "N/A",
                    rs.getString("check_in"),
                    rs.getString("check_out"),
                    rs.getString("status"),
                    String.format("%.2f", rs.getDouble("total_price")),
                    "Șterge" // Delete button text
                };
                bookingsModel.addRow(row);
            }
            
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this,
                "Eroare la încărcarea rezervărilor: " + e.getMessage(),
                "Eroare", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void loadReviews() {
        reviewsModel.setRowCount(0);
        try {
            Connection conn = DatabaseConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                "SELECT r.*, rm.name as room_name FROM reviews r " +
                "LEFT JOIN rooms rm ON r.room_id = rm.id ORDER BY r.created_at DESC LIMIT 50"
            );
            
            while (rs.next()) {
                Object[] row = {
                    rs.getInt("id"),
                    rs.getString("room_name") != null ? rs.getString("room_name") : "N/A",
                    rs.getString("guest_name"),
                    rs.getInt("rating"),
                    rs.getString("comment") != null ? rs.getString("comment") : "",
                    rs.getString("created_at")
                };
                reviewsModel.addRow(row);
            }
            
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this,
                "Eroare la încărcarea recenziilor: " + e.getMessage(),
                "Eroare", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void loadAnalytics() {
        try {
            Connection conn = DatabaseConnection.getConnection();
            
            // Total rooms
            Statement stmt1 = conn.createStatement();
            ResultSet rs1 = stmt1.executeQuery("SELECT COUNT(*) as total FROM rooms");
            rs1.next();
            int totalRooms = rs1.getInt("total");
            totalRoomsLabel.setText(String.valueOf(totalRooms));
            rs1.close();
            stmt1.close();
            
            // Total bookings (including API sync)
            Statement stmt2 = conn.createStatement();
            ResultSet rs2 = stmt2.executeQuery("SELECT COUNT(*) as total FROM bookings");
            rs2.next();
            int totalBookings = rs2.getInt("total");
            
            // Add Booking.com bookings if enabled
            if (BookingApiSimulator.isEnabled()) {
                Map<String, Object> bookingStats = BookingApiSimulator.getStatistics();
                if (bookingStats.containsKey("totalBookings")) {
                    int bookingComBookings = ((Number) bookingStats.get("totalBookings")).intValue();
                    totalBookings += bookingComBookings;
                }
            }
            totalBookingsLabel.setText(String.valueOf(totalBookings));
            rs2.close();
            stmt2.close();
            
            // Total revenue (including API sync)
            Statement stmt3 = conn.createStatement();
            ResultSet rs3 = stmt3.executeQuery(
                "SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE status = 'confirmed'"
            );
            rs3.next();
            double totalRevenue = rs3.getDouble("total");
            
            // Add Booking.com revenue if enabled
            if (BookingApiSimulator.isEnabled()) {
                Map<String, Object> bookingStats = BookingApiSimulator.getStatistics();
                if (bookingStats.containsKey("totalRevenue")) {
                    double bookingComRevenue = ((Number) bookingStats.get("totalRevenue")).doubleValue();
                    totalRevenue += bookingComRevenue;
                }
            }
            
            // Add Google Ads conversions revenue if enabled
            if (GoogleAdsApiSimulator.isEnabled()) {
                Map<String, Object> adsStats = GoogleAdsApiSimulator.getStatistics();
                if (adsStats.containsKey("revenue")) {
                    double adsRevenue = ((Number) adsStats.get("revenue")).doubleValue();
                    totalRevenue += adsRevenue;
                }
            }
            
            DecimalFormat df = new DecimalFormat("#.00");
            totalRevenueLabel.setText(df.format(totalRevenue) + " RON");
            rs3.close();
            stmt3.close();
            
            // Average rating (including API sync)
            Statement stmt4 = conn.createStatement();
            ResultSet rs4 = stmt4.executeQuery("SELECT COALESCE(AVG(rating), 0) as avg FROM reviews");
            rs4.next();
            double avgRating = rs4.getDouble("avg");
            
            // Add Booking.com rating if enabled
            if (BookingApiSimulator.isEnabled()) {
                Map<String, Object> bookingStats = BookingApiSimulator.getStatistics();
                if (bookingStats.containsKey("averageRating")) {
                    double bookingComRating = ((Number) bookingStats.get("averageRating")).doubleValue();
                    // Weighted average (70% local, 30% Booking.com)
                    avgRating = (avgRating * 0.7) + (bookingComRating * 0.3);
                }
            }
            
            avgRatingLabel.setText(String.format("%.2f/5", avgRating));
            rs4.close();
            stmt4.close();
            
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this,
                "Eroare la încărcarea statisticilor: " + e.getMessage(),
                "Eroare", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void showAddRoomDialog() {
        JDialog dialog = createStyledDialog("Adaugă Cameră Nouă", 450, 350);
        
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBackground(new Color(255, 255, 255, 250));
        panel.setOpaque(true);
        panel.setBorder(new EmptyBorder(30, 30, 30, 30));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.anchor = GridBagConstraints.WEST;
        
        JTextField nameField = createStyledTextField(25);
        JTextField typeField = createStyledTextField(25);
        JTextField capacityField = createStyledTextField(25);
        JTextField priceField = createStyledTextField(25);
        
        gbc.gridx = 0; gbc.gridy = 0;
        panel.add(createLabel("Nume:"), gbc);
        gbc.gridx = 1;
        panel.add(nameField, gbc);
        
        gbc.gridx = 0; gbc.gridy = 1;
        panel.add(createLabel("Tip:"), gbc);
        gbc.gridx = 1;
        panel.add(typeField, gbc);
        
        gbc.gridx = 0; gbc.gridy = 2;
        panel.add(createLabel("Capacitate:"), gbc);
        gbc.gridx = 1;
        panel.add(capacityField, gbc);
        
        gbc.gridx = 0; gbc.gridy = 3;
        panel.add(createLabel("Preț (RON):"), gbc);
        gbc.gridx = 1;
        panel.add(priceField, gbc);
        
        JButton saveBtn = createStyledButton("Salvează", true);
        saveBtn.addActionListener(e -> {
            try {
                // Validate and trim inputs
                String name = nameField.getText().trim();
                String type = typeField.getText().trim();
                String capacityStr = capacityField.getText().trim();
                String priceStr = priceField.getText().trim();
                
                // Validate required fields
                if (name.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți numele camerei.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    nameField.requestFocus();
                    return;
                }
                
                if (type.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți tipul camerei.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    typeField.requestFocus();
                    return;
                }
                
                if (capacityStr.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți capacitatea camerei.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    capacityField.requestFocus();
                    return;
                }
                
                if (priceStr.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți prețul camerei.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    priceField.requestFocus();
                    return;
                }
                
                // Parse numeric values with better error handling
                int capacity;
                double price;
                
                try {
                    capacity = Integer.parseInt(capacityStr);
                    if (capacity <= 0) {
                        throw new NumberFormatException("Capacitatea trebuie să fie un număr pozitiv.");
                    }
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(dialog,
                        "Capacitatea trebuie să fie un număr întreg pozitiv.\nExemplu: 2",
                        "Valoare invalidă", JOptionPane.ERROR_MESSAGE);
                    capacityField.requestFocus();
                    capacityField.selectAll();
                    return;
                }
                
                try {
                    price = Double.parseDouble(priceStr.replace(",", "."));
                    if (price <= 0) {
                        throw new NumberFormatException("Prețul trebuie să fie un număr pozitiv.");
                    }
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(dialog,
                        "Prețul trebuie să fie un număr valid pozitiv.\nExemplu: 150.50 sau 150,50",
                        "Valoare invalidă", JOptionPane.ERROR_MESSAGE);
                    priceField.requestFocus();
                    priceField.selectAll();
                    return;
                }
                
                // Insert into database
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(
                    "INSERT INTO rooms (name, type, capacity, price, status) VALUES (?, ?, ?, ?, 'available')"
                );
                pstmt.setString(1, name);
                pstmt.setString(2, type);
                pstmt.setInt(3, capacity);
                pstmt.setDouble(4, price);
                pstmt.executeUpdate();
                pstmt.close();
                
                JOptionPane.showMessageDialog(dialog, "Cameră adăugată cu succes!");
                dialog.dispose();
                loadRooms();
            } catch (SQLException ex) {
                JOptionPane.showMessageDialog(dialog,
                    "Eroare la salvarea în baza de date: " + ex.getMessage(),
                    "Eroare", JOptionPane.ERROR_MESSAGE);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(dialog,
                    "Eroare neașteptată: " + ex.getMessage(),
                    "Eroare", JOptionPane.ERROR_MESSAGE);
            }
        });
        
        gbc.gridx = 0; gbc.gridy = 4; gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        panel.add(saveBtn, gbc);
        
        dialog.add(panel);
        dialog.setVisible(true);
    }
    
    private void showAddBookingDialog() {
        JDialog dialog = createStyledDialog("Adaugă Rezervare Nouă", 450, 450);
        
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBackground(new Color(255, 255, 255, 250));
        panel.setOpaque(true);
        panel.setBorder(new EmptyBorder(30, 30, 30, 30));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.anchor = GridBagConstraints.WEST;
        
        JTextField guestNameField = createStyledTextField(25);
        JTextField guestEmailField = createStyledTextField(25);
        JTextField roomIdField = createStyledTextField(25);
        JTextField checkInField = createStyledTextField(25);
        JTextField checkOutField = createStyledTextField(25);
        JTextField totalPriceField = createStyledTextField(25);
        
        gbc.gridx = 0; gbc.gridy = 0;
        panel.add(createLabel("Nume Client:"), gbc);
        gbc.gridx = 1;
        panel.add(guestNameField, gbc);
        
        gbc.gridx = 0; gbc.gridy = 1;
        panel.add(createLabel("Email:"), gbc);
        gbc.gridx = 1;
        panel.add(guestEmailField, gbc);
        
        gbc.gridx = 0; gbc.gridy = 2;
        panel.add(createLabel("ID Cameră:"), gbc);
        gbc.gridx = 1;
        panel.add(roomIdField, gbc);
        
        gbc.gridx = 0; gbc.gridy = 3;
        panel.add(createLabel("Check-in (YYYY-MM-DD):"), gbc);
        gbc.gridx = 1;
        panel.add(checkInField, gbc);
        
        gbc.gridx = 0; gbc.gridy = 4;
        panel.add(createLabel("Check-out (YYYY-MM-DD):"), gbc);
        gbc.gridx = 1;
        panel.add(checkOutField, gbc);
        
        gbc.gridx = 0; gbc.gridy = 5;
        panel.add(createLabel("Preț Total (RON):"), gbc);
        gbc.gridx = 1;
        panel.add(totalPriceField, gbc);
        
        JButton saveBtn = createStyledButton("Salvează", true);
        saveBtn.addActionListener(e -> {
            try {
                // Validate and trim inputs
                String guestName = guestNameField.getText().trim();
                String guestEmail = guestEmailField.getText().trim();
                String roomIdStr = roomIdField.getText().trim();
                String checkIn = checkInField.getText().trim();
                String checkOut = checkOutField.getText().trim();
                String totalPriceStr = totalPriceField.getText().trim();
                
                // Validate required fields
                if (guestName.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți numele clientului.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    guestNameField.requestFocus();
                    return;
                }
                
                if (guestEmail.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți email-ul clientului.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    guestEmailField.requestFocus();
                    return;
                }
                
                if (roomIdStr.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți ID-ul camerei.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    roomIdField.requestFocus();
                    return;
                }
                
                if (checkIn.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți data de check-in.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    checkInField.requestFocus();
                    return;
                }
                
                if (checkOut.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți data de check-out.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    checkOutField.requestFocus();
                    return;
                }
                
                if (totalPriceStr.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți prețul total.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    totalPriceField.requestFocus();
                    return;
                }
                
                // Parse numeric values with better error handling
                int roomId;
                double totalPrice;
                
                try {
                    roomId = Integer.parseInt(roomIdStr);
                    if (roomId <= 0) {
                        throw new NumberFormatException("ID-ul camerei trebuie să fie un număr pozitiv.");
                    }
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(dialog,
                        "ID-ul camerei trebuie să fie un număr întreg pozitiv.\nExemplu: 1",
                        "Valoare invalidă", JOptionPane.ERROR_MESSAGE);
                    roomIdField.requestFocus();
                    roomIdField.selectAll();
                    return;
                }
                
                try {
                    totalPrice = Double.parseDouble(totalPriceStr.replace(",", "."));
                    if (totalPrice <= 0) {
                        throw new NumberFormatException("Prețul total trebuie să fie un număr pozitiv.");
                    }
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(dialog,
                        "Prețul total trebuie să fie un număr valid pozitiv.\nExemplu: 300.50 sau 300,50",
                        "Valoare invalidă", JOptionPane.ERROR_MESSAGE);
                    totalPriceField.requestFocus();
                    totalPriceField.selectAll();
                    return;
                }
                
                // Insert into database
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(
                    "INSERT INTO bookings (guest_name, guest_email, room_id, check_in, check_out, total_price, status) VALUES (?, ?, ?, ?, ?, ?, 'confirmed')"
                );
                pstmt.setString(1, guestName);
                pstmt.setString(2, guestEmail);
                pstmt.setInt(3, roomId);
                pstmt.setString(4, checkIn);
                pstmt.setString(5, checkOut);
                pstmt.setDouble(6, totalPrice);
                pstmt.executeUpdate();
                pstmt.close();
                
                JOptionPane.showMessageDialog(dialog, "Rezervare adăugată cu succes!");
                dialog.dispose();
                loadBookings();
                loadAnalytics();
            } catch (SQLException ex) {
                JOptionPane.showMessageDialog(dialog,
                    "Eroare la salvarea în baza de date: " + ex.getMessage(),
                    "Eroare", JOptionPane.ERROR_MESSAGE);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(dialog,
                    "Eroare neașteptată: " + ex.getMessage(),
                    "Eroare", JOptionPane.ERROR_MESSAGE);
            }
        });
        
        gbc.gridx = 0; gbc.gridy = 6; gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        panel.add(saveBtn, gbc);
        
        dialog.add(panel);
        dialog.setVisible(true);
    }
    
    private void showAddReviewDialog() {
        JDialog dialog = createStyledDialog("Adaugă Recenzie Nouă", 450, 400);
        
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBackground(new Color(255, 255, 255, 250));
        panel.setOpaque(true);
        panel.setBorder(new EmptyBorder(30, 30, 30, 30));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.anchor = GridBagConstraints.WEST;
        
        JTextField guestNameField = createStyledTextField(25);
        JTextField roomIdField = createStyledTextField(25);
        JSpinner ratingSpinner = new JSpinner(new SpinnerNumberModel(5, 1, 5, 1));
        ratingSpinner.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        ratingSpinner.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 50), 1),
            new EmptyBorder(8, 12, 8, 12)
        ));
        JTextArea commentArea = new JTextArea(4, 25);
        commentArea.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        commentArea.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 50), 1),
            new EmptyBorder(10, 15, 10, 15)
        ));
        commentArea.setBackground(Color.WHITE);
        commentArea.setForeground(TEXT_PRIMARY);
        commentArea.setLineWrap(true);
        commentArea.setWrapStyleWord(true);
        
        gbc.gridx = 0; gbc.gridy = 0;
        panel.add(createLabel("Nume Client:"), gbc);
        gbc.gridx = 1;
        panel.add(guestNameField, gbc);
        
        gbc.gridx = 0; gbc.gridy = 1;
        panel.add(createLabel("ID Cameră:"), gbc);
        gbc.gridx = 1;
        panel.add(roomIdField, gbc);
        
        gbc.gridx = 0; gbc.gridy = 2;
        panel.add(createLabel("Rating (1-5):"), gbc);
        gbc.gridx = 1;
        panel.add(ratingSpinner, gbc);
        
        gbc.gridx = 0; gbc.gridy = 3;
        panel.add(createLabel("Comentariu:"), gbc);
        gbc.gridx = 1;
        panel.add(new JScrollPane(commentArea), gbc);
        
        JButton saveBtn = createStyledButton("Salvează", true);
        saveBtn.addActionListener(e -> {
            try {
                String guestName = guestNameField.getText().trim();
                String roomIdStr = roomIdField.getText().trim();
                String comment = commentArea.getText().trim();
                int rating = (Integer) ratingSpinner.getValue();
                
                if (guestName.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți numele clientului.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    guestNameField.requestFocus();
                    return;
                }
                
                if (roomIdStr.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog,
                        "Vă rugăm introduceți ID-ul camerei.",
                        "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                    roomIdField.requestFocus();
                    return;
                }
                
                int roomId;
                try {
                    roomId = Integer.parseInt(roomIdStr);
                    if (roomId <= 0) {
                        throw new NumberFormatException();
                    }
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(dialog,
                        "ID-ul camerei trebuie să fie un număr întreg pozitiv.",
                        "Valoare invalidă", JOptionPane.ERROR_MESSAGE);
                    roomIdField.requestFocus();
                    roomIdField.selectAll();
                    return;
                }
                
                Connection conn = DatabaseConnection.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(
                    "INSERT INTO reviews (room_id, guest_name, rating, comment) VALUES (?, ?, ?, ?)"
                );
                pstmt.setInt(1, roomId);
                pstmt.setString(2, guestName);
                pstmt.setInt(3, rating);
                pstmt.setString(4, comment.isEmpty() ? null : comment);
                pstmt.executeUpdate();
                pstmt.close();
                
                JOptionPane.showMessageDialog(dialog, "Recenzie adăugată cu succes!");
                dialog.dispose();
                loadReviews();
                loadAnalytics();
            } catch (SQLException ex) {
                JOptionPane.showMessageDialog(dialog,
                    "Eroare la salvarea recenziei: " + ex.getMessage(),
                    "Eroare", JOptionPane.ERROR_MESSAGE);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(dialog,
                    "Eroare neașteptată: " + ex.getMessage(),
                    "Eroare", JOptionPane.ERROR_MESSAGE);
            }
        });
        
        gbc.gridx = 0; gbc.gridy = 4; gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        panel.add(saveBtn, gbc);
        
        dialog.add(panel);
        dialog.setVisible(true);
    }
    
    private JDialog createStyledDialog(String title, int width, int height) {
        JDialog dialog = new JDialog(this, title, true);
        dialog.setSize(width, height);
        dialog.setLocationRelativeTo(this);
        dialog.setUndecorated(false);
        
        // Set gradient background on content pane
        JPanel contentPane = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                GradientPaint gradient = new GradientPaint(
                    0, 0, BACKGROUND_LIGHT,
                    getWidth(), getHeight(), BACKGROUND_DARK
                );
                g2d.setPaint(gradient);
                g2d.fillRect(0, 0, getWidth(), getHeight());
                g2d.dispose();
            }
        };
        contentPane.setOpaque(true);
        dialog.setContentPane(contentPane);
        dialog.getRootPane().setBorder(BorderFactory.createLineBorder(new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 30), 1));
        return dialog;
    }
    
    private JLabel createLabel(String text) {
        JLabel label = new JLabel(text);
        label.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        label.setForeground(TEXT_PRIMARY);
        return label;
    }
    
    private JTextField createStyledTextField(int columns) {
        JTextField field = new JTextField(columns);
        
        field.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        field.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 50), 1),
            new EmptyBorder(10, 15, 10, 15)
        ));
        field.setBackground(Color.WHITE);
        field.setForeground(TEXT_PRIMARY);
        field.setOpaque(true);
        field.setEditable(true);
        field.setEnabled(true);
        
        // Add focus effect
        field.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusGained(java.awt.event.FocusEvent evt) {
                field.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(PRIMARY_COLOR, 2),
                    new EmptyBorder(9, 14, 9, 14)
                ));
                field.setBackground(new Color(255, 255, 255));
            }
            public void focusLost(java.awt.event.FocusEvent evt) {
                field.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 50), 1),
                    new EmptyBorder(10, 15, 10, 15)
                ));
                field.setBackground(Color.WHITE);
            }
        });
        
        return field;
    }
    
    // Delete methods
    private void deleteRoom(int roomId) {
        try {
            Connection conn = DatabaseConnection.getConnection();
            
            // First verify the room exists
            PreparedStatement checkStmt = conn.prepareStatement("SELECT id FROM rooms WHERE id = ?");
            checkStmt.setInt(1, roomId);
            ResultSet rs = checkStmt.executeQuery();
            boolean roomExists = rs.next();
            rs.close();
            checkStmt.close();
            
            if (!roomExists) {
                JOptionPane.showMessageDialog(this, 
                    "Cameră nu a fost găsită. ID: " + roomId,
                    "Eroare", JOptionPane.ERROR_MESSAGE);
                return;
            }
            
            // Delete the room
            PreparedStatement pstmt = conn.prepareStatement("DELETE FROM rooms WHERE id = ?");
            pstmt.setInt(1, roomId);
            int rowsAffected = pstmt.executeUpdate();
            pstmt.close();
            
            if (rowsAffected > 0) {
                JOptionPane.showMessageDialog(this, "Cameră ștearsă cu succes!");
                loadRooms();
                loadAnalytics();
            } else {
                JOptionPane.showMessageDialog(this, 
                    "Cameră nu a fost ștearsă. ID: " + roomId,
                    "Eroare", JOptionPane.ERROR_MESSAGE);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this,
                "Eroare la ștergerea camerei: " + e.getMessage(),
                "Eroare", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void deleteBooking(int bookingId) {
        try {
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement("DELETE FROM bookings WHERE id = ?");
            pstmt.setInt(1, bookingId);
            int rowsAffected = pstmt.executeUpdate();
            pstmt.close();
            
            if (rowsAffected > 0) {
                JOptionPane.showMessageDialog(this, "Rezervare ștearsă cu succes!");
                loadBookings();
                loadAnalytics();
            } else {
                JOptionPane.showMessageDialog(this, "Rezervare nu a fost găsită.");
            }
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this,
                "Eroare la ștergerea rezervării: " + e.getMessage(),
                "Eroare", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    // Button Renderer for delete column - uses JLabel instead of JButton to avoid event handling issues
    class ButtonRenderer extends JLabel implements javax.swing.table.TableCellRenderer {
        public ButtonRenderer() {
            setOpaque(true);
            setText("🗑️");
            setFont(new Font("Segoe UI Emoji", Font.PLAIN, 16));
            setBackground(new Color(220, 53, 69)); // Red color
            setForeground(Color.WHITE);
            setHorizontalAlignment(JLabel.CENTER);
            setBorder(new EmptyBorder(5, 10, 5, 10));
        }
        
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value,
                boolean isSelected, boolean hasFocus, int row, int column) {
            setBackground(new Color(220, 53, 69));
            setForeground(Color.WHITE);
            return this;
        }
    }
    // Settings panel as a full tab
    private JPanel createSettingsPanel() {
        JPanel mainPanel = new RoundedPanel();
        mainPanel.setLayout(new BorderLayout(15, 15));
        mainPanel.setBorder(new EmptyBorder(20, 20, 20, 20));
        mainPanel.setBackground(new Color(0, 0, 0, 0));
        
        // Header
        JLabel headerLabel = new JLabel("Setări Integrări API", JLabel.LEFT);
        headerLabel.setFont(new Font("Segoe UI", Font.BOLD, 28));
        headerLabel.setForeground(TEXT_PRIMARY);
        headerLabel.setBorder(new EmptyBorder(0, 0, 15, 0));
        
        JTabbedPane tabbedPane = new JTabbedPane();
        
        // Booking.com API Tab
        JPanel bookingPanel = new JPanel(new GridBagLayout());
        bookingPanel.setBackground(new Color(255, 255, 255, 250));
        bookingPanel.setBorder(new EmptyBorder(20, 20, 20, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.anchor = GridBagConstraints.WEST;
        
        JLabel bookingLabel = new JLabel("<html><h3>Booking.com API Integration</h3></html>");
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 2;
        bookingPanel.add(bookingLabel, gbc);
        
        gbc.gridwidth = 1;
        gbc.gridy = 1;
        bookingPanel.add(createLabel("API Key:"), gbc);
        JTextField bookingApiKey = createStyledTextField(30);
        gbc.gridx = 1;
        bookingPanel.add(bookingApiKey, gbc);
        
        gbc.gridx = 0; gbc.gridy = 2;
        bookingPanel.add(createLabel("Property ID:"), gbc);
        JTextField bookingPropertyId = createStyledTextField(30);
        gbc.gridx = 1;
        bookingPanel.add(bookingPropertyId, gbc);
        
        JCheckBox bookingEnabled = new JCheckBox("Activează sincronizare Booking.com");
        gbc.gridx = 0; gbc.gridy = 3; gbc.gridwidth = 2;
        bookingPanel.add(bookingEnabled, gbc);
        
        // Load existing Booking.com settings
        loadBookingSettings(bookingApiKey, bookingPropertyId, bookingEnabled);
        
        JButton bookingSaveBtn = createStyledButton("Salvează Setări Booking.com", true);
        bookingSaveBtn.addActionListener(e -> {
            // Save Booking.com settings
            String apiKey = bookingApiKey.getText();
            String propertyId = bookingPropertyId.getText();
            boolean enabled = bookingEnabled.isSelected();
            
            if (saveApiSettings("booking.com", apiKey, null, propertyId, null, enabled)) {
                JOptionPane.showMessageDialog(MainGUI.this,
                    "Setările Booking.com au fost salvate cu succes!\nAPI Key: " + (apiKey.isEmpty() ? "Nu este setat" : "Setat") +
                    "\nProperty ID: " + (propertyId.isEmpty() ? "Nu este setat" : propertyId) +
                    "\nStatus: " + (enabled ? "Activat" : "Dezactivat"),
                    "Setări salvate", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(MainGUI.this,
                    "Eroare la salvarea setărilor Booking.com.",
                    "Eroare", JOptionPane.ERROR_MESSAGE);
            }
        });
        gbc.gridy = 4;
        bookingPanel.add(bookingSaveBtn, gbc);
        
        // Google Ads API Tab
        JPanel googleAdsPanel = new JPanel(new GridBagLayout());
        googleAdsPanel.setBackground(new Color(255, 255, 255, 250));
        googleAdsPanel.setBorder(new EmptyBorder(20, 20, 20, 20));
        gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.anchor = GridBagConstraints.WEST;
        
        JLabel googleAdsLabel = new JLabel("<html><h3>Google Ads API Integration</h3></html>");
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 2;
        googleAdsPanel.add(googleAdsLabel, gbc);
        
        gbc.gridwidth = 1;
        gbc.gridy = 1;
        googleAdsPanel.add(createLabel("Client ID:"), gbc);
        JTextField googleClientId = createStyledTextField(30);
        gbc.gridx = 1;
        googleAdsPanel.add(googleClientId, gbc);
        
        gbc.gridx = 0; gbc.gridy = 2;
        googleAdsPanel.add(createLabel("Client Secret:"), gbc);
        JPasswordField googleClientSecret = new JPasswordField(30);
        googleClientSecret.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        googleClientSecret.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 50), 1),
            new EmptyBorder(10, 15, 10, 15)
        ));
        gbc.gridx = 1;
        googleAdsPanel.add(googleClientSecret, gbc);
        
        gbc.gridx = 0; gbc.gridy = 3;
        googleAdsPanel.add(createLabel("Customer ID:"), gbc);
        JTextField googleCustomerId = createStyledTextField(30);
        gbc.gridx = 1;
        googleAdsPanel.add(googleCustomerId, gbc);
        
        JCheckBox googleAdsEnabled = new JCheckBox("Activează integrare Google Ads");
        gbc.gridx = 0; gbc.gridy = 4; gbc.gridwidth = 2;
        googleAdsPanel.add(googleAdsEnabled, gbc);
        
        // Load existing Google Ads settings
        loadGoogleAdsSettings(googleClientId, googleClientSecret, googleCustomerId, googleAdsEnabled);
        
        JButton googleAdsSaveBtn = createStyledButton("Salvează Setări Google Ads", true);
        googleAdsSaveBtn.addActionListener(e -> {
            // Save Google Ads settings
            String clientId = googleClientId.getText();
            String clientSecret = new String(googleClientSecret.getPassword());
            String customerId = googleCustomerId.getText();
            boolean enabled = googleAdsEnabled.isSelected();
            
            if (saveApiSettings("google_ads", clientId, clientSecret, null, customerId, enabled)) {
                JOptionPane.showMessageDialog(MainGUI.this,
                    "Setările Google Ads au fost salvate cu succes!\nClient ID: " + (clientId.isEmpty() ? "Nu este setat" : "Setat") +
                    "\nClient Secret: " + (clientSecret.isEmpty() ? "Nu este setat" : "Setat") +
                    "\nCustomer ID: " + (customerId.isEmpty() ? "Nu este setat" : customerId) +
                    "\nStatus: " + (enabled ? "Activat" : "Dezactivat"),
                    "Setări salvate", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(MainGUI.this,
                    "Eroare la salvarea setărilor Google Ads.",
                    "Eroare", JOptionPane.ERROR_MESSAGE);
            }
        });
        gbc.gridy = 5;
        googleAdsPanel.add(googleAdsSaveBtn, gbc);
        
        tabbedPane.addTab("Booking.com", bookingPanel);
        tabbedPane.addTab("Google Ads", googleAdsPanel);
        
        mainPanel.add(headerLabel, BorderLayout.NORTH);
        mainPanel.add(tabbedPane, BorderLayout.CENTER);
        
        return mainPanel;
    }
    
    // Settings dialog (kept for menu access - redirects to Settings tab)
    private void showSettingsDialog() {
        // Switch to Settings tab (index 4 - after Camere, Rezervări, Recenzii, Analitică)
        if (tabbedPane != null) {
            tabbedPane.setSelectedIndex(4);
        }
    }
    
    // Save API settings to database
    private boolean saveApiSettings(String apiName, String apiKey, String apiSecret, 
                                    String propertyId, String customerId, boolean enabled) {
        try {
            Connection conn = DatabaseConnection.getConnection();
            
            // Check if settings already exist
            PreparedStatement checkStmt = conn.prepareStatement(
                "SELECT id FROM api_settings WHERE api_name = ?"
            );
            checkStmt.setString(1, apiName);
            ResultSet rs = checkStmt.executeQuery();
            
            if (rs.next()) {
                // Update existing settings
                PreparedStatement updateStmt = conn.prepareStatement(
                    "UPDATE api_settings SET api_key = ?, api_secret = ?, property_id = ?, " +
                    "customer_id = ?, enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE api_name = ?"
                );
                updateStmt.setString(1, apiKey.isEmpty() ? null : apiKey);
                updateStmt.setString(2, apiSecret == null || apiSecret.isEmpty() ? null : apiSecret);
                updateStmt.setString(3, propertyId == null || propertyId.isEmpty() ? null : propertyId);
                updateStmt.setString(4, customerId == null || customerId.isEmpty() ? null : customerId);
                updateStmt.setInt(5, enabled ? 1 : 0);
                updateStmt.setString(6, apiName);
                updateStmt.executeUpdate();
                updateStmt.close();
            } else {
                // Insert new settings
                PreparedStatement insertStmt = conn.prepareStatement(
                    "INSERT INTO api_settings (api_name, api_key, api_secret, property_id, customer_id, enabled) " +
                    "VALUES (?, ?, ?, ?, ?, ?)"
                );
                insertStmt.setString(1, apiName);
                insertStmt.setString(2, apiKey.isEmpty() ? null : apiKey);
                insertStmt.setString(3, apiSecret == null || apiSecret.isEmpty() ? null : apiSecret);
                insertStmt.setString(4, propertyId == null || propertyId.isEmpty() ? null : propertyId);
                insertStmt.setString(5, customerId == null || customerId.isEmpty() ? null : customerId);
                insertStmt.setInt(6, enabled ? 1 : 0);
                insertStmt.executeUpdate();
                insertStmt.close();
            }
            
            rs.close();
            checkStmt.close();
            return true;
        } catch (SQLException e) {
            System.err.println("Error saving API settings: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    // Load Booking.com settings from database
    private void loadBookingSettings(JTextField apiKeyField, JTextField propertyIdField, JCheckBox enabledCheckbox) {
        try {
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT api_key, property_id, enabled FROM api_settings WHERE api_name = ?"
            );
            stmt.setString(1, "booking.com");
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                String apiKey = rs.getString("api_key");
                String propertyId = rs.getString("property_id");
                boolean enabled = rs.getInt("enabled") == 1;
                
                if (apiKey != null && !apiKey.isEmpty()) {
                    apiKeyField.setText(apiKey);
                } else {
                    // Set default simulated API key
                    apiKeyField.setText("bk_test_1234567890abcdef");
                }
                if (propertyId != null && !propertyId.isEmpty()) {
                    propertyIdField.setText(propertyId);
                } else {
                    // Set default simulated property ID
                    propertyIdField.setText("prop_12345");
                }
                enabledCheckbox.setSelected(enabled);
            } else {
                // No settings found, set defaults
                apiKeyField.setText("bk_test_1234567890abcdef");
                propertyIdField.setText("prop_12345");
                enabledCheckbox.setSelected(false);
            }
            
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.err.println("Error loading Booking.com settings: " + e.getMessage());
            // Set defaults on error
            apiKeyField.setText("bk_test_1234567890abcdef");
            propertyIdField.setText("prop_12345");
        }
    }
    
    // Load Google Ads settings from database
    private void loadGoogleAdsSettings(JTextField clientIdField, JPasswordField clientSecretField, 
                                       JTextField customerIdField, JCheckBox enabledCheckbox) {
        try {
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT api_key, api_secret, customer_id, enabled FROM api_settings WHERE api_name = ?"
            );
            stmt.setString(1, "google_ads");
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                String clientId = rs.getString("api_key"); // api_key stores client_id for Google Ads
                String clientSecret = rs.getString("api_secret");
                String customerId = rs.getString("customer_id");
                boolean enabled = rs.getInt("enabled") == 1;
                
                if (clientId != null && !clientId.isEmpty()) {
                    clientIdField.setText(clientId);
                } else {
                    // Set default simulated client ID
                    clientIdField.setText("ga_test_9876543210fedcba");
                }
                if (clientSecret != null && !clientSecret.isEmpty()) {
                    clientSecretField.setText(clientSecret);
                } else {
                    // Set default simulated client secret
                    clientSecretField.setText("ga_secret_abcdef1234567890");
                }
                if (customerId != null && !customerId.isEmpty()) {
                    customerIdField.setText(customerId);
                } else {
                    // Set default simulated customer ID
                    customerIdField.setText("123-456-7890");
                }
                enabledCheckbox.setSelected(enabled);
            } else {
                // No settings found, set defaults
                clientIdField.setText("ga_test_9876543210fedcba");
                clientSecretField.setText("ga_secret_abcdef1234567890");
                customerIdField.setText("123-456-7890");
                enabledCheckbox.setSelected(false);
            }
            
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.err.println("Error loading Google Ads settings: " + e.getMessage());
            // Set defaults on error
            clientIdField.setText("ga_test_9876543210fedcba");
            clientSecretField.setText("ga_secret_abcdef1234567890");
            customerIdField.setText("123-456-7890");
        }
    }
    
    public static void main(String[] args) {
        // Set Windows-specific properties for better taskbar integration
        if (System.getProperty("os.name").toLowerCase().contains("windows")) {
            System.setProperty("java.awt.headless", "false");
            // Set app name for Windows taskbar
            System.setProperty("com.apple.mrj.application.apple.menu.about.name", "Bookerino");
        }
        
        SwingUtilities.invokeLater(() -> {
            try {
                MainGUI app = new MainGUI();
                // Ensure icon is set before making visible (critical for Windows taskbar)
                IconLoader.setFrameIcon(app);
                app.setVisible(true);
            } catch (Exception e) {
                JOptionPane.showMessageDialog(null,
                    "Eroare la pornirea aplicației: " + e.getMessage(),
                    "Eroare", JOptionPane.ERROR_MESSAGE);
                e.printStackTrace();
            }
        });
    }
}
