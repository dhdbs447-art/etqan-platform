
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, onSnapshot, updateDoc, deleteDoc, serverTimestamp, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const defaultServices=[
 {title:"حل الواجبات",icon:"📝",desc:"حل واجباتك بدقة وتنظيم مع شرح مختصر عند الحاجة.",price:"حسب المتطلبات"},
 {title:"عمل عروض تقديمية",icon:"📊",desc:"عروض PowerPoint احترافية بتصميم جذاب ومحتوى مرتب.",price:"يبدأ من 50 ريال"},
 {title:"عمل أبحاث",icon:"🔎",desc:"أبحاث أكاديمية منظمة وفق معايير التوثيق المطلوبة.",price:"حسب عدد الصفحات"},
 {title:"عمل مشاريع",icon:"🚀",desc:"تنفيذ مشاريع دراسية وتطبيقية مع ملفات وتسليم مرتب.",price:"حسب المشروع"},
 {title:"التقارير المرحلية والنهائية",icon:"📘",desc:"كتابة تقارير مرحلية ونهائية وفق تعليمات المشرف الأكاديمي.",price:"حسب التقرير"},
 {title:"تقارير المواد والتدريب",icon:"📄",desc:"تقارير المواد الدراسية، التدريب الميداني، التدريب التطبيقي وغيرها.",price:"حسب المتطلبات"},
 {title:"سيرة ذاتية احترافية",icon:"💼",desc:"تصميم CV احترافي بصياغة قوية وجاهز للتقديم.",price:"يبدأ من 40 ريال"},
 {title:"حضور المحاضرات",icon:"🎧",desc:"خدمة متابعة وحضور محاضرات حسب الترتيب المطلوب.",price:"حسب المدة"},
 {title:"عمل تصاميم",icon:"🎨",desc:"تصاميم سوشيال، شعارات، هويات، وبوسترات بجودة عالية.",price:"حسب التصميم"},
 {title:"عمل برامج",icon:"💻",desc:"برمجة واجبات ومشاريع ومواقع وتطبيقات بسيطة.",price:"حسب البرنامج"}
];
const defaultSettings={whatsapp:"966573664418",telegram:"https://t.me/Zak9090",username:"admin",password:"admin"};
let app,db,storage,settings={...defaultSettings},services=[...defaultServices],orders=[],reviews=[],lastOrderIds=new Set(),deferredPrompt=null;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const toast=t=>{const el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2800)};
const orderId=()=>`ETQ-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${Math.floor(1000+Math.random()*9000)}`;
function enc(v){return encodeURIComponent(v||"").replace(/%0A/g,"%0A")}
function waLink(text){return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`}
function serviceSelectOptions(){ $("#serviceSelect").innerHTML=services.map(s=>`<option>${s.title}</option>`).join("");}
function renderServices(){
 $("#servicesGrid").innerHTML=services.map((s,i)=>`<div class="card"><div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.desc}</p><div class="actions"><a class="primary" href="#order" data-service="${s.title}">اطلب الخدمة</a><a class="secondary" target="_blank" href="${settings.telegram}">تلجرام</a></div></div>`).join("");
 $$("#servicesGrid [data-service]").forEach(a=>a.onclick=()=>{$("#serviceSelect").value=a.dataset.service});
 $("#pricesGrid").innerHTML=services.map(s=>`<div class="price"><h3>${s.icon} ${s.title}</h3><b>${s.price||"حسب الطلب"}</b><p>${s.desc}</p></div>`).join("");
 serviceSelectOptions();
}
async function loadSettings(){
 const snap=await getDoc(doc(db,"settings","main"));
 if(snap.exists()) settings={...defaultSettings,...snap.data()}; else await setDoc(doc(db,"settings","main"),settings);
}
async function loadServices(){
 const snap=await getDoc(doc(db,"settings","services"));
 if(snap.exists()) services=snap.data().items||defaultServices; else await setDoc(doc(db,"settings","services"),{items:services});
 renderServices();
}
function initFirebase(){
 app=initializeApp(window.ETQAN_FIREBASE_CONFIG);
 db=getFirestore(app); storage=getStorage(app);
}
function listenOrders(){
 const q=query(collection(db,"orders"),orderBy("createdAt","desc"));
 onSnapshot(q,snap=>{
  const oldCount=orders.length; orders=[];
  snap.forEach(d=>orders.push({id:d.id,...d.data()}));
  $("#ordersCount").textContent=orders.length;
  renderOrders(); renderDash();
  const ids=new Set(orders.map(o=>o.id));
  if(oldCount && orders.some(o=>!lastOrderIds.has(o.id))){ beep(); toast("وصل طلب جديد"); }
  lastOrderIds=ids;
 });
}
function listenReviews(){
 onSnapshot(query(collection(db,"reviews"),orderBy("createdAt","desc")),snap=>{
  reviews=[]; snap.forEach(d=>reviews.push({id:d.id,...d.data()})); renderReviews();
 });
}
async function uploadFiles(files, oid){
 const urls=[];
 for(const file of files){
  const r=ref(storage,`orders/${oid}/${Date.now()}-${file.name}`);
  await uploadBytes(r,file); urls.push({name:file.name,url:await getDownloadURL(r)});
 }
 return urls;
}
$("#orderForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const fd=new FormData(e.target), oid=orderId();
 toast("جاري حفظ الطلب...");
 let files=[];
 try{ files=await uploadFiles($("#fileInput").files, oid); }catch(err){ console.warn(err); toast("تم حفظ الطلب بدون بعض الملفات، تأكد من صلاحيات Storage");}
 const data={orderNo:oid,name:fd.get("name"),phone:fd.get("phone"),service:fd.get("service"),deadline:fd.get("deadline"),details:fd.get("details"),files,status:"جديد",createdAt:serverTimestamp()};
 await addDoc(collection(db,"orders"),data);
 const fileText=files.length?`\nالملفات:\n${files.map(f=>f.url).join("\n")}`:"";
 const msg=`طلب جديد من منصة إتقان التعليمية
