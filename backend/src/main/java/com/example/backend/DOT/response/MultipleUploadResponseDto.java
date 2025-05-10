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
public class MultipleUploadResponseDto {
    private List<String> imageUrls;
}
