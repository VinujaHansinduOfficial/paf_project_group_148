package com.example.backend.Service;

import com.example.backend.Entity.Message;
import com.example.backend.Repo.MessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {

    private final MessageRepository messageRepository;

    public ChatService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> getRecentChats(Long userId) {
        return messageRepository.findRecentChats(userId);
    }
}
