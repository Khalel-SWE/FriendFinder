package com.media.friend_finder.config; // غير الباكدج حسب مشروعك

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // السماح للفرونت إند بتاعك
        config.addAllowedOrigin("http://localhost:4200");

        // السماح بكل الـ Headers
        config.addAllowedHeader("*");

        // السماح بكل الطرق (GET, POST, PUT, DELETE, OPTIONS)
        config.addAllowedMethod("*");

        config.setAllowCredentials(true);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}