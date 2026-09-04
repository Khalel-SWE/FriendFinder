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

    public String sendFriendRequest(
            String requesterEmail,
            String addresseeEmail
    ) {

        if (requesterEmail.equals(addresseeEmail)) {

            throw new RuntimeException(
                    "You cannot send a friend request to yourself"
            );
        }

        User requester =
                userRepository.findByEmail(requesterEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sender not found"
                                )
                        );

        User addressee =
                userRepository.findByEmail(addresseeEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Receiver not found"
                                )
                        );

        if ("ADMIN".equalsIgnoreCase(requester.getRole())) {

            throw new RuntimeException(
                    "Admin accounts cannot send friend requests"
            );
        }

        if ("ADMIN".equalsIgnoreCase(addressee.getRole())) {

            throw new RuntimeException(
                    "You cannot send a friend request to an Admin"
            );
        }

        var existingFriendship =
                friendshipRepository.findFriendshipBetweenUsers(
                        requester,
                        addressee
                );

        if (existingFriendship.isPresent()) {

            Friendship friendship =
                    existingFriendship.get();

            String currentStatus =
                    friendship.getStatus();


            if (FriendshipStatus.PENDING.name()
                    .equalsIgnoreCase(currentStatus)) {

                throw new RuntimeException(
                        "A friend request is already pending between these users"
                );
            }


            if (FriendshipStatus.ACCEPTED.name()
                    .equalsIgnoreCase(currentStatus)) {

                throw new RuntimeException(
                        "These users are already friends"
                );
            }


            if (FriendshipStatus.REJECTED.name()
                    .equalsIgnoreCase(currentStatus)) {

                friendship.setRequester(requester);

                friendship.setAddressee(addressee);

                friendship.setStatus(
                        FriendshipStatus.PENDING.name()
                );

                friendshipRepository.save(friendship);


                notificationService.createNotification(
                        addressee,
                        "You have a new friend request from "
                                + requester.getEmail(),
                        Notification.NotificationType.FRIEND_REQUEST,
                        friendship.getId(),
                        requester
                );

                return "Friend request sent successfully to "
                        + addresseeEmail;
            }


            throw new RuntimeException(
                    "Invalid friendship status: "
                            + currentStatus
            );
        }

        Friendship friendship =
                new Friendship();

        friendship.setRequester(requester);

        friendship.setAddressee(addressee);

        friendship.setStatus(
                FriendshipStatus.PENDING.name()
        );

        friendshipRepository.save(friendship);


        notificationService.createNotification(
                addressee,
                "You have a new friend request from "
                        + requester.getEmail(),
                Notification.NotificationType.FRIEND_REQUEST,
                friendship.getId(),
                requester
        );

        return "Friend request sent successfully to "
                + addresseeEmail;
    }

    public List<FriendRequestResponse> getPendingRequests(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return friendshipRepository
                .findByAddresseeAndStatus(
                        user,
                        FriendshipStatus.PENDING.name()
                )
                .stream()
                .map(f -> {

                    Profile requesterProfile =
                            profileRepository
                                    .findByUserEmail(
                                            f.getRequester().getEmail()
                                    )
                                    .orElseThrow(
                                            () ->
                                                    new RuntimeException(
                                                            "Profile not found"
                                                    )
                                    );

                    return FriendRequestResponse.builder()
                            .requestId(f.getId())
                            .requesterEmail(
                                    f.getRequester().getEmail()
                            )
                            .requesterFirstName(
                                    requesterProfile.getFirstName()
                            )
                            .requesterLastName(
                                    requesterProfile.getLastName()
                            )
                            .status(f.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public String acceptOrRejectRequest(
            String currentUserEmail,
            Long requestId,
            String status
    ) {

        Friendship friendship =
                friendshipRepository.findById(requestId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Friend request not found"
                                        )
                        );


        if (!friendship.getAddressee()
                .getEmail()
                .equals(currentUserEmail)) {

            throw new RuntimeException(
                    "Security Violation: You are not authorized to manage this friend request"
            );
        }


        FriendshipStatus statusEnum;

        try {

            statusEnum =
                    FriendshipStatus.valueOf(
                            status.toUpperCase()
                    );

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid status. Must be ACCEPTED or REJECTED"
            );
        }


        if (statusEnum == FriendshipStatus.PENDING) {

            throw new RuntimeException(
                    "Invalid status. Must be ACCEPTED or REJECTED"
            );
        }


        friendship.setStatus(
                statusEnum.name()
        );

        friendshipRepository.save(friendship);


        if (statusEnum == FriendshipStatus.ACCEPTED) {

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


            notificationService.createNotification(
                    friendship.getRequester(),
                    friendship.getAddressee().getEmail()
                            + " accepted your friend request",
                    Notification.NotificationType
                            .ACCEPT_FRIEND_REQUEST,
                    friendship.getId(),
                    friendship.getAddressee()
            );
        }


        return "Friend request has been "
                + statusEnum.name().toLowerCase();
    }

    public String sendFriendRequestById(
            String requesterEmail,
            Long receiverId
    ) {

        User receiver =
                userRepository.findById(receiverId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Receiver not found"
                                        )
                        );

        return sendFriendRequest(
                requesterEmail,
                receiver.getEmail()
        );
    }

    public List<FriendResponse> getMyFriends(
            String email
    ) {

        User currentUser =
                userRepository.findByEmail(email)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "User not found"
                                        )
                        );

        return buildFriendList(currentUser);
    }

    public List<FriendResponse> getFriendsForProfile(
            String currentUserEmail,
            Long profileUserId
    ) {

        User currentUser =
                userRepository.findByEmail(
                                currentUserEmail
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Current user not found"
                                        )
                        );


        User profileUser =
                userRepository.findById(profileUserId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Profile user not found"
                                        )
                        );

        if ("ADMIN".equalsIgnoreCase(
                profileUser.getRole()
        )) {

            throw new RuntimeException(
                    "Admin friends are not publicly accessible"
            );
        }

        if (currentUser.getId()
                .equals(profileUser.getId())) {

            return buildFriendList(
                    profileUser
            );
        }

        Friendship friendship =
                friendshipRepository
                        .findFriendshipBetweenUsers(
                                currentUser,
                                profileUser
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "You must be friends with this user to view their friends"
                                        )
                        );


        if (!FriendshipStatus.ACCEPTED.name()
                .equalsIgnoreCase(
                        friendship.getStatus()
                )) {

            throw new RuntimeException(
                    "You must be friends with this user to view their friends"
            );
        }


        return buildFriendList(
                profileUser
        );
    }

    private List<FriendResponse> buildFriendList(
            User owner
    ) {

        List<Friendship> friendships =
                friendshipRepository
                        .findAcceptedFriendships(owner);


        return friendships.stream()
                .map(friendship -> {

                    User friendUser =
                            friendship.getRequester()
                                    .equals(owner)
                                    ? friendship.getAddressee()
                                    : friendship.getRequester();

                    if ("ADMIN".equalsIgnoreCase(
                            friendUser.getRole()
                    )) {

                        return null;
                    }


                    Profile profile =
                            profileRepository
                                    .findByUserEmail(
                                            friendUser.getEmail()
                                    )
                                    .orElseThrow(
                                            () ->
                                                    new RuntimeException(
                                                            "Profile not found"
                                                    )
                                    );


                    String firstName =
                            profile.getFirstName() == null
                                    ? ""
                                    : profile.getFirstName().trim();

                    String lastName =
                            profile.getLastName() == null
                                    ? ""
                                    : profile.getLastName().trim();


                    String fullName =
                            (firstName + " " + lastName)
                                    .trim();

                    String initials =
                            (
                                    firstName.isEmpty()
                                            ? ""
                                            : String.valueOf(firstName.charAt(0))
                            )
                                    + (
                                    lastName.isEmpty()
                                            ? ""
                                            : String.valueOf(lastName.charAt(0))
                            );


                    String gradient =
                            friendUser.getId() % 2 == 0
                                    ? "from-burgundy"
                                    : "from-gold";


                    return FriendResponse.builder()
                            .id(friendUser.getId())
                            .name(
                                    fullName.isBlank()
                                            ? friendUser.getEmail()
                                            : fullName
                            )
                            .initials(
                                    initials
                                            .toUpperCase()
                            )
                            .gradient(gradient)
                            .mutualCount(0)
                            .profilePicture(
                                    profile.getProfilePicture()
                            )
                            .coverPhoto(
                                    profile.getCoverPhoto()
                            )
                            .build();

                })
                .filter(
                        friend -> friend != null
                )
                .collect(Collectors.toList());
    }

    public void removeFriend(
            String userEmail,
            Long friendId
    ) {

        User currentUser =
                userRepository.findByEmail(userEmail)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "User not found"
                                        )
                        );


        User friend =
                userRepository.findById(friendId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Friend not found"
                                        )
                        );


        Friendship friendship =
                friendshipRepository
                        .findFriendshipBetweenUsers(
                                currentUser,
                                friend
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Friendship not found"
                                        )
                        );


        if (!FriendshipStatus.ACCEPTED.name()
                .equalsIgnoreCase(
                        friendship.getStatus()
                )) {

            throw new RuntimeException(
                    "These users are not friends"
            );
        }


        friendshipRepository.delete(
                friendship
        );
    }
}