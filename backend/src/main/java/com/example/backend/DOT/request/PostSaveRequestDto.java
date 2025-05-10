package com.example.backend.DOT.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PostSaveRequestDto {
    private Long userId;
    private String description;
    private List<ImageSaveRequestDto> imageUrls;
}
