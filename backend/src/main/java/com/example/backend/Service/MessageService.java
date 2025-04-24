package com.example.backend.Service;

import com.example.backend.Config.EncryptionUtil;
import com.example.backend.DOT.MessageResponseDto;
import com.example.backend.Entity.Message;
import com.example.backend.Entity.User;
import com.example.backend.Repo.MessageRepository;
import com.example.backend.Repo.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public Message sendMessage(Long senderId, Long receiverId, String plainTextMessage) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));

        String encryptedMessage;
        try {
            encryptedMessage = EncryptionUtil.encrypt(plainTextMessage);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setEncryptedMessage(encryptedMessage);
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }


    public List<MessageResponseDto> getChatHistory(Long user1Id, Long user2Id, int limit) {
        List<Message> messages = messageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestampAsc(
                user1Id, user2Id, PageRequest.of(0, limit)
        );

        return messages.stream().map(this::convertToDtoWithDecryption).toList();
    }


    public List<MessageResponseDto> getRecentChats(Long userId) {
        List<Message> messages = messageRepository.findRecentChats(userId);
        return messages.stream().map(this::convertToDtoWithDecryption).toList();
    }

    private MessageResponseDto convertToDtoWithDecryption(Message message) {
        MessageResponseDto dto = new MessageResponseDto();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setTimestamp(message.getTimestamp());

        try {
            dto.setMessage(EncryptionUtil.decrypt(message.getEncryptedMessage()));
        } catch (Exception e) {
            dto.setMessage("Decryption error");
        }

        return dto;
    }

    public void deleteMessageById(Long id) {
        Optional<Message> messageOptional = messageRepository.findById(id);
        if (messageOptional.isPresent()) {
            messageRepository.deleteById(id);
        } else {
            throw new RuntimeException("Message with ID " + id + " not found.");
        }
    }


}

