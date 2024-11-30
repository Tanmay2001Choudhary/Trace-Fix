package com.newgen.bugtracking;

import com.newgen.bugtracking.entities.Role;
import com.newgen.bugtracking.entities.User;
import com.newgen.bugtracking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@SpringBootApplication
public class BugtrackingApplication implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    public static void main(String[] args) {
        SpringApplication.run(BugtrackingApplication.class, args);
    }

    @Override
    public void run(String... args) {
        List<User> adminAccount = userRepository.findByRole(Role.ADMIN);
        if (adminAccount == null || adminAccount.isEmpty()) {
            User user = new User();
            user.setEmail("admin@gmail.com");
            user.setName("admin");
            user.setRole(Role.ADMIN);
            user.setPassword(new BCryptPasswordEncoder().encode("admin"));
            userRepository.save(user);
            System.out.println("Admin created");
        }
    }

}
