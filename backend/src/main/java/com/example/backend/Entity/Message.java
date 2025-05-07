package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(columnDefinition = "TEXT")
    private String encryptedMessage;

    @Column(columnDefinition = "TIMESTAMP", nullable = true)
    private LocalDateTime timestamp;

    @OneToOne(mappedBy = "message", cascade = CascadeType.ALL)
    private Attachment attachment;
}

