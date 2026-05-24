
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, onSnapshot, updateDoc, deleteDoc, serverTimestamp, query, orderBy, getDocs, increment } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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
const defaultSettings={whatsapp:"966573664418",telegram:"https://t.me/Zak9090",username:"admin",password:"admin",themeName:"dark",fontName:"system",important1:"هام ✨ الطلب يُحفظ مباشرة برقم خاص داخل لوحة الإدارة",important2:"تنفيذ احترافي • متابعة سريعة • تواصل واتساب وتلجرام",important3:"منصة إتقان التعليمية لخدماتك الأكاديمية باحتراف"};
const defaultOffers=[
 {title:"باقة التقارير الأكاديمية",tag:"الأكثر طلبًا",desc:"تقرير مرحلي أو نهائي منسق وفق تعليمات المشرف الأكاديمي وبأسلوب احترافي."},
 {title:"عرض العروض التقديمية",tag:"تصميم فاخر",desc:"PowerPoint مرتب وجذاب مع أيقونات وألوان متناسقة ومحتوى واضح."},
 {title:"باقة المشاريع",tag:"إنجاز سريع",desc:"تنفيذ مشاريع دراسية وتطبيقية مع متابعة وتسليم مرتب حسب المطلوب."}
];
const defaultCoupons=[
 {code:"ETQAN10",value:"10%",desc:"خصم ترحيبي للطلبات الجديدة"},
 {code:"REPORT",value:"15%",desc:"خصم خاص على التقارير المرحلية والنهائية"},
 {code:"VIP",value:"هدية تنسيق",desc:"تنسيق إضافي مجاني للطلبات الكبيرة"}
];
let app,db,settings={...defaultSettings},services=[...defaultServices],offers=[...defaultOffers],coupons=[...defaultCoupons],orders=[],reviews=[],lastOrderIds=new Set(),deferredPrompt=null;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const toast=t=>{const el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2800)};
const orderId=()=>`ETQ-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${Math.floor(1000+Math.random()*9000)}`;
function enc(v){return encodeURIComponent(v||"").replace(/%0A/g,"%0A")}
function waLink(text){return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`}
function waDirectLink(){return `https://wa.me/${settings.whatsapp}`}
function serviceSelectOptions(){ $("#serviceSelect").innerHTML=services.map(s=>`<option>${s.title}</option>`).join("");}
function serviceIcon(s){return (s.icon||"📚").startsWith("data:image")?`<img src="${s.icon}" alt="" class="serviceImg">`:(s.icon||"📚")}
function updateContactButtons(){
 ["#directWhatsappBtn","#heroWhatsappBtn","#floatingWhatsappBtn"].forEach(sel=>{const el=$(sel); if(el) el.href=waDirectLink();});
}
function applyAppearance(){
 updateContactButtons();
 document.body.classList.remove("light","royal","emerald","rose","gold","ocean","sunset","midnight","neon","pearl","coffee","forest","galaxy","aurora","cyber","lava","mint");
 if(settings.themeName && settings.themeName!=="dark") document.body.classList.add(settings.themeName);
 document.body.dataset.font=settings.fontName||"system";
}
function updateImportantTexts(){
 const items=[settings.important1,settings.important2,settings.important3];
 ["#importantText1","#importantText2","#importantText3"].forEach((sel,i)=>{const el=$(sel); if(el) el.textContent=items[i]||defaultSettings[`important${i+1}`];});
}
async function updateVisitorCount(){
 try{
  const ref=doc(db,"stats","visitors");
  const key="etqanVisitorSeen";
  if(!localStorage.getItem(key)){await setDoc(ref,{count:increment(1)},{merge:true});localStorage.setItem(key,"1");}
  const snap=await getDoc(ref);
  const el=$("#visitorsCount"); if(el) el.textContent=(snap.exists()?snap.data().count:1)||1;
 }catch(e){const el=$("#visitorsCount"); if(el) el.textContent=localStorage.getItem("etqanVisits")||1;}
}
function renderMarketing(){
 const offersBox=$("#offersSlider");
 if(offersBox) offersBox.innerHTML=offers.map((o,i)=>`<div class="offerCard"><span>${o.tag||"عرض"}</span><h3>${o.title}</h3><p>${o.desc}</p><a href="#order" class="primary" data-offer="${o.title}">اطلب العرض</a></div>`).join("");
 $$("#offersSlider [data-offer]").forEach(a=>a.onclick=()=>{const sel=$("#serviceSelect"); if(sel && [...sel.options].some(o=>o.value===a.dataset.offer)) sel.value=a.dataset.offer;});
 const couponsBox=$("#couponsGrid");
 if(couponsBox) couponsBox.innerHTML=coupons.map(c=>`<div class="coupon"><div><b>${c.code}</b><span>${c.value}</span></div><p>${c.desc}</p><button class="secondary" data-copy="${c.code}">نسخ الكوبون</button></div>`).join("");
 $$("[data-copy]").forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);toast("تم نسخ الكوبون")}catch(e){toast(b.dataset.copy)}});
 renderAdminMarketing();
}
async function loadMarketing(){
 const snap=await getDoc(doc(db,"settings","marketing"));
 if(snap.exists()){offers=snap.data().offers||defaultOffers;coupons=snap.data().coupons||defaultCoupons;} else await setDoc(doc(db,"settings","marketing"),{offers,coupons});
 renderMarketing();
}
function renderAdminMarketing(){
 const ob=$("#offersAdminList"), cb=$("#couponsAdminList");
 if(ob) ob.innerHTML=offers.map((o,i)=>`<div class="orderItem"><h3>${o.title} <span class="status">${o.tag}</span></h3><p>${o.desc}</p><div class="orderActions"><button class="secondary" data-remove-offer="${i}">حذف</button></div></div>`).join("");
 if(cb) cb.innerHTML=coupons.map((c,i)=>`<div class="orderItem"><h3>${c.code} <span class="status">${c.value}</span></h3><p>${c.desc}</p><div class="orderActions"><button class="secondary" data-remove-coupon="${i}">حذف</button></div></div>`).join("");
 $$("[data-remove-offer]").forEach(b=>b.onclick=async()=>{offers.splice(+b.dataset.removeOffer,1);await setDoc(doc(db,"settings","marketing"),{offers,coupons});renderMarketing();toast("تم حذف العرض")});
 $$("[data-remove-coupon]").forEach(b=>b.onclick=async()=>{coupons.splice(+b.dataset.removeCoupon,1);await setDoc(doc(db,"settings","marketing"),{offers,coupons});renderMarketing();toast("تم حذف الكوبون")});
}

