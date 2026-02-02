# build stage: build the fat jar with Maven + JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# copy only pom to cache dependencies
COPY pom.xml .

# download dependencies (offline) - speeds build on incremental changes
RUN mvn -B dependency:go-offline

# copy source and build (skip tests for faster builds)
COPY . .
RUN mvn -B clean package -DskipTests

# runtime stage: small JRE image
FROM eclipse-temurin:17-jdk

WORKDIR /app

# copy the built jar from build stage; use exact artifact name if known
# if your artifact name is librarymanagement-0.0.1-SNAPSHOT.jar, change accordingly
COPY --from=build /app/target/*.jar app.jar

# optional: create a non-root user (uncomment to enable)
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser

EXPOSE 8080

# optional simple healthcheck (adjust path if different)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# allow overriding java options via env var
ENV JAVA_OPTS=""

# Use exec form, forward signals, and allow overriding PORT using env in host (Railway supplies $PORT)
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar --server.port=${PORT:-8080}"]
