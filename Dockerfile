# Use Maven with JDK 17 to build the app
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# IMPORTANT: Use Railway's PORT
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=$PORT"]
