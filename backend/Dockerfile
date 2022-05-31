FROM adoptopenjdk/openjdk11:alpine-jre
WORKDIR /app
RUN mkdir -p images
COPY target/backend-0.0.1-SNAPSHOT.jar backend.jar
ENTRYPOINT ["java","-jar","/app/backend.jar"]
