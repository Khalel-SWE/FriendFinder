//package com.media.friend_finder.config;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//@Configuration
//@EnableWebSecurity
//@RequiredArgsConstructor
//public class SecurityConfiguration {
//
//    private final JwtAuthenticationFilter jwtAuthFilter;
//    private final AuthenticationProvider authenticationProvider;
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(auth -> auth
//                        // المسارات المفتوحة للكل
//                        .requestMatchers("/friend-finder/auth/**",
//                                "/uploads/**",
//                                "/error",
//                                "/swagger-ui/**",
//                                "/v3/api-docs/**").permitAll()
//
//                        // بوابات الأدمن مقفولة ومحدش يدخلها غير الـ ADMIN
//                        .requestMatchers("/friend-finder/admin/**").hasRole("ADMIN")
//
//                        // أي مسار تاني محتاج يوزر عادي مسجل دخول
//                        .anyRequest().authenticated()
//                )
//                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authenticationProvider(authenticationProvider)
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//}

package com.media.friend_finder.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer; // <-- ضفنا دي
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults()) // <-- السطر السحري اللي كان ناقص عشان الـ CORS يشتغل!
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // وحدنا المسار هنا عشان يطابق الأنجولار والـ Controller بتاعك
                        .requestMatchers("/friend-finder/auth/**",
                                "/uploads/**",
                                "/error",
                                "/swagger-ui/**",
                                "/v3/api-docs/**").permitAll()

                        // بوابات الأدمن مقفولة ومحدش يدخلها غير الـ ADMIN
                        .requestMatchers("/friend-finder/admin/**").hasRole("ADMIN")

                        // أي مسار تاني محتاج يوزر عادي مسجل دخول
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}