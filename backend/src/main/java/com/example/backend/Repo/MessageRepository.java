package com.example.backend.Repo;

import com.example.backend.Entity.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Get the most recent message in each one-on-one chat involving the given user.
     */
    @Query("""
        SELECT m FROM Message m
        WHERE m.id IN (
            SELECT MAX(m2.id) FROM Message m2
            WHERE m2.sender.id = :userId OR m2.receiver.id = :userId
            GROUP BY CASE 
                WHEN m2.sender.id = :userId THEN m2.receiver.id 
                ELSE m2.sender.id 
            END
        )
        ORDER BY m.timestamp DESC
    """)
    List<Message> findRecentChats(@Param("userId") Long userId);

    /**
     * Get the full conversation between two users ordered by timestamp (ascending).
     */
    @Query("""
        SELECT m FROM Message m
        WHERE (m.sender.id = :senderId AND m.receiver.id = :receiverId)
           OR (m.sender.id = :receiverId AND m.receiver.id = :senderId)
        ORDER BY m.timestamp ASC
    """)
    List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestampAsc(
            @Param("senderId") Long senderId,
            @Param("receiverId") Long receiverId,
            Pageable pageable
    );
}
