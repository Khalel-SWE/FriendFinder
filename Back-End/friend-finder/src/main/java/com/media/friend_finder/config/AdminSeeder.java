package com.media.friend_finder.config;

import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.ProfileRepository;
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
    private final ProfileRepository profileRepository;

    @Override
    public void run(String... args) throws Exception {
//        // بنتأكد إن مفيش أدمن متسجل قبل كده عشان منعملش Duplicate
//        if (userRepository.findByEmail("admin@friendfinder.com").isEmpty()) {
//
//            User admin = new User();
//
//            admin.setEmail("admin@friendfinder.com");
//            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
//            admin.setRole("ADMIN");
//
//            admin = userRepository.save(admin);
//
//            Profile profile = new Profile();
//            profile.setUser(admin);
//            profile.setFirstName("Admin");
//            profile.setLastName("System");
//
//            profileRepository.save(profile);
//
//            System.out.println("====== Super Admin created successfully! ======");
//        }

        User admin;

        if (userRepository.findByEmail("admin@friendfinder.com").isEmpty()) {

            admin = new User();
            admin.setEmail("admin@friendfinder.com");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setRole("ADMIN");

            admin = userRepository.save(admin);

        } else {

            admin = userRepository.findByEmail("admin@friendfinder.com").get();

        }

        if (profileRepository.findByUser(admin).isEmpty()) {

            Profile profile = new Profile();
            profile.setUser(admin);
            profile.setFirstName("Admin");
            profile.setLastName("System");

            profileRepository.save(profile);
        }
    }
}