
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
const defaultSettings={whatsapp:"966573664418",telegram:"https://t.me/Zak9090",username:"admin",password:"admin",themeName:"dark",fontName:"system"};
let app,db,settings={...defaultSettings},services=[...defaultServices],orders=[],reviews=[],members=[],chats=[],globalMessages=[],currentMember=null,lastOrderIds=new Set(),deferredPrompt=null,selectedChatMember=null,adminChatUnsub=null,memberChatUnsub=null,memberMetaUnsub=null,chatMetaUnsub=null;
let servicesQuery="", orderFilterQuery="", orderFilterStatus="", adminFailCount=0, adminLockedUntil=0, adminSessionTimer=null;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const toast=t=>{const el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2800)};
const setStatusBar=t=>{const el=$("#etqanStatusBar");if(!el)return;if(!t){el.classList.add("hidden");el.textContent="";return;}el.textContent=t;el.classList.remove("hidden");};
let audioCtx=null, audioUnlocked=false, adminOrderIds=new Set(), memberStatusCache=new Map(), chatUnreadCache=new Map();
function unlockAudio(){
  try{
    audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==="suspended") audioCtx.resume();
    audioUnlocked=true;
  }catch(e){}
}
["click","touchstart","keydown"].forEach(ev=>window.addEventListener(ev,unlockAudio,{once:true,passive:true}));
function tone(freq=880,duration=180,type="sine",delay=0,gain=.055){
  try{
    unlockAudio();
    if(!audioCtx) return;
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type=type; o.frequency.value=freq; g.gain.value=0;
    o.connect(g); g.connect(audioCtx.destination);
    const now=audioCtx.currentTime+delay;
    g.gain.setValueAtTime(0,now);
    g.gain.linearRampToValueAtTime(gain,now+.015);
    g.gain.exponentialRampToValueAtTime(.0001,now+duration/1000);
    o.start(now); o.stop(now+duration/1000+.03);
    if(navigator.vibrate) navigator.vibrate(40);
  }catch(e){}
}
function playClientSuccess(){ tone(660,120,"sine",0,.045); tone(990,180,"sine",.13,.045); }
function playAdminNewOrder(){ tone(880,140,"triangle",0,.055); tone(1175,180,"triangle",.15,.055); tone(880,120,"triangle",.36,.04); }
function playStatusSound(){ tone(520,120,"sine",0,.04); tone(760,160,"sine",.14,.04); }
function playChatSound(){ tone(740,110,"triangle",0,.05); tone(980,150,"triangle",.12,.05); }
function browserNotify(title,body){
  try{
    if(!("Notification" in window)) return;
    if(Notification.permission==="granted") new Notification(title,{body,icon:"assets/icon-192.svg",badge:"assets/icon-192.svg"});
    else if(Notification.permission==="default") Notification.requestPermission().then(p=>{if(p==="granted") new Notification(title,{body,icon:"assets/icon-192.svg"});});
  }catch(e){}
}
function isAdminOpen(){return !!document.querySelector("#adminPanel:not(.hidden)");}
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
 const q=(servicesQuery||"").trim().toLowerCase();
 const visible=services.filter(s=>!q || [s.title,s.desc,s.price].some(v=>String(v||"").toLowerCase().includes(q)));
 const empty=$("#servicesEmpty");
 if(empty) empty.classList.toggle("hidden", visible.length>0);
 $("#servicesGrid").innerHTML=visible.map((s,i)=>`<div class="card" data-service-card="1"><div class="icon">${serviceIcon(s)}</div><h3>${s.title}</h3><p>${s.desc}</p><div class="actions"><a class="primary" href="#order" data-service="${s.title}">اطلب الخدمة</a><a class="secondary" target="_blank" href="${settings.telegram}">تلجرام</a><a class="secondary whatsappMini" target="_blank" href="${waDirectLink()}">واتساب مباشر</a></div></div>`).join("");
 $$("#servicesGrid [data-service]").forEach(a=>a.onclick=()=>{$("#serviceSelect").value=a.dataset.service});
 $("#pricesGrid").innerHTML=visible.map(s=>`<div class="price"><h3><span class="inlineIcon">${serviceIcon(s)}</span> ${s.title}</h3><b>${s.price||"حسب الطلب"}</b><p>${s.desc}</p></div>`).join("");
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
  const prevOrders=orders;
  const prevById=new Map(prevOrders.map(o=>[o.id,o]));
  const hadInitial=adminOrderIds.size>0;
  orders=[];
  snap.forEach(d=>orders.push({id:d.id,...d.data()}));
  $("#ordersCount").textContent=orders.length;
  renderOrders(); renderDash(); renderMemberDashboard();

  const ids=new Set(orders.map(o=>o.id));
  const newOrders=orders.filter(o=>!adminOrderIds.has(o.id));
  if(hadInitial && newOrders.length){
    if(isAdminOpen()){
      playAdminNewOrder();
      toast("🔔 وصل طلب جديد");
      browserNotify("طلب جديد في منصة إتقان",`${newOrders[0].name||"عميل"} - ${newOrders[0].service||"خدمة"}`);
    }
  }
  adminOrderIds=ids;
  lastOrderIds=ids;

  if(currentMember){
    const mine=orders.filter(o=>o.memberUsername===currentMember.username || (o.phone&&currentMember.phone&&o.phone===currentMember.phone));
    mine.forEach(o=>{
      const old=memberStatusCache.get(o.id);
      const now=o.status||"جديد";
      if(old && old!==now){
        playStatusSound();
        toast(`تم تحديث طلبك: ${now}`);
        browserNotify("تحديث حالة طلبك",`${o.orderNo||o.id}: ${now}`);
      }
      memberStatusCache.set(o.id,now);
    });
  }
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

