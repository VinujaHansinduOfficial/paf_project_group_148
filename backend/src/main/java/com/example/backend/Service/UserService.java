package com.example.backend.Service;

import com.example.backend.Entity.User;
import com.example.backend.Repo.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findUserById(Long Id) {
        return userRepository.findById(Id);
    }

    public boolean isUsernameTaken(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean isEmailTaken(String email) {
        return userRepository.existsByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void updateOnlineStatus(Long userId, boolean isOnline) {
        Optional<User> user = userRepository.findById(userId);
        user.ifPresent(u -> {
            u.setOnline(isOnline);
            userRepository.save(u);
        });
    }

    public Optional<User> loginUser(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) { // Replace this with BCrypt check if using hashed passwords
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }


    public boolean addFollower(Long userId, Long followerId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (!user.getFollowers().contains(followerId)) {
                user.getFollowers().add(followerId);
                userRepository.save(user);
                return true;
            }
        }

        return false;
    }

    public boolean unfollowUser(Long userId, Long followerId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getFollowers().contains(followerId)) {
                user.unfollow(followerId); // Calls the method from the Entity
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }
}

