package com.example.backend.Controller;

import com.example.backend.DOT.MessageResponseDto;
import com.example.backend.DOT.SendMessageRequest;
import com.example.backend.DOT.UpdateMessageRequest;
import com.example.backend.Entity.Message;
import com.example.backend.Service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request) {
        Long senderId = request.getSenderId();
        Long receiverId = request.getReceiverId();
        String content = request.getMessage(); // renamed to avoid conflict

        Message savedMessage = messageService.sendMessage(senderId, receiverId, content);
        return ResponseEntity.ok(savedMessage);
    }


    @GetMapping("/history")
    public ResponseEntity<List<MessageResponseDto>> getChatHistory(
            @RequestParam Long user1Id, @RequestParam Long user2Id,
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(messageService.getChatHistory(user1Id, user2Id, limit));
    }

    @GetMapping("/recent/{userId}")
    public ResponseEntity<List<MessageResponseDto>> getRecentChats(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getRecentChats(userId));
    }

    // com.example.backend.Controller.MessageController.java

    @PutMapping("/update")
    public ResponseEntity<?> updateMessage(@RequestBody UpdateMessageRequest request) {
        Message updatedMessage = messageService.updateMessage(request.getMessageId(), request.getNewMessage());
        return ResponseEntity.ok(updatedMessage);
    }


    // com.example.backend.Controller.MessageController.java

    @DeleteMapping("/delete/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.ok("Message deleted successfully");
    }


}
