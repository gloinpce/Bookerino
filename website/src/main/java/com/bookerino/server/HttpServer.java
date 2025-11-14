
package com.bookerino.server;

import com.sun.net.httpserver.*;
import com.bookerino.handlers.*;
import java.io.IOException;
import java.net.InetSocketAddress;

public class HttpServer {
    private final int port;
    private com.sun.net.httpserver.HttpServer server;
    
    public HttpServer(int port) {
        this.port = port;
    }
    
    public void start() throws IOException {
        server = com.sun.net.httpserver.HttpServer.create(new InetSocketAddress("0.0.0.0", port), 0);
        
        // API endpoints
        server.createContext("/api/rooms", new RoomHandler());
        server.createContext("/api/bookings", new BookingHandler());
        server.createContext("/api/reviews", new ReviewHandler());
        server.createContext("/api/analytics", new AnalyticsHandler());
        
        server.setExecutor(null);
        server.start();
    }
}
