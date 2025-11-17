package com.bookerino.util;

import javax.swing.*;
import java.awt.Image;
import java.io.File;
import java.net.URL;
import java.net.URLDecoder;

public class IconLoader {
    private static final String LOGO_FILENAME = "logo bokkerino_1759435973381.png";
    private static ImageIcon cachedIcon = null;
    
    /**
     * Loads the application icon from various possible locations
     * @return ImageIcon if found, null otherwise
     */
    public static ImageIcon loadApplicationIcon() {
        // Return cached icon if already loaded
        if (cachedIcon != null) {
            return cachedIcon;
        }
        
        try {
            // Try 1: Load from resources (embedded in JAR) - this is the most reliable
            URL iconUrl = IconLoader.class.getResource("/" + LOGO_FILENAME);
            if (iconUrl != null) {
                cachedIcon = new ImageIcon(iconUrl);
                System.out.println("Icon loaded from JAR resources: " + iconUrl);
                return cachedIcon;
            }
            
            // Try 2: Load from attached_assets folder relative to JAR
            try {
                String jarPath = IconLoader.class.getProtectionDomain().getCodeSource().getLocation().getPath();
                File jarFile = new File(URLDecoder.decode(jarPath, "UTF-8"));
                File iconFile = new File(jarFile.getParentFile().getParentFile(), 
                    "attached_assets" + File.separator + LOGO_FILENAME);
                if (iconFile.exists()) {
                    cachedIcon = new ImageIcon(iconFile.toURI().toURL());
                    System.out.println("Icon loaded from: " + iconFile.getAbsolutePath());
                    return cachedIcon;
                }
            } catch (Exception e) {
                System.err.println("Error loading icon from JAR parent: " + e.getMessage());
            }
            
            // Try 3: Load from attached_assets folder in current directory
            File iconFile = new File("attached_assets" + File.separator + LOGO_FILENAME);
            if (iconFile.exists()) {
                cachedIcon = new ImageIcon(iconFile.toURI().toURL());
                System.out.println("Icon loaded from: " + iconFile.getAbsolutePath());
                return cachedIcon;
            }
            
            // Try 4: Load from attached_assets folder using forward slash (works on Windows too)
            iconFile = new File("attached_assets/logo bokkerino_1759435973381.png");
            if (iconFile.exists()) {
                cachedIcon = new ImageIcon(iconFile.toURI().toURL());
                System.out.println("Icon loaded from: " + iconFile.getAbsolutePath());
                return cachedIcon;
            }
            
            // Try 5: Try absolute path (for development)
            String[] possiblePaths = {
                "E:/Bookerino/Bookerino/attached_assets/logo bokkerino_1759435973381.png",
                System.getProperty("user.dir") + File.separator + "attached_assets" + File.separator + LOGO_FILENAME
            };
            
            for (String path : possiblePaths) {
                iconFile = new File(path);
                if (iconFile.exists()) {
                    cachedIcon = new ImageIcon(iconFile.toURI().toURL());
                    System.out.println("Icon loaded from: " + iconFile.getAbsolutePath());
                    return cachedIcon;
                }
            }
            
        } catch (Exception e) {
            System.err.println("Error loading icon: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.err.println("WARNING: Could not load application icon from any location");
        return null;
    }
    
    /**
     * Loads the application icon and sets it as the frame icon
     * Also sets Windows-specific properties for better taskbar support
     * @param frame The JFrame to set the icon for
     */
    public static void setFrameIcon(JFrame frame) {
        ImageIcon icon = loadApplicationIcon();
        if (icon != null && icon.getImage() != null) {
            Image image = icon.getImage();
            frame.setIconImage(image);
            
            // For Windows: Set the app user model ID for better taskbar integration
            try {
                System.setProperty("com.apple.mrj.application.apple.menu.about.name", "Bookerino");
                // Windows-specific: Set taskbar icon
                if (System.getProperty("os.name").toLowerCase().contains("windows")) {
                    // The icon is already set via setIconImage, which works for Windows taskbar
                }
            } catch (Exception e) {
                // Ignore if properties can't be set
            }
            
            System.out.println("Icon set successfully for JFrame");
        } else {
            System.err.println("Warning: Could not load application icon for JFrame");
        }
    }
    
    /**
     * Loads the application icon and sets it as the dialog icon
     * @param dialog The JDialog to set the icon for
     */
    public static void setDialogIcon(JDialog dialog) {
        ImageIcon icon = loadApplicationIcon();
        if (icon != null && icon.getImage() != null) {
            dialog.setIconImage(icon.getImage());
            System.out.println("Icon set successfully for JDialog");
        } else {
            System.err.println("Warning: Could not load dialog icon");
        }
    }
    
    /**
     * Loads the logo image scaled to the specified size
     * @param width Desired width
     * @param height Desired height
     * @return Scaled ImageIcon, or null if not found
     */
    public static ImageIcon loadLogo(int width, int height) {
        ImageIcon icon = loadApplicationIcon();
        if (icon != null && icon.getImage() != null) {
            Image scaledImage = icon.getImage().getScaledInstance(width, height, Image.SCALE_SMOOTH);
            return new ImageIcon(scaledImage);
        }
        return null;
    }
}
