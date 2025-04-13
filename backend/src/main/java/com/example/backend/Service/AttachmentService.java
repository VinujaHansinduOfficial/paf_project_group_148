package com.example.backend.Service;

import com.example.backend.Entity.Attachment;
import com.example.backend.Entity.Message;
import com.example.backend.Repo.AttachmentRepository;
import com.example.backend.Repo.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Optional;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final MessageRepository messageRepository;

    public AttachmentService(AttachmentRepository attachmentRepository, MessageRepository messageRepository) {
        this.attachmentRepository = attachmentRepository;
        this.messageRepository = messageRepository;
    }

    public Attachment uploadFile(Long messageId, MultipartFile file) throws IOException {
        Message message = messageRepository.findById(messageId).orElseThrow(() -> new RuntimeException("Message not found"));

        Attachment attachment = new Attachment();
        attachment.setFileName(file.getOriginalFilename());
        attachment.setFileType(file.getContentType());
        attachment.setFileSize(file.getSize());
        attachment.setFileData(file.getBytes());
        attachment.setMessage(message);

        return attachmentRepository.save(attachment);
    }

    public Optional<Attachment> getFileByName(String fileName) {
        return attachmentRepository.findByFileName(fileName);
    }
}