رقم الطلب: ${oid}
الاسم: ${data.name}
الجوال: ${data.phone}
الخدمة: ${data.service}
المدة المطلوبة: ${data.deadline||"غير محدد"}
التفاصيل:
${data.details}${fileText}`;
 toast("تم حفظ الطلب وفتح واتساب");
 window.open(waLink(msg),"_blank");
 e.target.reset(); serviceSelectOptions();
});
function renderOrders(){
 const box=$("#ordersList"); if(!box) return;
 if(!orders.length){box.innerHTML="<p class='hint'>لا توجد طلبات حتى الآن.</p>";return}
 box.innerHTML=orders.map(o=>`<div class="orderItem">
 <h3>${o.orderNo||o.id} <span class="status">${o.status||"جديد"}</span></h3>
 <div class="meta"><span>${o.name||""}</span><span>${o.phone||""}</span><span>${o.service||""}</span><span>${o.deadline||""}</span></div>
 <p>${o.details||""}</p>
 ${(o.files||[]).map(f=>`<a class="secondary" target="_blank" href="${f.url}">📎 ${f.name}</a>`).join(" ")}
 <div class="orderActions">
 <button class="secondary" data-st="جديد" data-id="${o.id}">جديد</button><button class="secondary" data-st="جاري التنفيذ" data-id="${o.id}">جاري التنفيذ</button><button class="secondary" data-st="مكتمل" data-id="${o.id}">مكتمل</button>
 <button class="secondary" data-del="${o.id}">حذف</button>
 <a class="primary" target="_blank" href="${waLink(`متابعة طلب رقم ${o.orderNo||o.id}\nالخدمة: ${o.service||""}\nالحالة: ${o.status||"جديد"}`)}">واتساب</a>
 </div></div>`).join("");
 $$("[data-st]").forEach(b=>b.onclick=()=>updateDoc(doc(db,"orders",b.dataset.id),{status:b.dataset.st}));
 $$("[data-del]").forEach(b=>b.onclick=async()=>{if(confirm("حذف الطلب؟")) await deleteDoc(doc(db,"orders",b.dataset.del))});
}
function renderDash(){
 const n=orders.filter(o=>(o.status||"جديد")==="جديد").length, p=orders.filter(o=>o.status==="جاري التنفيذ").length, d=orders.filter(o=>o.status==="مكتمل").length;
 $("#dashNew").textContent=n; $("#dashProgress").textContent=p; $("#dashDone").textContent=d;
}
function renderAdminServices(){
 $("#servicesAdminList").innerHTML=services.map((s,i)=>`<div class="orderItem"><h3>${s.icon} ${s.title}</h3><p>${s.desc}</p><b>${s.price}</b><div class="orderActions"><button class="secondary" data-remove-service="${i}">حذف</button></div></div>`).join("");
 $$("[data-remove-service]").forEach(b=>b.onclick=async()=>{services.splice(+b.dataset.removeService,1);await setDoc(doc(db,"settings","services"),{items:services});renderServices();renderAdminServices()});
}
$("#serviceForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);services.push({title:fd.get("title"),icon:fd.get("icon"),desc:fd.get("desc"),price:fd.get("price")});await setDoc(doc(db,"settings","services"),{items:services});renderServices();renderAdminServices();e.target.reset();toast("تمت إضافة الخدمة")});
$("#settingsForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);settings={whatsapp:fd.get("whatsapp")||settings.whatsapp,telegram:fd.get("telegram")||settings.telegram,username:fd.get("username")||settings.username,password:fd.get("password")||settings.password};await setDoc(doc(db,"settings","main"),settings);toast("تم حفظ الإعدادات")});
$("#loginBtn").onclick=()=>{if($("#adminUser").value===settings.username&&$("#adminPass").value===settings.password){$("#loginBox").classList.add("hidden");$("#adminPanel").classList.remove("hidden");renderOrders();renderDash();renderAdminServices();$("#settingsForm").whatsapp.value=settings.whatsapp;$("#settingsForm").telegram.value=settings.telegram;$("#settingsForm").username.value=settings.username;$("#settingsForm").password.value=settings.password}else toast("بيانات الدخول غير صحيحة")};
$("#logoutBtn").onclick=()=>{$("#adminPanel").classList.add("hidden");$("#loginBox").classList.remove("hidden")};
$$(".tabs button").forEach(btn=>btn.onclick=()=>{$$(".tabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");$$(".tabContent").forEach(t=>t.classList.add("hidden"));$("#"+btn.dataset.tab+"Tab").classList.remove("hidden")});
$("#reviewForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);await addDoc(collection(db,"reviews"),{name:fd.get("name"),rating:fd.get("rating"),text:fd.get("text"),createdAt:serverTimestamp()});e.target.reset();toast("تم إضافة التقييم")});
function renderReviews(){ $("#reviewsList").innerHTML=reviews.map(r=>`<div class="review"><b>${"★".repeat(+r.rating)}</b><h3>${r.name}</h3><p>${r.text}</p></div>`).join("") || "<p class='hint'>لا توجد تقييمات بعد.</p>"}
$("#trackBtn").onclick=()=>{const v=$("#trackInput").value.trim();const o=orders.find(x=>x.orderNo===v);$("#trackResult").innerHTML=o?`<div class="orderItem"><h3>${o.orderNo}</h3><p>الحالة: <span class="status">${o.status}</span></p><p>الخدمة: ${o.service}</p></div>`:"<p class='hint'>لم يتم العثور على الطلب.</p>"}
function beep(){try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.value=.04;o.start();setTimeout(()=>{o.stop();c.close()},250)}catch(e){}}
$("#themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("theme",document.body.classList.contains("light")?"light":"dark")};
if(localStorage.getItem("theme")==="light")document.body.classList.add("light");
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").classList.remove("hidden")});
$("#installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null;$("#installBtn").classList.add("hidden")}};
if("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
(async()=>{try{initFirebase();await loadSettings();await loadServices();listenOrders();listenReviews();renderServices();}catch(e){console.error(e);toast("تحقق من إعدادات Firebase والقواعد")}})();