function renderServices(){
 $("#servicesGrid").innerHTML=services.map((s,i)=>`<div class="card"><div class="icon">${serviceIcon(s)}</div><h3>${s.title}</h3><p>${s.desc}</p><div class="actions"><a class="primary" href="#order" data-service="${s.title}">اطلب الخدمة</a><a class="secondary" target="_blank" href="${settings.telegram}">تلجرام</a><a class="secondary whatsappMini" target="_blank" href="${waDirectLink()}">واتساب مباشر</a></div></div>`).join("");
 $$("#servicesGrid [data-service]").forEach(a=>a.onclick=()=>{$("#serviceSelect").value=a.dataset.service});
 $("#pricesGrid").innerHTML=services.map(s=>`<div class="price"><h3><span class="inlineIcon">${serviceIcon(s)}</span> ${s.title}</h3><b>${s.price||"حسب الطلب"}</b><p>${s.desc}</p></div>`).join("");
 serviceSelectOptions();
}
async function loadSettings(){
 const snap=await getDoc(doc(db,"settings","main"));
 if(snap.exists()) settings={...defaultSettings,...snap.data()}; else await setDoc(doc(db,"settings","main"),settings);
 updateImportantTexts();
}
async function loadServices(){
 const snap=await getDoc(doc(db,"settings","services"));
 if(snap.exists()) services=snap.data().items||defaultServices; else await setDoc(doc(db,"settings","services"),{items:services});
 renderServices();
}
function initFirebase(){
 app=initializeApp(window.ETQAN_FIREBASE_CONFIG);
 db=getFirestore(app);
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
$("#orderForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const fd=new FormData(e.target), oid=orderId(); toast("جاري حفظ الطلب...");
 const data={orderNo:oid,name:fd.get("name"),phone:fd.get("phone"),service:fd.get("service"),deadline:fd.get("deadline"),details:fd.get("details"),status:"جديد",createdAt:serverTimestamp()};
 await addDoc(collection(db,"orders"),data);
 const msg=`طلب جديد من منصة إتقان التعليمية
رقم الطلب: ${oid}
الاسم: ${data.name}
الجوال: ${data.phone}
الخدمة: ${data.service}
المدة المطلوبة: ${data.deadline||"غير محدد"}
التفاصيل:
${data.details}`;
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
 $("#servicesAdminList").innerHTML=services.map((s,i)=>`<div class="orderItem"><h3><span class="inlineIcon">${serviceIcon(s)}</span> ${s.title}</h3><p>${s.desc}</p><b>${s.price}</b><div class="orderActions"><button class="secondary" data-remove-service="${i}">حذف</button></div></div>`).join("");
 $$("[data-remove-service]").forEach(b=>b.onclick=async()=>{services.splice(+b.dataset.removeService,1);await setDoc(doc(db,"settings","services"),{items:services});renderServices();renderAdminServices()});
}

$("#chooseIconBtn").onclick=()=>$("#serviceImageFile").click();
$("#serviceIconInput").addEventListener("input",e=>{$("#iconPreview").innerHTML=e.target.value||"📚"});
$("#serviceImageFile").addEventListener("change",e=>{const file=e.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>{$("#serviceIconInput").value=reader.result; $("#iconPreview").innerHTML=`<img src="${reader.result}" alt="">`;}; reader.readAsDataURL(file);});
$("#serviceForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);services.push({title:fd.get("title"),icon:fd.get("icon"),desc:fd.get("desc"),price:fd.get("price")});await setDoc(doc(db,"settings","services"),{items:services});renderServices();renderAdminServices();e.target.reset();toast("تمت إضافة الخدمة")});
$("#settingsForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);settings={...settings,whatsapp:fd.get("whatsapp")||settings.whatsapp,telegram:fd.get("telegram")||settings.telegram,username:fd.get("username")||settings.username,password:fd.get("password")||settings.password,themeName:fd.get("themeName")||settings.themeName,fontName:fd.get("fontName")||settings.fontName,important1:fd.get("important1")||settings.important1,important2:fd.get("important2")||settings.important2,important3:fd.get("important3")||settings.important3};await setDoc(doc(db,"settings","main"),settings);applyAppearance();updateImportantTexts();toast("تم حفظ الإعدادات")});
$("#loginBtn").onclick=()=>{if($("#adminUser").value===settings.username&&$("#adminPass").value===settings.password){$("#loginBox").classList.add("hidden");$("#adminPanel").classList.remove("hidden");renderOrders();renderDash();renderAdminServices();$("#settingsForm").whatsapp.value=settings.whatsapp;$("#settingsForm").telegram.value=settings.telegram;$("#settingsForm").username.value=settings.username;$("#settingsForm").password.value=settings.password;$("#settingsForm").themeName.value=settings.themeName||"dark";$("#settingsForm").fontName.value=settings.fontName||"system";$("#settingsForm").important1.value=settings.important1||"";$("#settingsForm").important2.value=settings.important2||"";$("#settingsForm").important3.value=settings.important3||"";renderAdminMarketing()}else toast("بيانات الدخول غير صحيحة")};
$("#logoutBtn").onclick=()=>{$("#adminPanel").classList.add("hidden");$("#loginBox").classList.remove("hidden")};
$$(".tabs button").forEach(btn=>btn.onclick=()=>{$$(".tabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");$$(".tabContent").forEach(t=>t.classList.add("hidden"));$("#"+btn.dataset.tab+"Tab").classList.remove("hidden")});
$("#offerForm")?.addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);offers.push({title:fd.get("title"),tag:fd.get("tag"),desc:fd.get("desc")});await setDoc(doc(db,"settings","marketing"),{offers,coupons});e.target.reset();renderMarketing();toast("تمت إضافة العرض")});
$("#couponForm")?.addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);coupons.push({code:fd.get("code"),value:fd.get("value"),desc:fd.get("desc")});await setDoc(doc(db,"settings","marketing"),{offers,coupons});e.target.reset();renderMarketing();toast("تمت إضافة الكوبون")});
$("#reviewForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);await addDoc(collection(db,"reviews"),{name:fd.get("name"),rating:fd.get("rating"),text:fd.get("text"),createdAt:serverTimestamp()});e.target.reset();toast("تم إضافة التقييم")});
function renderReviews(){ $("#reviewsList").innerHTML=reviews.map(r=>`<div class="review"><b>${"★".repeat(+r.rating)}</b><h3>${r.name}</h3><p>${r.text}</p></div>`).join("") || "<p class='hint'>لا توجد تقييمات بعد.</p>"}
$("#trackBtn").onclick=()=>{const v=$("#trackInput").value.trim();const o=orders.find(x=>x.orderNo===v);$("#trackResult").innerHTML=o?`<div class="orderItem"><h3>${o.orderNo}</h3><p>الحالة: <span class="status">${o.status}</span></p><p>الخدمة: ${o.service}</p></div>`:"<p class='hint'>لم يتم العثور على الطلب.</p>"}
function beep(){try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.value=.04;o.start();setTimeout(()=>{o.stop();c.close()},250)}catch(e){}}
$("#themeBtn").onclick=()=>{settings.themeName=document.body.classList.contains("light")?"dark":"light";applyAppearance();};

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").classList.remove("hidden")});
$("#installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null;$("#installBtn").classList.add("hidden")}};
if("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
(async()=>{try{initFirebase();await loadSettings();applyAppearance();await updateVisitorCount();await loadServices();await loadMarketing();listenOrders();listenReviews();renderServices();setTimeout(()=>$("#splash")?.classList.add("hide"),900);}catch(e){console.error(e);toast("تحقق من إعدادات Firebase والقواعد");setTimeout(()=>$("#splash")?.classList.add("hide"),900);}})();
