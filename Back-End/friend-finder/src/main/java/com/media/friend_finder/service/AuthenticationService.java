package com.media.friend_finder.service;

import com.media.friend_finder.dto.AuthResponse;
import com.media.friend_finder.dto.LoginRequest;
import com.media.friend_finder.dto.RegisterRequest;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.exception.UserAlreadyExistsException;
import com.media.friend_finder.repository.ProfileRepository;
import com.media.friend_finder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("البريد الإلكتروني مسجل مسبقاً");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        User savedUser = userRepository.save(user);

        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profileRepository.save(profile);

        var jwtToken = jwtService.generateToken(savedUser);
        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole())
                .build();
    }
}