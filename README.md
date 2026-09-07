# Friend Finder

Friend Finder is a full-stack social media web application designed to connect people through shared interests and interactions. Inspired by platforms like Facebook and Instagram, it provides a dedicated space for users to share moments, engage with content, and build a network of friends. The platform features robust role-based access control, dynamic news feeds, strict privacy boundaries, and a complete friendship management lifecycle.

## Technologies Used

**Backend & Security:**
* Java 17
* Spring Boot 3
* Spring Security (JWT & Bearer Token Authentication)
* Oracle Database 21c

**Frontend:**
* Angular & TypeScript
* Tailwind CSS v4
* Node Environment (NVM v22 / v24)

## Core Features

### Security & Authentication
* **Stateless Authentication:** Implemented secure login and registration using JSON Web Tokens (JWT). All protected API routes require a valid Bearer Token in the authorization header.
* **Account Integrity:** Strict password policies (uppercase, 8-12 characters, symbols, numbers) and unique email validation.
* **Role-Based Access Control (RBAC):** Distinct authorities and route protection for Admin and Standard User roles.

### Friendship System & Privacy Engine
* **Connection Lifecycle:** Full handling of friend requests (Add, Pending, Accept, Reject, Unfriend).
* **Suggested Connections:** A dynamic "Suggested Friends" widget that updates in real-time as requests are sent.
* **Strict Privacy Guard:** Profile data is conditionally rendered based on relationship status. Non-friends are restricted to basic "About" info and recent activities. Full access (Photos, Videos, Timeline) is exclusively unlocked upon accepted friendship.

### Content & Feed Dynamics
* **Multimedia Posts:** Users can publish text-only posts, single photos, videos, or mixed media with captions.
* **Dynamic Timeline:** A unified feed aggregating the user's own posts alongside content from their friends network.
* **Rich Interactions:** Support for multiple post reactions (like, love, haha, wow, sad, angry). 
* **Comment Management:** Users can edit or delete their comments within a 24-hour window. Post owners have elevated privileges to moderate and delete any comments on their own posts.

### Profile & Activity Tracking
* **Comprehensive Profiles:** Customizable user details including First/Last Name, Bio, Avatar, Cover Photo, Job Title, Location, Languages, and Interests.
* **Real-time Activity Sidebar:** A quick-glance widget tracking the user's latest 5 interactions across the platform (e.g., liked a post, published a comment, formed a new friendship).
* **Notification System:** Instant alerts for incoming requests, new comments, post reactions, admin replies, and friends' new posts.

### Admin Moderation Dashboard
* **Auto-Provisioning:** The primary admin account is automatically seeded into the database upon initialization (ID: 1).
* **Platform Analytics:** Real-time statistics tracking total users, active friendships, posts, and comments.
* **User Management:** Paginated user list with capabilities to view account status and apply or lift bans instantly.
* **Global Content Moderation:** Admins can view all platform posts (including author details and timestamps) and delete policy-violating content. Deleting a post triggers a cascade deletion of all associated comments and reactions.
* **Support Ticket System:** A dedicated interface to read and reply directly to user reports, suggestions, and bug submissions originating from the "Contact Us" module.

## Getting Started

### Prerequisites
* Java 17 
* Oracle Database 21c
* Node.js (v22 or v24 via NVM)
* Angular CLI

### Backend Setup
1. Open the project in IntelliJ IDEA.
2. Configure your Oracle DB connection credentials in the `application.properties` or `application.yml` file.
3. Run the Spring Boot application. 

### Frontend Setup
1. Ensure the correct Node version is active:
   ```bash
   nvm use 22


Install the necessary dependencies:

Bash
npm install
Compile and serve the application:

Bash
npx ng serve -o
