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
        
        public LoginDialog(Frame parent) {
            super(parent, "Autentificare - Bookerino", true);
            // Optimal size for login form
            setSize(440, 600);
            setLocationRelativeTo(parent);
            setResizable(false);
            setUndecorated(false);
            IconLoader.setDialogIcon(this);
            initializeUI();
        }
        
        private void initializeUI() {
            // Simple background - light blue gradient
            setLayout(new BorderLayout());
            JPanel backgroundPanel = new JPanel() {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    // Simple subtle gradient
                    GradientPaint gradient = new GradientPaint(
                        0, 0, new Color(240, 247, 255), // #f0f7ff
                        getWidth(), getHeight(), new Color(255, 255, 255) // white
                    );
                    g2d.setPaint(gradient);
                    g2d.fillRect(0, 0, getWidth(), getHeight());
                    g2d.dispose();
                }
            };
            backgroundPanel.setLayout(new GridBagLayout());
            setContentPane(backgroundPanel);
            
            // White card panel - MUST be opaque
            JPanel cardPanel = new JPanel() {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    
                    // Solid white background - CRITICAL: must be opaque
                    g2d.setColor(Color.WHITE);
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 12, 12);
                    
                    // Simple shadow
                    g2d.setColor(new Color(0, 0, 0, 8));
                    g2d.fillRoundRect(2, getHeight() - 2, getWidth() - 4, 2, 12, 12);
                    
                    g2d.dispose();
                }
            };
            cardPanel.setLayout(new BorderLayout());
            cardPanel.setBorder(new EmptyBorder(36, 36, 36, 36));
            cardPanel.setOpaque(true); // CRITICAL: Must be opaque!
            cardPanel.setBackground(Color.WHITE);
            cardPanel.setPreferredSize(new Dimension(380, 0));
            
            // Card header
            JPanel cardHeader = new JPanel(new BorderLayout());
            cardHeader.setOpaque(false);
            cardHeader.setBorder(new EmptyBorder(0, 0, 28, 0));
            
            // Title with gradient-hero effect (matching React)
            JLabel titleLabel = new JLabel("Bookerino", JLabel.CENTER) {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
                    
                    // Create gradient text effect
                    GradientPaint textGradient = new GradientPaint(
                        0, 0, PRIMARY_COLOR,
                        getWidth(), getHeight(), PRIMARY_DARK
                    );
                    g2d.setPaint(textGradient);
                    g2d.setFont(getFont());
                    FontMetrics fm = g2d.getFontMetrics();
                    int x = (getWidth() - fm.stringWidth(getText())) / 2;
                    int y = ((getHeight() - fm.getHeight()) / 2) + fm.getAscent();
                    g2d.drawString(getText(), x, y);
                    g2d.dispose();
                }
            };
            titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 30));
            titleLabel.setForeground(PRIMARY_COLOR);
            
            JLabel subtitleLabel = new JLabel("Sistem de Gestionare HoReCa", JLabel.CENTER);
            subtitleLabel.setFont(new Font("Segoe UI", Font.PLAIN, 16));
            subtitleLabel.setForeground(TEXT_MUTED);
            subtitleLabel.setBorder(new EmptyBorder(6, 0, 0, 0));
            
            JPanel titlePanel = new JPanel(new BorderLayout());
            titlePanel.setOpaque(false);
            titlePanel.add(titleLabel, BorderLayout.CENTER);
            titlePanel.add(subtitleLabel, BorderLayout.SOUTH);
            
            cardHeader.add(titlePanel, BorderLayout.CENTER);
            
            // Card content
            JPanel cardContent = new JPanel(new BorderLayout());
            cardContent.setOpaque(false);
            cardContent.setBorder(new EmptyBorder(0, 0, 0, 0));
            
            // Demo button (green) - most prominent
            demoBtn = createDemoButton("Creează Cont Demo Temporar");
            demoBtn.addActionListener(e -> createDemoAccount());
            demoBtn.setPreferredSize(new Dimension(0, 48));
            
            // Separator with "SAU" label
            JPanel separatorPanel = new JPanel(new BorderLayout());
            separatorPanel.setOpaque(false);
            separatorPanel.setBorder(new EmptyBorder(20, 0, 20, 0));
            
            // Line
            JPanel line = new JPanel();
            line.setPreferredSize(new Dimension(0, 1));
            line.setBackground(new Color(210, 220, 230));
            
            // Label
            JLabel separatorLabel = new JLabel("SAU", JLabel.CENTER);
            separatorLabel.setFont(new Font("Segoe UI", Font.PLAIN, 11));
            separatorLabel.setForeground(TEXT_MUTED);
            separatorLabel.setOpaque(true);
            separatorLabel.setBackground(Color.WHITE);
            separatorLabel.setBorder(new EmptyBorder(0, 12, 0, 12));
            
            separatorPanel.add(line, BorderLayout.CENTER);
            separatorPanel.add(separatorLabel, BorderLayout.CENTER);
            
            // Login form
            JPanel loginFormPanel = createEmailPhonePanel();
            
            // Info label
            JLabel infoLabel = new JLabel("<html><center>Orice credențiale funcționează în modul demo</center></html>", JLabel.CENTER);
            infoLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
            infoLabel.setForeground(TEXT_MUTED);
            infoLabel.setBorder(new EmptyBorder(16, 0, 0, 0));
            
            cardContent.add(demoBtn, BorderLayout.NORTH);
            cardContent.add(separatorPanel, BorderLayout.CENTER);
            cardContent.add(loginFormPanel, BorderLayout.CENTER);
            cardContent.add(infoLabel, BorderLayout.SOUTH);
            
            cardPanel.add(cardHeader, BorderLayout.NORTH);
            cardPanel.add(cardContent, BorderLayout.CENTER);
            
            // Center the card in background
            GridBagConstraints gbc = new GridBagConstraints();
            gbc.gridx = 0;
            gbc.gridy = 0;
            gbc.weightx = 1.0;
            gbc.weighty = 1.0;
            gbc.fill = GridBagConstraints.NONE;
            gbc.anchor = GridBagConstraints.CENTER;
            backgroundPanel.add(cardPanel, gbc);
        }
        
        private JPanel createEmailPhonePanel() {
            JPanel panel = new JPanel(new GridBagLayout());
            panel.setOpaque(false);
            panel.setBorder(new EmptyBorder(0, 0, 0, 0));
            GridBagConstraints gbc = new GridBagConstraints();
            gbc.insets = new Insets(4, 0, 4, 0);
            gbc.anchor = GridBagConstraints.WEST;
            gbc.fill = GridBagConstraints.HORIZONTAL;
            gbc.weightx = 1.0;
            
            emailField = new JTextField(25) {
                @Override
                public void paintComponent(Graphics g) {
                    super.paintComponent(g);
                    if (getText().isEmpty() && !hasFocus()) {
                        Graphics2D g2d = (Graphics2D) g.create();
                        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                        g2d.setColor(new Color(TEXT_MUTED.getRed(), TEXT_MUTED.getGreen(), TEXT_MUTED.getBlue(), 150));
                        g2d.setFont(getFont());
                        FontMetrics fm = g2d.getFontMetrics();
                        int x = 15;
                        int y = ((getHeight() - fm.getHeight()) / 2) + fm.getAscent();
                        g2d.drawString("orice@exemplu.ro", x, y);
                        g2d.dispose();
                    }
                }
            };
            emailField.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            emailField.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(210, 220, 230), 1),
                new EmptyBorder(10, 15, 10, 15)
            ));
            emailField.setBackground(Color.WHITE);
            emailField.setForeground(TEXT_PRIMARY);
            emailField.setOpaque(true);
            emailField.setPreferredSize(new Dimension(0, 44));
            
            // Add focus effect
            emailField.addFocusListener(new java.awt.event.FocusAdapter() {
                public void focusGained(java.awt.event.FocusEvent evt) {
                    emailField.setBorder(BorderFactory.createCompoundBorder(
                        BorderFactory.createLineBorder(PRIMARY_COLOR, 2),
                        new EmptyBorder(9, 14, 9, 14)
                    ));
                    emailField.repaint();
                }
                public void focusLost(java.awt.event.FocusEvent evt) {
                    emailField.setBorder(BorderFactory.createCompoundBorder(
                        BorderFactory.createLineBorder(new Color(210, 220, 230), 1),
                        new EmptyBorder(10, 15, 10, 15)
                    ));
                    emailField.repaint();
                }
            });
            
            passwordField = new JPasswordField(25) {
                @Override
                public void paintComponent(Graphics g) {
                    super.paintComponent(g);
                    if (getPassword().length == 0 && !hasFocus()) {
                        Graphics2D g2d = (Graphics2D) g.create();
                        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                        g2d.setColor(new Color(TEXT_MUTED.getRed(), TEXT_MUTED.getGreen(), TEXT_MUTED.getBlue(), 150));
                        g2d.setFont(getFont());
                        FontMetrics fm = g2d.getFontMetrics();
                        int x = 15;
                        int y = ((getHeight() - fm.getHeight()) / 2) + fm.getAscent();
                        g2d.drawString("orice123", x, y);
                        g2d.dispose();
                    }
                }
            };
            passwordField.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            passwordField.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(210, 220, 230), 1),
                new EmptyBorder(10, 15, 10, 15)
            ));
            passwordField.setBackground(Color.WHITE);
            passwordField.setForeground(TEXT_PRIMARY);
            passwordField.setOpaque(true);
            passwordField.setPreferredSize(new Dimension(0, 44));
            
            // Add focus effect
            passwordField.addFocusListener(new java.awt.event.FocusAdapter() {
                public void focusGained(java.awt.event.FocusEvent evt) {
                    passwordField.setBorder(BorderFactory.createCompoundBorder(
                        BorderFactory.createLineBorder(PRIMARY_COLOR, 2),
                        new EmptyBorder(9, 14, 9, 14)
                    ));
                    passwordField.repaint();
                }
                public void focusLost(java.awt.event.FocusEvent evt) {
                    passwordField.setBorder(BorderFactory.createCompoundBorder(
                        BorderFactory.createLineBorder(new Color(210, 220, 230), 1),
                        new EmptyBorder(10, 15, 10, 15)
                    ));
                    passwordField.repaint();
                }
            });
            
            gbc.gridx = 0; gbc.gridy = 0;
            gbc.insets = new Insets(0, 0, 8, 0);
            JLabel emailLabel = createLabel("Email");
            emailLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            panel.add(emailLabel, gbc);
            
            gbc.gridx = 0; gbc.gridy = 1;
            gbc.insets = new Insets(0, 0, 16, 0);
            panel.add(emailField, gbc);
            
            gbc.gridx = 0; gbc.gridy = 2;
            gbc.insets = new Insets(0, 0, 8, 0);
            JLabel passwordLabel = createLabel("Parolă");
            passwordLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            panel.add(passwordLabel, gbc);
            
            gbc.gridx = 0; gbc.gridy = 3;
            gbc.insets = new Insets(0, 0, 16, 0);
            panel.add(passwordField, gbc);
            
            loginBtn = createStyledButton("Conectează-te", true);
            loginBtn.addActionListener(e -> performLogin());
            loginBtn.setPreferredSize(new Dimension(0, 44));
            
            gbc.gridx = 0; gbc.gridy = 4;
            gbc.insets = new Insets(0, 0, 0, 0);
            gbc.anchor = GridBagConstraints.CENTER;
            panel.add(loginBtn, gbc);
            
            return panel;
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

