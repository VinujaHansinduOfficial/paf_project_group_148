package net.learn.learn.service;

import net.learn.learn.dto.LoginRequest;
import net.learn.learn.dto.RegisterRequest;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public void registerUser(RegisterRequest request) {
        // register logic here
    }

    public String authenticateUser(LoginRequest request) {
        // authentication logic (e.g., checking username and password)
        // return a JWT token or any success message
        return "mock-jwt-token";
    }
}
