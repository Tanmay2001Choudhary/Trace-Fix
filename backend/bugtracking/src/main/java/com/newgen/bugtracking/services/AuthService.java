package com.newgen.bugtracking.services;

import com.newgen.bugtracking.dao.UserDao;
import com.newgen.bugtracking.dto.JwtAuthenticationResponse;
import com.newgen.bugtracking.dto.SignInDTO;
import com.newgen.bugtracking.dto.SignUpDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    UserDao userDao;

    public ResponseEntity<String> signUp(SignUpDTO signUpDTO) {
        return userDao.signUp(signUpDTO);
    }

    public JwtAuthenticationResponse signIn(SignInDTO signInDTO) {
        return userDao.signIn(signInDTO);
    }
}
