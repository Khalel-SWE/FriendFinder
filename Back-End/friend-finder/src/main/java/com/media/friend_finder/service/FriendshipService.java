package com.media.friend_finder.service;

import com.media.friend_finder.dto.FriendRequestResponse;
import com.media.friend_finder.entity.Friendship;
import com.media.friend_finder.entity.FriendshipStatus;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.FriendshipRepository;
import com.media.friend_finder.repository.ProfileRepository;
import com.media.friend_finder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    // 1. إرسال طلب صداقة
    public String sendFriendRequest(String requesterEmail, String addresseeEmail) {
        if (requesterEmail.equals(addresseeEmail)) {
            // TODO: Replace with custom ResourceNotFoundException / BadRequestException
            throw new RuntimeException("You cannot send a friend request to yourself");
        }

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User addressee = userRepository.findByEmail(addresseeEmail)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        friendshipRepository.findFriendshipBetweenUsers(requester, addressee)
                .ifPresent(f -> {
                    throw new RuntimeException("A friend request or friendship already exists between these users");
                });

        Friendship friendship = new Friendship();
        friendship.setRequester(requester);
        friendship.setAddressee(addressee);
        friendship.setStatus(FriendshipStatus.PENDING.name()); // استخدام الـ Enum

        friendshipRepository.save(friendship);
        return "Friend request sent successfully to " + addresseeEmail;
    }

    // 2. عرض طلبات الصداقة المعلقة لليوزر الحالي
    public List<FriendRequestResponse> getPendingRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // TODO: Fix N+1 Query Problem by using JOIN FETCH in Repository for production scalability
        return friendshipRepository.findByAddresseeAndStatus(user, FriendshipStatus.PENDING.name())
                .stream()
                .map(f -> {
                    Profile requesterProfile = profileRepository.findByUserEmail(f.getRequester().getEmail())
                            .orElseThrow(() -> new RuntimeException("Profile not found"));

                    return FriendRequestResponse.builder()
                            .requestId(f.getId())
                            .requesterEmail(f.getRequester().getEmail())
                            .requesterFirstName(requesterProfile.getFirstName())
                            .requesterLastName(requesterProfile.getLastName())
                            .status(f.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // 3. قبول أو رفض طلب الصداقة (النسخة الآمنة المحمية)
    public String acceptOrRejectRequest(String currentUserEmail, Long requestId, String status) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));

        // الثغرة الأمنية: التحقق من أن المستخدم الحالي هو نفسه الشخص المستقبل للطلب (Addressee)
        if (!friendship.getAddressee().getEmail().equals(currentUserEmail)) {
            // TODO: Replace with custom AccessDeniedException
            throw new RuntimeException("Security Violation: You are not authorized to manage this friend request");
        }

        // التحقق من صحة الستيتس باستخدام الـ Enum
        try {
            FriendshipStatus statusEnum = FriendshipStatus.valueOf(status.toUpperCase());
            if (statusEnum == FriendshipStatus.PENDING) {
                throw new IllegalArgumentException();
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status. Must be ACCEPTED or REJECTED");
        }

        friendship.setStatus(status.toUpperCase());
        friendshipRepository.save(friendship);

        return "Friend request has been " + status.toLowerCase();
    }
}