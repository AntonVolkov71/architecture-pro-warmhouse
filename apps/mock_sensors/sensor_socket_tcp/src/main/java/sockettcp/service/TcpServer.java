package sockettcp.service;

import jakarta.annotation.PostConstruct;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class TcpServer {
    private final String topicTelemetry = "TELEMETRY";
    private final int timeoutMessage = 2000;
    private final ExecutorService clientPool = Executors.newFixedThreadPool(10);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${tcp.port}")
    private int port;

    @PostConstruct
    public void startServer() {

        Thread serverThread = new Thread(() -> {
            try (ServerSocket serverSocket = new ServerSocket(port)) {
                System.out.println("TCP server started on port " + port);

                while (true) {
                    Socket clientSocket = serverSocket.accept();
                    System.out.println("Connected client: " + clientSocket.getInetAddress());

                    clientPool.submit(() -> handleClient(clientSocket));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        serverThread.setDaemon(true);
        serverThread.start();
    }

    private void handleClient(Socket clientSocket) {
        System.out.println("handleClient");
        try (clientSocket; PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {
            while (!clientSocket.isClosed()) {
                Thread.sleep(timeoutMessage);
                String message = buildTelemetryData();
                out.println(message);
                System.out.println("send message " + message);

                if (out.checkError()) {
                    System.out.println("Error by send message, client should disconnected");
                    break;
                }
            }
        } catch (IOException | InterruptedException e) {
            System.out.println("Client disconnected: " + e.getMessage());
        } finally {
            try {
                clientSocket.close();
            } catch (IOException ignored) {
            }
        }
    }

    private String buildTelemetryData() throws IOException {
        Random random = new Random();

        Map<String, Object> map = new HashMap<>();
        map.put("query", topicTelemetry);
        map.put("air_temperature", random.nextInt(100));
        map.put("humidity", random.nextInt(100));
        map.put("status_connection", true);

        return objectMapper.writeValueAsString(map);
    }
}
