package com.bookerino.auth;

import com.bookerino.util.IconLoader;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import org.json.JSONObject;

public class AuthManager {
    private static final String AUTH_SERVER_URL = "http://localhost:5000/api/auth"; // Default, can be configured
    private static String currentToken = null;
    private static String currentUser = null;
    
    public static boolean isAuthenticated() {
        return currentToken != null && !currentToken.isEmpty();
    }
    
    public static String getCurrentUser() {
        return currentUser;
    }
    
    public static String getToken() {
        return currentToken;
    }
    
    public static void logout() {
        currentToken = null;
        currentUser = null;
    }
    
    public static boolean showLoginDialog(Component parent) {
        Frame frame = null;
        if (parent != null) {
            Window window = SwingUtilities.getWindowAncestor(parent);
            if (window instanceof Frame) {
                frame = (Frame) window;
            }
        }
        LoginDialog dialog = new LoginDialog(frame);
        dialog.setVisible(true);
        return dialog.isAuthenticated();
    }
    
    private static class LoginDialog extends JDialog {
        private boolean authenticated = false;
        private JTextField emailField;
        private JPasswordField passwordField;
        private JButton loginBtn;
        private JButton demoBtn;
        // Updated colors to match global.css
        private static final Color PRIMARY_COLOR = new Color(0, 136, 255); // hsl(210, 100%, 50%) - #0088ff
        private static final Color PRIMARY_DARK = new Color(51, 153, 255); // hsl(220, 90%, 60%)
        private static final Color DEMO_BUTTON_COLOR = new Color(34, 197, 94); // Green #22c55e
        private static final Color DEMO_BUTTON_DARK = new Color(22, 163, 74); // Darker green
        private static final Color TEXT_PRIMARY = new Color(51, 65, 85); // hsl(220, 15%, 20%)
        private static final Color TEXT_MUTED = new Color(115, 125, 135); // hsl(220, 10%, 45%)
        private static final Color BACKGROUND_LIGHT = new Color(240, 247, 255); // #f0f7ff
        
        public LoginDialog(Frame parent) {
            super(parent, "Autentificare - Bookerino", true);
            // Size optimized for desktop app: 500x700
            setSize(500, 700);
            setLocationRelativeTo(parent);
            setResizable(false);
            // Set dialog icon
            IconLoader.setDialogIcon(this);
            initializeUI();
        }
        
        private void initializeUI() {
            setLayout(new BorderLayout());
            getContentPane().setBackground(BACKGROUND_LIGHT);
            
            // Header with gradient matching global.css
            JPanel headerPanel = new JPanel() {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    // Gradient matching global.css gradient-hero
                    GradientPaint gradient = new GradientPaint(
                        0, 0, PRIMARY_COLOR,
                        getWidth(), getHeight(), PRIMARY_DARK
                    );
                    g2d.setPaint(gradient);
                    g2d.fillRect(0, 0, getWidth(), getHeight());
                    g2d.dispose();
                }
            };
            headerPanel.setPreferredSize(new Dimension(getWidth(), 140));
            headerPanel.setLayout(new BorderLayout());
            
            // Logo and title panel
            JPanel titlePanel = new JPanel(new BorderLayout());
            titlePanel.setOpaque(false);
            titlePanel.setBorder(new EmptyBorder(20, 0, 20, 0));
            
            ImageIcon logoIcon = IconLoader.loadLogo(48, 48);
            if (logoIcon != null) {
                JLabel logoLabel = new JLabel(logoIcon);
                logoLabel.setHorizontalAlignment(JLabel.CENTER);
                titlePanel.add(logoLabel, BorderLayout.NORTH);
            }
            
