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
  my_complaints: { en: 'My Complaints', ar: 'شكاويّ', de: 'Meine Beschwerden' },
  logout: { en: 'Log Out', ar: 'تسجيل الخروج', de: 'Abmelden' },
  composer_ph: { en: "What's on your mind?", ar: 'بتفكر في إيه؟', de: 'Was denkst du gerade?' },
  add_media: { en: 'Photo / Video', ar: 'صورة / فيديو', de: 'Foto / Video' },
  post_btn: { en: 'Post', ar: 'نشر', de: 'Posten' },
  comments_label: { en: 'comments', ar: 'تعليق', de: 'Kommentare' },
  people_you_may_know: { en: 'People you may know', ar: 'أشخاص ممكن تعرفهم', de: 'Leute, die du kennen könntest' },
  mutual_friends: { en: 'mutual friends', ar: 'أصدقاء مشتركين', de: 'gemeinsame Freunde' },
  add: { en: 'Add', ar: 'إضافة', de: 'Hinzufügen' },
};