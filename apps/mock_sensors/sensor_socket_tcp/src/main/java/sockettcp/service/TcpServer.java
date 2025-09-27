package sockettcp.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class TcpServer {
    private final String alarmMessage = "ALARM" + '\n';
//    private final int port = 11000;
    private final int timeoutMessage = 2000;
    private final ExecutorService clientPool = Executors.newFixedThreadPool(10);
    @Value("${server.port}")
    private int port;

    @PostConstruct
    public void startServer() {
        System.out.println("startServer");

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
                out.println(alarmMessage);
                System.out.println("send message " + alarmMessage);

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
}
