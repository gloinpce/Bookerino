package com.bookerino.auth;

import java.awt.Component;
import java.awt.Frame;
import java.awt.Window;
import javax.swing.SwingUtilities;

public class AuthManager {
    private static final String AUTH_SERVER_URL = "http://localhost:5000/api/auth"; // Default, can be configured
    static String currentToken = null;
    static String currentUser = null;
    
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
        ModernAuthDialog dialog = new ModernAuthDialog(frame);
        dialog.setVisible(true);
        return dialog.isAuthenticated();
    }
}

