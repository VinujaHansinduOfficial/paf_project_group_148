package com.example.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.Entity.Like;
import com.example.backend.Service.LikeService;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {
    @Autowired
    private LikeService likeService;

    @PostMapping("/toggle")
    public ResponseEntity<Object> toggleLike(@RequestBody Like like) {
        return ResponseEntity.ok(likeService.toggleLike(like));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getLikesByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.getLikesByPost(postId));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> hasUserLiked(@RequestParam Long userId, @RequestParam Long postId) {
        return ResponseEntity.ok(likeService.hasUserLiked(userId, postId));
    }
}
