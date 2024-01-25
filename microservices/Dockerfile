# Définir un argument pour le nom du microservice
ARG MS_NAME

# Étape 1: Utiliser l'image Maven officielle avec JDK 17 pour créer un build de l'application
FROM maven:3.8.4-openjdk-17 as app-builder
ARG MS_NAME
WORKDIR /app

COPY ./commonLib_docker/0.0.1-SNAPSHOT/commonLib-0.0.1-SNAPSHOT.jar /root/.m2/repository/com/predictia/commonLib/0.0.1-SNAPSHOT/commonLib-0.0.1-SNAPSHOT.jar
COPY ./service/${MS_NAME}/pom.xml ./pom.xml
RUN mvn dependency:go-offline
COPY ./service/${MS_NAME}/src ./src
RUN mvn package -DskipTests

# Étape 2: Utiliser l'image OpenJDK 17 pour exécuter l'application à partir du build
FROM openjdk:17
WORKDIR /app

# Copier le script d'attente dans l'image
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
# Copier le jar de l'application
COPY --from=app-builder /app/target/*.jar app.jar
# Utiliser wait-for-it.sh pour attendre que PostgreSQL soit prêt avant de démarrer l'application
ENTRYPOINT ["./wait-for-it.sh", "postgres:5432", "--", "java", "-jar", "app.jar"]
#COPY --from=app-builder /app/target/*.jar app.jar
#ENTRYPOINT ["java", "-jar", "app.jar"]