function chatDocId(member){return String(member?.id||member?.username||"").replace(/[^\w\-ء-ي]/g,"_");}
function chatMetaFor(member){
 return {memberId:chatDocId(member),memberDocId:member.id||"",memberUsername:member.username||"",memberName:member.name||member.username||"عضو",memberPhone:member.phone||""};
}
async function ensureChat(member){
 if(!member || !chatDocId(member)) return null;
 const id=chatDocId(member), ref=doc(db,"memberChats",id);
 await setDoc(ref,{...chatMetaFor(member),updatedAt:serverTimestamp(),adminUnread:0,memberUnread:0,lastMessage:"",lastSender:"system"}, {merge:true});
 return id;
}
function chatTime(v){
 try{ if(v?.toDate) return v.toDate().toLocaleString("ar-SA"); }catch(e){}
 return "";
}
function renderChatMessages(containerId,msgs,viewer,meta={}){
 const box=$(containerId); if(!box) return;
 box.innerHTML=msgs.map(m=>{
   const mine=(viewer==="admin"&&m.sender==="admin")||(viewer==="member"&&m.sender==="member");
   const readText = mine ? ((viewer==="admin" ? (meta.memberUnread||0)===0 : (meta.adminUnread||0)===0) ? "تمت القراءة" : "تم الإرسال") : "";
   return `<div class="chatBubble ${mine?"mine":"other"}">
     <div>${safeText(m.text)}</div>
     <small>${safeText(m.senderName|| (m.sender==="admin"?"المختص":"العضو"))} • ${chatTime(m.createdAt)} ${readText?(" • "+readText):""}</small>
   </div>`;
 }).join("") || "<p class='hint'>لا توجد رسائل بعد. ابدأ المحادثة الآن.</p>";
 box.scrollTop=box.scrollHeight;
}
function listenChatMetas(){
 if(chatMetaUnsub) chatMetaUnsub();
 chatMetaUnsub=onSnapshot(query(collection(db,"memberChats"),orderBy("updatedAt","desc")),snap=>{
   chats=[]; 
   snap.forEach(d=>chats.push({id:d.id,...d.data()}));
   const total=chats.reduce((s,c)=>s+Number(c.adminUnread||0),0);
   const badge=$("#adminChatBadge"); if(badge){badge.textContent=total; badge.classList.toggle("hidden",total===0);}
   const floating=$("#adminChatFloatBadge"); if(floating){floating.textContent=total; floating.classList.toggle("hidden",total===0);}
   chats.forEach(c=>{
     const old=chatUnreadCache.get(c.id)||0, now=Number(c.adminUnread||0);
     if(old<now && isAdminOpen()){playChatSound(); toast(`💬 رسالة جديدة من ${c.memberName||c.memberUsername||"عضو"}`); browserNotify("رسالة عضو جديدة", c.lastMessage||"وصلت رسالة جديدة");}
     chatUnreadCache.set(c.id,now);
   });
   renderAdminChatList();
   renderMembersAdmin();
 });
}
function renderAdminChatList(){
 const list=$("#adminChatList"); if(!list) return;
 const byId=new Map(chats.map(c=>[c.id,c]));
 const rows=members.map(m=>{
   const id=chatDocId(m), c=byId.get(id), unread=Number(c?.adminUnread||0);
   return `<button type="button" class="chatMemberBtn ${selectedChatMember&&chatDocId(selectedChatMember)===id?"active":""}" data-open-chat="${safeText(id)}">
     <b>${safeText(m.name||m.username)}</b>
     <span>@${safeText(m.username||"")}</span>
     ${unread?`<em>${unread}</em>`:""}
     <small>${safeText(c?.lastMessage||"لا توجد رسائل")}</small>
   </button>`;
 }).join("");
 list.innerHTML=rows || "<p class='hint'>لا يوجد أعضاء بعد.</p>";
 $$("[data-open-chat]").forEach(b=>b.onclick=()=>{const m=members.find(x=>chatDocId(x)===b.dataset.openChat); openAdminChat(m);});
}
async function openAdminChat(member){
 if(!member){toast("اختر عضوًا أولًا");return;}
 selectedChatMember=member;
 const id=await ensureChat(member);
 $("#adminChatTitle") && ($("#adminChatTitle").textContent=`محادثة: ${member.name||member.username}`);
 $("#adminChatEmpty")?.classList.add("hidden");
 $("#adminChatArea")?.classList.remove("hidden");
 await setDoc(doc(db,"memberChats",id),{adminUnread:0}, {merge:true});
 if(adminChatUnsub) adminChatUnsub();
 adminChatUnsub=onSnapshot(query(collection(db,"memberChats",id,"messages"),orderBy("createdAt","asc")),snap=>{
   const msgs=[]; snap.forEach(d=>msgs.push({id:d.id,...d.data()}));
   const meta=chats.find(c=>c.id===id)||{};
   renderChatMessages("#adminChatMessages",msgs,"admin",meta);
 });
 renderAdminChatList();
}
async function sendAdminChat(){
 const input=$("#adminChatInput");
 const text=input?.value?.trim();
 if(!text || !selectedChatMember) return;
 const id=await ensureChat(selectedChatMember);
 await addDoc(collection(db,"memberChats",id,"messages"),{text,sender:"admin",senderName:"المختص",createdAt:serverTimestamp(),readByAdmin:true,readByMember:false});
 await setDoc(doc(db,"memberChats",id),{...chatMetaFor(selectedChatMember),lastMessage:text,lastSender:"admin",updatedAt:serverTimestamp(),memberUnread:increment(1),adminUnread:0}, {merge:true});
 input.value="";
 playChatSound();
}
function initAdminChatUi(){
 $("#adminChatSend")?.addEventListener("click",sendAdminChat);
 $("#adminChatInput")?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendAdminChat();}});
}
function updateMemberChatBadge(meta={}){
 const badge=$("#memberChatBadge");
 const count=Number(meta.memberUnread||0);
 if(badge){badge.textContent=count; badge.classList.toggle("hidden",count===0);}
}
async function startMemberChat(){
 if(!currentMember) return;
 const id=await ensureChat(currentMember);
 if(memberMetaUnsub) memberMetaUnsub();
 memberMetaUnsub=onSnapshot(doc(db,"memberChats",id),snap=>{
   const meta=snap.exists()?snap.data():{};
   const old=chatUnreadCache.get("member_"+id)||0, now=Number(meta.memberUnread||0);
   if(old<now){playChatSound(); toast("💬 وصلت رسالة من المختص"); browserNotify("رسالة من منصة إتقان",meta.lastMessage||"وصلت رسالة جديدة");}
   chatUnreadCache.set("member_"+id,now);
   updateMemberChatBadge(meta);
 });
 if(memberChatUnsub) memberChatUnsub();
 memberChatUnsub=onSnapshot(query(collection(db,"memberChats",id,"messages"),orderBy("createdAt","asc")),snap=>{
   const msgs=[]; snap.forEach(d=>msgs.push({id:d.id,...d.data()}));
   const meta=chats.find(c=>c.id===id)||{};
   renderChatMessages("#memberChatMessages",msgs,"member",meta);
 });
}
async function openMemberChat(){
 if(!currentMember) return;
 const panel=$("#memberChatPanel"); if(panel) panel.classList.toggle("hidden");
 const id=await ensureChat(currentMember);
 await setDoc(doc(db,"memberChats",id),{memberUnread:0}, {merge:true});
}
async function sendMemberChat(){
 const input=$("#memberChatInput");
 const text=input?.value?.trim();
 if(!text || !currentMember) return;
 const id=await ensureChat(currentMember);
 await addDoc(collection(db,"memberChats",id,"messages"),{text,sender:"member",senderName:currentMember.name||currentMember.username,createdAt:serverTimestamp(),readByAdmin:false,readByMember:true});
 await setDoc(doc(db,"memberChats",id),{...chatMetaFor(currentMember),lastMessage:text,lastSender:"member",updatedAt:serverTimestamp(),adminUnread:increment(1),memberUnread:0}, {merge:true});
 input.value="";
 playChatSound();
}
function initMemberChatUi(){
 $("#memberChatToggle")?.addEventListener("click",openMemberChat);
 $("#memberChatSend")?.addEventListener("click",sendMemberChat);
 $("#memberChatInput")?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMemberChat();}});
}
function stopMemberChat(){
 if(memberChatUnsub) memberChatUnsub();
 if(memberMetaUnsub) memberMetaUnsub();
 memberChatUnsub=null; memberMetaUnsub=null;
}


