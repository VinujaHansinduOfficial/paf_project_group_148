package com.example.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Entity.Comment;
import com.example.backend.Repo.CommentRepository;

import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    
    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }
    
    public Comment updateComment(Long id, Comment comment) {
        Comment existingComment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        existingComment.setContent(comment.getContent());
        return commentRepository.save(existingComment);
    }
    
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
    
    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostId(postId);
    }
    
    public Comment getComment(Long id) {
        return commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
    }
}
