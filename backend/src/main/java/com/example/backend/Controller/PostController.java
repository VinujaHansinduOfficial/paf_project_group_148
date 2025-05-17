package com.example.backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.example.backend.DOT.request.PostSaveRequestDto;
import com.example.backend.DOT.response.PostResponseDto;
import com.example.backend.Service.PostService;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/posts")
public class PostController {
    @Autowired
    private PostService postService;

    @PostMapping("/")
    public ResponseEntity<?> savePost(@RequestBody PostSaveRequestDto request) {
        try {
            if(request.getDescription().isEmpty()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Description cannot be empty");
            }

            postService.savePost(request);

            return ResponseEntity.ok("Post saved successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<?> putMethodName(@PathVariable Long id, @RequestBody PostSaveRequestDto request) {    
        try {
            if(request.getDescription().isEmpty()){
                return ResponseEntity.badRequest().body("Description cannot be empty");
            }

            postService.updatePost(id, request);
            return ResponseEntity.ok("Post updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        try {
            postService.deletePost(id);
            return ResponseEntity.ok("Post deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }



    @GetMapping("/getAll")
    public ResponseEntity<?> getAllPosts() {
        try {
            List<PostResponseDto> posts = postService.getAllPosts();
            return ResponseEntity.ok(posts);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(postService.getPostById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // PostController.java
    @GetMapping("/getByUserId/{userId}")
    public ResponseEntity<List<PostResponseDto>> getPostsByUser(@PathVariable Long userId) {
        List<PostResponseDto> posts = postService.getPostsByUser(userId);
        return ResponseEntity.ok(posts);
    }


}
