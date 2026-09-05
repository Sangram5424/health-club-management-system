/*
 * File Path: health-club-api/src/main/java/com/healthclub/api/config/OpenApiConfig.java
 * Description: OpenAPI Swagger UI Configuration bean with Bearer Authentication Security Scheme.
 */
package com.healthclub.api.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Health Club Management System REST API",
        version = "1.0.0",
        description = "Interactive OpenAPI Swagger UI documentation for HCMS Spring Boot Backend REST APIs."
    ),
    security = @SecurityRequirement(name = "Bearer Authentication")
)
@SecurityScheme(
    name = "Bearer Authentication",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "Enter JWT Bearer Token obtained from POST /api/auth/login"
)
public class OpenApiConfig {
}