            JLabel titleLabel = new JLabel("Bookerino", JLabel.CENTER);
            titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 32));
            titleLabel.setForeground(Color.WHITE);
            
            JLabel subtitleLabel = new JLabel("Sistem de Gestionare HoReCa", JLabel.CENTER);
            subtitleLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            subtitleLabel.setForeground(new Color(255, 255, 255, 200));
            
            JPanel textPanel = new JPanel(new BorderLayout());
            textPanel.setOpaque(false);
            textPanel.add(titleLabel, BorderLayout.CENTER);
            textPanel.add(subtitleLabel, BorderLayout.SOUTH);
            textPanel.setBorder(new EmptyBorder(10, 0, 0, 0));
            
            titlePanel.add(textPanel, BorderLayout.CENTER);
            headerPanel.add(titlePanel, BorderLayout.CENTER);
            
            // Main content panel
            JPanel mainPanel = new JPanel(new BorderLayout());
            mainPanel.setOpaque(false);
            mainPanel.setBorder(new EmptyBorder(30, 30, 30, 30));
            
            // Demo button (green) - most prominent
            demoBtn = createDemoButton("Creează Cont Demo Temporar");
            demoBtn.addActionListener(e -> createDemoAccount());
            
            // Separator
            JSeparator separator = new JSeparator();
            separator.setForeground(new Color(200, 200, 200));
            
            // Login form
            JPanel loginFormPanel = createEmailPhonePanel();
            
            mainPanel.add(demoBtn, BorderLayout.NORTH);
            mainPanel.add(Box.createVerticalStrut(20), BorderLayout.CENTER);
            mainPanel.add(separator, BorderLayout.CENTER);
            mainPanel.add(Box.createVerticalStrut(20), BorderLayout.CENTER);
            mainPanel.add(loginFormPanel, BorderLayout.CENTER);
            
            // Info label
            JLabel infoLabel = new JLabel("<html><center><small>Orice credențiale funcționează în modul demo</small></center></html>", JLabel.CENTER);
            infoLabel.setFont(new Font("Segoe UI", Font.PLAIN, 11));
            infoLabel.setForeground(TEXT_MUTED);
            infoLabel.setBorder(new EmptyBorder(15, 0, 0, 0));
            mainPanel.add(infoLabel, BorderLayout.SOUTH);
            
            add(headerPanel, BorderLayout.NORTH);
            add(mainPanel, BorderLayout.CENTER);
        }
        
        private JPanel createEmailPhonePanel() {
            JPanel panel = new JPanel(new GridBagLayout());
            panel.setOpaque(false);
            panel.setBorder(new EmptyBorder(0, 0, 0, 0));
            GridBagConstraints gbc = new GridBagConstraints();
            gbc.insets = new Insets(8, 0, 8, 0);
            gbc.anchor = GridBagConstraints.WEST;
            gbc.fill = GridBagConstraints.HORIZONTAL;
            gbc.weightx = 1.0;
            
            emailField = createStyledTextField(20);
            passwordField = new JPasswordField(20);
            passwordField.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            passwordField.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 50), 1),
                new EmptyBorder(10, 15, 10, 15)
            ));
            passwordField.setBackground(Color.WHITE);
            passwordField.setForeground(TEXT_PRIMARY);
            passwordField.setOpaque(true);
            
            // Add focus effect
            passwordField.addFocusListener(new java.awt.event.FocusAdapter() {
                public void focusGained(java.awt.event.FocusEvent evt) {
                    passwordField.setBorder(BorderFactory.createCompoundBorder(
                        BorderFactory.createLineBorder(PRIMARY_COLOR, 2),
                        new EmptyBorder(9, 14, 9, 14)
                    ));
                }
                public void focusLost(java.awt.event.FocusEvent evt) {
                    passwordField.setBorder(BorderFactory.createCompoundBorder(
                        BorderFactory.createLineBorder(new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 50), 1),
                        new EmptyBorder(10, 15, 10, 15)
                    ));
                }
            });
            
            gbc.gridx = 0; gbc.gridy = 0;
            panel.add(createLabel("Email:"), gbc);
            gbc.gridx = 0; gbc.gridy = 1;
            panel.add(emailField, gbc);
            
            gbc.gridx = 0; gbc.gridy = 2;
            panel.add(Box.createVerticalStrut(5), gbc);
            
            gbc.gridx = 0; gbc.gridy = 3;
            panel.add(createLabel("Parolă:"), gbc);
            gbc.gridx = 0; gbc.gridy = 4;
            panel.add(passwordField, gbc);
            
            loginBtn = createStyledButton("Conectează-te", true);
            loginBtn.addActionListener(e -> performLogin());
            
            gbc.gridx = 0; gbc.gridy = 5;
            gbc.insets = new Insets(15, 0, 0, 0);
            gbc.anchor = GridBagConstraints.CENTER;
            panel.add(loginBtn, gbc);
            
            return panel;
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
            
            // Add focus effect
            field.addFocusListener(new java.awt.event.FocusAdapter() {
                public void focusGained(java.awt.event.FocusEvent evt) {
                    field.setBorder(BorderFactory.createCompoundBorder(
                        BorderFactory.createLineBorder(PRIMARY_COLOR, 2),
                        new EmptyBorder(9, 14, 9, 14)
                    ));
                }
                public void focusLost(java.awt.event.FocusEvent evt) {
                    field.setBorder(BorderFactory.createCompoundBorder(
                        BorderFactory.createLineBorder(new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 50), 1),
                        new EmptyBorder(10, 15, 10, 15)
                    ));
                }
            });
            
            return field;
        }
        
        private JLabel createLabel(String text) {
            JLabel label = new JLabel(text);
            label.setFont(new Font("Segoe UI", Font.PLAIN, 13));
            label.setForeground(TEXT_PRIMARY);
            return label;
        }
        
        private JButton createDemoButton(String text) {
            JButton button = new JButton(text) {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    
                    // Green gradient for demo button
                    GradientPaint gradient = new GradientPaint(
                        0, 0, DEMO_BUTTON_COLOR,
                        0, getHeight(), DEMO_BUTTON_DARK
                    );
                    g2d.setPaint(gradient);
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 10, 10);
                    
                    // Shadow effect
                    g2d.setColor(new Color(0, 0, 0, 10));
                    g2d.fillRoundRect(0, getHeight() - 3, getWidth(), 3, 10, 10);
                    
                    g2d.dispose();
                    super.paintComponent(g);
                }
            };
            button.setFont(new Font("Segoe UI", Font.BOLD, 15));
            button.setForeground(Color.WHITE);
            button.setBorder(new EmptyBorder(14, 30, 14, 30));
            button.setContentAreaFilled(false);
            button.setOpaque(false);
            button.setFocusPainted(false);
            button.setCursor(new Cursor(Cursor.HAND_CURSOR));
            return button;
        }
        
        private JButton createStyledButton(String text, boolean primary) {
            JButton button = new JButton(text) {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    
                    // Gradient matching global.css gradient-hero
                    GradientPaint gradient = new GradientPaint(
                        0, 0, PRIMARY_COLOR,
                        0, getHeight(), PRIMARY_DARK
                    );
                    g2d.setPaint(gradient);
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 10, 10);
                    
                    // Shadow effect
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
            return button;
        }
        
        private void createDemoAccount() {
            // Create demo account instantly - matching React app behavior
            currentToken = "demo-token-" + System.currentTimeMillis();
            currentUser = "Utilizator Demo";
            authenticated = true;
            dispose();
        }
        
        private void performLogin() {
            String email = emailField.getText().trim();
            String password = new String(passwordField.getPassword());
            
            if (email.isEmpty() && password.isEmpty()) {
                JOptionPane.showMessageDialog(this,
                    "Vă rugăm completați toate câmpurile.",
                    "Câmp obligatoriu", JOptionPane.WARNING_MESSAGE);
                return;
            }
            
            // In demo mode, any credentials work
            String identifier = email.isEmpty() ? "demo@bookerino.ro" : email;
            
            try {
                // Try to authenticate via web API first
                JSONObject requestBody = new JSONObject();
                requestBody.put("email", email);
                requestBody.put("password", hashPassword(password));
                
                String response = sendPostRequest(AUTH_SERVER_URL + "/login", requestBody.toString());
                
                if (response != null && response.contains("token")) {
                    JSONObject jsonResponse = new JSONObject(response);
                    currentToken = jsonResponse.getString("token");
                    currentUser = jsonResponse.optString("user", identifier);
                    authenticated = true;
                    dispose();
                } else {
                    // Fallback: Create demo account with provided credentials (like React app)
                    currentToken = "demo-token-" + System.currentTimeMillis();
                    currentUser = email.isEmpty() ? "Admin User" : email;
                    authenticated = true;
                    dispose();
                }
            } catch (Exception e) {
                // Fallback: Create demo account (like React app)
                currentToken = "demo-token-" + System.currentTimeMillis();
                currentUser = email.isEmpty() ? "Admin User" : email;
                authenticated = true;
                dispose();
            }
        }
        
        private String hashPassword(String password) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] hash = md.digest(password.getBytes(StandardCharsets.UTF_8));
                return Base64.getEncoder().encodeToString(hash);
            } catch (Exception e) {
                return password; // Fallback
            }
        }
        
        private String sendPostRequest(String urlString, String jsonBody) throws IOException {
            URL url;
            try {
                url = new URI(urlString).toURL();
            } catch (URISyntaxException e) {
                throw new IOException("Invalid URL: " + urlString, e);
            }
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }
            
            int responseCode = conn.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                    StringBuilder response = new StringBuilder();
                    String responseLine;
                    while ((responseLine = br.readLine()) != null) {
                        response.append(responseLine.trim());
                    }
                    return response.toString();
                }
            }
            return null;
        }
        
        public boolean isAuthenticated() {
            return authenticated;
        }
    }
}

