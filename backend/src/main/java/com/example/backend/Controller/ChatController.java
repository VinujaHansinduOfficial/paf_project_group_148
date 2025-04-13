package com.example.backend.Controller;

import com.example.backend.Entity.Message;
import com.example.backend.Service.ChatService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/chats")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/recent/{userId}")
    public List<Message> getRecentChats(@PathVariable Long userId) {
        return chatService.getRecentChats(userId);
    }
}