// ===== رسائل المختص العامة للأعضاء =====
function globalMsgTime(v){
 try{ if(v?.toDate) return v.toDate().toLocaleString("ar-SA"); }catch(e){}
 try{ if(typeof v==="number") return new Date(v).toLocaleString("ar-SA"); }catch(e){}
 return "";
}
function updateGlobalBadges(){
 const unread = Math.max(0, globalMessages.length - Number(localStorage.getItem("etqan_global_read_count")||0));
 const mb=$("#memberGlobalBadge");
 if(mb){mb.textContent=unread; mb.classList.toggle("hidden", unread===0);}
 const ab=$("#adminGlobalBadge");
 if(ab){ab.textContent=globalMessages.length; ab.classList.toggle("hidden", globalMessages.length===0);}
}
function renderMemberGlobalMessages(){
 const box=$("#memberGlobalMessages");
 if(!box) return;
 box.innerHTML = globalMessages.map(m=>`<div class="chatBubble other">
   <div>${safeText(m.text)}</div>
   <small>المختص • ${globalMsgTime(m.createdAt)}</small>
 </div>`).join("") || "<p class='hint'>لا توجد رسائل عامة حاليًا.</p>";
 box.scrollTop=box.scrollHeight;
 updateGlobalBadges();
}
function renderAdminGlobalMessages(){
 const box=$("#globalMessagesAdminList");
 if(!box) return;
 box.innerHTML = globalMessages.map(m=>`<div class="orderItem">
   <h3>رسالة عامة</h3>
   <p>${safeText(m.text)}</p>
   <small>${globalMsgTime(m.createdAt)}</small>
   <div class="orderActions">
     <button class="secondary" data-edit-global="${m.id}">تعديل</button>
     <button class="secondary" data-delete-global="${m.id}">حذف</button>
   </div>
 </div>`).join("") || "<p class='hint'>لا توجد رسائل عامة بعد.</p>";
 $$("[data-edit-global]").forEach(b=>b.onclick=async()=>{
   const msg=globalMessages.find(x=>x.id===b.dataset.editGlobal);
   if(!msg) return;
   const text=prompt("تعديل الرسالة العامة", msg.text||"");
   if(text===null) return;
   await updateDoc(doc(db,"globalMessages",b.dataset.editGlobal),{text:text.trim(),updatedAt:serverTimestamp()});
   toast("تم تعديل الرسالة");
 });
 $$("[data-delete-global]").forEach(b=>b.onclick=async()=>{
   if(!confirm("حذف الرسالة العامة؟")) return;
   await deleteDoc(doc(db,"globalMessages",b.dataset.deleteGlobal));
   toast("تم حذف الرسالة");
 });
 updateGlobalBadges();
}
function listenGlobalMessages(){
 onSnapshot(query(collection(db,"globalMessages"),orderBy("createdAt","desc")),snap=>{
   const oldCount=globalMessages.length;
   globalMessages=[];
   snap.forEach(d=>globalMessages.push({id:d.id,...d.data()}));
   renderAdminGlobalMessages();
   renderMemberGlobalMessages();
   if(currentMember && globalMessages.length>oldCount && oldCount>0){
     playChatSound();
     toast("📩 وصلت رسالة عامة من المختص");
     browserNotify("رسالة من المختص", globalMessages[0]?.text || "وصلت رسالة عامة جديدة");
   }
 });
}
async function sendGlobalMessage(){
 const input=$("#globalMessageInput");
 const text=input?.value?.trim();
 if(!text) return;
 await addDoc(collection(db,"globalMessages"),{
   text,
   sender:"specialist",
   createdAt:serverTimestamp(),
   updatedAt:serverTimestamp()
 });
 input.value="";
 playChatSound();
 toast("تم إرسال الرسالة لجميع الأعضاء");
}
function initGlobalMessagesUi(){
 $("#globalMessageSend")?.addEventListener("click",sendGlobalMessage);
 $("#globalMessageInput")?.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendGlobalMessage();}});
 $("#memberGlobalToggle")?.addEventListener("click",()=>{
   $("#memberGlobalPanel")?.classList.toggle("hidden");
   localStorage.setItem("etqan_global_read_count", String(globalMessages.length));
   renderMemberGlobalMessages();
 });
}

