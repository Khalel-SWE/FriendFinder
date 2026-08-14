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

  admin_panel: {
  en: 'Admin Panel',
  ar: 'لوحة الإدارة',
  de: 'Admin-Bereich'
},

admin_administration: {
  en: 'Administration',
  ar: 'الإدارة',
  de: 'Administration'
},

admin_dashboard: {
  en: 'Admin Dashboard',
  ar: 'لوحة تحكم الإدارة',
  de: 'Admin-Dashboard'
},

admin_dashboard_description: {
  en: 'Overview of the platform activity and statistics.',
  ar: 'نظرة عامة على نشاط المنصة وإحصائياتها.',
  de: 'Übersicht über die Plattformaktivität und Statistiken.'
},

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
admin_logout: { en: 'Logout', ar: 'تسجيل الخروج', de: 'Abmelden'}
};