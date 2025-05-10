package net.learn.learn.controller;


import net.learn.learn.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") // Adjust for your React app
@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        boolean isValid = loginService.validateUser(email, password);

        return isValid ? "Login successful" : "Invalid credentials";
    }
}

