package com.newgen.bugtracking.dao;

import com.newgen.bugtracking.dto.JwtAuthenticationResponse;
import com.newgen.bugtracking.dto.SignInDTO;
import com.newgen.bugtracking.dto.SignUpDTO;
import com.newgen.bugtracking.dto.UserDTO;
import com.newgen.bugtracking.entities.User;
import com.newgen.bugtracking.repository.UserRepository;
import com.newgen.bugtracking.services.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
@Slf4j
public class UserDao {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtil jwtUtil;

    public ResponseEntity<String> signUp(SignUpDTO signUpDTO) {
        log.info("Attempting to sign up user with email: {}", signUpDTO.getEmail());

        if (userRepository.findByEmail(signUpDTO.getEmail()).isPresent()) {
            log.error("Email {} already exists", signUpDTO.getEmail());
            return new ResponseEntity<>("Email already exists", HttpStatus.CONFLICT);
        }

        User user = convertToEntity(signUpDTO);
        user.setPassword(passwordEncoder.encode(signUpDTO.getPassword()));

        User savedUser = userRepository.save(user);
        log.info("User signed up successfully with email: {}", savedUser.getEmail());
        return new ResponseEntity<>("User signed up successfully", HttpStatus.CREATED);

    }

    public JwtAuthenticationResponse signIn(SignInDTO signInDTO) {
        log.info("Attempting to sign in user with email: {}", signInDTO.getEmail());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(signInDTO.getEmail(), signInDTO.getPassword()));
        } catch (Exception e) {
            log.error("Authentication failed for email: {}", signInDTO.getEmail());
            throw new IllegalArgumentException("Invalid email or password");
        }

        var user = userRepository.findByEmail(signInDTO.getEmail())
                .orElseThrow(() -> {
                    log.error("User not found for email: {}", signInDTO.getEmail());
                    return new IllegalArgumentException("Invalid email or password");
                });

        var jwt = jwtUtil.generateToken(user, user.getId());
        var refreshToken = jwtUtil.generateRefreshToken(new HashMap<>(), user);

        JwtAuthenticationResponse jwtAuthenticationResponse = new JwtAuthenticationResponse();
        jwtAuthenticationResponse.setToken(jwt);
        jwtAuthenticationResponse.setRefreshToken(refreshToken);

        log.info("User signed in successfully with email: {}", signInDTO.getEmail());
        return jwtAuthenticationResponse;
    }

    public User convertToEntity(SignUpDTO signUpDTO) {
        log.debug("Converting SignUpDTO to User entity for email: {}", signUpDTO.getEmail());
        User user = new User();
        user.setName(signUpDTO.getName());
        user.setEmail(signUpDTO.getEmail());
        user.setRole(signUpDTO.getRole());
        return user;
    }

    public UserDTO convertToDTO(User user) {
        log.debug("Converting User entity to UserDTO for email: {}", user.getEmail());
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .build();
    }
}
