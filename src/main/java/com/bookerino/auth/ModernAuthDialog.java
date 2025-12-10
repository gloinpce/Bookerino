package com.bookerino.auth;

import com.bookerino.util.IconLoader;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import org.json.JSONObject;

public class ModernAuthDialog extends JDialog {
    private boolean authenticated = false;
    private boolean isLogin = true;
    private JTextField emailField;
    private JPasswordField passwordField;
    private JPasswordField confirmPasswordField;
    private JTextField nameField;
    private JButton submitBtn;
    private JLabel errorLabel;
    private JLabel successLabel;
    private AnimatedBackgroundPanel backgroundPanel;
    private Timer animationTimer;
    
    // Colors matching globals.css
    private static final Color PRIMARY_COLOR = new Color(0, 136, 255); // hsl(210, 100%, 50%) - #0088ff
    private static final Color PRIMARY_DARK = new Color(51, 153, 255); // hsl(220, 90%, 60%)
    private static final Color TEXT_PRIMARY = new Color(51, 65, 85); // hsl(220, 15%, 20%)
    private static final Color TEXT_SECONDARY = new Color(100, 116, 139); // hsl(220, 15%, 47%)
    private static final Color TEXT_MUTED = new Color(115, 125, 135); // hsl(220, 10%, 45%)
    private static final Color CARD_BG = new Color(255, 255, 255);
    private static final Color CARD_BORDER = new Color(210, 220, 230); // hsl(210, 30%, 90%)
    private static final Color BG_LIGHT = new Color(240, 247, 255); // hsl(210, 40%, 98%)
    private static final Color DESTRUCTIVE = new Color(239, 68, 68); // red-500
    private static final Color SUCCESS = new Color(34, 197, 94); // green-500
    
    public ModernAuthDialog(Frame parent) {
        super(parent, "Bookerino - Autentificare", true);
        setSize(1200, 800);
        setLocationRelativeTo(parent);
        setResizable(false);
        setUndecorated(true);
        IconLoader.setDialogIcon(this);
        initializeUI();
        startAnimations();
    }
    
    private void initializeUI() {
        setLayout(new BorderLayout());
        
        // Animated background panel
        backgroundPanel = new AnimatedBackgroundPanel();
        backgroundPanel.setLayout(new GridBagLayout());
        setContentPane(backgroundPanel);
        
        // Main container with two columns (matching React design)
        JPanel mainContainer = new JPanel(new GridBagLayout());
        mainContainer.setOpaque(false);
        mainContainer.setPreferredSize(new Dimension(1000, 700));
        
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(0, 0, 0, 16);
        
        // Left column - Auth Form Card
        JPanel authCard = createAuthCard();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.weightx = 1.0;
        gbc.fill = GridBagConstraints.BOTH;
        mainContainer.add(authCard, gbc);
        
        // Right column - Info Card
        JPanel infoCard = createInfoCard();
        gbc.gridx = 1;
        gbc.insets = new Insets(0, 0, 0, 0);
        mainContainer.add(infoCard, gbc);
        
        // Center the main container
        GridBagConstraints mainGbc = new GridBagConstraints();
        mainGbc.gridx = 0;
        mainGbc.gridy = 0;
        mainGbc.weightx = 1.0;
        mainGbc.weighty = 1.0;
        mainGbc.fill = GridBagConstraints.NONE;
        mainGbc.anchor = GridBagConstraints.CENTER;
        backgroundPanel.add(mainContainer, mainGbc);
    }
    
    private JPanel createAuthCard() {
        JPanel card = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                // White card with rounded corners
                g2d.setColor(CARD_BG);
                g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 16, 16);
                
                // Shadow
                g2d.setColor(new Color(0, 0, 0, 8));
                g2d.fillRoundRect(2, getHeight() - 2, getWidth() - 4, 2, 16, 16);
                
