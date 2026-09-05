/*
 * File Path: health-club-api/src/main/java/com/healthclub/api/config/SecurityConfig.java
 * Description: Security configuration specifying CORS policy, JWT filter chain, and request authorization rules.
 */
package com.healthclub.api.config;

import com.healthclub.api.security.JwtAuthenticationFilter;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 1. Public Authentication, Signup & Documentation Endpoints
                .requestMatchers("/api/auth/**", "/h2-console/**", "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                
                // 2. Public Read-Only catalog & Signup Endpoints (Plans, Trainers, Member & Trainer Signup)
                .requestMatchers(HttpMethod.GET, "/api/plans/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/trainers/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/members").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/trainers").permitAll()
                
                // 3. Admin-Only Executive Endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/payments/admin").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/plans/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/plans/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/plans/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/trainers/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/trainers/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/members/**").hasRole("ADMIN")
                
                // 4. Trainer & Admin Operations (Workout / Diet routines & Trainer Request acceptance)
                .requestMatchers(HttpMethod.PUT, "/api/members/*/workout-plan").hasAnyRole("ADMIN", "TRAINER")
                .requestMatchers(HttpMethod.PUT, "/api/members/*/diet-plan").hasAnyRole("ADMIN", "TRAINER")
                .requestMatchers(HttpMethod.PUT, "/api/trainer-requests/*/status").hasAnyRole("ADMIN", "TRAINER")
                
                // 5. Member & Secured Operations (Razorpay Payment Checkout & Trainer Requests)
                .requestMatchers("/api/payments/**").hasAnyRole("ADMIN", "MEMBER")
                .requestMatchers("/api/trainer-requests/**").hasAnyRole("ADMIN", "MEMBER", "TRAINER")
                .requestMatchers("/api/members/**").hasAnyRole("ADMIN", "MEMBER", "TRAINER")
                
                .anyRequest().authenticated()
            )
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    } 

    @Bean
    AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "http://127.0.0.1:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
