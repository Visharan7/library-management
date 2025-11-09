# Use Maven with JDK 17 to build the app
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy pom.xml and download dependencies first (to speed up builds)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the project files and build the app
COPY . .
RUN mvn clean package -DskipTests

# Use a smaller JDK image for the final container
FROM eclipse-temurin:17-jdk

# Set the working directory
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
