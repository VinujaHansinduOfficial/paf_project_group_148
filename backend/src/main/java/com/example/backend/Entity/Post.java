package com.example.backend.Entity;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "Posts")
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String description;

    @CreationTimestamp
    @Column(name = "created_at",columnDefinition = "TIMESTAMP")
    private LocalDate createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at",columnDefinition = "TIMESTAMP")
    private LocalDate updatedAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<PostImage> images;
    
}
