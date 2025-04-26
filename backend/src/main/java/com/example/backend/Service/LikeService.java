package com.example.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Entity.Like;
import com.example.backend.Repo.LikeRepository;

import java.util.List;

@Service
public class LikeService {
    @Autowired
    private LikeRepository likeRepository;
    
    public Object toggleLike(Like like) {
        return likeRepository.findByUserIdAndPostId(like.getUserId(), like.getPostId())
            .map(existingLike -> {
                likeRepository.delete(existingLike);
                return null;
            })
            .orElseGet(() -> likeRepository.save(like));
    }
    
    public List<Like> getLikesByPost(Long postId) {
        return likeRepository.findByPostId(postId);
    }
    
    public boolean hasUserLiked(Long userId, Long postId) {
        return likeRepository.findByUserIdAndPostId(userId, postId).isPresent();
    }
}
