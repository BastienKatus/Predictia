# Étape 1: Construire commonLib
FROM maven:3.8.4-openjdk-17 as commonlib-builder
WORKDIR /commonlib
# Assurez-vous que le chemin d'accès à commonLib est correct par rapport au contexte de construction Docker
COPY ../commonLib/pom.xml ./pom.xml
RUN mvn dependency:go-offline
COPY ../commonLib/src ./src
RUN mvn install -DskipTests

# Étape 2: Utilisez l'image Maven officielle avec JDK 17 pour créer un build de l'application soccerManager
FROM maven:3.8.4-openjdk-17 as app-builder
WORKDIR /app
# Copiez le fichier pom.xml de soccerManager et téléchargez les dépendances pour la mise en cache
COPY ./pom.xml ./pom.xml
RUN mvn dependency:go-offline
# Copiez le code source de soccerManager
COPY ./src ./src
# Assurez-vous que Maven peut accéder au dépôt local où commonLib a été installé
COPY --from=commonlib-builder /root/.m2 /root/.m2
# Construisez l'application soccerManager
RUN mvn package -DskipTests

# Étape 3: Utilisez l'image OpenJDK 17 pour exécuter l'application à partir du build
FROM openjdk:17
WORKDIR /app
# Copiez le fichier jar construit dans l'étape de construction de soccerManager
COPY --from=app-builder /app/target/*.jar app.jar
# Exécutez l'application soccerManager
ENTRYPOINT ["java", "-jar", "app.jar"]
