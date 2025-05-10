package com.example.backend.DOT.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PostResponseDto {
    private Long postId;
    private String description;
    private String createdAt;
    private String updatedAt;
    
    private List<PostImageResponseDto> imageUrls;

    private UserResponseDto user;
    
}
