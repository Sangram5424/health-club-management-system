/*
 * File Path: health-club-api/src/main/java/com/healthclub/api/security/JwtAuthenticationFilter.java
 * Security Flow: Login creates JWT -> requests send Bearer token -> filter validates token -> role rules allow access.
 * Description: Spring Security Filter validating JWT tokens on incoming HTTP requests.
 */
package com.healthclub.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final ClubUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, ClubUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        String uri = request.getRequestURI();
        String method = request.getMethod();

        if (header == null || !header.startsWith("Bearer ")) {
            log.debug("[JwtAuthFilter] No Bearer Authorization header present for {} {}", method, uri);
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        try {
            String username = jwtService.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtService.isValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    log.info("[JwtAuthFilter] Successfully authenticated User: {}, Authorities: {} for {} {}",
                        username, userDetails.getAuthorities(), method, uri);
                } else {
                    log.warn("[JwtAuthFilter] Token validation failed for User: {} on {} {}", username, method, uri);
                }
            }
        } catch (Exception e) {
            log.error("[JwtAuthFilter] Exception validating JWT token on {} {}: {}", method, uri, e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
