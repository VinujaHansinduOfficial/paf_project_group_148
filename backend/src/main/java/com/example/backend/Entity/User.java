package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    private boolean isOnline;

    @Column(name = "user_from")
    private String from;

    @ElementCollection
    @CollectionTable(name = "followers", joinColumns = @JoinColumn(name = "id"))  // ✅ Fixed typo here
    private List<Long> followers = new ArrayList<>();
}
