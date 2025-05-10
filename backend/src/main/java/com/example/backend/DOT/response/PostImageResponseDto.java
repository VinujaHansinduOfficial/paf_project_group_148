package com.example.backend.DOT.response;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PostImageResponseDto {
    private Long id;
    private String imageUrl;
    private String extension;
    private String createdAt;
    private String updatedAt;
}
