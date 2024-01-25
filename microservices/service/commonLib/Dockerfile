# Étape 1: Utilisez l'image Maven officielle avec JDK 17 pour créer un build de l'application
FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
# Copiez le fichier pom.xml et téléchargez les dépendances pour la mise en cache
COPY pom.xml .
RUN mvn dependency:go-offline
# Copiez le code source de votre application
COPY src src
# Construisez l'application
RUN mvn package -DskipTests

# Étape 2: Utilisez l'image OpenJDK 17 pour exécuter l'application à partir du build
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copiez le fichier jar construit dans l'étape de construction
COPY --from=builder /app/target/*.jar app.jar
# Exécutez l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
