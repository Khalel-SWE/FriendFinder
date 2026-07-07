//package com.media.friend_finder.service;
//
//import com.media.friend_finder.entity.*;
//import com.media.friend_finder.repository.*;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class InteractionService {
//
//    private final CommentRepository commentRepository;
//    private final ReactionRepository reactionRepository;
//    private final PostRepository postRepository;
//    private final UserRepository userRepository;
//    private final FriendshipRepository friendshipRepository;
//
//    // 1. إضافة تعليق (مع التأكد من الخصوصية)
//    public Comment addComment(String email, Long postId, String content) {
//        User user = userRepository.findByEmail(email).orElseThrow();
//        Post post = postRepository.findById(postId).orElseThrow();
//
//        checkPrivacy(user, post.getUser()); // قاعدة "خالد"
//
//        Comment comment = new Comment();
//        comment.setPost(post);
//        comment.setUser(user);
//        comment.setContent(content);
//        comment = commentRepository.save(comment);
////        return commentRepository.save(comment);
//        return mapToCommentResponse(comment);
//    }
//
//    // 2. حذف تعليق (صلاحية صاحب البوست أو صاحب التعليق)
//    public void deleteComment(String email, Long commentId) {
//        Comment comment = commentRepository.findById(commentId).orElseThrow();
//        User user = userRepository.findByEmail(email).orElseThrow();
//
//        if (comment.getUser().equals(user) || comment.getPost().getUser().equals(user)) {
//            commentRepository.delete(comment);
//        } else {
//            throw new RuntimeException("Unauthorized: Cannot delete this comment");
//        }
//    }
//
//    // 3. تعديل تعليق (خلال 24 ساعة فقط)
//    public Comment updateComment(String email, Long commentId, String newContent) {
//        Comment comment = commentRepository.findById(commentId).orElseThrow();
//
//        if (!comment.getUser().getEmail().equals(email)) throw new RuntimeException("Unauthorized");
//
//        // شرط الـ 24 ساعة
//        if (comment.getCreatedAt().isBefore(LocalDateTime.now().minusHours(24))) {
//            throw new RuntimeException("Cannot edit comment after 24 hours");
//        }
//
//        comment.setContent(newContent);
//        return commentRepository.save(comment);
//    }
//
//    // 4. إضافة تفاعل (Like/Haha/etc...)
//    public void reactToPost(String email, Long postId, ReactionType type) {
//        User user = userRepository.findByEmail(email).orElseThrow();
//        Post post = postRepository.findById(postId).orElseThrow();
//
//        checkPrivacy(user, post.getUser());
//
//        Reaction reaction = reactionRepository.findByPostAndUser(post, user)
//                .orElse(new Reaction());
//
//        reaction.setPost(post);
//        reaction.setUser(user);
//        reaction.setType(type);
//        reactionRepository.save(reaction);
//    }
//
//    // القاعدة الأمنية (خصوصية خالد)
//    private void checkPrivacy(User viewer, User owner) {
//        if (!viewer.equals(owner)) {
//            boolean isFriend = friendshipRepository.findFriendshipBetweenUsers(viewer, owner).isPresent();
//            if (!isFriend) throw new RuntimeException("Access Denied: You are not friends with this user");
//        }
//    }
//
//    public List<Comment> getComments(Long postId) {
//        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
//    }
//
//    // دالة مساعدة للتحويل من Entity لـ DTO
//    private com.media.friend_finder.dto.CommentResponse mapToCommentResponse(Comment comment) {
//        return com.media.friend_finder.dto.CommentResponse.builder()
//                .id(comment.getId())
//                .content(comment.getContent())
//                .userEmail(comment.getUser().getEmail())
//                .createdAt(comment.getCreatedAt())
//                .updatedAt(comment.getUpdatedAt())
//                .build();
//    }
//}

package com.media.friend_finder.service;

import com.media.friend_finder.dto.CommentResponse;
import com.media.friend_finder.entity.*;
import com.media.friend_finder.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InteractionService {

    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;

    // 1. إضافة تعليق (مع التأكد من الخصوصية)
    public CommentResponse addComment(String email, Long postId, String content) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();

        checkPrivacy(user, post.getUser()); // قاعدة "خالد"

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(content);
        comment = commentRepository.save(comment);

        return mapToCommentResponse(comment);
    }

    // 2. حذف تعليق (صلاحية صاحب البوست أو صاحب التعليق)
    public void deleteComment(String email, Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow();
        User user = userRepository.findByEmail(email).orElseThrow();

        if (comment.getUser().equals(user) || comment.getPost().getUser().equals(user)) {
            commentRepository.delete(comment);
        } else {
            throw new RuntimeException("Unauthorized: Cannot delete this comment");
        }
    }

    // 3. تعديل تعليق (خلال 24 ساعة فقط)
    public CommentResponse updateComment(String email, Long commentId, String newContent) {
        Comment comment = commentRepository.findById(commentId).orElseThrow();

        if (!comment.getUser().getEmail().equals(email)) throw new RuntimeException("Unauthorized");

        // شرط الـ 24 ساعة
        if (comment.getCreatedAt().isBefore(LocalDateTime.now().minusHours(24))) {
            throw new RuntimeException("Cannot edit comment after 24 hours");
        }

        comment.setContent(newContent);
        comment = commentRepository.save(comment);
        return mapToCommentResponse(comment);
    }

    // 4. إضافة تفاعل (Like/Haha/etc...)
    public void reactToPost(String email, Long postId, ReactionType type) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();

        checkPrivacy(user, post.getUser());

        Reaction reaction = reactionRepository.findByPostAndUser(post, user)
                .orElse(new Reaction());

        reaction.setPost(post);
        reaction.setUser(user);
        reaction.setType(type);
        reactionRepository.save(reaction);
    }

    // القاعدة الأمنية (خصوصية خالد)
    private void checkPrivacy(User viewer, User owner) {
        if (!viewer.equals(owner)) {
            boolean isFriend = friendshipRepository.findFriendshipBetweenUsers(viewer, owner).isPresent();
            if (!isFriend) throw new RuntimeException("Access Denied: You are not friends with this user");
        }
    }

    public List<CommentResponse> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    // دالة مساعدة للتحويل من Entity لـ DTO
    private CommentResponse mapToCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userEmail(comment.getUser().getEmail())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}