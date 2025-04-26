package com.example.backend.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.Entity.Comment;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
    List<Comment> findByUserId(Long userId);
}
