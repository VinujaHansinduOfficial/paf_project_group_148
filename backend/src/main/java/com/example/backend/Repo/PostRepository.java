package com.example.backend.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.backend.Entity.Post;

public interface PostRepository extends  JpaRepository<Post, Long> {
    // Get all post Without user post
    @Query("SELECT p FROM Post p WHERE p.user.id != :userId")
    List<Post> findAllPostsExceptUser(@Param("userId") Long userId);

}
