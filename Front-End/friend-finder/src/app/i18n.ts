export type Lang = 'en' | 'ar' | 'de';

export const TRANSLATIONS: Record<string, Record<Lang, string>> = {
  brand: { en: 'Friend Finder', ar: 'Friend Finder', de: 'Friend Finder' },
  search_ph: { en: 'Search friends, moments, events...', ar: 'دوّر على أصحاب، لحظات، فعاليات...', de: 'Freunde, Momente, Events suchen...' },
  notifications: { en: 'Notifications', ar: 'الإشعارات', de: 'Benachrichtigungen' },
  notif_friend_req: { en: 'sent you a friend request', ar: 'أرسل لك طلب صداقة', de: 'hat dir eine Freundschaftsanfrage gesendet' },
  notif_reacted: { en: 'reacted to your post', ar: 'تفاعل مع منشورك', de: 'hat auf deinen Beitrag reagiert' },
  notif_admin_reply: { en: 'replied to your complaint', ar: 'رد على شكواك', de: 'hat auf deine Beschwerde geantwortet' },
  my_profile: { en: 'My Profile', ar: 'بروفايلي', de: 'Mein Profil' },
  edit_profile_link: { en: 'Edit Profile', ar: 'تعديل البروفايل', de: 'Profil bearbeiten' },
  contact_us: { en: 'Contact Us', ar: 'تواصل معنا', de: 'Kontakt' },
  my_messages: { en: 'My Messages', ar: 'رسائلي', de: 'Meine Nachrichten' },
  logout: { en: 'Log Out', ar: 'تسجيل الخروج', de: 'Abmelden' },
  composer_ph: { en: "What's on your mind?", ar: 'بتفكر في إيه؟', de: 'Was denkst du gerade?' },
  add_media: { en: 'Photo / Video', ar: 'صورة / فيديو', de: 'Foto / Video' },
  post_btn: { en: 'Post', ar: 'نشر', de: 'Posten' },
  comments_label: { en: 'comments', ar: 'تعليق', de: 'Kommentare' },
  people_you_may_know: { en: 'People you may know', ar: 'أشخاص ممكن تعرفهم', de: 'Leute, die du kennen könntest' },
  mutual_friends: { en: 'mutual friends', ar: 'أصدقاء مشتركين', de: 'gemeinsame Freunde' },
  add: { en: 'Add', ar: 'إضافة', de: 'Hinzufügen' },
  admin_panel: { en: 'Admin Panel', ar: 'لوحة الإدارة', de: 'Admin-Bereich'},
  admin_administration: { en: 'Administration', ar: 'الإدارة', de: 'Administration'},
  admin_dashboard: { en: 'Admin Dashboard', ar: 'لوحة تحكم الإدارة', de: 'Admin-Dashboard'},
  admin_dashboard_description: { en: 'Overview of the platform activity and statistics.', ar: 'نظرة عامة على نشاط المنصة وإحصائياتها.', de: 'Übersicht über die Plattformaktivität und Statistiken.'},
  admin: { en: 'Admin', ar: 'إدارة', de: 'Admin'},
  admin_users: { en: 'Users', ar: 'المستخدمون', de: 'Benutzer'},
  admin_posts: { en: 'Posts', ar: 'المنشورات', de: 'Beiträge'},
  admin_contacts: { en: 'Contacts', ar: 'الرسائل', de: 'Nachrichten'},
  admin_total_users: { en: 'Total Users', ar: 'إجمالي المستخدمين', de: 'Benutzer gesamt'},
  admin_total_posts: { en: 'Total Posts', ar: 'إجمالي المنشورات', de: 'Beiträge gesamt'},
  admin_total_comments: { en: 'Total Comments', ar: 'إجمالي التعليقات', de: 'Kommentare gesamt'},
  admin_active_friendships: { en: 'Active Friendships', ar: 'صداقات نشطة', de: 'Aktive Freundschaften'},
  admin_registered_accounts: { en: 'Registered accounts', ar: 'حسابات مسجلة',de: 'Registrierte Konten'},
  admin_published_posts: { en: 'Published posts', ar: 'منشورات منشورة', de: 'Veröffentlichte Beiträge'},
  admin_user_interactions: { en: 'User interactions', ar: 'تفاعلات المستخدمين', de: 'Benutzerinteraktionen'},
  admin_accepted_connections: { en: 'Accepted connections', ar: 'طلبات اتصال مقبولة', de: 'Angenommene Verbindungen'},
  admin_logout: { en: 'Logout', ar: 'تسجيل الخروج', de: 'Abmelden'},
  admin_notif_contact: { en: 'New contact message from', ar: 'رسالة تواصل جديدة من', de: 'Neue Kontaktanfrage von'},
  admin_notif_reply: {
  en: 'Administration replied to your message',
  ar: 'ردت الإدارة على رسالتك',
  de: 'Die Administration hat auf deine Nachricht geantwortet'
},notif_friend_request: { en: 'sent you a friend request', ar: 'أرسل لك طلب صداقة', de: 'hat dir eine Freundschaftsanfrage gesendet'},
  admin_administrator: {
  en: 'Administrator',
  ar: 'مدير النظام',
  de: 'Administrator'
},

admin_role_admin: {
  en: 'ADMIN',
  ar: 'إدارة',
  de: 'ADMIN'
},

admin_role_user: {
  en: 'USER',
  ar: 'مستخدم',
  de: 'BENUTZER'
},

admin_users_title: {
  en: 'Users',
  ar: 'المستخدمون',
  de: 'Benutzer'
},

admin_users_description: {
  en: 'Manage registered users and account access.',
  ar: 'إدارة المستخدمين المسجلين والوصول إلى الحسابات.',
  de: 'Registrierte Benutzer und Kontozugriffe verwalten.'
},

admin_name: {
  en: 'Name',
  ar: 'الاسم',
  de: 'Name'
},

admin_email: {
  en: 'Email',
  ar: 'البريد الإلكتروني',
  de: 'E-Mail'
},

admin_role: {
  en: 'Role',
  ar: 'الدور',
  de: 'Rolle'
},

admin_status: {
  en: 'Status',
  ar: 'الحالة',
  de: 'Status'
},

admin_joined: {
  en: 'Joined',
  ar: 'انضمام',
  de: 'Beigetreten'
},

admin_action: {
  en: 'Action',
  ar: 'الإجراء',
  de: 'Aktion'
},

admin_active: {
  en: 'Active',
  ar: 'نشط',
  de: 'Aktiv'
},

admin_banned: {
  en: 'Banned',
  ar: 'محظور',
  de: 'Gesperrt'
},

admin_protected: {
  en: 'Protected',
  ar: 'محمي',
  de: 'Geschützt'
},

admin_ban_user: {
  en: 'Ban User',
  ar: 'حظر المستخدم',
  de: 'Benutzer sperren'
},

admin_unban_user: {
  en: 'Unban User',
  ar: 'إلغاء حظر المستخدم',
  de: 'Sperre aufheben'
},

admin_account: {
  en: 'Admin account',
  ar: 'حساب المدير',
  de: 'Administratorkonto'
},

admin_posts_title: {
  en: 'Posts',
  ar: 'المنشورات',
  de: 'Beiträge'
},

admin_posts_description: {
  en: 'Manage posts published on Friend Finder.',
  ar: 'إدارة المنشورات المنشورة على Friend Finder.',
  de: 'Veröffentlichte Beiträge auf Friend Finder verwalten.'
},

admin_delete_post: {
  en: 'Delete Post',
  ar: 'حذف المنشور',
  de: 'Beitrag löschen'
},

admin_no_posts: {
  en: 'No posts found.',
  ar: 'لا توجد منشورات.',
  de: 'Keine Beiträge gefunden.'
},

admin_contacts_title: {
  en: 'Contact Messages',
  ar: 'رسائل التواصل',
  de: 'Kontaktanfragen'
},

admin_contacts_description: {
  en: 'Review messages sent by users.',
  ar: 'مراجعة الرسائل المرسلة من المستخدمين.',
  de: 'Von Benutzern gesendete Nachrichten überprüfen.'
},

admin_write_reply: {
  en: 'Write your reply...',
  ar: 'اكتب ردك...',
  de: 'Antwort schreiben...'
},

admin_send_reply: {
  en: 'Send Reply',
  ar: 'إرسال الرد',
  de: 'Antwort senden'
},

admin_close: {
  en: 'Close',
  ar: 'إغلاق',
  de: 'Schließen'
},

admin_open: {
  en: 'OPEN',
  ar: 'مفتوح',
  de: 'OFFEN'
},

admin_replied: {
  en: 'REPLIED',
  ar: 'تم الرد',
  de: 'BEANTWORTET'
},

admin_closed: {
  en: 'CLOSED',
  ar: 'مغلق',
  de: 'GESCHLOSSEN'
},

admin_previous: {
  en: 'Previous',
  ar: 'السابق',
  de: 'Zurück'
},

admin_next: {
  en: 'Next',
  ar: 'التالي',
  de: 'Weiter'
},

admin_no_contacts: {
  en: 'No contact messages found.',
  ar: 'لا توجد رسائل تواصل.',
  de: 'Keine Kontaktanfragen gefunden.'
},

admin_no_notifications: {
  en: 'No notifications',
  ar: 'لا توجد إشعارات',
  de: 'Keine Benachrichtigungen'
},

notif_friend_accept: {
  en: 'accepted your friend request',
  ar: 'وافق على طلب صداقتك',
  de: 'hat deine Freundschaftsanfrage angenommen'
},

notif_commented: {
  en: 'commented on your post',
  ar: 'علّق على منشورك',
  de: 'hat deinen Beitrag kommentiert'
},

admin_reply_label: {
  en: 'Admin Reply',
  ar: 'رد الإدارة',
  de: 'Antwort der Administration'
},

contact_complaint: {
  en: 'Complaint',
  ar: 'شكوى',
  de: 'Beschwerde'
},

contact_suggestion: {
  en: 'Suggestion',
  ar: 'اقتراح',
  de: 'Vorschlag'
},

contact_bug: {
  en: 'Bug',
  ar: 'مشكلة',
  de: 'Fehler'
},

contact_other: {
  en: 'Other',
  ar: 'أخرى',
  de: 'Sonstiges'
},
};