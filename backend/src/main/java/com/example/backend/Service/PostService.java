package com.example.backend.Service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.example.backend.DOT.request.PostSaveRequestDto;
import com.example.backend.Entity.Post;
import com.example.backend.Entity.PostImage;
import com.example.backend.Entity.User;
import com.example.backend.Repo.PostImageRepository;
import com.example.backend.Repo.PostRepository;
import com.example.backend.Repo.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.backend.DOT.response.PostImageResponseDto;
import com.example.backend.DOT.response.PostResponseDto;
import com.example.backend.DOT.response.UserResponseDto;

@Service
public class PostService {

    @Autowired
    private  PostRepository postRepository;

    @Autowired
    private  PostImageRepository postImageRepository;

    @Autowired
    private  UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public void savePost(PostSaveRequestDto request) {
        // Check if the user exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));


        Post post = new Post();
        post.setDescription(request.getDescription());
        post.setUser(user);

        // Save the post
        postRepository.save(post);

        // Save the images
        if(request.getImageUrls().size() > 0){
            request.getImageUrls().forEach(image -> {
                PostImage postImage = new PostImage();
                postImage.setPost(post);
                postImage.setImageUrl(image.getUrl());
                postImage.setExtension(image.getExtension());
                postImageRepository.save(postImage);
            });
        }
    }

    @Transactional
    public void updatePost(Long postId,PostSaveRequestDto request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Update the post's description
        post.setDescription(request.getDescription());

        // Save the updated post
        postRepository.save(post);

        // Delete existing images
        postImageRepository.deleteAllImagesByPostId(post.getPostId());

        // Update the images
        if(request.getImageUrls().size() > 0){
            request.getImageUrls().forEach(image -> {
                PostImage postImage = new PostImage();
                postImage.setPost(post);
                postImage.setImageUrl(image.getUrl());
                postImage.setExtension(image.getExtension());
                postImageRepository.save(postImage);
            });
        }
    }

    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        postRepository.delete(post);

        postImageRepository.deleteAllImagesByPostId(post.getPostId());
    }

    public PostResponseDto getPostById(long id){
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        PostResponseDto postResponseDto = modelMapper.map(post, PostResponseDto.class);
        UserResponseDto userResponseDto = modelMapper.map(post.getUser(), UserResponseDto.class);
        List<PostImage> images = post.getImages();
        List<PostImageResponseDto> imageUrls = new ArrayList<>();

        if(images.size() > 0){

            for (PostImage image : images) {
                PostImageResponseDto dto = new PostImageResponseDto();
                dto.setId(image.getId());
                dto.setImageUrl(image.getImageUrl());
                dto.setExtension(image.getExtension());
                dto.setCreatedAt(image.getCreatedAt().toString());
                dto.setUpdatedAt(image.getUpdatedAt().toString());
                imageUrls.add(dto);
            }

        }
        postResponseDto.setUser(userResponseDto);
        postResponseDto.setImageUrls(imageUrls);

        return postResponseDto;
    }


    public List<PostResponseDto> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        List<PostResponseDto> postResponseDtos = new ArrayList<>();

        for (Post post : posts) {
            PostResponseDto postResponseDto = modelMapper.map(post, PostResponseDto.class);
            UserResponseDto userResponseDto = modelMapper.map(post.getUser(), UserResponseDto.class);

            List<PostImage> images = post.getImages();
            List<PostImageResponseDto> imageUrls = new ArrayList<>();

            if(images.size() > 0){

                for (PostImage image : images) {
                    PostImageResponseDto dto = new PostImageResponseDto();
                    dto.setId(image.getId());
                    dto.setImageUrl(image.getImageUrl());
                    dto.setExtension(image.getExtension());
                    dto.setCreatedAt(image.getCreatedAt().toString());
                    dto.setUpdatedAt(image.getUpdatedAt().toString());
                    imageUrls.add(dto);
                }

            }

            postResponseDto.setUser(userResponseDto);
            postResponseDto.setImageUrls(imageUrls);

            postResponseDtos.add(postResponseDto);
        }

        return postResponseDtos;
    }
}
