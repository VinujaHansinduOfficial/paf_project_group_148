package com.example.backend.Repo;

import com.example.backend.Entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface PostImageRepository extends  JpaRepository<PostImage, Long> {
    // void deleteByPostId(Long postId);
    @Modifying
    @Query(value = "DELETE FROM post_images WHERE post_id = :postId", nativeQuery = true)
    void deleteAllImagesByPostId(@Param("postId") Long postId);
}
