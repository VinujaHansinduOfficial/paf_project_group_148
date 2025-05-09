package com.example.backend.DOT;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateMessageRequest {
    private Long messageId;
    private String newMessage;
}
