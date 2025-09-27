# Build stage
FROM gradle:8.10-jdk17-alpine AS builder

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the application
RUN ./gradlew bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built jar from builder
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]