                g2d.dispose();
            }
        };
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(40, 40, 40, 40));
        card.setOpaque(true);
        card.setBackground(CARD_BG);
        card.setPreferredSize(new Dimension(480, 0));
        
        // Header
        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        header.setBorder(new EmptyBorder(0, 0, 32, 0));
        
        JLabel title = new JLabel(isLogin ? "Autentificare" : "Înregistrare") {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
                
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
        title.setFont(new Font("Segoe UI", Font.BOLD, 28));
        title.setHorizontalAlignment(SwingConstants.CENTER);
        
        JLabel subtitle = new JLabel(isLogin ? "Accesați contul dvs. Bookerino" : "Începeți perioada de probă gratuită de 7 zile");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        subtitle.setForeground(TEXT_MUTED);
        subtitle.setHorizontalAlignment(SwingConstants.CENTER);
        subtitle.setBorder(new EmptyBorder(8, 0, 0, 0));
        
        JPanel titlePanel = new JPanel(new BorderLayout());
        titlePanel.setOpaque(false);
        titlePanel.add(title, BorderLayout.CENTER);
        titlePanel.add(subtitle, BorderLayout.SOUTH);
        
        header.add(titlePanel, BorderLayout.CENTER);
        
        // Content
        JPanel content = createAuthForm();
        
        card.add(header, BorderLayout.NORTH);
        card.add(content, BorderLayout.CENTER);
        
        return card;
    }
    
    private JPanel createAuthForm() {
        JPanel form = new JPanel(new GridBagLayout());
        form.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 0, 8, 0);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        gbc.anchor = GridBagConstraints.WEST;
        
        // Error/Success messages
        errorLabel = new JLabel("") {
            @Override
            protected void paintComponent(Graphics g) {
                if (!getText().isEmpty()) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    g2d.setColor(new Color(DESTRUCTIVE.getRed(), DESTRUCTIVE.getGreen(), DESTRUCTIVE.getBlue(), 25));
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                    g2d.setColor(DESTRUCTIVE);
                    g2d.setFont(getFont());
                    FontMetrics fm = g2d.getFontMetrics();
                    int y = ((getHeight() - fm.getHeight()) / 2) + fm.getAscent();
                    g2d.drawString(getText(), 12, y);
                    g2d.dispose();
                }
            }
        };
        errorLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        errorLabel.setForeground(DESTRUCTIVE);
        errorLabel.setPreferredSize(new Dimension(0, 0));
        errorLabel.setBorder(new EmptyBorder(12, 12, 12, 12));
        errorLabel.setOpaque(false);
        
        successLabel = new JLabel("") {
            @Override
            protected void paintComponent(Graphics g) {
                if (!getText().isEmpty()) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    g2d.setColor(new Color(SUCCESS.getRed(), SUCCESS.getGreen(), SUCCESS.getBlue(), 25));
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                    g2d.setColor(SUCCESS);
                    g2d.setFont(getFont());
                    FontMetrics fm = g2d.getFontMetrics();
                    int y = ((getHeight() - fm.getHeight()) / 2) + fm.getAscent();
                    g2d.drawString(getText(), 12, y);
                    g2d.dispose();
                }
            }
        };
        successLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        successLabel.setForeground(SUCCESS);
        successLabel.setPreferredSize(new Dimension(0, 0));
        successLabel.setBorder(new EmptyBorder(12, 12, 12, 12));
        successLabel.setOpaque(false);
        
        gbc.gridx = 0; gbc.gridy = 0;
        gbc.insets = new Insets(0, 0, 16, 0);
        form.add(errorLabel, gbc);
        
        gbc.gridy = 1;
        form.add(successLabel, gbc);
        
        // Name field (only for signup)
        if (!isLogin) {
            JLabel nameLabel = createFormLabel("Nume complet");
            gbc.gridy = 2;
            gbc.insets = new Insets(0, 0, 8, 0);
            form.add(nameLabel, gbc);
            
            nameField = createStyledTextField();
            gbc.gridy = 3;
            gbc.insets = new Insets(0, 0, 16, 0);
            form.add(nameField, gbc);
        }
        
        // Email field
        JLabel emailLabel = createFormLabel("Adresă de email");
        gbc.gridy = isLogin ? 2 : 4;
        gbc.insets = new Insets(0, 0, 8, 0);
        form.add(emailLabel, gbc);
        
        emailField = createStyledTextField();
        gbc.gridy = isLogin ? 3 : 5;
        gbc.insets = new Insets(0, 0, 16, 0);
        form.add(emailField, gbc);
        
        // Password field
        JLabel passwordLabel = createFormLabel("Parolă");
        gbc.gridy = isLogin ? 4 : 6;
        gbc.insets = new Insets(0, 0, 8, 0);
        form.add(passwordLabel, gbc);
        
        passwordField = createStyledPasswordField();
        gbc.gridy = isLogin ? 5 : 7;
        gbc.insets = new Insets(0, 0, 16, 0);
        form.add(passwordField, gbc);
        
        // Confirm password (only for signup)
        if (!isLogin) {
            JLabel confirmLabel = createFormLabel("Confirmare parolă");
            gbc.gridy = 8;
            gbc.insets = new Insets(0, 0, 8, 0);
            form.add(confirmLabel, gbc);
            
            confirmPasswordField = createStyledPasswordField();
            gbc.gridy = 9;
            gbc.insets = new Insets(0, 0, 16, 0);
            form.add(confirmPasswordField, gbc);
        }
        
        // Remember me / Forgot password (only for login)
        if (isLogin) {
            JPanel rememberPanel = new JPanel(new BorderLayout());
            rememberPanel.setOpaque(false);
            
            JCheckBox rememberCheck = new JCheckBox("Ține-mă minte");
            rememberCheck.setFont(new Font("Segoe UI", Font.PLAIN, 13));
            rememberCheck.setForeground(TEXT_SECONDARY);
            rememberCheck.setOpaque(false);
            
            JLabel forgotLabel = new JLabel("<html><a href='#'>Ați uitat parola?</a></html>");
            forgotLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
            forgotLabel.setForeground(PRIMARY_COLOR);
            forgotLabel.setCursor(new Cursor(Cursor.HAND_CURSOR));
            
            rememberPanel.add(rememberCheck, BorderLayout.WEST);
            rememberPanel.add(forgotLabel, BorderLayout.EAST);
            
            gbc.gridy = 6;
            gbc.insets = new Insets(0, 0, 24, 0);
            form.add(rememberPanel, gbc);
        }
        
        // Submit button
        submitBtn = createPrimaryButton(isLogin ? "Autentificare" : "Începeți perioada de probă");
        submitBtn.addActionListener(e -> performAuth());
        gbc.gridy = isLogin ? 7 : 10;
        gbc.insets = new Insets(0, 0, 16, 0);
        form.add(submitBtn, gbc);
        
        // Toggle login/signup
        JPanel togglePanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        togglePanel.setOpaque(false);
        
        JLabel toggleLabel = new JLabel(isLogin ? "Nu aveți un cont? " : "Aveți deja un cont? ");
        toggleLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        toggleLabel.setForeground(TEXT_SECONDARY);
        
        JLabel toggleLink = new JLabel(isLogin ? "Înregistrați-vă aici" : "Autentificați-vă aici");
        toggleLink.setFont(new Font("Segoe UI", Font.BOLD, 13));
        toggleLink.setForeground(PRIMARY_COLOR);
        toggleLink.setCursor(new Cursor(Cursor.HAND_CURSOR));
        toggleLink.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                toggleAuthMode();
            }
        });
        
        togglePanel.add(toggleLabel);
        togglePanel.add(toggleLink);
        
        gbc.gridy = isLogin ? 8 : 11;
        gbc.insets = new Insets(0, 0, 0, 0);
        form.add(togglePanel, gbc);
        
        return form;
    }
    
    private JPanel createInfoCard() {
        JPanel card = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                // Light blue background with rounded corners
                GradientPaint gradient = new GradientPaint(
                    0, 0, new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 13),
                    getWidth(), getHeight(), new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 8)
                );
                g2d.setPaint(gradient);
                g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 16, 16);
                
                // Border
                g2d.setColor(new Color(PRIMARY_COLOR.getRed(), PRIMARY_COLOR.getGreen(), PRIMARY_COLOR.getBlue(), 51));
                g2d.setStroke(new BasicStroke(1));
                g2d.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 16, 16);
                
                g2d.dispose();
            }
        };
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(40, 40, 40, 40));
        card.setOpaque(false);
        card.setPreferredSize(new Dimension(480, 0));
        
        JLabel title = new JLabel(isLogin ? "Conectați-vă la aplicație" : "De ce să vă înregistrați?");
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));
        title.setForeground(TEXT_PRIMARY);
        title.setBorder(new EmptyBorder(0, 0, 24, 0));
        
        JPanel featuresPanel = new JPanel(new GridBagLayout());
        featuresPanel.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(8, 0, 8, 0);
        
        String[] features = isLogin ? new String[]{
            "Panoul de control al afacerii",
            "Rapoarte și analize în timp real",
            "Gestionare rezervări și camere",
            "Integrare Google Ads",
            "Management recenzii clienți",
            "Gestionarea abonamentului"
        } : new String[]{
            "Perioadă de probă gratuită de 7 zile",
            "Acces la toate funcționalitățile",
            "Fără obligații de plată în perioada de probă",
            "Suport dedicat pentru noii clienți",
            "Integrări complete: Google Ads & Stripe",
            "Management profesional pentru HoReCa"
        };
        
        for (int i = 0; i < features.length; i++) {
            JPanel featureItem = new JPanel(new BorderLayout());
            featureItem.setOpaque(false);
            
            JLabel checkIcon = new JLabel("✓") {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    g2d.setColor(PRIMARY_COLOR);
                    g2d.setFont(new Font("Segoe UI", Font.BOLD, 18));
                    FontMetrics fm = g2d.getFontMetrics();
                    int y = ((getHeight() - fm.getHeight()) / 2) + fm.getAscent();
                    g2d.drawString("✓", 0, y);
                    g2d.dispose();
                }
            };
            checkIcon.setPreferredSize(new Dimension(24, 24));
            checkIcon.setFont(new Font("Segoe UI", Font.BOLD, 18));
            checkIcon.setForeground(PRIMARY_COLOR);
            
            JLabel featureText = new JLabel(features[i]);
            featureText.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            featureText.setForeground(TEXT_PRIMARY);
            
            featureItem.add(checkIcon, BorderLayout.WEST);
            featureItem.add(featureText, BorderLayout.CENTER);
            featureItem.setBorder(new EmptyBorder(0, 0, 0, 16));
            
            gbc.gridx = 0;
            gbc.gridy = i;
            featuresPanel.add(featureItem, gbc);
        }
        
        card.add(title, BorderLayout.NORTH);
        card.add(featuresPanel, BorderLayout.CENTER);
        
        return card;
    }
    
    private JLabel createFormLabel(String text) {
        JLabel label = new JLabel(text);
        label.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        label.setForeground(TEXT_PRIMARY);
        return label;
    }
    
    private JTextField createStyledTextField() {
        JTextField field = new JTextField() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                if (getText().isEmpty() && !hasFocus()) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    g2d.setColor(new Color(TEXT_MUTED.getRed(), TEXT_MUTED.getGreen(), TEXT_MUTED.getBlue(), 150));
                    g2d.setFont(getFont());
                    FontMetrics fm = g2d.getFontMetrics();
                    int y = ((getHeight() - fm.getHeight()) / 2) + fm.getAscent();
                    g2d.drawString("exemplu@email.com", 12, y);
                    g2d.dispose();
                }
            }
        };
        field.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        field.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(CARD_BORDER, 1),
            new EmptyBorder(12, 12, 12, 12)
        ));
        field.setBackground(Color.WHITE);
        field.setForeground(TEXT_PRIMARY);
        field.setOpaque(true);
        field.setPreferredSize(new Dimension(0, 44));
        
        field.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusGained(java.awt.event.FocusEvent evt) {
                field.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(PRIMARY_COLOR, 2),
                    new EmptyBorder(11, 11, 11, 11)
                ));
                field.repaint();
            }
            public void focusLost(java.awt.event.FocusEvent evt) {
                field.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(CARD_BORDER, 1),
                    new EmptyBorder(12, 12, 12, 12)
                ));
                field.repaint();
            }
        });
        
        return field;
    }
    
    private JPasswordField createStyledPasswordField() {
        JPasswordField field = new JPasswordField() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                if (getPassword().length == 0 && !hasFocus()) {
                    Graphics2D g2d = (Graphics2D) g.create();
                    g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                    g2d.setColor(new Color(TEXT_MUTED.getRed(), TEXT_MUTED.getGreen(), TEXT_MUTED.getBlue(), 150));
                    g2d.setFont(getFont());
                    FontMetrics fm = g2d.getFontMetrics();
                    int y = ((getHeight() - fm.getHeight()) / 2) + fm.getAscent();
                    g2d.drawString("••••••••", 12, y);
                    g2d.dispose();
                }
            }
        };
        field.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        field.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(CARD_BORDER, 1),
            new EmptyBorder(12, 12, 12, 12)
        ));
        field.setBackground(Color.WHITE);
        field.setForeground(TEXT_PRIMARY);
        field.setOpaque(true);
        field.setPreferredSize(new Dimension(0, 44));
        
        field.addFocusListener(new java.awt.event.FocusAdapter() {
            public void focusGained(java.awt.event.FocusEvent evt) {
                field.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(PRIMARY_COLOR, 2),
                    new EmptyBorder(11, 11, 11, 11)
                ));
                field.repaint();
            }
            public void focusLost(java.awt.event.FocusEvent evt) {
                field.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(CARD_BORDER, 1),
                    new EmptyBorder(12, 12, 12, 12)
                ));
                field.repaint();
            }
        });
        
        return field;
    }
    
    private JButton createPrimaryButton(String text) {
        JButton button = new JButton(text) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g.create();
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                
                if (getModel().isEnabled()) {
                    GradientPaint gradient = new GradientPaint(
                        0, 0, PRIMARY_COLOR,
                        0, getHeight(), PRIMARY_DARK
                    );
                    g2d.setPaint(gradient);
                } else {
                    g2d.setColor(new Color(200, 200, 200));
                }
                g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                
                if (getModel().isPressed()) {
                    g2d.setColor(new Color(0, 0, 0, 20));
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                } else if (getModel().isRollover()) {
                    g2d.setColor(new Color(255, 255, 255, 20));
                    g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                }
                
                g2d.dispose();
                super.paintComponent(g);
            }
        };
        button.setFont(new Font("Segoe UI", Font.BOLD, 14));
        button.setForeground(Color.WHITE);
        button.setBorder(new EmptyBorder(12, 24, 12, 24));
        button.setContentAreaFilled(false);
        button.setOpaque(false);
        button.setFocusPainted(false);
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));
        button.setPreferredSize(new Dimension(0, 44));
        
        return button;
    }
    
    private void toggleAuthMode() {
        isLogin = !isLogin;
        removeAll();
        initializeUI();
        revalidate();
        repaint();
    }
    
    private void performAuth() {
        clearMessages();
        
        String email = emailField.getText().trim();
        String password = new String(passwordField.getPassword());
        
        if (email.isEmpty() || password.isEmpty()) {
            showError("Vă rugăm completați toate câmpurile.");
            return;
        }
        
        if (!isLogin) {
            String name = nameField != null ? nameField.getText().trim() : "";
            String confirmPassword = confirmPasswordField != null ? new String(confirmPasswordField.getPassword()) : "";
            
            if (name.isEmpty()) {
                showError("Vă rugăm introduceți numele complet.");
                return;
            }
            
            if (!password.equals(confirmPassword)) {
                showError("Parolele nu se potrivesc.");
                return;
            }
        }
        
        // Developer account
        final String DEV_EMAIL = "admin@bookerino.ro";
        final String DEV_PASSWORD = "Bookerino2025!";
        
        if (email.equals(DEV_EMAIL) && password.equals(DEV_PASSWORD)) {
            AuthManager.currentToken = "dev-token-bookerino-2025";
            AuthManager.currentUser = "Developer Bookerino";
            authenticated = true;
            dispose();
            return;
        }
        
        // Try API authentication
        submitBtn.setEnabled(false);
        submitBtn.setText("Se procesează...");
        
        SwingUtilities.invokeLater(() -> {
            try {
                JSONObject requestBody = new JSONObject();
                requestBody.put("email", email);
                requestBody.put("password", hashPassword(password));
                
                String endpoint = isLogin ? "/login" : "/register";
                String response = sendPostRequest("http://localhost:5000/api/auth" + endpoint, requestBody.toString());
                
                if (response != null && response.contains("token")) {
                    JSONObject jsonResponse = new JSONObject(response);
                    AuthManager.currentToken = jsonResponse.getString("token");
                    AuthManager.currentUser = jsonResponse.optString("user", email);
                    authenticated = true;
                    dispose();
                } else {
                    showError(isLogin ? "Autentificare eșuată. Verificați email-ul și parola." : "Înregistrare eșuată. Verificați datele introduse.");
                }
            } catch (Exception e) {
                showError("Eroare la conectarea la server. Verificați conexiunea la internet.");
            } finally {
                submitBtn.setEnabled(true);
                submitBtn.setText(isLogin ? "Autentificare" : "Începeți perioada de probă");
            }
        });
    }
    
    private void showError(String message) {
        errorLabel.setText(message);
        errorLabel.setPreferredSize(new Dimension(0, 40));
        successLabel.setText("");
        successLabel.setPreferredSize(new Dimension(0, 0));
        revalidate();
        repaint();
    }
    
    private void clearMessages() {
        errorLabel.setText("");
        errorLabel.setPreferredSize(new Dimension(0, 0));
        successLabel.setText("");
        successLabel.setPreferredSize(new Dimension(0, 0));
        revalidate();
        repaint();
    }
    
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            return password;
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
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(5000);
        
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
    
    // Animated background with floating orbs (matching AnimatedBackground.tsx)
    private class AnimatedBackgroundPanel extends JPanel {
        private List<Orb> orbs = new ArrayList<>();
        private Random random = new Random();
        private boolean orbsInitialized = false;
        
        public AnimatedBackgroundPanel() {
            // Orbs will be initialized when component is first painted (when dimensions are available)
        }
        
        private void initializeOrbs() {
            if (orbsInitialized) return;
            
            // Use default dimensions if component size is not yet available
            int width = getWidth();
            int height = getHeight();
            
            // If dimensions are not available yet, use defaults
            if (width <= 0) width = 1200;
            if (height <= 0) height = 800;
            
            // Ensure positive values for nextInt
            width = Math.max(width, 1);
            height = Math.max(height, 1);
            
            // Create animated orbs
            for (int i = 0; i < 6; i++) {
                orbs.add(new Orb(
                    random.nextInt(width),
                    random.nextInt(height),
                    random.nextInt(200) + 150,
                    random.nextFloat() * 0.02f + 0.01f,
                    random.nextFloat() * 0.02f + 0.01f
                ));
            }
            orbsInitialized = true;
        }
        
        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2d = (Graphics2D) g.create();
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            
            // Initialize orbs on first paint (when dimensions are available)
            if (!orbsInitialized) {
                initializeOrbs();
            }
            
            // Base gradient background (matching bg-gradient-subtle)
            GradientPaint baseGradient = new GradientPaint(
                0, 0, BG_LIGHT,
                getWidth(), getHeight(), new Color(255, 255, 255)
            );
            g2d.setPaint(baseGradient);
            g2d.fillRect(0, 0, getWidth(), getHeight());
            
            // Animated orbs with blur effect simulation
            for (Orb orb : orbs) {
                // Multiple layers for blur effect
                for (int i = 0; i < 3; i++) {
                    float alpha = 0.3f / (i + 1);
                    int size = orb.size + (i * 20);
                    Color orbColor = new Color(
                        PRIMARY_COLOR.getRed(),
                        PRIMARY_COLOR.getGreen(),
                        PRIMARY_COLOR.getBlue(),
                        (int)(alpha * 255)
                    );
                    g2d.setColor(orbColor);
                    g2d.fillOval(
                        (int)(orb.x - size / 2),
                        (int)(orb.y - size / 2),
                        size, size
                    );
                }
            }
            
            g2d.dispose();
        }
        
        public void animate() {
            for (Orb orb : orbs) {
                orb.x += orb.vx;
                orb.y += orb.vy;
                
                if (orb.x < -orb.size || orb.x > getWidth() + orb.size) orb.vx *= -1;
                if (orb.y < -orb.size || orb.y > getHeight() + orb.size) orb.vy *= -1;
            }
            repaint();
        }
        
        private class Orb {
            float x, y;
            int size;
            float vx, vy;
            
            Orb(float x, float y, int size, float vx, float vy) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.vx = vx;
                this.vy = vy;
            }
        }
    }
    
    private void startAnimations() {
        animationTimer = new Timer(16, e -> {
            if (backgroundPanel != null) {
                backgroundPanel.animate();
            }
        });
        animationTimer.start();
    }
    
    @Override
    public void dispose() {
        if (animationTimer != null) {
            animationTimer.stop();
        }
        super.dispose();
    }
    
    public boolean isAuthenticated() {
        return authenticated;
    }
}
