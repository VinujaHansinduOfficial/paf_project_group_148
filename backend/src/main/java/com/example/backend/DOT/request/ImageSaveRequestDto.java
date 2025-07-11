package com.example.backend.DOT.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ImageSaveRequestDto {
    private String url;
    private String extension;
}
