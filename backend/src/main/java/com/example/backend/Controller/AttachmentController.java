package com.example.backend.Controller;

import com.example.backend.Entity.Attachment;
import com.example.backend.Service.AttachmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Attachment> uploadFile(@RequestParam Long messageId, @RequestParam MultipartFile file) {
        try {
            Attachment attachment = attachmentService.uploadFile(messageId, file);
            return ResponseEntity.ok(attachment);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<Attachment> getFile(@PathVariable String fileName) {
        Optional<Attachment> attachment = attachmentService.getFileByName(fileName);
        return attachment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
