import org.gradle.api.tasks.testing.logging.TestExceptionFormat
import org.gradle.api.tasks.testing.logging.TestLogEvent

plugins {
    application
    id("checkstyle")
    id("org.springframework.boot") version "3.2.2"
    id("io.spring.dependency-management") version "1.1.3"
    id("com.github.ben-manes.versions") version "0.48.0"
    id("io.freefair.lombok") version "8.6"
}

group = "sockettcp"

version = "1.0-SNAPSHOT"

application { mainClass.set("sockettcp.Application") }

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-devtools")
    implementation("net.datafaker:datafaker:2.0.1")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
    testImplementation("org.hamcrest:hamcrest:2.2")
}

checkstyle {
    toolVersion = "8.41"
}

tasks.test {
    useJUnitPlatform()
    testLogging {
        exceptionFormat = TestExceptionFormat.FULL
        events = mutableSetOf(TestLogEvent.FAILED, TestLogEvent.PASSED, TestLogEvent.SKIPPED)
        showStandardStreams = true
    }
}

tasks.register<Checkstyle>("checkSocketTcp") {
    val exerciseName = project.findProperty("sockettcp")?.toString() ?: ""

    val dirsToCheck =
        file(".").listFiles()?.filter { it.isDirectory }?.map { File(it, exerciseName) }?.filter { it.exists() }
            ?: emptyList()

    source(dirsToCheck)
    include("**/*.java")
    exclude("**/build/**")
    classpath = files()
}
