package com.media.friend_finder.service;

import com.media.friend_finder.dto.FriendRequestResponse;
import com.media.friend_finder.dto.FriendResponse;
import com.media.friend_finder.entity.*;
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
    private final NotificationService notificationService;
    private final ActivityService activityService;

    // 1. إرسال طلب صداقة
    public String sendFriendRequest(String requesterEmail, String addresseeEmail) {

        if (requesterEmail.equals(addresseeEmail)) {
            throw new RuntimeException("You cannot send a friend request to yourself");
        }

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User addressee = userRepository.findByEmail(addresseeEmail)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // ============================
        // ADMIN PROTECTION
        // ============================

        if ("ADMIN".equals(addressee.getRole())) {
            throw new RuntimeException("You cannot send a friend request to an Admin");
        }

        // ============================
        // EXISTING FRIENDSHIP CHECK
        // ============================

        friendshipRepository.findFriendshipBetweenUsers(requester, addressee)
                .ifPresent(f -> {
                    throw new RuntimeException(
                            "A friend request or friendship already exists between these users"
                    );
                });

        Friendship friendship = new Friendship();

        friendship.setRequester(requester);
        friendship.setAddressee(addressee);
        friendship.setStatus(FriendshipStatus.PENDING.name());

        friendshipRepository.save(friendship);

        // ============================
        // NOTIFICATION
        // ============================

        notificationService.createNotification(
                addressee,
                "You have a new friend request from " + requester.getEmail(),
                Notification.NotificationType.FRIEND_REQUEST,
                friendship.getId()
        );

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

        if(status.equalsIgnoreCase("ACCEPTED")){

            activityService.saveActivity(
                    friendship.getRequester(),
                    ActivityType.FRIEND_ADDED,
                    friendship.getId()
            );

            activityService.saveActivity(
                    friendship.getAddressee(),
                    ActivityType.FRIEND_ADDED,
                    friendship.getId()
            );

        }

        // إرسال إشعار مرتد في حالة القبول فقط
        if (status.equalsIgnoreCase("ACCEPTED")) {
            notificationService.createNotification(
                    friendship.getRequester(),
                    friendship.getAddressee().getEmail() + " accepted your friend request",
                    Notification.NotificationType.ACCEPT_FRIEND_REQUEST,
                    friendship.getId()
            );
        }

        return "Friend request has been " + status.toLowerCase();
    }

    // 👇👇 الإضافات الجديدة 👇👇

    // 4. إرسال طلب صداقة بالـ ID (عشان زرار المقترحات في الفرونت إند بيبعت ID)
    public String sendFriendRequestById(String requesterEmail, Long receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        // هننادي على الدالة الأصلية بتاعتك عشان نحافظ على اللوجيك والإشعارات
        return sendFriendRequest(requesterEmail, receiver.getEmail());
    }

    // 5. جلب الأصدقاء الفعليين لتابة الـ Friends في البروفايل
    public List<FriendResponse> getMyFriends(String email) {
        User currentUser = userRepository.findByEmail(email).orElseThrow();
        // بنستخدم الدالة بتاعتك اللي بتجيب الـ ACCEPTED
        List<Friendship> friendships = friendshipRepository.findAcceptedFriendships(currentUser);

        return friendships.stream().map(f -> {
            User friendUser = f.getRequester().equals(currentUser) ? f.getAddressee() : f.getRequester();
            Profile profile = profileRepository.findByUserEmail(friendUser.getEmail()).orElseThrow();

            String initials = (profile.getFirstName().charAt(0) + "" + profile.getLastName().charAt(0)).toUpperCase();
            String gradient = friendUser.getId() % 2 == 0 ? "from-burgundy" : "from-gold";

            return FriendResponse.builder()
                    .id(friendUser.getId())
                    .name(profile.getFirstName() + " " + profile.getLastName())
                    .initials(initials)
                    .gradient(gradient)
                    .mutualCount(0) // مؤقتاً بصفر
                    .build();
        }).collect(Collectors.toList());
    }

    // 6. مسح صديق (Unfriend)
    public void removeFriend(String userEmail, Long friendId) {
        User currentUser = userRepository.findByEmail(userEmail).orElseThrow();
        User friend = userRepository.findById(friendId).orElseThrow();

        Friendship friendship = friendshipRepository.findFriendshipBetweenUsers(currentUser, friend)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        friendshipRepository.delete(friendship);
    }
}