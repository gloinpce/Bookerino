package com.bookerino;

import com.bookerino.database.DatabaseConnection;
import com.bookerino.auth.AuthManager;
import com.bookerino.util.IconLoader;
import com.bookerino.api.BookingApiSimulator;
import com.bookerino.api.GoogleAdsApiSimulator;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
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
    
    // React-style layout components
    private JPanel sidebarPanel;
    private JPanel topBarPanel;
    private JPanel contentPanel;
    private boolean sidebarOpen = true;
    private String activeModule = "dashboard";
    
    // Original components
    @SuppressWarnings("unused")
    private JTabbedPane tabbedPane; // Kept for potential future use
    private JTable roomsTable;
    private JTable bookingsTable;
    @SuppressWarnings("unused")
    private JTable reviewsTable; // Kept for potential future use
    private DefaultTableModel roomsModel;
    private DefaultTableModel bookingsModel;
    private DefaultTableModel reviewsModel;
    private JLabel totalRoomsLabel;
    private JLabel totalBookingsLabel;
    private JLabel totalRevenueLabel;
    private JLabel avgRatingLabel;
    private JTextField searchField;
    private JLabel propertyNameLabel;
    private JLabel propertyLocationLabel;
    
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
        setSize(1440, 960);
        setLocationRelativeTo(null);
        
        IconLoader.setFrameIcon(this);
        setupCustomTheme();
        
        // Main container with BorderLayout
        setLayout(new BorderLayout());
        
        // Create sidebar (left)
        createSidebar();
        
        // Create main content area (center)
        createMainContentArea();
        
        // Add components to frame
        add(sidebarPanel, BorderLayout.WEST);
        add(contentPanel, BorderLayout.CENTER);
    }
    
    private void createSidebar() {
        // Sidebar colors: from-blue-600 to-blue-800
        Color SIDEBAR_START = new Color(37, 99, 235); // blue-600
        Color SIDEBAR_END = new Color(30, 64, 175);   // blue-800
        Color SIDEBAR_BORDER = new Color(59, 130, 246); // blue-500/30
        
        sidebarPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                // Gradient from blue-600 to blue-800
                GradientPaint gradient = new GradientPaint(
                    0, 0, SIDEBAR_START,
                    0, getHeight(), SIDEBAR_END
                );
                g2d.setPaint(gradient);
                g2d.fillRect(0, 0, getWidth(), getHeight());
                g2d.dispose();
            }
        };
        sidebarPanel.setLayout(new BorderLayout());
        sidebarPanel.setPreferredSize(new Dimension(sidebarOpen ? 256 : 80, 0));
        
        // Logo area
        JPanel logoPanel = new JPanel(new BorderLayout());
        logoPanel.setOpaque(false);
        logoPanel.setBorder(new EmptyBorder(24, 24, 24, 24));
        
        if (sidebarOpen) {
            JLabel logoTitle = new JLabel("Bookerino");
            logoTitle.setFont(new Font("Segoe UI", Font.BOLD, 24));
            logoTitle.setForeground(Color.WHITE);
            
            JLabel logoSubtitle = new JLabel("HoReCa Management");
            logoSubtitle.setFont(new Font("Segoe UI", Font.PLAIN, 12));
            logoSubtitle.setForeground(new Color(219, 234, 254)); // blue-100
            
            JPanel titlePanel = new JPanel(new BorderLayout());
            titlePanel.setOpaque(false);
            titlePanel.add(logoTitle, BorderLayout.CENTER);
            titlePanel.add(logoSubtitle, BorderLayout.SOUTH);
            
            logoPanel.add(titlePanel, BorderLayout.CENTER);
        }
        
        // Toggle button
        JButton toggleBtn = new JButton(sidebarOpen ? "✕" : "☰") {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                if (getModel().isRollover()) {
                    g2d.setColor(new Color(59, 130, 246, 76)); // blue-500/30
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                }
                g2d.dispose();
                super.paintComponent(g);
            }
        };
        toggleBtn.setFont(new Font("Segoe UI", Font.PLAIN, 20));
        toggleBtn.setForeground(Color.WHITE);
        toggleBtn.setOpaque(false);
        toggleBtn.setContentAreaFilled(false);
        toggleBtn.setBorderPainted(false);
        toggleBtn.setBorder(new EmptyBorder(8, 8, 8, 8));
        toggleBtn.addActionListener(e -> toggleSidebar());
        
        if (sidebarOpen) {
            logoPanel.add(toggleBtn, BorderLayout.EAST);
        } else {
            logoPanel.add(toggleBtn, BorderLayout.CENTER);
        }
        
        // Border
        JPanel borderPanel = new JPanel();
        borderPanel.setOpaque(false);
        borderPanel.setPreferredSize(new Dimension(0, 1));
        borderPanel.setBackground(SIDEBAR_BORDER);
        
        // Navigation menu
        JPanel navPanel = createNavigationMenu();
        
        // User profile area
        JPanel userPanel = createUserProfilePanel();
        
        sidebarPanel.add(logoPanel, BorderLayout.NORTH);
        sidebarPanel.add(borderPanel, BorderLayout.NORTH);
        sidebarPanel.add(navPanel, BorderLayout.CENTER);
        sidebarPanel.add(userPanel, BorderLayout.SOUTH);
    }
    
    private JPanel createNavigationMenu() {
        JPanel navPanel = new JPanel();
        navPanel.setOpaque(false);
        navPanel.setLayout(new BoxLayout(navPanel, BoxLayout.Y_AXIS));
        navPanel.setBorder(new EmptyBorder(16, 16, 16, 16));
        
        String[] menuItems = {"Dashboard", "Rezervări", "Camere", "Oaspeți", "Analiză Performanță", "Rapoarte Financiare", "Setări"};
        String[] menuIds = {"dashboard", "bookings", "rooms", "guests", "analytics", "financial", "settings"};
        
        for (int i = 0; i < menuItems.length; i++) {
            final String moduleId = menuIds[i];
            JButton menuBtn = createMenuButton(menuItems[i], moduleId.equals(activeModule));
            menuBtn.addActionListener(e -> switchModule(moduleId));
            navPanel.add(menuBtn);
            navPanel.add(Box.createVerticalStrut(8));
        }
        
        return navPanel;
    }
    
    private JButton createMenuButton(String label, boolean active) {
        JButton btn = new JButton(sidebarOpen ? label : "") {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                if (active) {
                    // Active: white background with blue text
                    g2d.setColor(Color.WHITE);
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                    // Shadow
                    g2d.setColor(new Color(0, 0, 0, 20));
                    g2d.fillRoundRect(0, getHeight() - 2, getWidth(), 2, 8, 8);
                } else if (getModel().isRollover()) {
                    // Hover: blue-500/30
                    g2d.setColor(new Color(59, 130, 246, 76));
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                }
                g2d.dispose();
                super.paintComponent(g);
            }
        };
        btn.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        btn.setForeground(active ? PRIMARY_COLOR : new Color(219, 234, 254)); // blue-100
        btn.setOpaque(false);
        btn.setContentAreaFilled(false);
        btn.setBorderPainted(false);
        btn.setHorizontalAlignment(sidebarOpen ? SwingConstants.LEFT : SwingConstants.CENTER);
        btn.setBorder(new EmptyBorder(12, sidebarOpen ? 16 : 0, 12, 16));
        btn.setPreferredSize(new Dimension(sidebarOpen ? 0 : 48, 48));
        btn.setMaximumSize(new Dimension(Integer.MAX_VALUE, 48));
        
        return btn;
    }
    
    private JPanel createUserProfilePanel() {
        JPanel userPanel = new JPanel(new BorderLayout());
        userPanel.setOpaque(false);
        userPanel.setBorder(new EmptyBorder(16, 16, 16, 16));
        
        // Border
        JPanel borderPanel = new JPanel();
        borderPanel.setOpaque(false);
        borderPanel.setPreferredSize(new Dimension(0, 1));
        borderPanel.setBackground(new Color(59, 130, 246, 76));
        userPanel.add(borderPanel, BorderLayout.NORTH);
        
        // User info
        JPanel userInfoPanel = new JPanel(new BorderLayout());
        userInfoPanel.setOpaque(false);
        
        if (sidebarOpen) {
            // Avatar
            JPanel avatarPanel = new JPanel() {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    g2d.setColor(new Color(96, 165, 250)); // blue-400
                    g2d.fillOval(0, 0, getWidth(), getHeight());
                    g2d.setColor(Color.WHITE);
                    g2d.setFont(new Font("Segoe UI", Font.BOLD, 14));
                    FontMetrics fm = g2d.getFontMetrics();
                    String initials = AuthManager.getCurrentUser() != null && AuthManager.getCurrentUser().length() > 0 
                        ? AuthManager.getCurrentUser().substring(0, 1).toUpperCase() : "U";
                    int x = (getWidth() - fm.stringWidth(initials)) / 2;
                    int y = ((getHeight() - fm.getHeight()) / 2) + fm.getAscent();
                    g2d.drawString(initials, x, y);
                    g2d.dispose();
                }
            };
            avatarPanel.setPreferredSize(new Dimension(32, 32));
            avatarPanel.setOpaque(false);
            
            // User details
            JLabel userNameLabel = new JLabel(AuthManager.getCurrentUser() != null ? AuthManager.getCurrentUser() : "User");
            userNameLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            userNameLabel.setForeground(Color.WHITE);
            
            JLabel userEmailLabel = new JLabel("demo@bookerino.ro");
            userEmailLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
            userEmailLabel.setForeground(new Color(219, 234, 254));
            
            JPanel detailsPanel = new JPanel(new BorderLayout());
            detailsPanel.setOpaque(false);
            detailsPanel.add(userNameLabel, BorderLayout.CENTER);
            detailsPanel.add(userEmailLabel, BorderLayout.SOUTH);
            detailsPanel.setBorder(new EmptyBorder(0, 12, 0, 0));
            
            userInfoPanel.add(avatarPanel, BorderLayout.WEST);
            userInfoPanel.add(detailsPanel, BorderLayout.CENTER);
            
            // Logout button
            JButton logoutBtn = new JButton("🚪") {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    if (getModel().isRollover()) {
                        g2d.setColor(new Color(59, 130, 246, 76));
                        g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                    }
                    g2d.dispose();
                    super.paintComponent(g);
                }
            };
            logoutBtn.setFont(new Font("Segoe UI", Font.PLAIN, 16));
            logoutBtn.setForeground(new Color(219, 234, 254));
            logoutBtn.setOpaque(false);
            logoutBtn.setContentAreaFilled(false);
            logoutBtn.setBorderPainted(false);
            logoutBtn.setBorder(new EmptyBorder(4, 4, 4, 4));
            logoutBtn.addActionListener(e -> handleLogout());
            
            userInfoPanel.add(logoutBtn, BorderLayout.EAST);
        } else {
            // Collapsed: just avatar
            JPanel avatarPanel = new JPanel() {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    g2d.setColor(new Color(96, 165, 250));
                    g2d.fillOval(0, 0, getWidth(), getHeight());
                    g2d.setColor(Color.WHITE);
                    g2d.setFont(new Font("Segoe UI", Font.BOLD, 14));
                    FontMetrics fm = g2d.getFontMetrics();
                    String initials = AuthManager.getCurrentUser() != null && AuthManager.getCurrentUser().length() > 0 
                        ? AuthManager.getCurrentUser().substring(0, 1).toUpperCase() : "U";
                    int x = (getWidth() - fm.stringWidth(initials)) / 2;
                    int y = ((getHeight() - fm.getHeight()) / 2) + fm.getAscent();
                    g2d.drawString(initials, x, y);
                    g2d.dispose();
                }
            };
            avatarPanel.setPreferredSize(new Dimension(32, 32));
            avatarPanel.setOpaque(false);
            avatarPanel.addMouseListener(new java.awt.event.MouseAdapter() {
                public void mouseClicked(java.awt.event.MouseEvent e) {
                    handleLogout();
                }
            });
            userInfoPanel.add(avatarPanel, BorderLayout.CENTER);
        }
        
        userPanel.add(userInfoPanel, BorderLayout.CENTER);
        return userPanel;
    }
    
    private void createMainContentArea() {
        contentPanel = new JPanel(new BorderLayout());
        contentPanel.setOpaque(false);
        
        // Top bar
        createTopBar();
        
        // Main content with gradient background
        JPanel mainContent = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                // Gradient matching global.css gradient-subtle
                Color[] gradientColors = {
                    new Color(255, 255, 255),
                    new Color(240, 247, 255),
                    new Color(201, 224, 255),
                    new Color(168, 207, 255),
                    new Color(214, 235, 255),
                    new Color(240, 247, 255)
                };
                
                int width = getWidth();
                int height = getHeight();
                for (int i = 0; i < gradientColors.length - 1; i++) {
                    float startX = (float) i / (gradientColors.length - 1) * width;
                    float endX = (float) (i + 1) / (gradientColors.length - 1) * width;
                    GradientPaint gradient = new GradientPaint(
                        startX, 0, gradientColors[i],
                        endX, height, gradientColors[i + 1]
                    );
                    g2d.setPaint(gradient);
                    g2d.fillRect((int)startX, 0, (int)(endX - startX), height);
                }
                g2d.dispose();
            }
        };
        mainContent.setLayout(new BorderLayout());
        mainContent.setBorder(new EmptyBorder(32, 32, 32, 32));
        
        // Content based on active module
        JPanel moduleContent = createModuleContent(activeModule);
        mainContent.add(moduleContent, BorderLayout.CENTER);
        
        contentPanel.add(topBarPanel, BorderLayout.NORTH);
        contentPanel.add(mainContent, BorderLayout.CENTER);
    }
    
    private void createTopBar() {
        topBarPanel = new JPanel(new BorderLayout());
        topBarPanel.setOpaque(false);
        topBarPanel.setBorder(new EmptyBorder(16, 32, 16, 32));
        
        // Semi-transparent white background with blur effect simulation
        JPanel topBarBg = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.8f));
                g2d.setColor(Color.WHITE);
                g2d.fillRect(0, 0, getWidth(), getHeight());
                g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f));
                // Border
                g2d.setColor(new Color(226, 232, 240)); // slate-200
                g2d.drawLine(0, getHeight() - 1, getWidth(), getHeight() - 1);
                g2d.dispose();
            }
        };
        topBarBg.setLayout(new BorderLayout());
        topBarBg.setOpaque(false);
        
        // Search field
        JPanel searchPanel = new JPanel(new BorderLayout());
        searchPanel.setOpaque(false);
        searchPanel.setPreferredSize(new Dimension(0, 40));
        searchPanel.setMaximumSize(new Dimension(600, 40));
        
        searchField = new JTextField() {
            @Override
            public void paintComponent(Graphics g) {
                super.paintComponent(g);
                if (getText().isEmpty() && !hasFocus()) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    g2d.setColor(new Color(TEXT_MUTED.getRed(), TEXT_MUTED.getGreen(), TEXT_MUTED.getBlue(), 150));
                    g2d.setFont(getFont());
                    FontMetrics fm = g2d.getFontMetrics();
                    int x = 40;
                    int y = ((getHeight() - fm.getHeight()) / 2) + fm.getAscent();
                    g2d.drawString("Caută rezervări, oaspeți, camere...", x, y);
                    g2d.dispose();
                }
            }
        };
        searchField.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        searchField.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(226, 232, 240), 1),
            new EmptyBorder(10, 40, 10, 15)
        ));
        searchField.setBackground(new Color(248, 250, 252)); // slate-50
        searchField.setForeground(TEXT_PRIMARY);
        searchField.setOpaque(true);
        
        // Search icon (simulated with label)
        JLabel searchIcon = new JLabel("🔍");
        searchIcon.setBorder(new EmptyBorder(0, 12, 0, 0));
        searchIcon.setFont(new Font("Segoe UI", Font.PLAIN, 18));
        
        searchPanel.add(searchIcon, BorderLayout.WEST);
        searchPanel.add(searchField, BorderLayout.CENTER);
        
        // Right side: notifications and property info
        JPanel rightPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 16, 0));
        rightPanel.setOpaque(false);
        
        // Notification button
        JButton notificationBtn = new JButton("🔔") {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                if (getModel().isRollover()) {
                    g2d.setColor(new Color(241, 245, 249)); // slate-100
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                }
                g2d.dispose();
                super.paintComponent(g);
            }
        };
        notificationBtn.setFont(new Font("Segoe UI", Font.PLAIN, 20));
        notificationBtn.setForeground(TEXT_PRIMARY);
        notificationBtn.setOpaque(false);
        notificationBtn.setContentAreaFilled(false);
        notificationBtn.setBorderPainted(false);
        notificationBtn.setBorder(new EmptyBorder(8, 8, 8, 8));
        notificationBtn.setPreferredSize(new Dimension(40, 40));
        
        // Red dot indicator
        JPanel indicator = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setColor(new Color(239, 68, 68)); // red-500
                g2d.fillOval(0, 0, getWidth(), getHeight());
                g2d.dispose();
            }
        };
        indicator.setPreferredSize(new Dimension(8, 8));
        indicator.setOpaque(false);
        
        JPanel notificationContainer = new JPanel(null); // Use null layout for overlay
        notificationContainer.setOpaque(false);
        notificationContainer.setPreferredSize(new Dimension(40, 40));
        notificationBtn.setBounds(0, 0, 40, 40);
        indicator.setBounds(32, 2, 8, 8);
        notificationContainer.add(notificationBtn);
        notificationContainer.add(indicator);
        
        // Property info
        JPanel propertyPanel = new JPanel(new BorderLayout());
        propertyPanel.setOpaque(false);
        propertyPanel.setBackground(new Color(248, 250, 252));
        propertyPanel.setBorder(new EmptyBorder(8, 12, 8, 12));
        
        propertyNameLabel = new JLabel("Proprietatea Ta");
        propertyNameLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        propertyNameLabel.setForeground(TEXT_PRIMARY);
        
        propertyLocationLabel = new JLabel("România");
        propertyLocationLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        propertyLocationLabel.setForeground(TEXT_SECONDARY);
        
        JPanel propertyInfo = new JPanel(new BorderLayout());
        propertyInfo.setOpaque(false);
        propertyInfo.add(propertyNameLabel, BorderLayout.CENTER);
        propertyInfo.add(propertyLocationLabel, BorderLayout.SOUTH);
        
        propertyPanel.add(propertyInfo, BorderLayout.CENTER);
        
        rightPanel.add(notificationContainer);
        rightPanel.add(propertyPanel);
        
        topBarBg.add(searchPanel, BorderLayout.WEST);
        topBarBg.add(rightPanel, BorderLayout.EAST);
        
        topBarPanel.add(topBarBg, BorderLayout.CENTER);
    }
    
    private JPanel createModuleContent(String module) {
        JPanel content = new JPanel();
        content.setOpaque(false);
        content.setLayout(new BorderLayout());
        
        switch (module) {
            case "dashboard":
                return createDashboardPanel();
            case "bookings":
                return createBookingsPanel();
            case "rooms":
                return createRoomsPanel();
            case "guests":
                return createGuestsPanel();
            case "analytics":
                return createAnalyticsPanel();
            case "financial":
                return createFinancialPanel();
            case "settings":
                return createSettingsPanel();
            default:
                return createDashboardPanel();
        }
    }
    
    
    private void switchModule(String moduleId) {
        activeModule = moduleId;
        // Update navigation buttons by recreating sidebar
        sidebarPanel.removeAll();
        createSidebar();
        sidebarPanel.revalidate();
        sidebarPanel.repaint();
        
        // Update content panel
        JPanel mainContent = (JPanel) ((JPanel) contentPanel.getComponent(1)).getComponent(0);
        mainContent.removeAll();
        mainContent.add(createModuleContent(moduleId), BorderLayout.CENTER);
        revalidate();
        repaint();
    }
    
    private void toggleSidebar() {
        sidebarOpen = !sidebarOpen;
        // Recreate sidebar with new state
        sidebarPanel.removeAll();
        createSidebar();
        sidebarPanel.setPreferredSize(new Dimension(sidebarOpen ? 256 : 80, 0));
        revalidate();
        repaint();
    }
    
    private void handleLogout() {
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
    }
    
    // Placeholder methods for modules
    private JPanel createDashboardPanel() {
        JPanel panel = new JPanel();
        panel.setOpaque(false);
        panel.setLayout(new BorderLayout());
        
        JLabel title = new JLabel("Bine ai venit în Bookerino!");
        title.setFont(new Font("Segoe UI", Font.BOLD, 32));
        title.setForeground(TEXT_PRIMARY);
        title.setBorder(new EmptyBorder(0, 0, 8, 0));
        
        JLabel subtitle = new JLabel("Sistemul tău de management HoReCa este gata de utilizare.");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        subtitle.setForeground(TEXT_MUTED);
        
        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        header.add(title, BorderLayout.NORTH);
        header.add(subtitle, BorderLayout.SOUTH);
        
        panel.add(header, BorderLayout.NORTH);
        return panel;
    }
    
    private JPanel createGuestsPanel() {
        return createDashboardPanel(); // Placeholder
    }
    
    private JPanel createFinancialPanel() {
        return createDashboardPanel(); // Placeholder
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
    
    private void loadData() {
        // Initialize models if not already initialized
        if (reviewsModel == null) {
            String[] columns = {"ID", "Cameră", "Nume Client", "Rating", "Comentariu", "Data"};
            reviewsModel = new DefaultTableModel(columns, 0) {
                @Override
                public boolean isCellEditable(int row, int column) {
                    return false;
                }
            };
        }
        
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
    
    @SuppressWarnings("unused")
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
