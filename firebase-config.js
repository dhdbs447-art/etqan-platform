/*
تم ربط منصة إتقان التعليمية بـ Firebase/Firestore.
أي تعديل من لوحة التحكم سيُحفظ سحابيًا ويظهر من أي جهاز ومتصفح عند فتح نفس رابط الموقع.

مهم:
- تأكد أن Firestore Database مفعّل.
- أثناء التجربة استخدم Rules بوضع test mode.
- بعد النشر النهائي يُفضّل تشديد قواعد الأمان.
*/
window.ETQAN_FIREBASE = {
  enabled: true,
  config: {
    apiKey: "AIzaSyB6pWhu0Vol0Opf0ZkijAkgVNCY0JzRogg",
    authDomain: "etqan-platform-cfaa3.firebaseapp.com",
    projectId: "etqan-platform-cfaa3",
    storageBucket: "etqan-platform-cfaa3.firebasestorage.app",
    messagingSenderId: "127982181198",
    appId: "1:127982181198:web:36614bc91bc667ff751c1f",
    measurementId: "G-C7SN7FMF0E"
  }
};
