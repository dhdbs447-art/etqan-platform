
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, onSnapshot, updateDoc, deleteDoc, serverTimestamp, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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
const defaultSettings={whatsapp:"966573664418",telegram:"https://t.me/Zak9090",username:"admin",password:"admin",themeName:"dark",fontName:"system"};
let app,db,settings={...defaultSettings},services=[...defaultServices],orders=[],reviews=[],members=[],currentMember=null,lastOrderIds=new Set(),deferredPrompt=null;
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
 document.body.classList.remove("light","royal","emerald","rose","gold","ocean","sunset","midnight","neon","pearl","coffee","forest","galaxy");
 if(settings.themeName && settings.themeName!=="dark") document.body.classList.add(settings.themeName);
 document.body.dataset.font=settings.fontName||"system";
}
function renderServices(){
 $("#servicesGrid").innerHTML=services.map((s,i)=>`<div class="card"><div class="icon">${serviceIcon(s)}</div><h3>${s.title}</h3><p>${s.desc}</p><div class="actions"><a class="primary" href="#order" data-service="${s.title}">اطلب الخدمة</a><a class="secondary" target="_blank" href="${settings.telegram}">تلجرام</a><a class="secondary whatsappMini" target="_blank" href="${waDirectLink()}">واتساب مباشر</a></div></div>`).join("");
 $$("#servicesGrid [data-service]").forEach(a=>a.onclick=()=>{$("#serviceSelect").value=a.dataset.service});
 $("#pricesGrid").innerHTML=services.map(s=>`<div class="price"><h3><span class="inlineIcon">${serviceIcon(s)}</span> ${s.title}</h3><b>${s.price||"حسب الطلب"}</b><p>${s.desc}</p></div>`).join("");
 serviceSelectOptions(); renderMemberDashboard();
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
 db=getFirestore(app);
}
function listenOrders(){
 const q=query(collection(db,"orders"),orderBy("createdAt","desc"));
 onSnapshot(q,snap=>{
  const oldCount=orders.length; orders=[];
  snap.forEach(d=>orders.push({id:d.id,...d.data()}));
  $("#ordersCount").textContent=orders.length;
  renderOrders(); renderDash(); renderMemberDashboard();
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

function listenMembers(){
 onSnapshot(query(collection(db,"members"),orderBy("createdAt","desc")),snap=>{
  members=[]; snap.forEach(d=>members.push({id:d.id,...d.data()}));
  renderMembersAdmin();
  if(currentMember){
    const fresh=members.find(m=>m.username===currentMember.username);
    if(fresh){ currentMember=fresh; localStorage.setItem("etqan_current_member",JSON.stringify(currentMember)); renderMemberDashboard(); }
  }
 });
}
function safeText(v){return String(v||"").replace(/[<>&"]/g,s=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[s]));}
function allowedForMember(member){
 const raw=(member?.allowedServices||"").trim();
 if(!raw) return services;
 const allowed=raw.split(",").map(x=>x.trim()).filter(Boolean);
 return services.filter(s=>allowed.includes(s.title));
}
function renderMemberDashboard(){
 const dash=$("#memberDashboard"); if(!dash) return;
 if(!currentMember){dash.classList.add("hidden"); $("#memberAuth")?.classList.remove("hidden"); return;}
 $("#memberAuth")?.classList.add("hidden"); dash.classList.remove("hidden");
 $("#memberNameView").textContent=currentMember.name||currentMember.username;
 const myOrders=orders.filter(o=>o.memberUsername===currentMember.username || (o.phone&&currentMember.phone&&o.phone===currentMember.phone));
 $("#memberOrdersCount").textContent=myOrders.length;
 $("#memberActiveCount").textContent=myOrders.filter(o=>o.status==="جاري التنفيذ"||o.status==="جديد").length;
 $("#memberDoneCount").textContent=myOrders.filter(o=>o.status==="مكتمل").length;
 const allowed=allowedForMember(currentMember);
 $("#memberServicesGrid").innerHTML=allowed.map(s=>`<div class="memberService"><div class="icon">${serviceIcon(s)}</div><h4>${safeText(s.title)}</h4><p>${safeText(s.desc)}</p><button class="primary" data-member-service="${safeText(s.title)}">طلب الخدمة</button></div>`).join("") || "<p class='hint'>لم يتم تحديد خدمات لهذا العضو بعد.</p>";
 $$("[data-member-service]").forEach(b=>b.onclick=()=>{location.hash="#order"; $("#serviceSelect").value=b.dataset.memberService; $("#orderForm").name.value=currentMember.name||""; $("#orderForm").phone.value=currentMember.phone||"";});
 $("#memberOrdersList").innerHTML=myOrders.map(o=>`<div class="orderItem"><h3>${safeText(o.orderNo||o.id)} <span class="status">${safeText(o.status||"جديد")}</span></h3><p>${safeText(o.service||"")}</p><p>${safeText(o.details||"")}</p></div>`).join("") || "<p class='hint'>لا توجد طلبات لهذا العضو.</p>";
}
function renderMembersAdmin(){
 const box=$("#membersAdminList"); if(!box) return;
 box.innerHTML=members.map(m=>`<div class="orderItem memberAdminItem">
  <h3>${safeText(m.name)} <span class="status">${m.active===false?"موقوف":"نشط"}</span></h3>
  <div class="meta"><span>@${safeText(m.username)}</span><span>${safeText(m.phone)}</span><span>${safeText(m.type)}</span></div>
  <label>الخدمات المخصصة<input data-member-services="${m.id}" value="${safeText(m.allowedServices||"")}" placeholder="مثال: حل الواجبات, عمل عروض تقديمية"></label>
  <div class="orderActions">
    <button class="secondary" data-save-member="${m.id}">حفظ الخدمات</button>
    <button class="secondary" data-toggle-member="${m.id}">${m.active===false?"تفعيل":"إيقاف"}</button>
    <button class="secondary" data-delete-member="${m.id}">حذف</button>
  </div>
 </div>`).join("") || "<p class='hint'>لا يوجد أعضاء حتى الآن.</p>";
 $$("[data-save-member]").forEach(b=>b.onclick=async()=>{const inp=document.querySelector(`[data-member-services="${b.dataset.saveMember}"]`); await updateDoc(doc(db,"members",b.dataset.saveMember),{allowedServices:inp.value}); toast("تم حفظ خدمات العضو")});
 $$("[data-toggle-member]").forEach(b=>b.onclick=async()=>{const m=members.find(x=>x.id===b.dataset.toggleMember); await updateDoc(doc(db,"members",b.dataset.toggleMember),{active:!(m.active!==false)});});
 $$("[data-delete-member]").forEach(b=>b.onclick=async()=>{if(confirm("حذف العضو؟")) await deleteDoc(doc(db,"members",b.dataset.deleteMember));});
}
function initMemberPortal(){
 const saved=localStorage.getItem("etqan_current_member");
 if(saved){try{currentMember=JSON.parse(saved)}catch(e){}}
 renderMemberDashboard();
 $$("[data-member-mode]").forEach(btn=>btn.onclick=()=>{
   $$("[data-member-mode]").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
   $("#memberLoginForm").classList.toggle("hidden",btn.dataset.memberMode!=="login");
   $("#memberRegisterForm").classList.toggle("hidden",btn.dataset.memberMode!=="register");
 });
 $("#memberRegisterForm")?.addEventListener("submit",async e=>{
   e.preventDefault();
   const fd=new FormData(e.target), username=String(fd.get("username")).trim();
   if(!username){toast("اكتب اسم مستخدم");return;}
   const exists=members.some(m=>m.username===username);
   if(exists){toast("اسم المستخدم موجود مسبقًا");return;}
   const data={name:fd.get("name"),phone:fd.get("phone"),username,password:fd.get("password"),type:fd.get("type"),active:true,allowedServices:"",createdAt:serverTimestamp()};
   const ref=await addDoc(collection(db,"members"),data);
   currentMember={id:ref.id,...data}; localStorage.setItem("etqan_current_member",JSON.stringify(currentMember));
   e.target.reset(); toast("تم إنشاء الحساب"); renderMemberDashboard();
 });
 $("#memberLoginForm")?.addEventListener("submit",e=>{
   e.preventDefault();
   const fd=new FormData(e.target), username=String(fd.get("username")).trim(), password=String(fd.get("password"));
   const member=members.find(m=>m.username===username && String(m.password)===password);
   if(!member){toast("بيانات العضو غير صحيحة");return;}
   if(member.active===false){toast("هذا الحساب موقوف مؤقتًا");return;}
   currentMember=member; localStorage.setItem("etqan_current_member",JSON.stringify(member)); e.target.reset(); toast("تم دخول العضو"); renderMemberDashboard();
 });
 $("#memberLogoutBtn")?.addEventListener("click",()=>{currentMember=null;localStorage.removeItem("etqan_current_member");renderMemberDashboard();toast("تم خروج العضو")});
}

$("#orderForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const fd=new FormData(e.target), oid=orderId(); toast("جاري حفظ الطلب...");
 const data={orderNo:oid,name:fd.get("name"),phone:fd.get("phone"),service:fd.get("service"),deadline:fd.get("deadline"),details:fd.get("details"),status:"جديد",memberUsername:currentMember?.username||"",memberName:currentMember?.name||"",createdAt:serverTimestamp()};
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
 <div class="meta"><span>${o.name||""}</span><span>${o.phone||""}</span><span>${o.service||""}</span><span>${o.deadline||""}</span><span>${o.memberUsername?("عضو: "+o.memberUsername):"عميل زائر"}</span></div>
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
$("#settingsForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);settings={...settings,whatsapp:fd.get("whatsapp")||settings.whatsapp,telegram:fd.get("telegram")||settings.telegram,username:fd.get("username")||settings.username,password:fd.get("password")||settings.password,themeName:fd.get("themeName")||settings.themeName,fontName:fd.get("fontName")||settings.fontName};await setDoc(doc(db,"settings","main"),settings);applyAppearance();toast("تم حفظ الإعدادات")});
$("#loginBtn").onclick=()=>{if($("#adminUser").value===settings.username&&$("#adminPass").value===settings.password){$("#loginBox").classList.add("hidden");$("#adminPanel").classList.remove("hidden");renderOrders();renderDash();renderAdminServices();renderMembersAdmin();$("#settingsForm").whatsapp.value=settings.whatsapp;$("#settingsForm").telegram.value=settings.telegram;$("#settingsForm").username.value=settings.username;$("#settingsForm").password.value=settings.password;$("#settingsForm").themeName.value=settings.themeName||"dark";$("#settingsForm").fontName.value=settings.fontName||"system"}else toast("بيانات الدخول غير صحيحة")};
$("#logoutBtn").onclick=()=>{$("#adminPanel").classList.add("hidden");$("#loginBox").classList.remove("hidden")};
$$(".tabs button").forEach(btn=>btn.onclick=()=>{$$(".tabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");$$(".tabContent").forEach(t=>t.classList.add("hidden"));$("#"+btn.dataset.tab+"Tab").classList.remove("hidden")});
$("#reviewForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);await addDoc(collection(db,"reviews"),{name:fd.get("name"),rating:fd.get("rating"),text:fd.get("text"),createdAt:serverTimestamp()});e.target.reset();toast("تم إضافة التقييم")});
function renderReviews(){ $("#reviewsList").innerHTML=reviews.map(r=>`<div class="review"><b>${"★".repeat(+r.rating)}</b><h3>${r.name}</h3><p>${r.text}</p></div>`).join("") || "<p class='hint'>لا توجد تقييمات بعد.</p>"}
$("#trackBtn").onclick=()=>{const v=$("#trackInput").value.trim();const o=orders.find(x=>x.orderNo===v);$("#trackResult").innerHTML=o?`<div class="orderItem"><h3>${o.orderNo}</h3><p>الحالة: <span class="status">${o.status}</span></p><p>الخدمة: ${o.service}</p></div>`:"<p class='hint'>لم يتم العثور على الطلب.</p>"}
function beep(){try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.value=.04;o.start();setTimeout(()=>{o.stop();c.close()},250)}catch(e){}}
$("#themeBtn").onclick=()=>{settings.themeName=document.body.classList.contains("light")?"dark":"light";applyAppearance();};

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").classList.remove("hidden")});
$("#installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null;$("#installBtn").classList.add("hidden")}};
if("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
(async()=>{try{initFirebase();await loadSettings();applyAppearance();await loadServices();listenOrders();listenReviews();listenMembers();initMemberPortal();renderServices();}catch(e){console.error(e);toast("تحقق من إعدادات Firebase والقواعد")}})();


// Elite Pro UI enhancements
window.addEventListener("load",()=>{
  setTimeout(()=>document.getElementById("loader")?.classList.add("hide"),450);
});
const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("show"); revealObserver.unobserve(entry.target);}
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));



/* Elite Pro V3 UI motion helpers */
function initEliteV3(){
  const progress=document.getElementById("scrollProgress");
  const toTop=document.getElementById("toTopBtn");
  const topbar=document.querySelector(".topbar");
  const update=()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const pct=max>0?(window.scrollY/max)*100:0;
    if(progress) progress.style.width=pct+"%";
    if(toTop) toTop.classList.toggle("show", window.scrollY>420);
    if(topbar) topbar.classList.toggle("scrolled", window.scrollY>20);
  };
  window.addEventListener("scroll",update,{passive:true});
  update();
  if(toTop) toTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
}
document.addEventListener("DOMContentLoaded",initEliteV3);


/* Free Pro Suite: AI FAQ, local analytics, browser notification, members */
function freeSuiteInit(){
  const getN=k=>Number(localStorage.getItem(k)||0);
  const setN=(k,v)=>localStorage.setItem(k,String(v));
  setN("etqan_visits", getN("etqan_visits")+1);

  const updateStats=()=>{
    const v=document.getElementById("localVisits");
    const c=document.getElementById("localClicks");
    const m=document.getElementById("localMembers");
    const o=document.getElementById("localOrdersMirror");
    if(v) v.textContent=getN("etqan_visits");
    if(c) c.textContent=getN("etqan_whatsapp_clicks");
    if(m) m.textContent=getN("etqan_members");
    if(o) o.textContent=(document.getElementById("ordersCount")?.textContent||"0");
  };
  setInterval(updateStats,1200); updateStats();

  ["floatingWhatsappBtn","directWhatsappBtn","heroWhatsappBtn"].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.addEventListener("click",()=>{setN("etqan_whatsapp_clicks",getN("etqan_whatsapp_clicks")+1);updateStats();});
  });

  const aiForm=document.getElementById("aiForm"), aiInput=document.getElementById("aiInput"), aiMessages=document.getElementById("aiMessages");
  const reply=(q)=>{
    q=(q||"").toLowerCase();
    if(q.includes("سعر")||q.includes("تكلفة")||q.includes("كم")) return "الأسعار تختلف حسب نوع الخدمة والمدة والمتطلبات. يمكنك فتح قسم الأسعار أو إرسال الطلب وسيتم الرد عليك بتفاصيل دقيقة.";
    if(q.includes("واجب")) return "خدمة حل الواجبات تشمل التنظيم والدقة حسب المطلوب. اكتب المادة والتفاصيل والموعد المطلوب.";
    if(q.includes("تقرير")||q.includes("مرحلي")||q.includes("نهائي")) return "ننفذ التقارير المرحلية والنهائية وفق تعليمات المشرف الأكاديمي مع تنسيق مرتب.";
    if(q.includes("عرض")||q.includes("بوربوينت")||q.includes("power")) return "نجهز عروض تقديمية بتصميم جذاب ومحتوى مرتب، ويمكن تحديد عدد الشرائح واللغة.";
    if(q.includes("سيفي")||q.includes("cv")||q.includes("سيرة")) return "نصمم سيرة ذاتية احترافية بصياغة مناسبة للتقديم الوظيفي أو الجامعي.";
    if(q.includes("طلب")||q.includes("كيف")) return "اختر الخدمة ثم اكتب اسمك ورقمك والتفاصيل، وسيُحفظ الطلب برقم خاص ويفتح واتساب برسالة جاهزة.";
    if(q.includes("واتس")||q.includes("تواصل")) return "يمكنك الضغط على زر واتساب مباشر للتواصل بدون تعبئة طلب.";
    return "أقدر أساعدك في الواجبات، العروض، الأبحاث، المشاريع، التقارير، السيرة الذاتية، التصاميم والبرمجة. اكتب نوع الخدمة المطلوبة.";
  };
  if(aiForm) aiForm.addEventListener("submit",e=>{
    e.preventDefault();
    const q=aiInput.value.trim(); if(!q) return;
    aiMessages.insertAdjacentHTML("beforeend",`<div class="userMsg">${q.replace(/[<>]/g,"")}</div>`);
    aiInput.value="";
    setTimeout(()=>{aiMessages.insertAdjacentHTML("beforeend",`<div class="botMsg">${reply(q)}</div>`); aiMessages.scrollTop=aiMessages.scrollHeight;},350);
    aiMessages.scrollTop=aiMessages.scrollHeight;
  });

  const memberForm=document.getElementById("memberForm");
  if(memberForm) memberForm.addEventListener("submit",async e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(memberForm).entries());
    try{
      if(db) await addDoc(collection(db,"members"),{...data,createdAt:serverTimestamp()});
    }catch(err){ console.warn(err); }
    setN("etqan_members",getN("etqan_members")+1);
    memberForm.reset(); updateStats(); toast("تم تسجيل العضوية المجانية");
  });

  const notifyBtn=document.getElementById("notifyBtn");
  if(notifyBtn) notifyBtn.addEventListener("click",async()=>{
    if(!("Notification" in window)){toast("المتصفح لا يدعم التنبيهات");return;}
    const p=await Notification.requestPermission();
    if(p==="granted"){ new Notification("منصة إتقان",{body:"تم تفعيل تنبيه المتصفح المجاني بنجاح"}); toast("تم تفعيل التنبيه");}
    else toast("لم يتم السماح بالتنبيهات");
  });
}
document.addEventListener("DOMContentLoaded",freeSuiteInit);
