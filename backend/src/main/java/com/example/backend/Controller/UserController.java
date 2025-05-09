package com.example.backend.Controller;

import com.example.backend.Entity.User;
import com.example.backend.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.findUserByUsername(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/uid/{Id}")
    public ResponseEntity<User> getUserById(@PathVariable Long Id) {
        Optional<User> user = userService.findUserById(Id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userService.isUsernameTaken(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken.");
        }
        if (userService.isEmailTaken(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already registered.");
        }
        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully.");
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<String> updateOnlineStatus(@PathVariable Long userId, @RequestParam boolean online) {
        userService.updateOnlineStatus(userId, online);
        return ResponseEntity.ok("User status updated.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        Optional<User> userOpt = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(user); // You can send limited user data here if needed
        }
        return ResponseEntity.status(401).body("Invalid username or password.");
    }

    @PostMapping("/{userId}/add-follower")
    public ResponseEntity<String> addFollower(
            @PathVariable Long userId,
            @RequestParam Long followerId) {

        boolean added = userService.addFollower(userId, followerId);
        if (added) {
            return ResponseEntity.ok("Follower added successfully.");
        } else {
            return ResponseEntity.badRequest().body("Unable to add follower. User may not exist or follower already added.");
        }
    }

}
