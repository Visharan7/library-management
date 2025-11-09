# Use a lightweight Java image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy the JAR file built by Maven
COPY target/librarymanagement-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 (Spring Boot default)
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
