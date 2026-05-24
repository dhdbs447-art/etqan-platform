# منصة إتقان التعليمية

موقع عربي جاهز للتشغيل باسم **منصة إتقان التعليمية**.

## التشغيل المباشر
افتح ملف `index.html` في المتصفح.

## بيانات الدخول الافتراضية
- اسم المستخدم: `admin`
- كلمة المرور: `admin`

يمكن تغييرها من لوحة التحكم داخل الصفحة.

## ماذا يمكنك تعديله من لوحة التحكم؟
- رقم الواتساب.
- رابط/مستخدم تلجرام.
- إضافة خدمة جديدة.
- تعديل خدمة.
- حذف خدمة.
- تغيير بيانات دخول الإدارة.

## التخزين
- يعمل مباشرة عبر LocalStorage: التعديلات تبقى محفوظة في نفس المتصفح.
- التخزين من أي متصفح مفعّل الآن عبر Firebase/Firestore.

## تفعيل Firebase للتخزين من أي متصفح
1. ادخل إلى Firebase Console وأنشئ مشروعًا.
2. أضف Web App.
3. فعّل Firestore Database.
4. انسخ إعدادات Firebase إلى ملف `firebase-config.js`.
5. غيّر:
```js
enabled: false
```
إلى:
```js
enabled: true
```

بعد ذلك أي تعديل من لوحة التحكم سيظهر من أي متصفح يستخدم نفس الموقع.


## حالة Firebase
تم إدخال إعدادات مشروع Firebase التالي:
- projectId: `etqan-platform-cfaa3`
- التخزين السحابي: مفعّل في `firebase-config.js`

## ملاحظة مهمة عن قواعد Firestore
إذا لم تحفظ التعديلات من جهاز آخر، افتح Firebase ثم:
Firestore Database → Rules

واستخدم مؤقتًا أثناء التجربة:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /etqanPlatform/{document} {
      allow read, write: if true;
    }
  }
}
```

بعد النشر النهائي يُفضّل حماية لوحة الإدارة بطريقة أقوى.
