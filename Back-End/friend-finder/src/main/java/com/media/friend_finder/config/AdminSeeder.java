package com.media.friend_finder.config;

import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // بنتأكد إن مفيش أدمن متسجل قبل كده عشان منعملش Duplicate
        if (userRepository.findByEmail("admin@friendfinder.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@friendfinder.com");
            admin.setPasswordHash(passwordEncoder.encode("admin@123")); // الباسوورد الافتراضي
            admin.setRole("ADMIN"); // الصلاحية اللي بتفرق الأدمن عن اليوزر العادي
            userRepository.save(admin);
            System.out.println("====== Super Admin created successfully! ======");
        }
    }
}