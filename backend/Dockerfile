# -------- Стадия 1: компиляция (всегда на архитектуре билдера) ----------
FROM --platform=$BUILDPLATFORM eclipse-temurin:21-jdk AS build
WORKDIR /workspace/app

ENV GRADLE_OPTS="-Dorg.gradle.jvmargs=-Xmx1g"
# Кэшируем Gradle-артефакты между слоями
RUN --mount=type=cache,target=/root/.gradle \
    --mount=type=cache,target=/home/gradle/.gradle true

# Сначала только wrapper и build-скрипты – для лучшего кеша
COPY gradle/ gradle
COPY gradlew settings.gradle build.gradle gradle.properties ./

# Give execution permission to gradlew
RUN chmod +x ./gradlew

RUN ./gradlew --no-daemon dependencies

# Теперь исходники и финальная сборка
COPY src/ src
RUN ./gradlew --no-daemon build -x test

# -------- Стадия 2: минимальный рантайм (на каждую $TARGETPLATFORM) -----
FROM --platform=$TARGETPLATFORM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /workspace/app/build/libs/*-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]