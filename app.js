const defaults = {
  whatsapp: "966573664418",
  telegram: "https://t.me/Zak9090",
  adminUser: "admin",
  adminPass: "admin",
  services: [
    {id: crypto.randomUUID(), icon:"📝", title:"حل الواجبات", desc:"حل الواجبات بطريقة منظمة وواضحة مع مراعاة متطلبات المادة والتعليمات المطلوبة."},
    {id: crypto.randomUUID(), icon:"📊", title:"عمل عروض تقديمية", desc:"تصميم عروض تقديمية احترافية وجذابة بصياغة مرتبة وشرائح متناسقة."},
    {id: crypto.randomUUID(), icon:"🔎", title:"عمل أبحاث", desc:"إعداد أبحاث أكاديمية تشمل التنظيم، الصياغة، المراجع، والتنسيق حسب المطلوب."},
    {id: crypto.randomUUID(), icon:"🧩", title:"عمل مشاريع", desc:"تنفيذ مشاريع دراسية وتطبيقية بفكرة واضحة وخطة عمل ونتائج مرتبة."},
    {id: crypto.randomUUID(), icon:"📘", title:"التقارير المرحلية والنهائية", desc:"كتابة التقارير المرحلية والنهائية وفق تعليمات المشرف الأكاديمي وبصياغة أكاديمية منظمة."},
    {id: crypto.randomUUID(), icon:"📑", title:"عمل تقارير", desc:"تقارير للمواد الدراسية، التدريب الميداني، التدريب التطبيقي، وأنواع أخرى حسب متطلبات الجهة."},
    {id: crypto.randomUUID(), icon:"💼", title:"عمل سيفي احترافي", desc:"إعداد سيرة ذاتية احترافية ومنسقة تبرز المهارات والخبرات بشكل جذاب."},
    {id: crypto.randomUUID(), icon:"🎧", title:"حضور المحاضرات", desc:"متابعة حضور المحاضرات وفق الاتفاق وتقديم تحديثات عند الحاجة."},
    {id: crypto.randomUUID(), icon:"🎨", title:"عمل تصاميم", desc:"تصاميم تعليمية وتسويقية جذابة للمنشورات، الملفات، والعروض."},
    {id: crypto.randomUUID(), icon:"💻", title:"عمل برامج", desc:"برمجة حلول ومشاريع بسيطة ومتقدمة حسب المتطلبات الدراسية أو العملية."}
  ]
};

const LS_KEY = "etqan-platform-v1";
let state = structuredClone(defaults);
let usingCloud = false;
let cloudReady = false;
let db, docRef, getDoc, setDoc, onSnapshot;

const $ = (id) => document.getElementById(id);
const toast = (msg) => {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
};

const normalizeTelegram = (value) => {
  if (!value) return "#";
  if (value.startsWith("http")) return value;
  return `https://t.me/${value.replace("@","")}`;
};
const whatsappLink = (title = "") => `https://wa.me/${state.whatsapp}?text=${encodeURIComponent("مرحباً، أريد طلب خدمة من منصة إتقان التعليمية" + (title ? ": " + title : ""))}`;
const telegramLink = () => normalizeTelegram(state.telegram);

async function initCloud(){
  if (!window.ETQAN_FIREBASE || !window.ETQAN_FIREBASE.enabled) return false;
  try{
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const firestore = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");
    const app = initializeApp(window.ETQAN_FIREBASE.config);
    db = firestore.getFirestore(app);
    getDoc = firestore.getDoc;
    setDoc = firestore.setDoc;
    onSnapshot = firestore.onSnapshot;
    docRef = firestore.doc(db, "etqanPlatform", "main");
    const snap = await getDoc(docRef);
    if (snap.exists()) state = {...structuredClone(defaults), ...snap.data()};
    else await setDoc(docRef, state);
    usingCloud = true;
    cloudReady = true;
    onSnapshot(docRef, (s) => {
      if (s.exists()){
        state = {...structuredClone(defaults), ...s.data()};
        render();
      }
    });
    return true;
  }catch(e){
    console.warn(e);
    toast("تعذر الاتصال بالسحابة، سيتم استخدام تخزين المتصفح.");
    return false;
  }
}