function renderMemberDashboard(){
 const dash=$("#memberDashboard"); if(!dash) return;
 if(!currentMember){dash.classList.add("hidden"); $("#memberAuth")?.classList.remove("hidden"); stopMemberChat(); return;}
 $("#memberAuth")?.classList.add("hidden"); dash.classList.remove("hidden");
 $("#memberNameView").textContent=currentMember.name||currentMember.username;
 startMemberChat();
 renderMemberGlobalMessages();
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
    <button class="primary" data-chat-member="${m.id}">شات خاص ${Number((chats.find(c=>c.id===chatDocId(m))||{}).adminUnread||0)?`<span class="miniBadge">${Number((chats.find(c=>c.id===chatDocId(m))||{}).adminUnread||0)}</span>`:""}</button>
    <button class="secondary" data-save-member="${m.id}">حفظ الخدمات</button>
    <button class="secondary" data-toggle-member="${m.id}">${m.active===false?"تفعيل":"إيقاف"}</button>
    <button class="secondary" data-delete-member="${m.id}">حذف</button>
  </div>
 </div>`).join("") || "<p class='hint'>لا يوجد أعضاء حتى الآن.</p>";
 $$("[data-chat-member]").forEach(b=>b.onclick=()=>{const m=members.find(x=>x.id===b.dataset.chatMember); document.querySelector(`[data-tab="chatAdmin"]`)?.click(); openAdminChat(m);});
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
 $("#memberLogoutBtn")?.addEventListener("click",()=>{currentMember=null;localStorage.removeItem("etqan_current_member");stopMemberChat();renderMemberDashboard();toast("تم خروج العضو")});
 initMemberChatUi();
 initGlobalMessagesUi();
}

$("#orderForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const form=e.target, fd=new FormData(form), oid=orderId();
 const submitBtn=$("#submitOrderBtn"), state=$("#orderFormState"), phone=String(fd.get("phone")||"").trim(), details=String(fd.get("details")||"").trim(), trap=String(fd.get("website")||"").trim();
 if(trap){toast("تعذر إرسال الطلب"); return;}
 if(!/^((\+?966|0)?5\d{8})$/.test(phone.replace(/\s+/g,""))){toast("رقم الجوال غير صحيح"); return;}
 if(details.length<15){toast("أضف تفاصيل أكثر عن الطلب"); return;}
 if(submitBtn) submitBtn.disabled=true;
 if(state) state.textContent="جاري حفظ الطلب...";
 setStatusBar("جاري حفظ الطلب...");
 try{
  const data={orderNo:oid,name:fd.get("name"),phone:phone,service:fd.get("service"),deadline:fd.get("deadline"),details:details,status:"جديد",memberUsername:currentMember?.username||"",memberName:currentMember?.name||"",createdAt:serverTimestamp()};
  await addDoc(collection(db,"orders"),data);
  playClientSuccess();
  browserNotify("تم إرسال الطلب","تم حفظ طلبك بنجاح داخل منصة إتقان");
  const msg=`طلب جديد من منصة إتقان التعليمية
رقم الطلب: ${oid}
الاسم: ${data.name}
الجوال: ${data.phone}
الخدمة: ${data.service}
المدة المطلوبة: ${data.deadline||"غير محدد"}
التفاصيل:
${data.details}`;
  toast("تم حفظ الطلب وفتح واتساب");
  if(state) state.textContent="تم حفظ الطلب بنجاح، يتم الآن فتح واتساب.";
  window.open(waLink(msg),"_blank");
  form.reset(); if($("#detailsCount")) $("#detailsCount").textContent="0"; serviceSelectOptions();
 }catch(err){
  console.error(err);
  if(state) state.textContent="تعذر حفظ الطلب. تحقق من الاتصال أو قواعد Firestore.";
  toast("تعذر حفظ الطلب");
 }finally{
  if(submitBtn) submitBtn.disabled=false;
  setStatusBar("");
 }
});

function renderOrders(){
 const box=$("#ordersList"); if(!box) return;
 const q=(orderFilterQuery||"").trim().toLowerCase();
 const filtered=orders.filter(o=>{
  const matchStatus=!orderFilterStatus || (o.status||"جديد")===orderFilterStatus;
  const hay=[o.orderNo,o.id,o.name,o.phone,o.service,o.deadline,o.memberUsername,o.details].join(" ").toLowerCase();
  const matchQuery=!q || hay.includes(q);
  return matchStatus && matchQuery;
 });
 if(!filtered.length){box.innerHTML="<p class='hint'>لا توجد طلبات مطابقة حاليًا.</p>";return}
 box.innerHTML=filtered.map(o=>`<div class="orderItem">
 <h3>${o.orderNo||o.id} <span class="status">${o.status||"جديد"}</span></h3>
 <div class="meta"><span>${o.name||""}</span><span>${o.phone||""}</span><span>${o.service||""}</span><span>${o.deadline||""}</span><span>${o.memberUsername?("عضو: "+o.memberUsername):"عميل زائر"}</span></div>
 <p>${o.details||""}</p>
 <div class="orderActions">
 <button class="secondary" data-st="جديد" data-id="${o.id}">جديد</button><button class="secondary" data-st="جاري التنفيذ" data-id="${o.id}">جاري التنفيذ</button><button class="secondary" data-st="مكتمل" data-id="${o.id}">مكتمل</button>
 <button class="secondary" data-del="${o.id}">حذف</button>
 <a class="primary" target="_blank" href="${waLink(`متابعة طلب رقم ${o.orderNo||o.id}
الخدمة: ${o.service||""}
الحالة: ${o.status||"جديد"}`)}">واتساب</a>
 </div></div>`).join("");
 $$("[data-st]").forEach(b=>b.onclick=async()=>{await updateDoc(doc(db,"orders",b.dataset.id),{status:b.dataset.st}); playStatusSound(); toast("تم تحديث حالة الطلب");});
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
$("#settingsForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);settings={...settings,whatsapp:fd.get("whatsapp")||settings.whatsapp,telegram:fd.get("telegram")||settings.telegram,username:fd.get("username")||settings.username,password:fd.get("password")||settings.password,themeName:fd.get("themeName")||settings.themeName,fontName:fd.get("fontName")||settings.fontName};await setDoc(doc(db,"settings","main"),settings);applyAppearance();updateSecurityNote();toast("تم حفظ الإعدادات")});
function openAdminPanel(){
 $("#loginBox").classList.add("hidden");$("#adminPanel").classList.remove("hidden");
 sessionStorage.setItem("etqan_admin_open","1");
 renderOrders();renderDash();renderAdminServices();renderMembersAdmin();renderAdminGlobalMessages();$("#settingsForm").whatsapp.value=settings.whatsapp;$("#settingsForm").telegram.value=settings.telegram;$("#settingsForm").username.value=settings.username;$("#settingsForm").password.value=settings.password;$("#settingsForm").themeName.value=settings.themeName||"dark";$("#settingsForm").fontName.value=settings.fontName||"system";
 resetAdminTimer();
}
function closeAdminPanel(){
 $("#adminPanel").classList.add("hidden");$("#loginBox").classList.remove("hidden");
 sessionStorage.removeItem("etqan_admin_open");
 clearTimeout(adminSessionTimer);
}
function updateSecurityNote(){
 const note=$("#adminSecurityNote");
 if(!note) return;
 if(settings.username==="admin" && settings.password==="admin"){
  note.textContent="تنبيه أمني: ما زالت بيانات الدخول الافتراضية مفعلة. غيّرها من الإعدادات فورًا.";
  note.classList.remove("hidden");
 }else note.classList.add("hidden");
}
function resetAdminTimer(){
 clearTimeout(adminSessionTimer);
 adminSessionTimer=setTimeout(()=>{if(!$("#adminPanel").classList.contains("hidden")){closeAdminPanel();toast("تم تسجيل خروج لوحة المختص تلقائيًا بعد فترة خمول");}},1000*60*20);
}
["click","keydown","mousemove","touchstart"].forEach(ev=>document.addEventListener(ev,()=>{if(!$("#adminPanel").classList.contains("hidden")) resetAdminTimer();},{passive:true}));
$("#loginBtn").onclick=()=>{
 const now=Date.now();
 if(adminLockedUntil && now<adminLockedUntil){toast("تم إيقاف محاولات الدخول مؤقتًا، حاول بعد قليل");return;}
 if($("#adminUser").value===settings.username&&$("#adminPass").value===settings.password){adminFailCount=0;adminLockedUntil=0;openAdminPanel();}
 else{adminFailCount++; if(adminFailCount>=5){adminLockedUntil=Date.now()+1000*60*3;toast("تم إيقاف محاولات الدخول 3 دقائق");} else toast("بيانات الدخول غير صحيحة");}
};
$("#logoutBtn").onclick=()=>{closeAdminPanel()};
$$(".tabs button").forEach(btn=>btn.onclick=()=>{$$(".tabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");$$(".tabContent").forEach(t=>t.classList.add("hidden"));$("#"+btn.dataset.tab+"Tab").classList.remove("hidden")});
$("#reviewForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);await addDoc(collection(db,"reviews"),{name:fd.get("name"),rating:fd.get("rating"),text:fd.get("text"),createdAt:serverTimestamp()});e.target.reset();toast("تم إضافة التقييم")});
function renderReviews(){ $("#reviewsList").innerHTML=reviews.map(r=>`<div class="review"><b>${"★".repeat(+r.rating)}</b><h3>${r.name}</h3><p>${r.text}</p></div>`).join("") || "<p class='hint'>لا توجد تقييمات بعد.</p>"}
$("#trackBtn").onclick=()=>{const v=$("#trackInput").value.trim();const o=orders.find(x=>x.orderNo===v);$("#trackResult").innerHTML=o?`<div class="orderItem"><h3>${o.orderNo}</h3><p>الحالة: <span class="status">${o.status}</span></p><p>الخدمة: ${o.service}</p></div>`:"<p class='hint'>لم يتم العثور على الطلب.</p>"}
function beep(){playAdminNewOrder()}
function bindEnhancedUi(){
 const s=$("#servicesSearch"), clearBtn=$("#clearServicesSearch"), details=$("#orderDetails"), count=$("#detailsCount");
 if(s) s.addEventListener("input",e=>{servicesQuery=e.target.value||""; renderServices();});
 if(clearBtn) clearBtn.addEventListener("click",()=>{if(s){s.value=""; servicesQuery=""; renderServices(); s.focus();}});
 if(details) details.addEventListener("input",()=>{if(count) count.textContent=String(details.value.length);});
 if($("#ordersSearch")) $("#ordersSearch").addEventListener("input",e=>{orderFilterQuery=e.target.value||""; renderOrders();});
 if($("#ordersStatusFilter")) $("#ordersStatusFilter").addEventListener("change",e=>{orderFilterStatus=e.target.value||""; renderOrders();});
 if($("#exportOrdersBtn")) $("#exportOrdersBtn").addEventListener("click",()=>{
  const rows=orders.filter(o=>(!orderFilterStatus || (o.status||"جديد")===orderFilterStatus) && (!orderFilterQuery || [o.orderNo,o.id,o.name,o.phone,o.service,o.deadline,o.memberUsername,o.details].join(" ").toLowerCase().includes(orderFilterQuery.toLowerCase()))).map(o=>[o.orderNo||o.id,o.status||"جديد",o.name||"",o.phone||"",o.service||"",o.deadline||"",o.memberUsername||"",String(o.details||"").replace(/\n/g," ")]);
  const csv=["رقم الطلب,الحالة,الاسم,الجوال,الخدمة,الموعد,العضو,التفاصيل",...rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(","))].join("\n");
  const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="etqan-orders.csv"; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),700);
 });
 updateSecurityNote();
 if(sessionStorage.getItem("etqan_admin_open")==="1") openAdminPanel();
}
$("#themeBtn").onclick=()=>{settings.themeName=document.body.classList.contains("light")?"dark":"light";applyAppearance();};

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").classList.remove("hidden")});
$("#installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null;$("#installBtn").classList.add("hidden")}};
if("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js?v=1779923009");
(async()=>{try{initFirebase();await loadSettings();applyAppearance();await loadServices();listenOrders();listenReviews();listenMembers();
listenGlobalMessages();listenChatMetas();initAdminChatUi();initMemberPortal();renderServices();bindEnhancedUi();}catch(e){console.error(e);toast("تحقق من إعدادات Firebase والقواعد");bindEnhancedUi();}})();


// Elite Pro UI enhancements
const hideLoader=()=>document.getElementById("loader")?.classList.add("hide");
window.addEventListener("load",()=>{setTimeout(hideLoader,450);});
document.addEventListener("DOMContentLoaded",()=>setTimeout(hideLoader,1200));
setTimeout(hideLoader,3500);
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


/* ===== Mobile app navigation + role-safe admin access ===== */
function etqanSafeHideLoader(){
  const loader=document.getElementById("loader");
  if(loader) loader.classList.add("hide");
}
["DOMContentLoaded","load"].forEach(ev=>window.addEventListener(ev,()=>setTimeout(etqanSafeHideLoader,120)));
window.addEventListener("error",()=>setTimeout(etqanSafeHideLoader,80));
window.addEventListener("unhandledrejection",()=>setTimeout(etqanSafeHideLoader,80));

const ETQAN_ADMIN_MODE_KEY="etqan_admin_mode";
const ETQAN_NOTIFY_READ_KEY="etqan_notify_read";
function etqanSetAdminMode(on){
  document.body.classList.toggle("admin-mode",!!on);
  const adminSec=document.getElementById("admin");
  if(adminSec) adminSec.classList.toggle("roleHidden",!on);
  try{localStorage.setItem(ETQAN_ADMIN_MODE_KEY,on?"1":"0")}catch(e){}
  etqanUpdateBottomState();
}
function etqanIsAdminMode(){
  return !!document.body.classList.contains("admin-mode") || localStorage.getItem(ETQAN_ADMIN_MODE_KEY)==="1";
}
function etqanScrollTo(selector){
  const el = typeof selector==="string" ? document.querySelector(selector) : selector;
  if(!el) return;
  el.scrollIntoView({behavior:"smooth", block:"start"});
}
function etqanOpenTab(tabName){
  const btn=document.querySelector(`.tabs button[data-tab="${tabName}"]`);
  if(btn) btn.click();
}
function etqanAccountAction(forceAdmin=false){
  if(forceAdmin || etqanIsAdminMode()){
    etqanSetAdminMode(true);
    etqanScrollTo("#admin");
    if(document.getElementById("adminPanel")?.classList.contains("hidden")){
      document.getElementById("loginBox")?.classList.remove("hidden");
      document.getElementById("adminPanel")?.classList.add("hidden");
    }else{
      etqanOpenTab("orders");
    }
    return;
  }
  etqanScrollTo("#members");
}
function etqanReportsAction(){
  if(etqanIsAdminMode()){
    etqanSetAdminMode(true);
    etqanScrollTo("#admin");
    etqanOpenTab("orders");
    return;
  }
  if(currentMember){
    etqanScrollTo("#members");
    setTimeout(()=>document.getElementById("memberOrdersList")?.scrollIntoView({behavior:"smooth",block:"start"}),250);
  }else{
    etqanScrollTo("#track");
    document.getElementById("trackInput")?.focus();
  }
}
function etqanGoHome(){ window.scrollTo({top:0, behavior:"smooth"}); }
function etqanUpdateBottomState(active){
  const map={
    home:"bottomHomeBtn",
    services:"bottomServicesBtn",
    account:"bottomAccountBtn",
    reports:"bottomReportsBtn",
    more:"bottomMoreBtn"
  };
  Object.values(map).forEach(id=>document.getElementById(id)?.classList.remove("active","adminActive"));
  const target=active&&map[active]?document.getElementById(map[active]):null;
  if(target) target.classList.add("active");
  if(etqanIsAdminMode()){
    document.getElementById("bottomAccountBtn")?.classList.add("adminActive");
  }
}
function etqanUnreadNotifications(){
  const items=[];
  const memberChatCount=Number(document.getElementById("memberChatBadge")?.textContent||0);
  const memberGlobalCount=Number(document.getElementById("memberGlobalBadge")?.textContent||0);
  const adminChatCount=Number(document.getElementById("adminChatBadge")?.textContent||0);
  if(etqanIsAdminMode() && adminChatCount>0){
    items.push({id:"admin-chat",title:"رسائل الأعضاء",desc:`لديك ${adminChatCount} رسالة جديدة`,action:()=>{etqanSetAdminMode(true); etqanScrollTo("#admin"); etqanOpenTab("chatAdmin");}});
  }
  if(currentMember && memberChatCount>0){
    items.push({id:"member-chat",title:"رسائل المختص",desc:`لديك ${memberChatCount} رسالة غير مقروءة`,action:()=>{etqanScrollTo("#members"); setTimeout(()=>{try{openMemberChat();}catch(e){ document.getElementById("memberChatPanel")?.classList.remove("hidden");}},220);}});
  }
  if(currentMember && memberGlobalCount>0){
    items.push({id:"member-global",title:"تنبيهات المختص",desc:`لديك ${memberGlobalCount} إشعار جديد`,action:()=>{etqanScrollTo("#members"); setTimeout(()=>{const panel=document.getElementById("memberGlobalPanel"); if(panel?.classList.contains("hidden")) document.getElementById("memberGlobalToggle")?.click();},220);}});
  }
  return items.filter(item=>!etqanIsNotificationRead(item.id));
}
function etqanIsNotificationRead(id){
  try{
    const read=JSON.parse(localStorage.getItem(ETQAN_NOTIFY_READ_KEY)||"{}");
    return !!read[id];
  }catch(e){return false;}
}
function etqanMarkNotificationRead(id){
  try{
    const read=JSON.parse(localStorage.getItem(ETQAN_NOTIFY_READ_KEY)||"{}");
    read[id]=Date.now();
    localStorage.setItem(ETQAN_NOTIFY_READ_KEY,JSON.stringify(read));
  }catch(e){}
  etqanRefreshNotificationBadge();
}
function etqanClearStaleNotificationReads(){
  try{
    const read=JSON.parse(localStorage.getItem(ETQAN_NOTIFY_READ_KEY)||"{}");
    const activeIds=new Set(etqanUnreadNotifications().map(x=>x.id));
    Object.keys(read).forEach(k=>{ if(!activeIds.has(k)) delete read[k]; });
    localStorage.setItem(ETQAN_NOTIFY_READ_KEY,JSON.stringify(read));
  }catch(e){}
}
function etqanRefreshNotificationBadge(){
  const items=etqanUnreadNotifications();
  const badge=document.getElementById("etqan-style-badge");
  if(badge){
    badge.textContent=String(items.length);
    badge.classList.toggle("hidden", items.length===0);
  }
}
function etqanOpenSheet(id){
  document.getElementById("etqanOverlay")?.classList.remove("hidden");
  document.getElementById(id)?.classList.remove("hidden");
  etqanUpdateBottomState(id==="etqanQuickMenu"?"more":null);
}
function etqanCloseSheets(){
  document.getElementById("etqanOverlay")?.classList.add("hidden");
  document.querySelectorAll(".etqan-sheet").forEach(el=>el.classList.add("hidden"));
}
function etqanRenderNotifications(){
  etqanClearStaleNotificationReads();
  const box=document.getElementById("etqanNotificationsList");
  if(!box) return [];
  const items=etqanUnreadNotifications();
  if(!items.length){
    box.innerHTML='<div class="etqan-empty-note">لا توجد إشعارات جديدة الآن.</div>';
  }else{
    box.innerHTML=items.map(item=>`<button type="button" class="etqan-notice" data-notice-id="${item.id}"><div><b>${item.title}</b><p>${item.desc}</p></div><span>←</span></button>`).join("");
    box.querySelectorAll("[data-notice-id]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const item=items.find(x=>x.id===btn.dataset.noticeId);
        if(!item) return;
        etqanMarkNotificationRead(item.id);
        etqanCloseSheets();
        item.action();
      });
    });
  }
  etqanRefreshNotificationBadge();
  return items;
}
function etqanOpenNotificationsDirect(){
  const items=etqanRenderNotifications();
  if(items.length===1){
    etqanMarkNotificationRead(items[0].id);
    items[0].action();
    return;
  }
  etqanOpenSheet("etqanNotificationsSheet");
}
function etqanHandleQuickAction(action){
  etqanCloseSheets();
  if(action==="home"){ etqanGoHome(); etqanUpdateBottomState("home"); }
  if(action==="services"){ etqanScrollTo("#services"); etqanUpdateBottomState("services"); }
  if(action==="order"){ etqanScrollTo("#order"); etqanUpdateBottomState("more"); }
  if(action==="track"){ etqanScrollTo("#track"); etqanUpdateBottomState("reports"); }
  if(action==="account"){ etqanAccountAction(); etqanUpdateBottomState("account"); }
  if(action==="admin"){ etqanAccountAction(true); }
  if(action==="theme"){ document.getElementById("themeBtn")?.click(); }
}
function initEtqanMobileAppNav(){
  etqanSetAdminMode(false);
  document.getElementById("etqanOverlay")?.addEventListener("click",etqanCloseSheets);
  document.querySelectorAll("[data-close-sheet]").forEach(btn=>btn.addEventListener("click",etqanCloseSheets));
  document.getElementById("topMenuBtn")?.addEventListener("click",()=>etqanOpenSheet("etqanQuickMenu"));
  document.getElementById("bottomMoreBtn")?.addEventListener("click",e=>{e.preventDefault(); etqanOpenSheet("etqanQuickMenu");});
  document.getElementById("topNotifyBtn")?.addEventListener("click",()=>{etqanOpenNotificationsDirect();});
  document.querySelectorAll("[data-action]").forEach(el=>{
    el.addEventListener("click",()=>{
      const act=el.getAttribute("data-action");
      if(act==="whatsapp") return;
      etqanHandleQuickAction(act);
    });
  });
  document.getElementById("bottomHomeBtn")?.addEventListener("click",e=>{e.preventDefault(); etqanGoHome(); etqanUpdateBottomState("home");});
  document.getElementById("bottomServicesBtn")?.addEventListener("click",e=>{e.preventDefault(); etqanScrollTo("#services"); etqanUpdateBottomState("services");});
  document.getElementById("bottomReportsBtn")?.addEventListener("click",e=>{e.preventDefault(); etqanReportsAction(); etqanUpdateBottomState("reports");});
  const accountBtn=document.getElementById("bottomAccountBtn");
  if(accountBtn){
    let pressTimer=null,longPressed=false;
    const start=()=>{
      longPressed=false;
      clearTimeout(pressTimer);
      pressTimer=setTimeout(()=>{
        longPressed=true;
        toast("تم فتح وضع المختص");
        etqanSetAdminMode(true);
        etqanAccountAction(true);
      },700);
    };
    const cancel=()=>{clearTimeout(pressTimer);};
    accountBtn.addEventListener("touchstart",start,{passive:true});
    accountBtn.addEventListener("mousedown",start);
    ["touchend","touchcancel","mouseup","mouseleave"].forEach(ev=>accountBtn.addEventListener(ev,cancel));
    accountBtn.addEventListener("click",e=>{
      e.preventDefault();
      if(longPressed){ longPressed=false; return; }
      etqanAccountAction();
      etqanUpdateBottomState("account");
    });
  }
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible) return;
    const id=visible.target.id;
    if(id==="home") etqanUpdateBottomState("home");
    else if(id==="services"||id==="prices") etqanUpdateBottomState("services");
    else if(id==="track"||id==="admin") etqanUpdateBottomState("reports");
    else if(id==="members") etqanUpdateBottomState("account");
  },{threshold:.3});
  ["#home","#services","#prices","#track","#members","#admin"].forEach(sel=>{const el=document.querySelector(sel); if(el) observer.observe(el);});
  document.getElementById("sheetWhatsappBtn")?.setAttribute("href", waDirectLink());
  setInterval(etqanRefreshNotificationBadge,1200);
  etqanRefreshNotificationBadge();
}

document.addEventListener("DOMContentLoaded",()=>{
  initEtqanMobileAppNav();
  setTimeout(()=>{
    document.getElementById("sheetWhatsappBtn")?.setAttribute("href", waDirectLink());
    etqanRefreshNotificationBadge();
    renderServices?.();
  },500);
});
