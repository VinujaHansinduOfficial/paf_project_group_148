package com.example.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()  // Optional: Disable CSRF if you don't need it
                .authorizeHttpRequests()
                .requestMatchers("/**").permitAll()  // Allow access to all routes
                .anyRequest().permitAll();  // Optional: Handle other requests

        return http.build();
    }
}