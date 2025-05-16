package com.example.backend.Controller;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.DOT.response.MultipleUploadResponseDto;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/store")
public class FileStore {
    // Upload multiple files at once (images and videos)
    @Value("${upload.directory}")
    private String uploadDirectory;

    @Value("${server.url}")
    private String serverUrl;


     @PostMapping("/multiple")
    public ResponseEntity<?> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        try {
            if (files == null || files.length == 0) {
                return ResponseEntity.badRequest().body("No files provided");
            }

            File dir = new File(uploadDirectory);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            List<String> fileUrls = new ArrayList<>();

            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue; 
                }

                String originalFilename = file.getOriginalFilename();
                String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

                Path filePath = Paths.get(uploadDirectory, uniqueFilename);
                Files.write(filePath, file.getBytes());

                String fileUrl = serverUrl + "/images/" + uniqueFilename;
                fileUrls.add(fileUrl);
            }

            if (fileUrls.isEmpty()) {
                return ResponseEntity.badRequest().body("No valid files provided");
            }

            return ResponseEntity.ok().body(new MultipleUploadResponseDto(fileUrls));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload files: " + e.getMessage());
        }
    }
}