function loadLocal(){
  const saved = localStorage.getItem(LS_KEY);
  if(saved){
    try{ state = {...structuredClone(defaults), ...JSON.parse(saved)}; }
    catch(e){ state = structuredClone(defaults); }
  } else localStorage.setItem(LS_KEY, JSON.stringify(state));
}
async function save(){
  localStorage.setItem(LS_KEY, JSON.stringify(state));
  if(usingCloud && cloudReady) await setDoc(docRef, state);
}
function render(){
  $("year").textContent = new Date().getFullYear();
  ["heroWhatsapp","bottomWhatsapp"].forEach(id => $(id).href = whatsappLink());
  ["heroTelegram","bottomTelegram"].forEach(id => $(id).href = telegramLink());
  $("whatsappInput").value = state.whatsapp;
  $("telegramInput").value = state.telegram;
  $("adminUserInput").value = state.adminUser;
  $("adminPassInput").value = state.adminPass;

  $("servicesGrid").innerHTML = state.services.map(s => `
    <article class="service-card">
      <div class="service-icon">${escapeHtml(s.icon)}</div>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.desc)}</p>
      <div class="card-actions">
        <a class="wa" href="${whatsappLink(s.title)}" target="_blank" rel="noopener">واتساب</a>
        <a class="tg" href="${telegramLink()}" target="_blank" rel="noopener">تلجرام</a>
      </div>
    </article>
  `).join("");

  $("adminServicesList").innerHTML = state.services.map(s => `
    <div class="admin-row">
      <span class="ico">${escapeHtml(s.icon)}</span>
      <div><strong>${escapeHtml(s.title)}</strong><br><small>${escapeHtml(s.desc)}</small></div>
      <div class="row-actions">
        <button class="small-btn edit" onclick="editService('${s.id}')">تعديل</button>
        <button class="small-btn delete" onclick="deleteService('${s.id}')">حذف</button>
      </div>
    </div>
  `).join("");
}
function escapeHtml(str=""){
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
function showAdmin(){
  $("adminPanel").classList.remove("hidden");
  location.hash = "adminPanel";
}
$("openAdminBtn").addEventListener("click", () => document.querySelector(".login-card").scrollIntoView({behavior:"smooth"}));
$("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if($("username").value.trim() === state.adminUser && $("password").value === state.adminPass){
    sessionStorage.setItem("etqan-admin", "1");
    showAdmin();
    toast("تم الدخول للوحة التحكم");
  } else toast("بيانات الدخول غير صحيحة");
});
$("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("etqan-admin");
  $("adminPanel").classList.add("hidden");
  toast("تم تسجيل الخروج");
});
$("settingsForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  state.whatsapp = $("whatsappInput").value.trim();
  state.telegram = $("telegramInput").value.trim();
  state.adminUser = $("adminUserInput").value.trim() || "admin";
  state.adminPass = $("adminPassInput").value || "admin";
  await save(); render(); toast("تم حفظ الإعدادات");
});
$("serviceForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const item = {
    id: $("serviceId").value || crypto.randomUUID(),
    title: $("serviceTitle").value.trim(),
    icon: $("serviceIcon").value.trim(),
    desc: $("serviceDesc").value.trim()
  };
  const idx = state.services.findIndex(x => x.id === item.id);
  if(idx >= 0) state.services[idx] = item; else state.services.push(item);
  await save(); render(); resetServiceForm(); toast("تم حفظ الخدمة");
});
$("cancelEditBtn").addEventListener("click", resetServiceForm);
window.editService = (id) => {
  const s = state.services.find(x => x.id === id);
  if(!s) return;
  $("serviceId").value = s.id;
  $("serviceTitle").value = s.title;
  $("serviceIcon").value = s.icon;
  $("serviceDesc").value = s.desc;
  $("serviceFormTitle").textContent = "تعديل خدمة";
  $("serviceTitle").focus();
};
window.deleteService = async (id) => {
  if(confirm("هل تريد حذف هذه الخدمة؟")){
    state.services = state.services.filter(x => x.id !== id);
    await save(); render(); toast("تم حذف الخدمة");
  }
};
function resetServiceForm(){
  $("serviceId").value = "";
  $("serviceTitle").value = "";
  $("serviceIcon").value = "";
  $("serviceDesc").value = "";
  $("serviceFormTitle").textContent = "إضافة خدمة";
}
(async function(){
  loadLocal();
  await initCloud();
  render();
  if(sessionStorage.getItem("etqan-admin") === "1") showAdmin();
})();
