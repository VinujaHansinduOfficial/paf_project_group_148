package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileType;
    private Long fileSize;

    @Lob
    @Column(columnDefinition = "BLOB")
    private byte[] fileData;

    @OneToOne
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;
}
