
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, onSnapshot, updateDoc, deleteDoc, serverTimestamp, query, orderBy, getDocs, increment } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const defaultServices=[
 {title:"بحوث جامعية",icon:"🔎",desc:"بحث مرتب مع توثيق وتنسيق حسب تعليمات الدكتور أو الجامعة.",price:"يبدأ من 59 ريال"},
 {title:"عروض بوربوينت",icon:"📊",desc:"عرض مختصر وجذاب بتصميم مناسب للشرح والتسليم.",price:"يبدأ من 39 ريال"},
 {title:"تقارير وتكاليف",icon:"📘",desc:"تقارير مواد، تدريب، واجبات وتكاليف بصياغة منظمة.",price:"يبدأ من 49 ريال"},
 {title:"مشاريع تخرج",icon:"🚀",desc:"مساعدة منظمة في المشروع، التقرير، العرض، والملفات المطلوبة.",price:"حسب المشروع"},
 {title:"ترجمة وتلخيص",icon:"🌐",desc:"ترجمة، تلخيص، إعادة صياغة وتدقيق لغوي حسب المطلوب.",price:"يبدأ من 20 ريال"},
 {title:"واجبات وحلول",icon:"📝",desc:"حل واجبات وتكاليف مع ترتيب الإجابة وتوضيحها عند الحاجة.",price:"حسب المتطلبات"}
];
const defaultSettings={
 whatsapp:"966573664418",
 telegram:"https://t.me/Zak9090",
 username:"",
 password:"",
 themeName:"dark",
 fontName:"system",
 tickerEnabled:true,
 tickerText:"خدمات وتقارير وعروض مميزة طوال الأسبوع | خصومات على الباقات الأكثر طلبًا | تواصل سريع مع المختص عبر واتساب",
 tickerSpeed:"32",
 brandName:"منصة إتقان التعليمية",
 brandTagline:"خدمات تعليمية احترافية بلمسة إبداعية",
 heroBadge:"للطلاب في السعودية • سريع • واضح • سري",
 heroTitle:"بحوث، عروض، تقارير وواجبات جامعية بدون تعقيد",
 heroText:"اختر الخدمة خلال ثوانٍ، اكتب المطلوب، ويصلك الرد عبر واتساب لتحديد السعر والموعد بوضوح.",
 heroPrimaryLabel:"اطلب الآن",
 heroWhatsappLabel:"تواصل واتساب",
 directWhatsappLabel:"💬 مراسلة واتساب مباشرة بدون طلب",
 heroCardTitle:"رد سريع وتسعير واضح",
 heroCardDesc:"أرسل التفاصيل مرة واحدة، ونراجع طلبك لتحديد السعر والمدة قبل التنفيذ.",
 heroOrdersStatLabel:"طلب محفوظ",
 installTitle:"ثبت منصة إتقان على سطح الهاتف",
 installText:"دخول أسرع بلمسة واحدة مثل التطبيق.",
 installButtonLabel:"تثبيت الآن",
 offersTitle:"الأكثر طلباً",
 offersDesc:"خيارات مختصرة تساعدك تختار بسرعة.",
 whyTitle:"ليش الطلاب يطلبون من إتقان؟",
 whyDesc:"وضوح، سرعة، خصوصية، وتسليم منظم.",
 servicesTitle:"الخدمات الأكثر طلباً",
 servicesDesc:"اختر خدمتك وارسل التفاصيل مباشرة.",
 pricesTitle:"الأسعار التقديرية",
 pricesDesc:"السعر النهائي يعتمد على الحجم والمدة والمتطلبات.",
 orderTitle:"ارسل طلبك خلال دقيقة",
 orderDesc:"املأ البيانات الأساسية فقط، ثم كمل التواصل على واتساب.",
 trackTitle:"تتبع الطلب",
 trackDesc:"أدخل رقم الطلب لمعرفة حالته.",
 faqTitle:"الأسئلة الشائعة",
 faqDesc:"إجابات سريعة لأكثر الأسئلة تكرارًا.",
 reviewsTitle:"تقييم العملاء",
 reviewsDesc:"شارك رأيك في الخدمة.",
 aiTitle:"مساعد إتقان الذكي",
 aiDesc:"مساعد مجاني داخل المنصة يجيب على الأسئلة الشائعة ويوجه العميل للخدمة المناسبة.",
 membersTitle:"بوابة الأعضاء",
 membersDesc:"حساب خاص لكل عميل لمتابعة خدماته وطلباته من أي جهاز.",
 analyticsTitle:"إحصائيات مجانية",
 analyticsDesc:"إحصائيات محلية مجانية للزيارات والتفاعل على هذا الجهاز.",
 adminTitle:"دخول المختص",
 adminDesc:"لن تظهر أي أدوات أو أيقونات التحكم إلا بعد تسجيل دخول صحيح.",
 couponCode:"ETQAN10",
 couponText:"اذكر الكود في واتساب للحصول على تسعير مناسب حسب نوع الخدمة.",
 footerText:"© منصة إتقان التعليمية — جميع الحقوق محفوظة",
 orderHint:"بعد الإرسال سيفتح واتساب برسالة مرتبة فيها تفاصيل طلبك.",
 trackPlaceholder:"مثال: ETQ-20260524-1234",
 offersEnabled:true,
 whyEnabled:true,
 couponEnabled:true,
 faqEnabled:true,
 reviewsEnabled:true,
 aiEnabled:false,
 analyticsEnabled:false,
 directWhatsappEnabled:true,
 showTelegramButtons:true,
 servicesEnabled:true,
 pricesEnabled:true,
 trackEnabled:true,
 membersEnabled:true,
 brandColor:"#38bdf8",
 brandColor2:"#7c3aed",
 brandColor3:"#f472b6",
 appPrimaryColor:"#5b3f96",
 appSecondaryColor:"#38245e",
 appAccentColor:"#37d39b",
 offersData:`الأكثر طلبًا|بحث أو تقرير|صياغة وتنسيق وتوثيق حسب المطلوب.|يبدأ من 59 ريال
سريعة|عرض بوربوينت|شرائح مرتبة وجاهزة للشرح أو التسليم.|يبدأ من 39 ريال
عاجلة|واجب أو تكليف|حل وتنظيم للواجبات والتكاليف القصيرة.|حسب المتطلبات`,
 whyData:`⚡ رد سريع|نراجع طلبك ونوضح السعر والمدة عبر واتساب.
🔒 سرية كاملة|بياناتك وتفاصيل طلبك خاصة ولا تظهر للآخرين.
📌 وضوح قبل الاتفاق|السعر والمدة والمتطلبات تتحدد قبل بدء التنفيذ.
✅ تعديلات حسب الاتفاق|نستقبل الملاحظات ضمن نطاق الطلب المتفق عليه.`,
 faqData:`كم السعر؟|السعر يبدأ من الأرقام الموضحة ويتغير حسب عدد الصفحات، الشرائح، المدة، والمتطلبات.
هل أقدر أطلب مستعجل؟|نعم، اكتب الموعد المطلوب وسيتم توضيح إمكانية التنفيذ والسعر.
هل فيه سرية؟|نعم، يتم التعامل مع تفاصيل الطلب بسرية وخصوصية.
كيف أرسل الملفات؟|بعد إرسال الطلب سيفتح واتساب ويمكنك إرفاق الملفات مباشرة.`
};

let app,db,settings={...defaultSettings},services=[...defaultServices],orders=[],reviews=[],members=[],chats=[],globalMessages=[],currentMember=null,notificationDocs=[],lastOrderIds=new Set(),deferredPrompt=null,canInstallPwa=false,selectedChatMember=null,adminChatUnsub=null,memberChatUnsub=null,memberMetaUnsub=null,chatMetaUnsub=null,notificationsUnsub=null;
let etqanFirebaseAvailable=false;
function etqanHasDb(){ return !!db; }
function etqanHideLoader(){ try{ document.getElementById("loader")?.classList.add("hide"); }catch(_e){} }
function etqanWarnOfflineMode(msg="تم تشغيل المنصة بالواجهة الأساسية. تعذر الاتصال بالخدمة السحابية حاليًا."){
  try{
    console.warn(msg);
    toast(msg);
  }catch(_e){}
}
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const toast=t=>{const el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2800)};
function settingsBool(v,fallback=true){if(v===undefined||v===null||v==="") return fallback; return !(v===false||String(v)==="false"||String(v)==="0"||String(v).toLowerCase()==="off");}
function etqanRows(raw,fallback=""){const source=String(raw||fallback||"").trim(); return source?source.split(/\n+/).map(x=>x.trim()).filter(Boolean):[];}
function etqanParts(line,count){const arr=String(line||"").split("|").map(x=>x.trim()); while(arr.length<count) arr.push(""); return arr.slice(0,count);}
function etqanSetText(sel,val){const el=$(sel); if(el && val!=null) el.textContent=String(val);}
function etqanToggleSel(sel,on){document.querySelectorAll(sel).forEach(el=>el.classList.toggle("hidden",!on));}
function etqanApplyThemePalette(){
 const root=document.documentElement;
 [["--brand",settings.brandColor||defaultSettings.brandColor],["--brand2",settings.brandColor2||defaultSettings.brandColor2],["--brand3",settings.brandColor3||defaultSettings.brandColor3],["--etqan-app-primary",settings.appPrimaryColor||defaultSettings.appPrimaryColor],["--etqan-app-primary2",settings.appSecondaryColor||defaultSettings.appSecondaryColor],["--etqan-app-accent",settings.appAccentColor||defaultSettings.appAccentColor]].forEach(([k,v])=>root.style.setProperty(k,v));
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',settings.appPrimaryColor||settings.brandColor||'#7c3aed');
}
function etqanRenderCmsContent(){
 etqanSetText('.brand h1',settings.brandName||defaultSettings.brandName);
 etqanSetText('.brand p',settings.brandTagline||defaultSettings.brandTagline);
 etqanSetText('#etqan-app-style-header h1',settings.brandName||defaultSettings.brandName);
 etqanSetText('#etqan-app-style-header p',settings.brandTagline||defaultSettings.brandTagline);
 etqanSetText('#home .badge',settings.heroBadge||defaultSettings.heroBadge);
 etqanSetText('#home .heroTitleAnimated',settings.heroTitle||defaultSettings.heroTitle);
 etqanSetText('#home .heroText p',settings.heroText||defaultSettings.heroText);
 etqanSetText('#home .heroActions .primary',settings.heroPrimaryLabel||defaultSettings.heroPrimaryLabel);
 etqanSetText('#heroWhatsappBtn',settings.heroWhatsappLabel||defaultSettings.heroWhatsappLabel);
 etqanSetText('#directWhatsappBtn',settings.directWhatsappLabel||defaultSettings.directWhatsappLabel);
 etqanSetText('#home .heroCard h3',settings.heroCardTitle||defaultSettings.heroCardTitle);
 etqanSetText('#home .heroCard p',settings.heroCardDesc||defaultSettings.heroCardDesc);
 etqanSetText('#home .heroCard .stats span',settings.heroOrdersStatLabel||defaultSettings.heroOrdersStatLabel);
 etqanSetText('#homeInstallCard .homeInstallBody strong',settings.installTitle||defaultSettings.installTitle);
 etqanSetText('#homeInstallCard .homeInstallBody p',settings.installText||defaultSettings.installText);
 etqanSetText('#homeInstallBtn',settings.installButtonLabel||defaultSettings.installButtonLabel);
 etqanSetText('.couponBox h2',settings.couponCode||defaultSettings.couponCode);
 etqanSetText('.couponBox p',settings.couponText||defaultSettings.couponText);
 etqanSetText('#order .hint',settings.orderHint||defaultSettings.orderHint);
 const track=$('#trackInput'); if(track) track.placeholder=settings.trackPlaceholder||defaultSettings.trackPlaceholder;
 etqanSetText('footer',settings.footerText||defaultSettings.footerText);
 [
  ['#offers .sectionHead', 'offersTitle', 'offersDesc'],
  ['#why .sectionHead', 'whyTitle', 'whyDesc'],
  ['#services .sectionHead', 'servicesTitle', 'servicesDesc'],
  ['#prices .sectionHead', 'pricesTitle', 'pricesDesc'],
  ['#order .sectionHead', 'orderTitle', 'orderDesc'],
  ['#track .sectionHead', 'trackTitle', 'trackDesc'],
  ['#faq .sectionHead', 'faqTitle', 'faqDesc'],
  ['#reviews .sectionHead', 'reviewsTitle', 'reviewsDesc'],
  ['#ai .sectionHead', 'aiTitle', 'aiDesc'],
  ['#members .sectionHead', 'membersTitle', 'membersDesc'],
  ['#analytics .sectionHead', 'analyticsTitle', 'analyticsDesc'],
  ['#admin .sectionHead', 'adminTitle', 'adminDesc']
 ].forEach(([base,titleKey,descKey])=>{ etqanSetText(`${base} h2`, settings[titleKey]||defaultSettings[titleKey]); etqanSetText(`${base} p`, settings[descKey]||defaultSettings[descKey]); });
 const offerGrid=document.querySelector('.offerGrid');
 if(offerGrid){offerGrid.innerHTML=etqanRows(settings.offersData,defaultSettings.offersData).map(line=>{const [badge,title,desc,meta]=etqanParts(line,4); return `<div class="offerCard"><span>${safeText(badge)}</span><h3>${safeText(title)}</h3><p>${safeText(desc)}</p><b>${safeText(meta)}</b></div>`;}).join('');}
 const whyGrid=document.querySelector('.whyGrid');
 if(whyGrid){whyGrid.innerHTML=etqanRows(settings.whyData,defaultSettings.whyData).map(line=>{const [title,desc]=etqanParts(line,2); return `<div><strong>${safeText(title)}</strong><p>${safeText(desc)}</p></div>`;}).join('');}
 const faq=document.querySelector('.faqList');
 if(faq){faq.innerHTML=etqanRows(settings.faqData,defaultSettings.faqData).map(line=>{const [q,a]=etqanParts(line,2); return `<details><summary>${safeText(q)}</summary><p>${safeText(a)}</p></details>`;}).join('');}
 etqanToggleSel('#offers',settingsBool(settings.offersEnabled,true));
 etqanToggleSel('#why',settingsBool(settings.whyEnabled,true));
 etqanToggleSel('.coupon.section',settingsBool(settings.couponEnabled,true));
 etqanToggleSel('#faq',settingsBool(settings.faqEnabled,true));
 etqanToggleSel('#reviews',settingsBool(settings.reviewsEnabled,true));
 etqanToggleSel('#ai',settingsBool(settings.aiEnabled,true));
 etqanToggleSel('#analytics',settingsBool(settings.analyticsEnabled,true));
 etqanToggleSel('#services',settingsBool(settings.servicesEnabled,true));
 etqanToggleSel('#prices',settingsBool(settings.pricesEnabled,true));
 etqanToggleSel('#track',settingsBool(settings.trackEnabled,true));
 etqanToggleSel('#members',settingsBool(settings.membersEnabled,true));
 const directOn=settingsBool(settings.directWhatsappEnabled,true);
 ['#directWhatsappBtn','#heroWhatsappBtn','#floatingWhatsappBtn'].forEach(sel=>$(sel)?.classList.toggle('hidden',!directOn));
 try{ etqanEnsureHeroCreativeActions(); }catch(e){}
 try{ if(etqanIsMobileShell()) etqanRebuildMobileDesign(); }catch(e){}
}
function etqanStorageGet(key, fallback=null){
  try{
    const value=localStorage.getItem(key);
    return value===null ? fallback : value;
  }catch(e){
    return fallback;
  }
}
function etqanStorageSet(key, value){
  try{ localStorage.setItem(key, value); }catch(e){}
}
function etqanStorageRemove(key){
  try{ localStorage.removeItem(key); }catch(e){}
}
function etqanSaveMemberSession(member){
  if(!member){ etqanStorageRemove("etqan_current_member"); return; }
  try{
    etqanStorageSet("etqan_current_member", JSON.stringify(member));
  }catch(e){}
}
function etqanReadMemberSession(){
  const raw=etqanStorageGet("etqan_current_member","");
  if(!raw) return null;
  try{
    return JSON.parse(raw);
  }catch(e){
    etqanStorageRemove("etqan_current_member");
    return null;
  }
}
function etqanHasAdminSession(){
  return etqanStorageGet("etqan_admin_last_login","") === "1";
}
function etqanSaveAdminSession(on){
  if(on) etqanStorageSet("etqan_admin_last_login","1");
  else etqanStorageRemove("etqan_admin_last_login");
}
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
function etqanTimestampLabel(value){
 try{
  if(value?.seconds) return new Date(value.seconds*1000).toLocaleString('ar-SA');
  if(value instanceof Date) return value.toLocaleString('ar-SA');
 }catch(e){}
 return 'غير محدد';
}
function etqanCsvCell(v){return `"${String(v==null?'':v).replace(/"/g,'""')}"`;}
function etqanDownloadFile(fileName,content,mime='text/plain;charset=utf-8'){
 const blob=new Blob([content],{type:mime});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');
 a.href=url; a.download=fileName; document.body.appendChild(a); a.click();
 setTimeout(()=>{URL.revokeObjectURL(url); a.remove();},1200);
}
function etqanOrderStatusCounts(list=orders){
 return {
  total:list.length,
  fresh:list.filter(o=>(o.status||'جديد')==='جديد').length,
  progress:list.filter(o=>(o.status||'')==='جاري التنفيذ').length,
  done:list.filter(o=>(o.status||'')==='مكتمل').length
 };
}
function etqanMemberStatusCounts(list=members){
 return {
  total:list.length,
  active:list.filter(m=>m.active!==false).length,
  stopped:list.filter(m=>m.active===false).length,
  vip:list.filter(m=>String(m.type||'').includes('VIP')||String(m.type||'').includes('مميز')).length
 };
}
function etqanRenderSummaryStrip(target,items=[]){
 const box=$(target); if(!box) return;
 box.innerHTML=items.map(item=>`<div class="summaryChip ${item.tone||''}"><strong>${safeText(item.value)}</strong><span>${safeText(item.label)}</span></div>`).join('');
}
function etqanExportOrdersCsv(){
 const rows=[['رقم الطلب','الاسم','الجوال','الخدمة','الحالة','الموعد','اسم المستخدم','التاريخ','التفاصيل']];
 orders.forEach(o=>rows.push([o.orderNo||o.id||'',o.name||'',o.phone||'',o.service||'',o.status||'جديد',o.deadline||'',o.memberUsername||'',etqanTimestampLabel(o.createdAt),String(o.details||'').replace(/\n/g,' ') ]));
 etqanDownloadFile('etqan-orders.csv', rows.map(r=>r.map(etqanCsvCell).join(',')).join('\n'), 'text/csv;charset=utf-8');
 toast('تم تجهيز ملف الطلبات CSV');
}
function etqanExportMembersCsv(){
 const rows=[['الاسم','اسم المستخدم','الجوال','العضوية','الحالة','الخدمات المخصصة']];
 members.forEach(m=>rows.push([m.name||'',m.username||'',m.phone||'',m.type||'',m.active===false?'موقوف':'نشط',m.allowedServices||'']));
 etqanDownloadFile('etqan-members.csv', rows.map(r=>r.map(etqanCsvCell).join(',')).join('\n'), 'text/csv;charset=utf-8');
 toast('تم تجهيز ملف الأعضاء CSV');
}
function etqanBuildBackupPayload(){
 return {
  exportedAt:new Date().toISOString(),
  settings:{...settings},
  services:[...services]
 };
}
function etqanExportBackup(){
 const payload=JSON.stringify(etqanBuildBackupPayload(),null,2);
 const area=$('#backupPayloadInput');
 if(area) area.value=payload;
 etqanDownloadFile('etqan-backup.json', payload, 'application/json;charset=utf-8');
 toast('تم إنشاء نسخة احتياطية كاملة');
}
async function etqanImportBackup(){
 const area=$('#backupPayloadInput');
 const raw=String(area?.value||'').trim();
 if(!raw){toast('ألصق JSON أولًا داخل مربع النسخة الاحتياطية'); return;}
 try{
  const parsed=JSON.parse(raw);
  const incomingSettings={...defaultSettings,...settings,...(parsed.settings||{})};
  const incomingServices=Array.isArray(parsed.services)&&parsed.services.length ? parsed.services : services;
  settings=incomingSettings;
  services=incomingServices;
  await setDoc(doc(db,'settings','main'),settings);
  await setDoc(doc(db,'settings','services'),{items:services});
  applyAppearance(); renderServices(); renderOrders(); renderMembersAdmin(); renderAdminServices(); etqanFillSettingsForm();
  toast('تم استيراد النسخة الاحتياطية بنجاح');
 }catch(err){
  console.error(err);
  toast('تعذر قراءة ملف النسخة الاحتياطية');
 }
}
function etqanCopyText(text, ok='تم النسخ'){
 const value=String(text||'').trim();
 if(!value){toast('لا يوجد محتوى للنسخ'); return;}
 navigator.clipboard?.writeText(value).then(()=>toast(ok)).catch(()=>toast('تعذر النسخ من المتصفح'));
}

function setAuthFeedback(targetId,message,type="info"){
  const box=document.getElementById(targetId);
  if(!box) return;
  box.textContent=message||"";
  box.className=`authFeedback ${type} ${message?"show":""}`.trim();
}
function requestBrowserNotifications(){
  try{
    if(!("Notification" in window)) return;
    if(Notification.permission==="default"){
      Notification.requestPermission().catch(()=>null);
    }
  }catch(e){}
}
function etqanTickerItems(){
  const raw=String(settings.tickerText||"").trim();
  const source=raw || defaultSettings.tickerText;
  return source.split(/\n|\|/).map(x=>x.trim()).filter(Boolean);
}
function renderManagedTicker(){
  const strip=document.querySelector(".importantStrip");
  const moving=document.querySelector(".importantStrip .movingText");
  if(!strip || !moving) return;
  const enabled = settings.tickerEnabled!==false && String(settings.tickerEnabled)!=="false";
  strip.classList.toggle("hidden", !enabled);
  if(!enabled) return;
  const items=etqanTickerItems();
  moving.innerHTML=[...items,...items].map(item=>`<span>${safeText(item)}</span>`).join("");
  const speed=Math.max(14, Number(settings.tickerSpeed||32));
  moving.style.animationDuration=`${speed}s`;
}
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
 renderManagedTicker();
 document.body.classList.remove("light","royal","emerald","rose","gold","ocean","sunset","midnight","neon","pearl","coffee","forest","galaxy");
 if(settings.themeName && settings.themeName!=="dark") document.body.classList.add(settings.themeName);
 document.body.dataset.font=settings.fontName||"system";
 etqanApplyThemePalette();
 etqanRenderCmsContent();
}
function renderServices(){
 const showTelegram=settingsBool(settings.showTelegramButtons,true);
 try{ etqanEnsureHeroCreativeActions(); }catch(e){}
 try{ etqanEnsureServiceExplorerUi(); }catch(e){}
 const visible=etqanVisibleServices();
 try{ etqanRenderServiceExplorerMeta(visible); }catch(e){}
 $("#servicesGrid").innerHTML=visible.map((s,i)=>{const cat=etqanGuessServiceCategory(s); return `<div class="card"><div class="serviceTopMeta"><span class="serviceBadge">${safeText(cat)}</span><span class="hint">${safeText(s.price||'حسب الطلب')}</span></div><div class="icon">${serviceIcon(s)}</div><h3>${s.title}</h3><p>${s.desc}</p><div class="actions"><a class="primary" href="#order" data-service="${s.title}">اطلب الخدمة</a>${showTelegram?`<a class="secondary" target="_blank" href="${settings.telegram}">تلجرام</a>`:""}<a class="secondary whatsappMini" target="_blank" href="${waDirectLink()}">واتساب مباشر</a></div></div>`;}).join("") || `<div class="panel mini servicesEmptyState"><h3>ما لقينا خدمة مطابقة الآن</h3><p class="hint">جرّب البحث بكلمة مختلفة أو اضغط إعادة ضبط لعرض كل الخدمات.</p><button type="button" class="secondary" id="servicesEmptyResetBtn">إظهار كل الخدمات</button></div>`;
 $$("#servicesGrid [data-service]").forEach(a=>a.onclick=()=>{$("#serviceSelect").value=a.dataset.service});
 $("#pricesGrid").innerHTML=visible.map(s=>`<div class="price"><div class="serviceTopMeta"><span class="serviceBadge">${safeText(etqanGuessServiceCategory(s))}</span></div><h3><span class="inlineIcon">${serviceIcon(s)}</span> ${s.title}</h3><b>${s.price||"حسب الطلب"}</b><p>${s.desc}</p></div>`).join("") || "<p class='hint'>لا توجد نتائج حاليًا.</p>";
 $("#servicesEmptyResetBtn")?.addEventListener('click',()=>{etqanServiceSearch=''; etqanServiceFilter='الكل'; const input=document.getElementById('servicesSearchInput'); if(input) input.value=''; renderServices();});
 serviceSelectOptions(); renderMemberDashboard();
}
async function loadSettings(){
 if(!etqanHasDb()) return settings;
 const snap=await getDoc(doc(db,"settings","main"));
 if(snap.exists()) settings={...defaultSettings,...snap.data()}; else await setDoc(doc(db,"settings","main"),settings);
 return settings;
}
async function loadServices(){
 if(!etqanHasDb()){
  services=[...defaultServices];
  renderServices();
  return services;
 }
 const snap=await getDoc(doc(db,"settings","services"));
 if(snap.exists()) services=snap.data().items||defaultServices; else await setDoc(doc(db,"settings","services"),{items:services});
 renderServices();
 return services;
}
function initFirebase(){
 try{
  app=initializeApp(window.ETQAN_FIREBASE_CONFIG);
  db=getFirestore(app);
  etqanFirebaseAvailable=!!db;
 }catch(error){
  etqanFirebaseAvailable=false;
  db=null;
  console.error("Firebase init failed", error);
 }
 return etqanFirebaseAvailable;
}
function listenOrders(){
 if(!etqanHasDb()) return;
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
    const mine=orders.filter(o=>{
      const sameId=currentMember.id && o.memberId && o.memberId===currentMember.id;
      const sameUser=o.memberUsername===currentMember.username;
      const samePhone=o.phone&&currentMember.phone&&o.phone===currentMember.phone;
      return !!(sameId||sameUser||samePhone);
    });
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
 if(!etqanHasDb()) return;
 onSnapshot(query(collection(db,"reviews"),orderBy("createdAt","desc")),snap=>{
  reviews=[]; snap.forEach(d=>reviews.push({id:d.id,...d.data()})); renderReviews();
 });
}

function listenMembers(){
 if(!etqanHasDb()) return;
 onSnapshot(query(collection(db,"members"),orderBy("createdAt","desc")),snap=>{
  members=[]; snap.forEach(d=>members.push({id:d.id,...d.data()}));
  renderMembersAdmin();
  if(currentMember){
    const fresh=members.find(m=>m.username===currentMember.username || (currentMember.id && m.id===currentMember.id));
    if(fresh){
      currentMember=fresh;
      etqanSaveMemberSession(currentMember);
      renderMemberDashboard();
    }else if(currentMember?.username){
      renderMemberDashboard();
    }else{
      currentMember=null;
      etqanSaveMemberSession(null);
      renderMemberDashboard();
    }
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
 if(!etqanHasDb()) return;
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
 await etqanCreateNotification({target:`member:${selectedChatMember.id||selectedChatMember.username}`,kind:"admin-chat",title:"رسالة من المختص",desc:text,memberDocId:selectedChatMember.id||"",memberUsername:selectedChatMember.username||""});
 input.value="";
 playChatSound();
 toast("تم إرسال الرسالة للعضو");
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
 await etqanCreateNotification({target:"admin",kind:"member-chat",title:"رسالة جديدة من عضو",desc:text,memberDocId:currentMember.id||"",memberUsername:currentMember.username||""});
 input.value="";
 playChatSound();
 toast("تم إرسال رسالتك للمختص");
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
 if(!etqanHasDb()) return;
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
 await etqanCreateNotification({target:"all-members",kind:"global-message",title:"إشعار من المختص",desc:text});
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
 $$("[data-member-service]").forEach(b=>b.onclick=()=>{
   etqanScrollTo("#order");
   try{ etqanActivateView?.("services"); }catch(e){}
   const sel=$("#serviceSelect"); if(sel) sel.value=b.dataset.memberService;
   if($("#orderForm")?.name) $("#orderForm").name.value=currentMember.name||"";
   if($("#orderForm")?.phone) $("#orderForm").phone.value=currentMember.phone||"";
   setTimeout(()=>{ try{ $("#orderForm")?.details?.focus(); }catch(e){} },220);
   toast(`تم اختيار خدمة: ${b.dataset.memberService}`);
 });
 $("#memberOrdersList").innerHTML=myOrders.map(o=>`<div class="orderItem"><h3>${safeText(o.orderNo||o.id)} <span class="status">${safeText(o.status||"جديد")}</span></h3><p>${safeText(o.service||"")}</p><p>${safeText(o.details||"")}</p></div>`).join("") || "<p class='hint'>لا توجد طلبات لهذا العضو.</p>";
}
function renderMembersAdmin(){
 const box=$("#membersAdminList"); if(!box) return;
 const q=String($("#membersSearchInput")?.value||"").trim().toLowerCase();
 const filter=String($("#membersStatusFilter")?.value||"").trim();
 const list=members.filter(m=>{
  const text=`${m.name||""} ${m.username||""} ${m.phone||""} ${m.type||""}`.toLowerCase();
  const activeState=m.active===false?'stopped':'active';
  return (!q || text.includes(q)) && (!filter || filter===activeState);
 });
 const counts=etqanMemberStatusCounts(list);
 etqanRenderSummaryStrip('#membersSummaryStrip',[
  {label:'إجمالي المعروض',value:counts.total,tone:'violet'},
  {label:'نشط',value:counts.active,tone:'green'},
  {label:'موقوف',value:counts.stopped,tone:'rose'},
  {label:'مميز/VIP',value:counts.vip,tone:'gold'}
 ]);
 box.innerHTML=list.map(m=>{
  const memberOrders=orders.filter(o=>o.memberUsername===m.username || (o.phone&&m.phone&&o.phone===m.phone));
  const chatMeta=(chats.find(c=>c.id===chatDocId(m))||{});
  return `<div class="orderItem memberAdminItem luxuryOrderCard"><div class="luxuryOrderHead"><div><h3>${safeText(m.name)} <span class="status ${m.active===false?'is-stopped':'is-live'}">${m.active===false?'موقوف':'نشط'}</span></h3><div class="meta orderMetaGrid"><span>@${safeText(m.username)}</span><span>${safeText(m.phone)}</span><span>${safeText(m.type||'عضوية عادية')}</span><span>طلبات العضو: ${memberOrders.length}</span></div></div><button class="secondary smallBtn" data-copy-member="${m.id}">نسخ بيانات الدخول</button></div><label>الخدمات المخصصة<input data-member-services="${m.id}" value="${safeText(m.allowedServices||"")}" placeholder="مثال: حل الواجبات, عمل عروض تقديمية"></label><div class="orderActions adminMiniActions"><button class="primary" data-chat-member="${m.id}">شات خاص ${Number(chatMeta.adminUnread||0)?`<span class="miniBadge">${Number(chatMeta.adminUnread||0)}</span>`:""}</button><button class="secondary" data-save-member="${m.id}">حفظ الخدمات</button><button class="secondary" data-toggle-member="${m.id}">${m.active===false?'تفعيل':'إيقاف'}</button><button class="secondary" data-delete-member="${m.id}">حذف</button></div></div>`;
 }).join("") || "<p class='hint'>لا يوجد أعضاء مطابقون للفلترة الحالية.</p>";
 $$('[data-copy-member]').forEach(b=>b.onclick=()=>{const m=members.find(x=>x.id===b.dataset.copyMember); if(!m) return; etqanCopyText(`اسم المستخدم: ${m.username||''}
كلمة المرور: ${m.password||''}`,'تم نسخ بيانات دخول العضو');});
 $$('[data-chat-member]').forEach(b=>b.onclick=()=>{const m=members.find(x=>x.id===b.dataset.chatMember); document.querySelector('[data-tab="chatAdmin"]')?.click(); openAdminChat(m);});
 $$('[data-save-member]').forEach(b=>b.onclick=async()=>{const inp=document.querySelector(`[data-member-services="${b.dataset.saveMember}"]`); await updateDoc(doc(db,'members',b.dataset.saveMember),{allowedServices:inp.value}); toast('تم حفظ خدمات العضو')});
 $$('[data-toggle-member]').forEach(b=>b.onclick=async()=>{const m=members.find(x=>x.id===b.dataset.toggleMember); await updateDoc(doc(db,'members',b.dataset.toggleMember),{active:!(m.active!==false)});});
 $$('[data-delete-member]').forEach(b=>b.onclick=async()=>{if(confirm('حذف العضو؟')) await deleteDoc(doc(db,'members',b.dataset.deleteMember));});
}
function initMemberPortal(){
 currentMember = etqanReadMemberSession();
 renderMemberDashboard();
 if(currentMember){requestBrowserNotifications();}
 $$("[data-member-mode]").forEach(btn=>btn.onclick=()=>{
   $$("[data-member-mode]").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
   $("#memberLoginForm").classList.toggle("hidden",btn.dataset.memberMode!=="login");
   $("#memberRegisterForm").classList.toggle("hidden",btn.dataset.memberMode!=="register");
 });
 $("#memberLoginForm")?.classList.remove("hidden");
 $("#memberRegisterForm")?.classList.add("hidden");
 $("#memberRegisterForm")?.addEventListener("submit",async e=>{
   e.preventDefault();
   const fd=new FormData(e.target), username=String(fd.get("username")).trim();
   if(!username){toast("اكتب اسم مستخدم");return;}
   const exists=members.some(m=>m.username===username);
   if(exists){toast("اسم المستخدم موجود مسبقًا");return;}
   const data={name:fd.get("name"),phone:fd.get("phone"),username,password:fd.get("password"),type:fd.get("type"),active:true,allowedServices:"",createdAt:serverTimestamp()};
   const ref=await addDoc(collection(db,"members"),data);
   currentMember={id:ref.id,...data}; etqanSaveMemberSession(currentMember);
   await etqanCreateNotification({target:"admin",kind:"member-created",title:"تسجيل عضو جديد",desc:`تم تسجيل عضو جديد باسم ${data.name||username}`,memberDocId:ref.id,memberUsername:username});
   etqanSetAdminVerified(false);
   etqanHideAdminGate();
   e.target.reset(); setAuthFeedback("memberLoginStatus","تم إنشاء الحساب وتم تسجيل الدخول","success"); requestBrowserNotifications(); toast("تم إنشاء الحساب"); renderMemberDashboard(); try{ etqanBuildAccountRedesign(); }catch(e){}
 });
 $("#memberLoginForm")?.addEventListener("submit",e=>{
   e.preventDefault();
   const fd=new FormData(e.target), username=String(fd.get("username")).trim(), password=String(fd.get("password"));
   const member=members.find(m=>m.username===username && String(m.password)===password);
   if(!member){setAuthFeedback("memberLoginStatus","اسم المستخدم أو كلمة المرور خاطئة","error");toast("اسم المستخدم أو كلمة المرور خاطئة");return;}
   if(member.active===false){setAuthFeedback("memberLoginStatus","هذا الحساب موقوف مؤقتًا","error");toast("هذا الحساب موقوف مؤقتًا");return;}
   etqanSetAdminVerified(false);
   etqanHideAdminGate();
   currentMember=member; etqanSaveMemberSession(member); e.target.reset(); setAuthFeedback("memberLoginStatus","تم دخول العضو بنجاح","success"); requestBrowserNotifications(); toast("تم دخول العضو بنجاح"); renderMemberDashboard(); try{ etqanBuildAccountRedesign(); }catch(e){}
 });
 $("#memberLogoutBtn")?.addEventListener("click",()=>{currentMember=null;etqanSaveMemberSession(null);stopMemberChat();etqanSetAdminVerified(false);etqanHideAdminGate();renderMemberDashboard();try{ etqanBuildAccountRedesign(); }catch(e){}toast("تم خروج العضو")});
 initMemberChatUi();
 initGlobalMessagesUi();
}

$("#orderForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const fd=new FormData(e.target), oid=orderId(); toast("جاري حفظ الطلب...");
 const extraOrderMeta=[
  fd.get("level")?`المستوى: ${fd.get("level")}`:"",
  fd.get("package")?`الباقة: ${fd.get("package")}`:"",
  fd.get("pages")?`الحجم التقريبي: ${fd.get("pages")}`:"",
  fd.get("deliveryStyle")?`أسلوب التسليم: ${fd.get("deliveryStyle")}`:""
].filter(Boolean).join("\n");
const rawDetails=String(fd.get("details")||"").trim();
const data={orderNo:oid,name:fd.get("name"),phone:fd.get("phone"),service:fd.get("service"),deadline:fd.get("deadline"),level:fd.get("level")||"",package:fd.get("package")||"",pages:fd.get("pages")||"",deliveryStyle:fd.get("deliveryStyle")||"",details:[extraOrderMeta,rawDetails].filter(Boolean).join("\n\n"),status:"جديد",memberId:currentMember?.id||"",memberUsername:currentMember?.username||"",memberName:currentMember?.name||"",createdAt:serverTimestamp()};
 await addDoc(collection(db,"orders"),data);
 await etqanCreateNotification({target:"admin",kind:"new-order",title:"طلب خدمة جديد",desc:`${data.service||"خدمة جديدة"} من ${data.name||"عميل"}`,memberUsername:data.memberUsername||""});
 playClientSuccess();
 browserNotify("تم إرسال الطلب","تم حفظ طلبك بنجاح داخل منصة إتقان");
 const msg=`طلب جديد من منصة إتقان التعليمية
رقم الطلب: ${oid}
الاسم: ${data.name}
الجوال: ${data.phone}
الخدمة: ${data.service}
المستوى: ${data.level||"غير محدد"}
الباقة: ${data.package||"غير محدد"}
الحجم التقريبي: ${data.pages||"غير محدد"}
أسلوب التسليم: ${data.deliveryStyle||"غير محدد"}
المدة المطلوبة: ${data.deadline||"غير محدد"}
التفاصيل:
${data.details}`;
 toast("تم حفظ الطلب وفتح واتساب");
 window.open(waLink(msg),"_blank");
 e.target.reset(); serviceSelectOptions();
});
function renderOrders(){
 const box=$("#ordersList"); if(!box) return;
 const q=String($("#ordersSearchInput")?.value||"").trim().toLowerCase();
 const st=String($("#ordersStatusFilter")?.value||"").trim();
 const filtered=orders.filter(o=>{const blob=`${o.orderNo||""} ${o.name||""} ${o.phone||""} ${o.service||""} ${o.details||""}`.toLowerCase(); return (!q || blob.includes(q)) && (!st || (o.status||"جديد")===st);});
 const counts=etqanOrderStatusCounts(filtered);
 etqanRenderSummaryStrip('#ordersSummaryStrip',[
  {label:'إجمالي المعروض',value:counts.total,tone:'violet'},
  {label:'جديد',value:counts.fresh,tone:'blue'},
  {label:'جاري التنفيذ',value:counts.progress,tone:'gold'},
  {label:'مكتمل',value:counts.done,tone:'green'}
 ]);
 if(!filtered.length){box.innerHTML="<p class='hint'>لا توجد نتائج مطابقة حاليًا.</p>";return}
 box.innerHTML=filtered.map(o=>`<div class="orderItem luxuryOrderCard"><div class="luxuryOrderHead"><div><h3>${safeText(o.orderNo||o.id)} <span class="status ${(o.status||'جديد')==='مكتمل'?'is-done':(o.status||'جديد')==='جاري التنفيذ'?'is-progress':'is-fresh'}">${safeText(o.status||"جديد")}</span></h3><div class="meta orderMetaGrid"><span>${safeText(o.name||"")}</span><span>${safeText(o.phone||"")}</span><span>${safeText(o.service||"")}</span><span>${safeText(o.deadline||'بدون موعد')}</span><span>${safeText(o.memberUsername?('عضو: '+o.memberUsername):'عميل زائر')}</span><span>${safeText(etqanTimestampLabel(o.createdAt))}</span></div></div><button class="secondary smallBtn" data-copy-order="${safeText(o.orderNo||o.id)}">نسخ الرقم</button></div><p>${safeText(o.details||"")}</p><div class="orderActions adminMiniActions"><button class="secondary" data-st="جديد" data-id="${o.id}">جديد</button><button class="secondary" data-st="جاري التنفيذ" data-id="${o.id}">جاري التنفيذ</button><button class="secondary" data-st="مكتمل" data-id="${o.id}">مكتمل</button><button class="secondary" data-del="${o.id}">حذف</button><a class="primary" target="_blank" href="${waLink(`متابعة طلب رقم ${o.orderNo||o.id}
الخدمة: ${o.service||''}
الحالة: ${o.status||'جديد'}`)}">واتساب</a></div></div>`).join("");
 $$('[data-copy-order]').forEach(b=>b.onclick=()=>etqanCopyText(b.dataset.copyOrder,'تم نسخ رقم الطلب'));
 $$('[data-st]').forEach(b=>b.onclick=async()=>{await updateDoc(doc(db,'orders',b.dataset.id),{status:b.dataset.st}); playStatusSound(); toast('تم تحديث حالة الطلب');});
 $$('[data-del]').forEach(b=>b.onclick=async()=>{if(confirm('حذف الطلب؟')) await deleteDoc(doc(db,'orders',b.dataset.del))});
}
function renderDash(){
 const n=orders.filter(o=>(o.status||"جديد")==="جديد").length, p=orders.filter(o=>o.status==="جاري التنفيذ").length, d=orders.filter(o=>o.status==="مكتمل").length;
 $("#dashNew").textContent=n; $("#dashProgress").textContent=p; $("#dashDone").textContent=d;
}
function renderAdminServices(){
 $("#servicesAdminList").innerHTML=services.map((s,i)=>`<div class="orderItem"><h3><span class="inlineIcon">${serviceIcon(s)}</span> ${s.title}</h3><p>${s.desc}</p><b>${s.price}</b><div class="orderActions"><button class="secondary" data-edit-service="${i}">تعديل</button><button class="secondary" data-copy-service="${i}">نسخ</button><button class="secondary" data-up-service="${i}">↑</button><button class="secondary" data-down-service="${i}">↓</button><button class="secondary" data-remove-service="${i}">حذف</button></div></div>`).join("");
 $$('[data-remove-service]').forEach(b=>b.onclick=async()=>{services.splice(+b.dataset.removeService,1);await saveServicesAndRefresh()});
 $$('[data-copy-service]').forEach(b=>b.onclick=async()=>{const i=+b.dataset.copyService; services.splice(i+1,0,{...services[i]}); await saveServicesAndRefresh(); toast('تم نسخ الخدمة');});
 $$('[data-up-service]').forEach(b=>b.onclick=async()=>{const i=+b.dataset.upService; if(i<1) return; [services[i-1],services[i]]=[services[i],services[i-1]]; await saveServicesAndRefresh();});
 $$('[data-down-service]').forEach(b=>b.onclick=async()=>{const i=+b.dataset.downService; if(i>=services.length-1) return; [services[i+1],services[i]]=[services[i],services[i+1]]; await saveServicesAndRefresh();});
 $$('[data-edit-service]').forEach(b=>b.onclick=()=>{const i=+b.dataset.editService, s=services[i], form=document.getElementById('serviceForm'); if(!form||!s) return; form.title.value=s.title||''; form.icon.value=s.icon||''; form.price.value=s.price||''; form.desc.value=s.desc||''; form.editIndex.value=String(i); document.getElementById('iconPreview').innerHTML=serviceIcon(s); form.querySelector('button.primary').textContent='حفظ تعديل الخدمة'; document.getElementById('serviceFormState').textContent='أنت الآن في وضع تعديل خدمة موجودة.'; document.getElementById('cancelServiceEditBtn').classList.remove('hidden'); form.scrollIntoView({behavior:'smooth',block:'start'});});
}

$("#chooseIconBtn").onclick=()=>$("#serviceImageFile").click();
$("#serviceIconInput").addEventListener("input",e=>{$("#iconPreview").innerHTML=e.target.value||"📚"});
$("#serviceImageFile").addEventListener("change",e=>{const file=e.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>{$("#serviceIconInput").value=reader.result; $("#iconPreview").innerHTML=`<img src="${reader.result}" alt="">`;}; reader.readAsDataURL(file);});
$("#serviceForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);const payload={title:fd.get("title"),icon:fd.get("icon"),desc:fd.get("desc"),price:fd.get("price")};const editIndex=String(fd.get("editIndex")||"").trim();if(editIndex!==""){services[+editIndex]=payload;toast("تم تحديث الخدمة") }else{services.push(payload);toast("تمت إضافة الخدمة")}await saveServicesAndRefresh();e.target.reset();if(e.target.editIndex) e.target.editIndex.value="";$("#iconPreview").innerHTML="📚";e.target.querySelector("button.primary").textContent="إضافة خدمة";document.getElementById("serviceFormState").textContent="أضف خدمة جديدة أو عدّل الخدمات الحالية من القائمة أدناه.";document.getElementById("cancelServiceEditBtn")?.classList.add("hidden");});
$("#settingsForm").addEventListener("submit",async e=>{
 e.preventDefault();
 settings={...defaultSettings,...settings,...etqanCollectSettingsForm()};
 await setDoc(doc(db,"settings","main"),settings);
 try{localStorage.setItem("etqan_admin_username",String(settings.username||"").trim());localStorage.setItem("etqan_admin_password",String(settings.password||""));}catch(e){}
 applyAppearance();
 renderManagedTicker();
 renderServices();
 renderOrders();
 renderMembersAdmin();
 renderAdminServices();
 etqanFillSettingsForm();
 etqanRenderCmsContent();
 try{ etqanBuildAccountRedesign(); }catch(e){}
 try{ if(etqanIsMobileShell()) etqanRebuildMobileDesign(); }catch(e){}
 toast("تم حفظ إعدادات المنصة بالكامل");
});


let etqanServiceSearch="";
let etqanServiceFilter="الكل";
function etqanGuessServiceCategory(service){
 const text=`${service?.title||''} ${service?.desc||''}`.toLowerCase();
 if(/سيرة|cv/.test(text)) return "سيرة ذاتية";
 if(/عرض|powerpoint|بوربوينت/.test(text)) return "عروض";
 if(/بحث|مراجع|توثيق/.test(text)) return "أبحاث";
 if(/مشروع|ابتكار/.test(text)) return "مشاريع";
 if(/تصميم|شعار|هوية|بوستر/.test(text)) return "تصاميم";
 if(/برنامج|برمجة|موقع|تطبيق/.test(text)) return "برمجة";
 if(/محاضرة|متابعة/.test(text)) return "متابعة";
 if(/تقرير|تقارير/.test(text)) return "تقارير";
 return "أخرى";
}
function etqanServiceFilters(){
 const list=['الكل'];
 services.forEach(s=>{const cat=etqanGuessServiceCategory(s); if(cat && cat!=='أخرى' && !list.includes(cat)) list.push(cat);});
 return list.slice(0,8);
}
function etqanSharePlatform(){
 const title=settings.brandName||'منصة إتقان التعليمية';
 const text=`${title} — ${settings.brandTagline||''}`.trim();
 if(navigator.share){
  navigator.share({title,text,url:location.href}).catch(()=>etqanCopyText(location.href,'تم نسخ رابط المنصة'));
 }else{
  etqanCopyText(location.href,'تم نسخ رابط المنصة');
 }
}
function etqanEnsureHeroCreativeActions(){
 const row=document.querySelector('#home .heroActions');
 if(!row || document.getElementById('sharePlatformBtn')) return;
 const btn=document.createElement('button');
 btn.type='button';
 btn.id='sharePlatformBtn';
 btn.className='secondary sharePlatformBtn';
 btn.textContent='مشاركة المنصة';
 btn.addEventListener('click',etqanSharePlatform);
 row.appendChild(btn);
}
function etqanEnsureServiceExplorerUi(){
 const grid=document.getElementById('servicesGrid');
 if(!grid) return;
 if(!document.getElementById('servicesExplorerPanel')){
  grid.insertAdjacentHTML('beforebegin',`<div id="servicesExplorerPanel" class="servicesExplorerPanel"><div class="servicesExplorerHead"><div><span class="sectionEyebrow">تصفح ذكي</span><h3>اكتشف الخدمة الأنسب لك</h3><p>ابحث باسم الخدمة أو استخدم الفلاتر السريعة للوصول للخدمة المناسبة فورًا.</p></div><div id="servicesExplorerStats" class="servicesExplorerStats"></div></div><div class="servicesExplorerControls"><input id="servicesSearchInput" class="servicesSearchInput" placeholder="ابحث باسم الخدمة أو الوصف"><button type="button" class="secondary" id="servicesSearchReset">إعادة ضبط</button></div><div id="servicesFilterChips" class="filterChipRow"></div></div>`);
  document.getElementById('servicesSearchInput')?.addEventListener('input',e=>{etqanServiceSearch=String(e.target.value||'').trim(); renderServices();});
  document.getElementById('servicesSearchReset')?.addEventListener('click',()=>{etqanServiceSearch=''; etqanServiceFilter='الكل'; const input=document.getElementById('servicesSearchInput'); if(input) input.value=''; renderServices();});
 }
 const chips=document.getElementById('servicesFilterChips');
 if(chips){
  chips.innerHTML=etqanServiceFilters().map(name=>`<button type="button" class="filterChip ${etqanServiceFilter===name?'active':''}" data-service-filter="${name}">${name}</button>`).join('');
  chips.querySelectorAll('[data-service-filter]').forEach(btn=>btn.addEventListener('click',()=>{etqanServiceFilter=btn.dataset.serviceFilter||'الكل'; renderServices();}));
 }
}
function etqanVisibleServices(){
 const q=String(etqanServiceSearch||'').toLowerCase();
 return services.filter(s=>{
  const cat=etqanGuessServiceCategory(s);
  const blob=`${s.title||''} ${s.desc||''} ${s.price||''} ${cat}`.toLowerCase();
  return (!q || blob.includes(q)) && (etqanServiceFilter==='الكل' || cat===etqanServiceFilter);
 });
}
function etqanRenderServiceExplorerMeta(visible){
 const stats=document.getElementById('servicesExplorerStats');
 if(stats){
  stats.innerHTML=`<div class="explorerStat"><strong>${visible.length}</strong><span>نتائج الآن</span></div><div class="explorerStat"><strong>${services.length}</strong><span>إجمالي الخدمات</span></div><div class="explorerStat"><strong>${orders.length}</strong><span>طلبات محفوظة</span></div>`;
 }
 document.getElementById('servicesExplorerPanel')?.classList.toggle('hidden', !settingsBool(settings.servicesEnabled,true));
}
const etqanPalettePresets={
 royal:{label:'ملكي',themeName:'royal',brandColor:'#8b5cf6',brandColor2:'#4f46e5',brandColor3:'#ec4899',appPrimaryColor:'#5b3f96',appSecondaryColor:'#2b195a',appAccentColor:'#34d399'},
 emerald:{label:'زمردي',themeName:'emerald',brandColor:'#10b981',brandColor2:'#0f766e',brandColor3:'#22d3ee',appPrimaryColor:'#065f46',appSecondaryColor:'#042f2e',appAccentColor:'#a7f3d0'},
 sunset:{label:'غروب',themeName:'sunset',brandColor:'#fb7185',brandColor2:'#f97316',brandColor3:'#facc15',appPrimaryColor:'#7c2d12',appSecondaryColor:'#431407',appAccentColor:'#fdba74'},
 ocean:{label:'محيطي',themeName:'ocean',brandColor:'#38bdf8',brandColor2:'#2563eb',brandColor3:'#22c55e',appPrimaryColor:'#1d4ed8',appSecondaryColor:'#172554',appAccentColor:'#67e8f9'},
 rose:{label:'وردي',themeName:'rose',brandColor:'#fb7185',brandColor2:'#e11d48',brandColor3:'#c084fc',appPrimaryColor:'#9d174d',appSecondaryColor:'#4a044e',appAccentColor:'#f9a8d4'}
};
function etqanApplyPalettePreset(name){
 const preset=etqanPalettePresets[name];
 const form=document.getElementById('settingsForm');
 if(!preset || !form) return;
 ['brandColor','brandColor2','brandColor3','appPrimaryColor','appSecondaryColor','appAccentColor'].forEach(key=>{if(form.elements[key]) form.elements[key].value=preset[key]; settings[key]=preset[key];});
 if(form.elements.themeName) form.elements.themeName.value=preset.themeName||'dark';
 settings.themeName=preset.themeName||settings.themeName;
 applyAppearance();
 toast(`تم تطبيق قالب ${preset.label} كمعاينة، اضغط حفظ الإعدادات للتثبيت`);
}
function etqanEnsureCreativeAdminTools(){
 const mount=document.getElementById('advancedSettingsMount');
 if(!mount || document.getElementById('palettePresetsCard')) return;
 const section=document.createElement('section');
 section.id='palettePresetsCard';
 section.className='settingsCard';
 section.innerHTML=`<h3>إبداعات سريعة</h3><p class="hint">قوالب ألوان جاهزة ولمسات سريعة. بعد اختيار القالب اضغط حفظ الإعدادات لتثبيته نهائيًا.</p><div class="presetPaletteGrid">${Object.entries(etqanPalettePresets).map(([key,p])=>`<button type="button" class="presetPaletteBtn" data-palette-preset="${key}"><span class="presetSwatches"><i style="background:${p.brandColor}"></i><i style="background:${p.brandColor2}"></i><i style="background:${p.brandColor3}"></i></span><b>${p.label}</b></button>`).join('')}</div><div class="adminToolbarActions wideActions"><button type="button" class="secondary" id="copySiteLinkBtn">نسخ رابط المنصة</button></div>`;
 mount.appendChild(section);
 section.querySelectorAll('[data-palette-preset]').forEach(btn=>btn.addEventListener('click',()=>etqanApplyPalettePreset(btn.dataset.palettePreset)));
 document.getElementById('copySiteLinkBtn')?.addEventListener('click',()=>etqanCopyText(location.href,'تم نسخ رابط المنصة'));
}

function etqanEnsureAdminEnhancements(){
 const freeNotice=document.querySelector('.freeNotice');
 if(freeNotice && !freeNotice.dataset.ready){freeNotice.dataset.ready='1'; freeNotice.innerHTML='<b>لوحة تحكم شاملة</b><p class="hint">تحكم كامل في الهوية، الألوان، أقسام الصفحة، العروض، الأسئلة الشائعة، الخدمات، الطلبات والأعضاء من مكان واحد.</p>';}
 const orderForm=document.getElementById('orderForm');
 if(orderForm && !orderForm.querySelector('[name="name"]')?.id){orderForm.querySelector('[name="name"]')?.setAttribute('id','customerName');}
 const ordersTab=document.getElementById('ordersTab');
 if(ordersTab && !document.getElementById('ordersToolbar')){
  ordersTab.insertAdjacentHTML('afterbegin',`<div id="ordersToolbar" class="adminToolBar"><input id="ordersSearchInput" class="adminSearchInput" placeholder="بحث بالاسم أو رقم الطلب أو الجوال أو الخدمة"><select id="ordersStatusFilter" class="adminSelect"><option value="">كل الحالات</option><option>جديد</option><option>جاري التنفيذ</option><option>مكتمل</option></select><div class="adminToolbarActions"><button type="button" class="secondary" id="ordersExportBtn">تصدير CSV</button><button type="button" class="secondary" id="ordersResetBtn">إعادة ضبط</button></div></div><div id="ordersSummaryStrip" class="summaryStrip"></div>`);
  document.getElementById('ordersSearchInput').addEventListener('input',renderOrders);
  document.getElementById('ordersStatusFilter').addEventListener('change',renderOrders);
  document.getElementById('ordersExportBtn').addEventListener('click',etqanExportOrdersCsv);
  document.getElementById('ordersResetBtn').addEventListener('click',()=>{document.getElementById('ordersSearchInput').value=''; document.getElementById('ordersStatusFilter').value=''; renderOrders();});
 }
 const membersTab=document.getElementById('membersAdminTab');
 if(membersTab && !document.getElementById('membersToolbar')){
  membersTab.insertAdjacentHTML('afterbegin',`<div id="membersToolbar" class="adminToolBar"><input id="membersSearchInput" class="adminSearchInput" placeholder="بحث بالاسم أو اليوزر أو الجوال أو نوع العضوية"><select id="membersStatusFilter" class="adminSelect"><option value="">كل الأعضاء</option><option value="active">النشطون</option><option value="stopped">الموقوفون</option></select><div class="adminToolbarActions"><button type="button" class="secondary" id="membersExportBtn">تصدير CSV</button><button type="button" class="secondary" id="membersResetBtn">إعادة ضبط</button></div></div><div id="membersSummaryStrip" class="summaryStrip"></div>`);
  document.getElementById('membersSearchInput').addEventListener('input',renderMembersAdmin);
  document.getElementById('membersStatusFilter').addEventListener('change',renderMembersAdmin);
  document.getElementById('membersExportBtn').addEventListener('click',etqanExportMembersCsv);
  document.getElementById('membersResetBtn').addEventListener('click',()=>{document.getElementById('membersSearchInput').value=''; document.getElementById('membersStatusFilter').value=''; renderMembersAdmin();});
 }
 const serviceForm=document.getElementById('serviceForm');
 if(serviceForm && !serviceForm.querySelector('[name="editIndex"]')){
  serviceForm.insertAdjacentHTML('afterbegin',`<input type="hidden" name="editIndex"><div class="panelNote" id="serviceFormState">أضف خدمة جديدة أو عدّل الخدمات الحالية من القائمة أدناه.</div>`);
  serviceForm.insertAdjacentHTML('beforeend',`<div class="serviceFormActions"><button type="button" class="secondary hidden" id="cancelServiceEditBtn">إلغاء التعديل</button></div>`);
  document.getElementById('cancelServiceEditBtn').addEventListener('click',()=>{serviceForm.reset(); serviceForm.querySelector('[name="editIndex"]').value=''; const p=document.getElementById('iconPreview'); if(p) p.innerHTML='📚'; serviceForm.querySelector('button.primary').textContent='إضافة خدمة'; document.getElementById('serviceFormState').textContent='أضف خدمة جديدة أو عدّل الخدمات الحالية من القائمة أدناه.'; document.getElementById('cancelServiceEditBtn').classList.add('hidden');});
 }
 const settingsForm=document.getElementById('settingsForm');
 if(settingsForm && !document.getElementById('advancedSettingsMount')){
  const submitBtn=settingsForm.querySelector('button.primary');
  const wrap=document.createElement('div');
  wrap.id='advancedSettingsMount';
  wrap.className='settingsGridAdvanced';
  wrap.innerHTML=`
   <section class="settingsCard">
    <h3>الهوية الرئيسية</h3>
    <label class="settingsBlock"><span>اسم المنصة</span><input name="brandName"></label>
    <label class="settingsBlock"><span>الوصف المختصر</span><input name="brandTagline"></label>
    <label class="settingsBlock"><span>شارة الرئيسية</span><input name="heroBadge"></label>
    <label class="settingsBlock"><span>عنوان الرئيسية</span><textarea name="heroTitle"></textarea></label>
    <label class="settingsBlock"><span>وصف الرئيسية</span><textarea name="heroText"></textarea></label>
    <label class="settingsBlock"><span>عنوان بطاقة التطبيق</span><input name="installTitle"></label>
    <label class="settingsBlock"><span>وصف بطاقة التطبيق</span><textarea name="installText"></textarea></label>
    <label class="settingsBlock"><span>نص زر التثبيت</span><input name="installButtonLabel"></label>
   </section>
   <section class="settingsCard">
    <h3>بطاقات البطل والتواصل</h3>
    <label class="settingsBlock"><span>عنوان البطاقة الجانبية</span><input name="heroCardTitle"></label>
    <label class="settingsBlock"><span>وصف البطاقة الجانبية</span><textarea name="heroCardDesc"></textarea></label>
    <label class="settingsBlock"><span>وصف إحصائية البطاقة</span><input name="heroOrdersStatLabel"></label>
    <label class="settingsBlock"><span>زر الطلب</span><input name="heroPrimaryLabel"></label>
    <label class="settingsBlock"><span>زر واتساب في الرئيسية</span><input name="heroWhatsappLabel"></label>
    <label class="settingsBlock"><span>زر واتساب المباشر</span><input name="directWhatsappLabel"></label>
    <label class="settingsBlock"><span>ملاحظة نموذج الطلب</span><textarea name="orderHint"></textarea></label>
    <label class="settingsBlock"><span>مثال التتبع</span><input name="trackPlaceholder"></label>
    <label class="settingsBlock"><span>نص الفوتر</span><input name="footerText"></label>
   </section>
   <section class="settingsCard">
    <h3>عناوين الأقسام</h3>
    <label class="settingsBlock"><span>عنوان العروض</span><input name="offersTitle"></label>
    <label class="settingsBlock"><span>وصف العروض</span><textarea name="offersDesc"></textarea></label>
    <label class="settingsBlock"><span>عنوان لماذا نحن</span><input name="whyTitle"></label>
    <label class="settingsBlock"><span>وصف لماذا نحن</span><textarea name="whyDesc"></textarea></label>
    <label class="settingsBlock"><span>عنوان الخدمات</span><input name="servicesTitle"></label>
    <label class="settingsBlock"><span>وصف الخدمات</span><textarea name="servicesDesc"></textarea></label>
    <label class="settingsBlock"><span>عنوان الأسعار</span><input name="pricesTitle"></label>
    <label class="settingsBlock"><span>وصف الأسعار</span><textarea name="pricesDesc"></textarea></label>
   </section>
   <section class="settingsCard">
    <h3>عناوين إضافية</h3>
    <label class="settingsBlock"><span>عنوان الطلب</span><input name="orderTitle"></label>
    <label class="settingsBlock"><span>وصف الطلب</span><textarea name="orderDesc"></textarea></label>
    <label class="settingsBlock"><span>عنوان التتبع</span><input name="trackTitle"></label>
    <label class="settingsBlock"><span>وصف التتبع</span><textarea name="trackDesc"></textarea></label>
    <label class="settingsBlock"><span>عنوان FAQ</span><input name="faqTitle"></label>
    <label class="settingsBlock"><span>وصف FAQ</span><textarea name="faqDesc"></textarea></label>
    <label class="settingsBlock"><span>عنوان التقييمات</span><input name="reviewsTitle"></label>
    <label class="settingsBlock"><span>وصف التقييمات</span><textarea name="reviewsDesc"></textarea></label>
   </section>
   <section class="settingsCard">
    <h3>الأعضاء والذكاء والإحصائيات</h3>
    <label class="settingsBlock"><span>عنوان المساعد الذكي</span><input name="aiTitle"></label>
    <label class="settingsBlock"><span>وصف المساعد الذكي</span><textarea name="aiDesc"></textarea></label>
    <label class="settingsBlock"><span>عنوان بوابة الأعضاء</span><input name="membersTitle"></label>
    <label class="settingsBlock"><span>وصف بوابة الأعضاء</span><textarea name="membersDesc"></textarea></label>
    <label class="settingsBlock"><span>عنوان الإحصائيات</span><input name="analyticsTitle"></label>
    <label class="settingsBlock"><span>وصف الإحصائيات</span><textarea name="analyticsDesc"></textarea></label>
    <label class="settingsBlock"><span>عنوان قسم المختص</span><input name="adminTitle"></label>
    <label class="settingsBlock"><span>وصف قسم المختص</span><textarea name="adminDesc"></textarea></label>
   </section>
   <section class="settingsCard">
    <h3>محتوى العروض والأقسام</h3>
    <label class="settingsBlock"><span>كود الخصم</span><input name="couponCode"></label>
    <label class="settingsBlock"><span>وصف كود الخصم</span><textarea name="couponText"></textarea></label>
    <label class="settingsBlock"><span>العروض</span><textarea name="offersData" placeholder="شارة|عنوان|وصف|نص إضافي"></textarea></label>
    <label class="settingsBlock"><span>لماذا نحن</span><textarea name="whyData" placeholder="عنوان|وصف"></textarea></label>
    <label class="settingsBlock"><span>الأسئلة الشائعة</span><textarea name="faqData" placeholder="سؤال|إجابة"></textarea></label>
   </section>
   <section class="settingsCard">
    <h3>الألوان الاحترافية</h3>
    <div class="themeColorRow"><label class="settingsBlock"><span>اللون الأساسي</span><input type="color" name="brandColor"></label><label class="settingsBlock"><span>اللون الثانوي</span><input type="color" name="brandColor2"></label><label class="settingsBlock"><span>لون الإبراز</span><input type="color" name="brandColor3"></label></div>
    <div class="themeColorRow"><label class="settingsBlock"><span>لون التطبيق الرئيسي</span><input type="color" name="appPrimaryColor"></label><label class="settingsBlock"><span>لون التطبيق الثانوي</span><input type="color" name="appSecondaryColor"></label><label class="settingsBlock"><span>لون التمييز</span><input type="color" name="appAccentColor"></label></div>
   </section>
   <section class="settingsCard">
    <h3>إظهار وإخفاء الأقسام</h3>
    <div class="settingsToggleGrid">
     <label class="checkField"><input name="offersEnabled" type="checkbox"><span>قسم العروض</span></label>
     <label class="checkField"><input name="whyEnabled" type="checkbox"><span>قسم لماذا نحن</span></label>
     <label class="checkField"><input name="couponEnabled" type="checkbox"><span>كود الخصم</span></label>
     <label class="checkField"><input name="faqEnabled" type="checkbox"><span>الأسئلة الشائعة</span></label>
     <label class="checkField"><input name="reviewsEnabled" type="checkbox"><span>التقييمات</span></label>
     <label class="checkField"><input name="aiEnabled" type="checkbox"><span>المساعد الذكي</span></label>
     <label class="checkField"><input name="analyticsEnabled" type="checkbox"><span>الإحصائيات</span></label>
     <label class="checkField"><input name="servicesEnabled" type="checkbox"><span>الخدمات</span></label>
     <label class="checkField"><input name="pricesEnabled" type="checkbox"><span>الأسعار</span></label>
     <label class="checkField"><input name="trackEnabled" type="checkbox"><span>التتبع</span></label>
     <label class="checkField"><input name="membersEnabled" type="checkbox"><span>بوابة الأعضاء</span></label>
     <label class="checkField"><input name="directWhatsappEnabled" type="checkbox"><span>أزرار واتساب</span></label>
     <label class="checkField"><input name="showTelegramButtons" type="checkbox"><span>أزرار تلجرام</span></label>
    </div>
   </section>
   <section class="settingsCard settingsCardWide">
    <h3>نسخة احتياطية وتحكم سريع</h3>
    <p class="hint">يمكنك تصدير إعدادات وهوية المنصة والخدمات في JSON، ثم استيرادها لاحقًا بنفس التنسيق.</p>
    <textarea id="backupPayloadInput" class="backupArea" placeholder="سيظهر هنا ملف النسخة الاحتياطية JSON أو ألصق نسخة للاستيراد"></textarea>
    <div class="adminToolbarActions wideActions">
     <button type="button" class="secondary" id="exportBackupBtn">تصدير JSON</button>
     <button type="button" class="secondary" id="importBackupBtn">استيراد JSON</button>
    </div>
   </section>`;
  settingsForm.insertBefore(wrap,submitBtn);
  document.getElementById('exportBackupBtn')?.addEventListener('click',etqanExportBackup);
  document.getElementById('importBackupBtn')?.addEventListener('click',etqanImportBackup);
 }
 etqanEnsureCreativeAdminTools();
}
function etqanFillSettingsForm(){const form=document.getElementById('settingsForm'); if(!form) return; etqanEnsureAdminEnhancements(); Array.from(form.elements).forEach(el=>{if(!el.name) return; const val=settings[el.name]; if(el.type==='checkbox') el.checked=settingsBool(val,el.name!=='tickerEnabled'); else if(val!=null) el.value=String(val);});}
function etqanCollectSettingsForm(){const form=document.getElementById('settingsForm'); const out={...defaultSettings,...settings}; if(!form) return out; Array.from(form.elements).forEach(el=>{if(!el.name) return; out[el.name]=el.type==='checkbox'?el.checked:el.value;}); return out;}
async function saveServicesAndRefresh(){await setDoc(doc(db,'settings','services'),{items:services}); renderServices(); renderAdminServices();}
function etqanNormalizeCredential(v, trim=true){
  const raw = String(v==null ? "" : v);
  return trim ? raw.trim() : raw;
}
function etqanGetAdminCandidates(){
  const liveUser = etqanNormalizeCredential(settings.username);
  const livePass = etqanNormalizeCredential(settings.password, false);
  const candidates = [];
  if(liveUser || livePass) candidates.push({username: liveUser, password: livePass});
  try{
    const oldUser = etqanNormalizeCredential(localStorage.getItem("etqan_admin_username"));
    const oldPass = etqanNormalizeCredential(localStorage.getItem("etqan_admin_password"), false);
    if(oldUser || oldPass) candidates.push({username: oldUser, password: oldPass});
  }catch(e){}
  return candidates.filter(c=>{
    const isFilled = c.username!=="" || c.password!=="";
    const isBlockedDefault = c.username==="admin" && c.password==="admin";
    return isFilled && !isBlockedDefault;
  });
}
function etqanOpenAdminAfterLogin(){
 etqanSetAdminVerified(true);
 renderOrders();renderDash();renderAdminServices();renderMembersAdmin();renderAdminGlobalMessages();
 etqanEnsureAdminEnhancements();
 etqanFillSettingsForm();
 activateAdminTab("orders");
 etqanSaveAdminSession(true);
 try{ etqanBuildAccountRedesign(); }catch(e){}
 try{ etqanActivateView?.("reports"); }catch(e){}
 setTimeout(()=>{try{ document.getElementById("admin")?.scrollIntoView({behavior:"smooth",block:"start"}); }catch(e){} try{ document.querySelector('.adminQuickBtn[data-tab-target="orders"]')?.focus(); }catch(e){}},120);
 setAuthFeedback("adminLoginStatus","تم دخول المختص بنجاح","success");
 requestBrowserNotifications();
 toast("تم دخول المختص بنجاح");
}
function etqanRestoreAdminSession(){
 if(!etqanHasAdminSession()) return;
 etqanSetAdminVerified(true);
 renderOrders();renderDash();renderAdminServices();renderMembersAdmin();renderAdminGlobalMessages();
 etqanEnsureAdminEnhancements();
 etqanFillSettingsForm();
}
function etqanAttemptAdminLogin(){
  const inputUser = etqanNormalizeCredential($("#adminUser")?.value);
  const inputPass = etqanNormalizeCredential($("#adminPass")?.value, false);
  if(inputUser==="admin" && inputPass==="admin"){
    etqanSetAdminVerified(false);
    setAuthFeedback("adminLoginStatus","هذه البيانات غير مقبولة","error");
    toast("هذه البيانات غير مقبولة");
    return;
  }
  const matched = etqanGetAdminCandidates().some(c=>inputUser===c.username && inputPass===c.password);
  if(matched){
    etqanOpenAdminAfterLogin();
  }else{
    etqanSetAdminVerified(false);
    setAuthFeedback("adminLoginStatus","اسم المستخدم أو كلمة المرور خاطئة","error");
    toast("اسم المستخدم أو كلمة المرور خاطئة");
  }
}
$("#loginBtn").onclick=etqanAttemptAdminLogin;
["#adminUser","#adminPass"].forEach(sel=>{
  $(sel)?.addEventListener("keydown",e=>{
    if(e.key==="Enter"){
      e.preventDefault();
      etqanAttemptAdminLogin();
    }
  });
});
$("#logoutBtn").onclick=()=>{
  etqanSetAdminVerified(false);
  etqanSaveAdminSession(false);
  setAuthFeedback("adminLoginStatus","","info");
  try{ etqanBuildAccountRedesign(); }catch(e){}
  toast("تم خروج المختص");
};
$$(".tabs button").forEach(btn=>btn.onclick=()=>{$$(".tabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");$$(".tabContent").forEach(t=>t.classList.add("hidden"));$("#"+btn.dataset.tab+"Tab").classList.remove("hidden");document.querySelectorAll(".adminQuickBtn").forEach(b=>b.classList.toggle("active", b.dataset.tabTarget===btn.dataset.tab));});document.querySelectorAll(".adminQuickBtn").forEach(btn=>btn.onclick=()=>activateAdminTab(btn.dataset.tabTarget));
$("#reviewForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target);await addDoc(collection(db,"reviews"),{name:fd.get("name"),rating:fd.get("rating"),text:fd.get("text"),createdAt:serverTimestamp()});e.target.reset();toast("تم إضافة التقييم")});
function renderReviews(){ $("#reviewsList").innerHTML=reviews.map(r=>`<div class="review"><b>${"★".repeat(+r.rating)}</b><h3>${r.name}</h3><p>${r.text}</p></div>`).join("") || "<p class='hint'>لا توجد تقييمات بعد.</p>"}
$("#trackBtn").onclick=()=>{const v=$("#trackInput").value.trim();const o=orders.find(x=>x.orderNo===v);$("#trackResult").innerHTML=o?`<div class="orderItem"><h3>${o.orderNo}</h3><p>الحالة: <span class="status">${o.status}</span></p><p>الخدمة: ${o.service}</p></div>`:"<p class='hint'>لم يتم العثور على الطلب.</p>"}

function activateAdminTab(tabName){
  const tabBtn=document.querySelector(`.tabs button[data-tab="${tabName}"]`);
  if(tabBtn) tabBtn.click();
  document.querySelectorAll(".adminQuickBtn").forEach(b=>b.classList.toggle("active", b.dataset.tabTarget===tabName));
}

function beep(){playAdminNewOrder()}
$("#themeBtn").onclick=()=>{settings.themeName=document.body.classList.contains("light")?"dark":"light";applyAppearance();};

function isStandaloneMode(){
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone===true;
}
function isIosDevice(){
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isAndroidDevice(){
  return /android/i.test(navigator.userAgent);
}
function isChromeLike(){
  return /chrome|crios|chromium/i.test(navigator.userAgent) && !/edg|opr|opera|samsungbrowser/i.test(navigator.userAgent);
}
function isSamsungBrowser(){
  return /samsungbrowser/i.test(navigator.userAgent);
}
function buildInstallSteps(){
  if(isIosDevice()){
    return [
      "اضغط زر المشاركة في المتصفح من أعلى أو أسفل الشاشة.",
      "اختر: إضافة إلى الشاشة الرئيسية.",
      "اضغط إضافة وسيظهر اختصار المنصة على سطح الهاتف."
    ];
  }
  if(canInstallPwa){
    return [
      "اضغط زر تثبيت الآن مرة واحدة فقط.",
      "إذا ظهرت نافذة المتصفح فاضغط تثبيت أو Install.",
      "إذا لم تظهر، افتح قائمة المتصفح ثم اختر: تثبيت التطبيق أو Add to Home screen."
    ];
  }
  if(isSamsungBrowser()){
    return [
      "افتح قائمة المتصفح ⋮ من أعلى الشاشة.",
      "ابحث عن: إضافة الصفحة إلى أو تثبيت التطبيق.",
      "وافق على الإضافة وسيظهر اختصار المنصة على سطح الهاتف."
    ];
  }
  if(isAndroidDevice()){
    return [
      "افتح قائمة المتصفح ⋮ من أعلى الشاشة.",
      "اختر: تثبيت التطبيق أو Add to Home screen.",
      "وافق على التثبيت وسيظهر اختصار المنصة على سطح الهاتف."
    ];
  }
  return [
    "افتح قائمة المتصفح من أعلى الشاشة.",
    "اختر: تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.",
    "وافق على التثبيت وسيظهر اختصار المنصة على سطح الهاتف."
  ];
}
function openInstallGuideModal(message){
  const modal=$("#installGuideModal");
  const text=$("#installGuideText");
  const steps=$("#installGuideSteps");
  if(text) text.textContent=message;
  if(steps){
    steps.innerHTML=buildInstallSteps().map((step,idx)=>`<div class="install-guide-step"><b>${idx+1}</b><span>${safeText(step)}</span></div>`).join("");
  }
  if(modal){
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("install-guide-open");
  }
}
function closeInstallGuideModal(){
  const modal=$("#installGuideModal");
  if(modal){
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("install-guide-open");
  }
}
function showInstallGuide(){
  if(isStandaloneMode()){
    toast("المنصة مثبتة بالفعل على سطح الهاتف");
    return;
  }
  let msg = "استخدم قائمة المتصفح ثم اختر تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.";
  if(isIosDevice()){
    msg = "في الآيفون لا يمكن فتح نافذة تثبيت تلقائية. استخدم زر المشاركة ثم اختر إضافة إلى الشاشة الرئيسية.";
  }else if(canInstallPwa){
    msg = "إذا لم تظهر نافذة التثبيت، استخدم قائمة المتصفح أو زر الطريقة ثم اختر تثبيت التطبيق.";
  }else if(isSamsungBrowser()){
    msg = "هذا المتصفح لم يعرض نافذة تثبيت مباشرة الآن. استخدم قائمة ⋮ ثم اختر إضافة الصفحة أو تثبيت التطبيق.";
  }else if(isChromeLike() || isAndroidDevice()){
    msg = "هذا المتصفح لم يعرض نافذة تثبيت مباشرة الآن. افتح قائمة ⋮ ثم اختر تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.";
  }
  openInstallGuideModal(msg);
}
function syncInstallButtons(){
  const hide=isStandaloneMode();
  ["#installBtn","#homeInstallBtn","#homeInstallCard","#mobileInstallCard","#mobileInstallBtn","#mobileInstallMiniBtn"].forEach(sel=>{
    const el=$(sel);
    if(el) el.classList.toggle("hidden", hide);
  });
  const primaryLabel = canInstallPwa ? "تثبيت الآن" : "عرض الطريقة";
  ["#installBtn","#homeInstallBtn","#mobileInstallBtn"].forEach(sel=>{
    const btn=$(sel);
    if(btn && !hide) btn.textContent = primaryLabel;
  });
}
async function triggerInstallPrompt(){
  if(isStandaloneMode()){
    toast("المنصة مثبتة بالفعل على سطح الهاتف");
    syncInstallButtons();
    return;
  }
  if(deferredPrompt){
    canInstallPwa=true;
    try{
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if(choice?.outcome==="accepted"){
        toast("جارٍ تثبيت المنصة...");
      }else{
        showInstallGuide();
      }
    }catch(e){
      showInstallGuide();
    }
    deferredPrompt=null;
    syncInstallButtons();
    return;
  }
  showInstallGuide();
}
window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault();
  deferredPrompt=e;
  canInstallPwa=true;
  syncInstallButtons();
  try{document.body.classList.add("can-install-pwa");}catch(_e){}
});
window.addEventListener("appinstalled",()=>{
  deferredPrompt=null;
  canInstallPwa=false;
  closeInstallGuideModal();
  syncInstallButtons();
  toast("تم تثبيت المنصة على سطح الهاتف");
});
document.addEventListener("click",(e)=>{
  const closeBtn=e.target.closest("[data-install-close]");
  if(closeBtn){
    e.preventDefault();
    closeInstallGuideModal();
    return;
  }
  const btn=e.target.closest("#installBtn,#homeInstallBtn,#mobileInstallBtn");
  if(btn){
    e.preventDefault();
    triggerInstallPrompt();
    return;
  }
  const guideBtn=e.target.closest("#mobileInstallMiniBtn,#showInstallGuideBtn");
  if(guideBtn){
    e.preventDefault();
    showInstallGuide();
    return;
  }
  const copyBtn=e.target.closest("#copyInstallLinkBtn");
  if(copyBtn){
    e.preventDefault();
    const link=location.href;
    const done=()=>toast("تم نسخ رابط المنصة");
    try{
      if(navigator.clipboard?.writeText){
        navigator.clipboard.writeText(link).then(done).catch(()=>{window.prompt("انسخ الرابط التالي",link);});
      }else{
        window.prompt("انسخ الرابط التالي",link);
      }
    }catch(_e){
      window.prompt("انسخ الرابط التالي",link);
    }
    return;
  }
});
document.addEventListener("DOMContentLoaded",()=>{
  syncInstallButtons();
});
if("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js?v=1780181972").catch(()=>{});
(async()=>{
 try{
  const firebaseReady=initFirebase();
  try{ await loadSettings(); }catch(e){ console.error("loadSettings failed",e); }
  try{ applyAppearance(); }catch(e){ console.error("applyAppearance failed",e); }
  try{ await loadServices(); }catch(e){ console.error("loadServices failed",e); services=[...defaultServices]; renderServices(); }
  if(firebaseReady){
   try{ listenOrders(); }catch(e){ console.error("listenOrders failed",e); }
   try{ listenReviews(); }catch(e){ console.error("listenReviews failed",e); }
   try{ listenMembers(); }catch(e){ console.error("listenMembers failed",e); }
   try{ listenGlobalMessages(); }catch(e){ console.error("listenGlobalMessages failed",e); }
   try{ listenChatMetas(); }catch(e){ console.error("listenChatMetas failed",e); }
   try{ listenNotifications(); }catch(e){ console.error("listenNotifications failed",e); }
  }else{
   etqanWarnOfflineMode();
  }
  try{ initAdminChatUi(); }catch(e){ console.error("initAdminChatUi failed",e); }
  try{ initMemberPortal(); }catch(e){ console.error("initMemberPortal failed",e); }
  try{ etqanEnsureAdminEnhancements(); }catch(e){ console.error("etqanEnsureAdminEnhancements failed",e); }
  try{ renderServices(); }catch(e){ console.error("renderServices failed",e); }
  try{ renderManagedTicker(); }catch(e){ console.error("renderManagedTicker failed",e); }
  try{ etqanSyncAdminUi(); }catch(e){ console.error("etqanSyncAdminUi failed",e); }
  try{ etqanRestoreAdminSession(); }catch(e){ console.error("etqanRestoreAdminSession failed",e); }
  try{ etqanFillSettingsForm(); }catch(e){ console.error("etqanFillSettingsForm failed",e); }
  try{ etqanRenderCmsContent(); }catch(e){ console.error("etqanRenderCmsContent failed",e); }
  if(currentMember){
    try{ etqanActivateView?.("account"); }catch(e){ console.error("activate account view failed",e); }
  }
  try{ etqanBuildAccountRedesign(); }catch(e){ console.error("etqanBuildAccountRedesign failed",e); }
 }catch(e){
  console.error(e);
  toast("تم تشغيل المنصة مع وجود مشكلة في التهيئة. راجع الإعدادات.");
 }finally{
  etqanHideLoader();
 }
})();


// Elite Pro UI enhancements
window.addEventListener("load",()=>{
  setTimeout(etqanHideLoader,450);
});
window.addEventListener("error",()=>setTimeout(etqanHideLoader,120),true);
setTimeout(etqanHideLoader,2200);
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


const ETQAN_NOTIFY_READ_KEY="etqan_notify_read_map_v2";
function etqanNotificationAudience(){
  if(etqanIsAdminMode()) return "admin";
  if(currentMember?.id) return `member:${currentMember.id}`;
  if(currentMember?.username) return `member:${currentMember.username}`;
  return "guest";
}
function etqanReadMap(){
  try{return JSON.parse(localStorage.getItem(ETQAN_NOTIFY_READ_KEY)||"{}");}catch(e){return {};}
}
function etqanWriteReadMap(map){
  try{localStorage.setItem(ETQAN_NOTIFY_READ_KEY,JSON.stringify(map||{}));}catch(e){}
}
function etqanMarkNotificationRead(id){
  if(!id) return;
  const map=etqanReadMap();
  const audience=etqanNotificationAudience();
  map[audience]=map[audience]||{};
  map[audience][id]=Date.now();
  etqanWriteReadMap(map);
  etqanRefreshNotificationBadge();
}
function etqanIsNotificationRead(id){
  if(!id) return false;
  const map=etqanReadMap();
  const audience=etqanNotificationAudience();
  return !!(map[audience]&&map[audience][id]);
}
function etqanNotificationMatches(item){
  if(!item) return false;
  const target=String(item.target||"");
  if(etqanIsAdminMode()) return target==="admin";
  if(currentMember){
    return target==="all-members" || target===`member:${currentMember.id}` || target===`member:${currentMember.username}`;
  }
  return false;
}
function etqanNotificationAction(item){
  const kind=String(item.kind||"");
  if(kind==="member-created"){
    return ()=>{ etqanAccountAction(true); setTimeout(()=>{ etqanOpenTab("membersAdmin"); },180); };
  }
  if(kind==="member-chat"){
    return ()=>{ etqanAccountAction(true); setTimeout(()=>{ etqanOpenTab("chatAdmin"); const member=members.find(m=>m.id===item.memberDocId || m.username===item.memberUsername); if(member) openAdminChat(member); },220); };
  }
  if(kind==="admin-chat"){
    return ()=>{ etqanAccountAction(); setTimeout(()=>{ openMemberChat(); },220); };
  }
  if(kind==="global-message"){
    return ()=>{ etqanAccountAction(); setTimeout(()=>{ const panel=document.getElementById("memberGlobalPanel"); if(panel?.classList.contains("hidden")) document.getElementById("memberGlobalToggle")?.click(); },220); };
  }
  if(kind==="new-order"){
    return ()=>{ etqanAccountAction(true); setTimeout(()=>{ etqanOpenTab("orders"); },180); };
  }
  return ()=>{ etqanOpenSheet("etqanNotificationsSheet"); };
}
async function etqanCreateNotification(data={}){
  try{
    if(!db) return;
    await addDoc(collection(db,"notifications"),{
      target:data.target||"admin",
      kind:data.kind||"general",
      title:data.title||"إشعار جديد",
      desc:data.desc||"",
      memberDocId:data.memberDocId||"",
      memberUsername:data.memberUsername||"",
      createdAt:serverTimestamp()
    });
  }catch(e){console.warn("notify-create",e);}
}
function listenNotifications(){
 if(!etqanHasDb()) return;
  if(notificationsUnsub) notificationsUnsub();
  notificationsUnsub=onSnapshot(query(collection(db,"notifications"),orderBy("createdAt","desc")),snap=>{
    const previousIds=new Set(notificationDocs.map(n=>n.id));
    notificationDocs=[];
    snap.forEach(d=>notificationDocs.push({id:d.id,...d.data()}));
    notificationDocs.filter(etqanNotificationMatches).forEach(item=>{
      if(previousIds.has(item.id) || etqanIsNotificationRead(item.id)) return;
      toast(`🔔 ${item.title}`);
      browserNotify(item.title,item.desc||"لديك إشعار جديد");
    });
    etqanRenderNotifications();
  });
}
let etqanAdminVerified=false;


let etqanAdminGateVisible = false;
function etqanHideAdminGate(){
  etqanAdminGateVisible = false;
  document.body.classList.remove("show-admin-gate");
  const adminSec=document.getElementById("admin");
  if(adminSec && !etqanAdminVerified) adminSec.classList.add("roleHidden");
}

function etqanSyncAdminUi(){
  const adminSec=document.getElementById("admin");
  const loginBox=document.getElementById("loginBox");
  const adminPanel=document.getElementById("adminPanel");
  const specialistBtn=document.getElementById("topSpecialistBtn");
  document.body.classList.toggle("admin-mode", !!etqanAdminVerified);
  document.body.classList.toggle("admin-authenticated", !!etqanAdminVerified);
  document.body.classList.toggle("show-admin-gate", !!etqanAdminGateVisible || !!etqanAdminVerified);
  if(adminSec) adminSec.classList.toggle("roleHidden", !etqanAdminVerified && !etqanAdminGateVisible);
  if(adminPanel) adminPanel.classList.toggle("hidden", !etqanAdminVerified);
  if(loginBox) loginBox.classList.toggle("hidden", etqanAdminVerified);
  if(specialistBtn) specialistBtn.classList.toggle("hidden", !etqanAdminVerified);
  etqanUpdateBottomState();
}
function etqanShowAdminGate(){
  const adminSec=document.getElementById("admin");
  const loginBox=document.getElementById("loginBox");
  const adminPanel=document.getElementById("adminPanel");
  const specialistBtn=document.getElementById("topSpecialistBtn");
  etqanAdminGateVisible = true;
  document.body.classList.add("show-admin-gate");
  if(adminSec) adminSec.classList.remove("roleHidden");
  if(loginBox) loginBox.classList.remove("hidden");
  if(adminPanel) adminPanel.classList.add("hidden");
  if(specialistBtn) specialistBtn.classList.add("hidden");
  document.body.classList.remove("admin-mode");
  document.body.classList.remove("admin-authenticated");
  etqanUpdateBottomState();
}
function etqanSetAdminMode(on){
  etqanAdminVerified = !!on && etqanAdminVerified;
  etqanSyncAdminUi();
}
function etqanSetAdminVerified(on){
  etqanAdminVerified = !!on;
  if(on) etqanAdminGateVisible = true;
  if(!on) etqanAdminGateVisible = false;
  etqanSyncAdminUi();
}
function etqanIsAdminMode(){
  return !!etqanAdminVerified;
}

if(etqanHasAdminSession()){
  etqanSetAdminVerified(true);
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
  if(forceAdmin){
    etqanShowAdminGate();
    etqanScrollTo("#admin");
    return;
  }
  if(etqanIsAdminMode()){
    etqanScrollTo("#admin");
    etqanOpenTab("orders");
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
  const items=notificationDocs
    .filter(etqanNotificationMatches)
    .map(item=>({
      id:item.id,
      title:item.title||"إشعار جديد",
      desc:item.desc||"",
      action:etqanNotificationAction(item)
    }))
    .filter(item=>!etqanIsNotificationRead(item.id));

  const memberChatCount=Number(document.getElementById("memberChatBadge")?.textContent||0);
  const memberGlobalCount=Number(document.getElementById("memberGlobalBadge")?.textContent||0);
  const adminChatCount=Number(document.getElementById("adminChatBadge")?.textContent||0);

  if(etqanIsAdminMode() && adminChatCount>0 && !items.some(x=>x.id==="admin-chat-live")){
    items.unshift({id:"admin-chat-live",title:"رسائل الأعضاء",desc:`لديك ${adminChatCount} رسالة جديدة`,action:()=>{etqanSetAdminMode(true); etqanScrollTo("#admin"); etqanOpenTab("chatAdmin");}});
  }
  if(currentMember && memberChatCount>0 && !items.some(x=>x.id==="member-chat-live")){
    items.unshift({id:"member-chat-live",title:"رسائل المختص",desc:`لديك ${memberChatCount} رسالة غير مقروءة`,action:()=>{etqanScrollTo("#members"); setTimeout(()=>{try{openMemberChat();}catch(e){ document.getElementById("memberChatPanel")?.classList.remove("hidden");}},220);}});
  }
  if(currentMember && memberGlobalCount>0 && !items.some(x=>x.id==="member-global-live")){
    items.unshift({id:"member-global-live",title:"تنبيهات المختص",desc:`لديك ${memberGlobalCount} إشعار جديد`,action:()=>{etqanScrollTo("#members"); setTimeout(()=>{const panel=document.getElementById("memberGlobalPanel"); if(panel?.classList.contains("hidden")) document.getElementById("memberGlobalToggle")?.click();},220);}});
  }

  return items;
}
function etqanClearStaleNotificationReads(){
  try{
    const map=etqanReadMap();
    const audience=etqanNotificationAudience();
    const activeIds=new Set(notificationDocs.filter(etqanNotificationMatches).map(x=>x.id));
    if(map[audience]){
      Object.keys(map[audience]).forEach(k=>{ if(!activeIds.has(k)) delete map[audience][k]; });
      etqanWriteReadMap(map);
    }
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
  etqanSetAdminVerified(false);
  document.getElementById("etqanOverlay")?.addEventListener("click",etqanCloseSheets);
  document.querySelectorAll("[data-close-sheet]").forEach(btn=>btn.addEventListener("click",etqanCloseSheets));
  document.getElementById("topMenuBtn")?.addEventListener("click",()=>etqanOpenSheet("etqanQuickMenu"));
  document.getElementById("bottomMoreBtn")?.addEventListener("click",e=>{e.preventDefault(); etqanOpenSheet("etqanQuickMenu");});
  document.getElementById("topSpecialistBtn")?.addEventListener("click",e=>{
    e.preventDefault();
    if(etqanIsAdminMode()){
      etqanAccountAction(true);
    }
  });
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
    accountBtn.addEventListener("click",e=>{
      e.preventDefault();
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


/* ===== True mobile app shell redesign v2 ===== */
let etqanMobileCurrentView="home";
function etqanIsMobileShell(){
  return window.innerWidth<=768;
}
function etqanCreateMobileShell(){
  if(!etqanIsMobileShell()) return;
  if(document.getElementById("mobileAppShell")) return;
  document.body.classList.add("etqan-mobile-shell");
  const main=document.querySelector("main");
  if(!main) return;
  const shell=document.createElement("div");
  shell.id="mobileAppShell";
  shell.innerHTML=`
    <div class="mobile-view active" data-view="home"></div>
    <div class="mobile-view" data-view="services"></div>
    <div class="mobile-view" data-view="account"></div>
    <div class="mobile-view" data-view="reports"></div>
    <div class="mobile-view" data-view="more"></div>
  `;
  main.insertBefore(shell, main.firstChild);

  const map={
    home:["home","offers","why"],
    services:["services","prices","order"],
    account:["members"],
    reports:["track","analytics"],
    more:["faq","reviews","ai","admin"]
  };
  Object.entries(map).forEach(([view, ids])=>{
    const target=shell.querySelector(`.mobile-view[data-view="${view}"]`);
    ids.forEach(id=>{
      const node=document.getElementById(id);
      if(node && target) target.appendChild(node);
    });
  });

  etqanBuildMobileHomeExtras();
  etqanBuildMobileServiceChrome();
  etqanBindMobileShellNav();
  etqanActivateView("home");
}
function etqanBuildMobileHomeExtras(){
  const homeView=document.querySelector('.mobile-view[data-view="home"]');
  if(!homeView || homeView.querySelector(".mobile-app-card")) return;
  const card=document.createElement("div");
  card.className="mobile-app-card";
  card.innerHTML=`
    <h3 class="mobile-app-title">وصول سريع</h3>
    <p class="mobile-app-subtitle">بدل النزول الطويل، افتح أهم الأقسام من هنا مباشرة.</p>
    <div class="mobile-shortcuts">
      <button type="button" class="mobile-shortcut" data-mobile-jump="services"><span>▦</span>الخدمات</button>
      <button type="button" class="mobile-shortcut" data-mobile-jump="order"><span>📝</span>إرسال طلب</button>
      <button type="button" class="mobile-shortcut" data-mobile-jump="track"><span>📄</span>تتبع طلب</button>
      <button type="button" class="mobile-shortcut" data-mobile-jump="members"><span>👤</span>حسابي</button>
    </div>
  `;
  homeView.appendChild(card);
  card.querySelectorAll("[data-mobile-jump]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const target=btn.getAttribute("data-mobile-jump");
      if(target==="services"){ etqanActivateView("services"); }
      else if(target==="members"){ etqanActivateView("account"); }
      else if(target==="track"){ etqanActivateView("reports"); setTimeout(()=>document.getElementById("trackInput")?.focus(),120); }
      else if(target==="order"){ etqanActivateView("services"); setTimeout(()=>document.getElementById("order")?.scrollIntoView({behavior:"smooth",block:"start"}),140); }
    });
  });
}
function etqanBuildMobileServiceChrome(){
  const servicesView=document.querySelector('.mobile-view[data-view="services"]');
  if(!servicesView || servicesView.querySelector(".mobile-services-toolbar")) return;
  const toolbar=document.createElement("div");
  toolbar.className="mobile-app-card";
  toolbar.innerHTML=`
    <h3 class="mobile-app-title">الخدمات</h3>
    <p class="mobile-app-subtitle">اختر الخدمة بسرعة ثم أرسل الطلب من نفس الصفحة.</p>
    <div class="mobile-services-toolbar">
      <input id="mobileServiceSearch" type="search" placeholder="ابحث عن خدمة..." autocomplete="off">
      <button type="button" id="mobileServiceReset" aria-label="تحديث">↻</button>
    </div>
    <div id="mobileServicesGrid" class="mobile-services-grid"></div>
    <div id="mobileServicesEmpty" class="mobile-empty hidden">لا توجد نتائج مطابقة الآن.</div>
  `;
  servicesView.insertBefore(toolbar, servicesView.firstChild);
  const input=toolbar.querySelector("#mobileServiceSearch");
  const reset=toolbar.querySelector("#mobileServiceReset");
  const rerender=()=>etqanRenderMobileServiceCards(input?.value||"");
  input?.addEventListener("input",rerender);
  reset?.addEventListener("click",()=>{ if(input) input.value=""; rerender(); });
  etqanRenderMobileServiceCards("");
}
function etqanRenderMobileServiceCards(queryText=""){
  const grid=document.getElementById("mobileServicesGrid");
  const empty=document.getElementById("mobileServicesEmpty");
  if(!grid) return;
  const q=(queryText||"").trim().toLowerCase();
  const filtered=services.filter(s=>!q || `${s.title} ${s.desc} ${s.price||""}`.toLowerCase().includes(q));
  grid.innerHTML=filtered.map(s=>`
    <article class="mobile-service-card">
      <div class="mobile-service-head">${serviceIcon(s)}</div>
      <div class="mobile-service-body">
        <h3>${safeText(s.title)}</h3>
        <p>${safeText(s.desc)}</p>
        <div class="mobile-service-meta">
          <span class="mobile-price-chip">${safeText(s.price||"حسب الطلب")}</span>
          <button class="mobile-order-btn" type="button" data-mobile-order="${safeText(s.title)}">اطلب</button>
        </div>
      </div>
    </article>
  `).join("");
  if(empty) empty.classList.toggle("hidden", filtered.length!==0);
  grid.querySelectorAll("[data-mobile-order]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      etqanActivateView("services");
      document.getElementById("serviceSelect").value=btn.getAttribute("data-mobile-order");
      setTimeout(()=>{
        document.getElementById("order")?.scrollIntoView({behavior:"smooth",block:"start"});
      },90);
    });
  });
}
function etqanBindMobileShellNav(){
  const navMap={
    bottomHomeBtn:"home",
    bottomServicesBtn:"services",
    bottomAccountBtn:"account",
    bottomReportsBtn:"reports",
    bottomMoreBtn:"more"
  };
  Object.entries(navMap).forEach(([id,view])=>{
    const btn=document.getElementById(id);
    if(!btn) return;
    const clone=btn.cloneNode(true);
    btn.parentNode.replaceChild(clone,btn);
    clone.addEventListener("click",e=>{
      e.preventDefault();
      if(id==="bottomMoreBtn"){
        etqanActivateView("more");
      }else{
        etqanActivateView(view);
      }
    });
  });
  document.getElementById("topMenuBtn")?.addEventListener("click",()=>etqanActivateView("more"));
}

function etqanLockAdminSurface(){
  const adminSection=document.getElementById("admin");
  const adminPanel=document.getElementById("adminPanel");
  const loginBox=document.getElementById("loginBox");
  if(!adminSection) return;
  if(etqanIsAdminMode()){
    adminSection.classList.remove("roleHidden");
    adminPanel?.classList.remove("hidden");
    loginBox?.classList.add("hidden");
    return;
  }
  if(!etqanAdminGateVisible){
    adminSection.classList.add("roleHidden");
  }
  adminPanel?.classList.add("hidden");
}

function etqanActivateView(view){
  etqanMobileCurrentView=view;
  document.querySelectorAll(".mobile-view").forEach(v=>v.classList.toggle("active",v.getAttribute("data-view")===view));
  etqanUpdateBottomState(view);
  if(view==="more") etqanCloseSheets?.();
  if(view!=="more" && !etqanIsAdminMode()) etqanHideAdminGate();
  etqanLockAdminSurface();
  setTimeout(()=>{try{etqanRemoveDuplicateBranding(); etqanRebuildMobileDesign?.();}catch(e){}},60);
  window.scrollTo({top:0,behavior:"instant"});
}
function etqanMapSelectorToView(selector){
  const s=String(selector||"");
  if(s.includes("#services")||s.includes("#prices")||s.includes("#order")) return "services";
  if(s.includes("#members")) return "account";
  if(s.includes("#track")||s.includes("#analytics")||s.includes("#admin")) return "reports";
  if(s.includes("#faq")||s.includes("#reviews")||s.includes("#ai")) return "more";
  return "home";
}
const _etqanOriginalScrollTo = etqanScrollTo;
etqanScrollTo = function(selector){
  if(etqanIsMobileShell() && document.getElementById("mobileAppShell")){
    etqanActivateView(etqanMapSelectorToView(selector));
    setTimeout(()=>{
      try{
        const el=typeof selector==="string"?document.querySelector(selector):selector;
        if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
      }catch(e){}
    },80);
    return;
  }
  return _etqanOriginalScrollTo(selector);
};
const _etqanOriginalGoHome = etqanGoHome;
etqanGoHome = function(){
  if(etqanIsMobileShell() && document.getElementById("mobileAppShell")){
    etqanActivateView("home");
    return;
  }
  return _etqanOriginalGoHome();
};
const _etqanOriginalAccountAction = etqanAccountAction;
etqanAccountAction = function(forceAdmin=false){
  if(etqanIsMobileShell() && document.getElementById("mobileAppShell")){
    if(forceAdmin){
      etqanSetAdminMode(true);
      etqanActivateView("more");
      setTimeout(()=>{
        document.getElementById("admin")?.scrollIntoView({behavior:"smooth",block:"start"});
        if(document.getElementById("adminPanel")?.classList.contains("hidden")){
          etqanShowAdminGate();
          document.getElementById("loginBox")?.classList.remove("hidden");
          document.getElementById("adminPanel")?.classList.add("hidden");
        }else{
          etqanOpenTab("orders");
        }
      },120);
      return;
    }
    etqanActivateView("account");
    return;
  }
  return _etqanOriginalAccountAction(forceAdmin);
};
const _etqanOriginalReportsAction = etqanReportsAction;
etqanReportsAction = function(){
  if(etqanIsMobileShell() && document.getElementById("mobileAppShell")){
    etqanActivateView("reports");
    return;
  }
  return _etqanOriginalReportsAction();
};
const _etqanOriginalRenderServices = renderServices;
renderServices = function(){
  _etqanOriginalRenderServices();
  if(etqanIsMobileShell()) etqanRenderMobileServiceCards(document.getElementById("mobileServiceSearch")?.value||"");
};
window.addEventListener("resize",()=>{
  if(window.innerWidth<=768){
    document.body.classList.add("etqan-mobile-shell");
    etqanCreateMobileShell();
  }else{
    document.body.classList.remove("etqan-mobile-shell");
  }
});
document.addEventListener("DOMContentLoaded",()=>setTimeout(etqanCreateMobileShell,220));


function etqanRefreshSpecialistEntry(){
  const btn=document.getElementById("topSpecialistBtn");
  if(!btn) return;
  const loggedIn = !document.getElementById("adminPanel")?.classList.contains("hidden");
  btn.classList.toggle("hidden", !loggedIn);
  btn.textContent = "إ";
  btn.title = loggedIn ? "لوحة المختص" : "دخول المختص";
  btn.setAttribute("aria-label", btn.title);
}
setInterval(etqanRefreshSpecialistEntry, 1200);
document.addEventListener("click",e=>{
  if(e.target && (e.target.id==="loginBtn" || e.target.id==="logoutBtn")) setTimeout(etqanRefreshSpecialistEntry, 80);
}, true);

/* ===== Final merged mobile redesign + task bindings ===== */
const ETQAN_LOCAL_THEME_KEY="etqan_local_theme_override";

function etqanGetLocalTheme(){
  try{return localStorage.getItem(ETQAN_LOCAL_THEME_KEY)||"";}catch(e){return "";}
}
function etqanApplyLocalTheme(themeName){
  if(!themeName) return;
  try{localStorage.setItem(ETQAN_LOCAL_THEME_KEY,themeName);}catch(e){}
  settings.themeName=themeName;
  applyAppearance();
  if(document.getElementById("settingsForm")?.themeName){
    document.getElementById("settingsForm").themeName.value=themeName;
  }
  etqanRenderThemeSelectors();
  toast("تم تغيير الثيم");
}
const _etqanApplyAppearanceOriginal = applyAppearance;
applyAppearance = function(){
  const localTheme=etqanGetLocalTheme();
  if(localTheme) settings.themeName=localTheme;
  _etqanApplyAppearanceOriginal();
  document.body.classList.toggle("dark", !settings.themeName || settings.themeName==="dark");
  etqanRenderThemeSelectors?.();
};

function etqanThemePresets(){
  return [
    {id:"royal", label:"بنفسجي ملكي", swatch:"royal"},
    {id:"emerald", label:"زمردي هادئ", swatch:"emerald"},
    {id:"coffee", label:"نحاسي فاتح", swatch:"copper"},
    {id:"midnight", label:"ليلي أنيق", swatch:"midnight"}
  ];
}
function etqanRenderThemeSelectors(){
  document.querySelectorAll("[data-theme-picker]").forEach(box=>{
    const current=(settings.themeName&&settings.themeName!=="dark")?settings.themeName:"royal";
    box.innerHTML=etqanThemePresets().map(t=>`
      <button type="button" class="theme-chip ${current===t.id?'active':''}" data-theme-choice="${t.id}">
        <div class="theme-swatch swatch-${t.swatch}"></div>
        <span>${t.label}</span>
      </button>
    `).join("");
    box.querySelectorAll("[data-theme-choice]").forEach(btn=>{
      btn.addEventListener("click",()=>etqanApplyLocalTheme(btn.dataset.themeChoice));
    });
  });
}


function etqanMemberOrders(){
  if(!currentMember) return [];
  return orders.filter(o=>{
    const sameId = currentMember.id && o.memberId && o.memberId===currentMember.id;
    const sameUsername = currentMember.username && o.memberUsername && o.memberUsername===currentMember.username;
    const samePhone = o.phone && currentMember.phone && o.phone===currentMember.phone;
    return !!(sameId || sameUsername || samePhone);
  });
}
function etqanAdminOrders(){ return Array.isArray(orders)?orders:[]; }
function etqanOrderOwnerLabel(o){
  return o.memberName || o.name || o.memberUsername || o.phone || "عميل";
}
function etqanOrderOwnerKey(o){
  return o.memberId || o.memberUsername || o.phone || etqanOrderOwnerLabel(o);
}
function etqanBuildGroupItemsHtml(group){
  return (group?.items||[]).map((item,idx)=>`
          <div class="mobile-list-card report-row-card grouped-report-item">
            <div class="mobile-list-row report-row-top">
              <div class="mobile-report-icon">${["📄","🧾","📘","📊","📝"][idx%5]}</div>
              <div class="report-row-copy">
                <h4>${safeText(item.service ? `تقرير ${item.service}` : `تقرير ${idx+1}`)}</h4>
                <p>${safeText(item.status||"جديد")} • ${safeText(item.orderNo||item.id||"ETQ")}</p>
              </div>
            </div>
            <div class="mobile-list-row grouped-report-meta">
              <div><p>${safeText(item.deadline||"بدون موعد محدد")}</p></div>
              <button type="button" class="secondary report-open-btn" data-report-open="${safeText(item.orderNo||item.id||"")}">فتح</button>
            </div>
          </div>
        `).join("");
}

function etqanFindMemberForGroup(group){
  const key=String(group?.key||"");
  const label=String(group?.label||"");
  return (Array.isArray(members)?members:[]).find(m=>{
    return [m.id,m.username,m.phone,m.name].some(v=>String(v||"")===key || String(v||"")===label);
  }) || null;
}
function etqanOpenAdminChatFromGroup(group){
  const member = etqanFindMemberForGroup(group);
  if(!member){ toast("تعذر العثور على العميل للمراسلة"); return; }
  etqanActivateView("more");
  setTimeout(async()=>{
    try{
      const adminPanel = document.getElementById("adminPanel");
      adminPanel?.scrollIntoView({behavior:"smooth",block:"start"});
      await openAdminChat(member);
      document.getElementById("adminChatArea")?.scrollIntoView({behavior:"smooth",block:"center"});
      toast(`تم فتح مراسلة ${member.name||member.username||"العميل"}`);
    }catch(e){
      console.error(e);
      toast("تعذر فتح المحادثة الآن");
    }
  },180);
}

function etqanGroupedReportData(){
  const list = etqanIsAdminMode() ? etqanAdminOrders() : etqanMemberOrders();
  const map = new Map();
  list.forEach(o=>{
    const key = etqanOrderOwnerKey(o);
    if(!map.has(key)) map.set(key,{key,label:etqanOrderOwnerLabel(o),items:[]});
    map.get(key).items.push(o);
  });
  return Array.from(map.values()).map(group=>{
    group.items.sort((a,b)=>{
      const av = a.createdAt?.seconds || 0;
      const bv = b.createdAt?.seconds || 0;
      return bv-av;
    });
    group.total = group.items.length;
    group.done = group.items.filter(o=>(o.status||"")==="مكتمل").length;
    group.progress = group.items.filter(o=>["جاري","جاري التنفيذ","قيد المراجعة"].includes(o.status)).length;
    group.fresh = group.items.filter(o=>(o.status||"جديد")==="جديد").length;
    return group;
  }).sort((a,b)=>b.total-a.total || a.label.localeCompare(b.label,"ar"));
}

function etqanStatsForView(){
  const list = etqanIsAdminMode() ? etqanAdminOrders() : etqanMemberOrders();
  return {
    total:list.length,
    fresh:list.filter(o=>(o.status||"جديد")==="جديد").length,
    progress:list.filter(o=>["جاري","جاري التنفيذ","قيد المراجعة"].includes(o.status)).length,
    done:list.filter(o=>(o.status||"")==="مكتمل").length
  };
}
function etqanRecentReportItems(){
  const list = etqanIsAdminMode() ? etqanAdminOrders() : etqanMemberOrders();
  return list.slice(0,4).map((o,idx)=>({
    title: o.service ? `تقرير ${o.service}` : `تقرير ${idx+1}`,
    desc: `${o.name||currentMember?.name||"عميل"} • ${o.status||"جديد"}`,
    date: o.orderNo || o.id || "ETQ",
    icon: ["📄","👤","🗓️","📈"][idx%4]
  }));
}
function etqanEnsureMobileHead(view, title){
  const root=document.querySelector(`.mobile-view[data-view="${view}"]`);
  if(!root) return null;
  let head=root.querySelector(".mobile-page-head");
  if(!head){
    head=document.createElement("div");
    head.className="mobile-page-head";
    head.innerHTML=`<button type="button" class="mobile-icon-btn" data-mobile-back>‹</button><h2>${title}</h2><button type="button" class="mobile-icon-btn" data-mobile-gear>⚙️</button>`;
    root.insertBefore(head, root.firstChild);
    head.querySelector("[data-mobile-back]")?.addEventListener("click",()=>etqanGoHome());
    head.querySelector("[data-mobile-gear]")?.addEventListener("click",()=>document.getElementById("themeBtn")?.click());
  }else{
    head.querySelector("h2").textContent=title;
  }
  return root;
}


function etqanBuildHomeRedesign(){
  const view=etqanEnsureMobileHead("home","الرئيسية");
  if(!view) return;
  let shell=view.querySelector(".mobile-home-shell");
  if(!shell){
    shell=document.createElement("div");
    shell.className="mobile-home-shell";
    view.insertBefore(shell, view.children[1] || null);
  }
  const fresh=orders.filter(o=>(o.status||"جديد")==="جديد").length;
  const done=orders.filter(o=>(o.status||"") === "مكتمل").length;
  const totalOrders=orders.length;
  const totalServices=services.length;
  const totalReviews=reviews.length;
  const directLink=waDirectLink();
  shell.innerHTML=`
    <div class="mobile-hero-card home-hero-card">
      <div class="mobile-hero-topline">
        <span class="mobile-hero-badge">منصة إتقان التعليمية</span>
        <div class="mobile-hero-avatar home-hero-logo-wrap"><img src="assets/home-logo-showcase.png" alt="شعار منصة إتقان التعليمية" class="home-hero-logo"></div>
      </div>
      <h3>خدمات تعليمية احترافية</h3>
      <h2>أنجز طلبك بسرعة وبأسلوب أوضح</h2>
      <p>واجهة مرتبة للوصول إلى الخدمات، إرسال الطلب، المتابعة، والحساب الشخصي من نفس المكان.</p>
      <div class="mobile-stat-row home-stat-row">
        <div class="mobile-stat"><b>${totalServices}</b><span>خدمة</span></div>
        <div class="mobile-stat"><b>${totalOrders}</b><span>طلب محفوظ</span></div>
        <div class="mobile-stat"><b>${done}</b><span>مكتمل</span></div>
      </div>
      <div class="mobile-hero-actions">
        <button type="button" class="mobile-solid-action" data-home-action="order">ابدأ الطلب</button>
        <a class="mobile-outline-action" href="${directLink}" target="_blank" rel="noopener">واتساب مباشر</a>
      </div>
    </div>

    <div class="mobile-specialist-card home-special-card">
      <div class="account-specialist-head">
        <div class="account-specialist-icon">⚡</div>
        <div>
          <span>وصول سريع</span>
          <h2>الأقسام المهمة</h2>
        </div>
      </div>
      <p>انتقل بسرعة إلى القسم المطلوب بدون النزول الطويل داخل الصفحة.</p>
      <div class="mobile-home-shortcuts">
        <button type="button" class="mobile-mini-action" data-home-action="services"><span>▦</span><b>الخدمات</b></button>
        <button type="button" class="mobile-mini-action" data-home-action="track"><span>📄</span><b>التتبع</b></button>
        <button type="button" class="mobile-mini-action" data-home-action="account"><span>👤</span><b>حسابي</b></button>
        <button type="button" class="mobile-mini-action" data-home-action="more"><span>☰</span><b>المزيد</b></button>
      </div>
    </div>

    <div class="mobile-logo-showcase-card">
      <div class="mobile-logo-showcase-head">
        <span class="mobile-hero-badge">هوية المنصة</span>
        <span class="mobile-soft-pill">إتقان</span>
      </div>
      <div class="mobile-logo-showcase-frame">
        <img src="assets/home-logo-showcase.png" alt="شعار منصة إتقان التعليمية" class="mobile-home-logo-image">
      </div>
    </div>

    <div id="mobileInstallCard" class="mobile-install-card">
      <div class="mobile-install-copy">
        <span class="mobile-hero-badge">تثبيت سريع</span>
        <h3>ثبت المنصة على سطح الهاتف</h3>
        <p>لمسة واحدة للوصول السريع بدون البحث عن الرابط كل مرة.</p>
      </div>
      <div class="mobile-install-actions">
        <button type="button" id="mobileInstallBtn" class="mobile-solid-action">تثبيت الآن</button>
        <button type="button" id="mobileInstallMiniBtn" class="mobile-outline-action" title="شرح التثبيت">الطريقة</button>
      </div>
    </div>

    ${(settings.tickerEnabled!==false && String(settings.tickerEnabled)!=="false") ? `<div class="mobile-home-ticker"><div class="mobile-home-ticker-track" style="animation-duration:${Math.max(14, Number(settings.tickerSpeed||32))}s">${[...etqanTickerItems(),...etqanTickerItems()].map(item=>`<span>${safeText(item)}</span>`).join("")}</div></div>` : ""}

    <div class="mobile-tile-grid home-tile-grid">
      <button type="button" class="mobile-tile home-tile" data-home-action="services">
        <div class="icon">▦</div>
        <div><h3>الخدمات</h3><p>استعرض الخدمات والأسعار وقدّم طلبك من نفس الصفحة.</p></div>
      </button>
      <button type="button" class="mobile-tile home-tile" data-home-action="account">
        <div class="icon blue">👤</div>
        <div><h3>حسابي</h3><p>دخول العضو، إنشاء حساب جديد، والانتقال للوصول الخاص.</p></div>
      </button>
      <button type="button" class="mobile-tile home-tile" data-home-action="reports">
        <div class="icon orange">📈</div>
        <div><h3>التقارير</h3><p>ملخص واضح للحالات الحالية والعناصر الحديثة في المنصة.</p></div>
      </button>
      <button type="button" class="mobile-tile home-tile" data-home-action="more">
        <div class="icon green">☷</div>
        <div><h3>المزيد</h3><p>التقييمات، الأسئلة الشائعة، التواصل، والمساعد.</p></div>
      </button>
    </div>

    <div class="mobile-list-card home-summary-card">
      <div class="mobile-list-row">
        <div>
          <h4>ملخص سريع</h4>
          <p>عدد الطلبات الجديدة الآن: ${fresh} • التقييمات الحالية: ${totalReviews} • جميع الخدمات محدثة داخل المنصة.</p>
        </div>
        <span class="mobile-soft-pill">مباشر</span>
      </div>
    </div>
  `;
  shell.querySelectorAll("[data-home-action]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const action=btn.dataset.homeAction;
      if(action==="services"){ etqanActivateView("services"); }
      if(action==="reports" || action==="track"){ etqanActivateView("reports"); setTimeout(()=>document.getElementById("trackInput")?.focus(),120); }
      if(action==="account"){ etqanActivateView("account"); }
      if(action==="more"){ etqanActivateView("more"); }
      if(action==="order"){ etqanActivateView("services"); setTimeout(()=>document.getElementById("order")?.scrollIntoView({behavior:"smooth",block:"start"}),120); }
    });
  });
}


function etqanBuildServicesRedesign(){
  const view=etqanEnsureMobileHead("services","الخدمات");
  if(!view) return;
  let shell=view.querySelector(".mobile-services-shell");
  if(!shell){
    shell=document.createElement("div");
    shell.className="mobile-services-shell";
    view.insertBefore(shell, view.children[1] || null);
  }
  const directLink=waDirectLink();
  const popular=services.slice(0,4).map(s=>safeText(s.title)).filter(Boolean);
  shell.innerHTML=`
    <div class="mobile-services-hero">
      <div class="mobile-hero-topline">
        <span class="mobile-hero-badge">الخدمات المتاحة</span>
        <div class="mobile-hero-avatar">▦</div>
      </div>
      <h3>اختيار أسرع للخدمات</h3>
      <h2>كل خدمات إتقان في صفحة واحدة</h2>
      <p>ابحث عن الخدمة، راجع الأسعار الإرشادية، ثم انتقل مباشرة إلى إرسال الطلب أو التواصل السريع.</p>
      <div class="mobile-stat-row">
        <div class="mobile-stat"><b>${services.length}</b><span>خدمة</span></div>
        <div class="mobile-stat"><b>${orders.length}</b><span>طلب محفوظ</span></div>
        <div class="mobile-stat"><b>${reviews.length}</b><span>تقييم</span></div>
      </div>
      <div class="mobile-hero-actions">
        <button type="button" class="mobile-solid-action" data-service-action="order">إرسال طلب</button>
        <a class="mobile-outline-action" href="${directLink}" target="_blank" rel="noopener">تواصل سريع</a>
      </div>
    </div>
    <div class="mobile-app-card mobile-service-discovery">
      <div class="mobile-list-row compact">
        <div>
          <h4>الخدمات الأكثر طلبًا</h4>
          <p>اختصارات سريعة للوصول إلى الخدمة ثم تعبئة الطلب من نفس الصفحة.</p>
        </div>
        <span class="mobile-soft-pill">${services.length} خدمة</span>
      </div>
      <div class="mobile-chip-row">
        ${popular.map(name=>`<button type="button" class="mobile-chip" data-service-chip="${name}">${name}</button>`).join("")}
      </div>
    </div>
  `;
  shell.querySelector('[data-service-action="order"]')?.addEventListener("click",()=>{
    document.getElementById("order")?.scrollIntoView({behavior:"smooth",block:"start"});
    setTimeout(()=>document.getElementById("customerName")?.focus(),120);
  });
  shell.querySelectorAll("[data-service-chip]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const name=btn.getAttribute("data-service-chip");
      const input=document.getElementById("mobileServiceSearch");
      if(input){ input.value=name; input.dispatchEvent(new Event("input",{bubbles:true})); }
      document.getElementById("serviceSelect").value=name;
      document.getElementById("order")?.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });
}


function etqanBuildAccountRedesign(){
  const view=etqanEnsureMobileHead("account","حسابي");
  if(!view) return;
  let shell=view.querySelector(".mobile-dashboard-shell");
  if(!shell){
    shell=document.createElement("div");
    shell.className="mobile-dashboard-shell";
    view.insertBefore(shell, view.children[1] || null);
  }
  const logged=!!currentMember;
  const adminMode=etqanIsAdminMode();
  const ordersMine=etqanMemberOrders();
  const memberName=currentMember?.name || currentMember?.username || "ضيف إتقان";
  const specialistName=(settings.username||"المختص").trim() || "المختص";
  const active=ordersMine.filter(o=>["جديد","جاري التنفيذ","جاري"].includes(o.status)).length;
  const done=ordersMine.filter(o=>o.status==="مكتمل").length;
  shell.innerHTML=`
    <div class="mobile-hero-card account-hero ${adminMode ? 'specialist-hero' : ''}">
      <div class="mobile-hero-topline">
        <span class="mobile-hero-badge">${adminMode ? "وضع المختص" : (logged ? "حسابك الشخصي" : "بوابة الأعضاء")}</span>
        <div class="mobile-hero-avatar">${adminMode ? "🛠️" : (logged ? "👤" : "✨")}</div>
      </div>
      <h3>${adminMode ? "حساب المختص" : (logged ? "مرحبًا بك 👋" : "أهلاً بك في حسابي")}</h3>
      <h2>${adminMode ? specialistName : (logged ? memberName : "سجّل الدخول للوصول إلى حسابك")}</h2>
      <p>${adminMode ? "كل أدوات التحكم السريعة أصبحت مباشرة تحت اسم المختص لسهولة الوصول وإدارة المنصة." : (logged ? "استمر في متابعة طلباتك ورسائلك وخدماتك من مكان واحد وبأسلوب أوضح." : "سجّل الدخول أو أنشئ حسابًا جديدًا لمتابعة الطلبات والرسائل والخدمات المخصصة لك.")}</p>
      <div class="mobile-stat-row">
        <div class="mobile-stat"><b>${adminMode ? orders.filter(o=>(o.status||"جديد")==="جديد").length : ordersMine.length}</b><span>${adminMode ? "جديد" : "طلباتي"}</span></div>
        <div class="mobile-stat"><b>${adminMode ? orders.filter(o=>o.status==="جاري التنفيذ").length : active}</b><span>قيد التنفيذ</span></div>
        <div class="mobile-stat"><b>${adminMode ? orders.filter(o=>o.status==="مكتمل").length : done}</b><span>مكتمل</span></div>
      </div>
      ${adminMode ? `
      <div class="mobile-admin-quickbar">
        <button type="button" class="mobile-mini-action" data-admin-action="orders"><span>📦</span><b>الطلبات</b></button>
        <button type="button" class="mobile-mini-action" data-admin-action="members"><span>👥</span><b>الأعضاء</b></button>
        <button type="button" class="mobile-mini-action" data-admin-action="chat"><span>💬</span><b>الرسائل</b></button>
        <button type="button" class="mobile-mini-action" data-admin-action="global"><span>📣</span><b>العامة</b></button>
        <button type="button" class="mobile-mini-action" data-admin-action="services"><span>▦</span><b>الخدمات</b></button>
        <button type="button" class="mobile-mini-action" data-admin-action="settings"><span>⚙️</span><b>الإعدادات</b></button>
        <button type="button" class="mobile-mini-action danger" data-admin-action="logout"><span>↩</span><b>خروج</b></button>
      </div>` : ``}
    </div>
    ${adminMode ? `` : `
    <div class="mobile-specialist-card account-specialist-card">
      <div class="account-specialist-head">
        <div class="account-specialist-icon">🛡️</div>
        <div>
          <span>وصول خاص</span>
          <h2>دخول المختص</h2>
        </div>
      </div>
      <p>إدارة الطلبات والطلاب والرسائل من لوحة المختص مباشرة وبواجهة منظمة.</p>
      <button type="button" class="cta" id="mobileOpenAdminBtn">${document.getElementById("adminPanel")?.classList.contains("hidden")?"فتح لوحة المختص":"لوحة المختص"}</button>
    </div>`}
    <div class="mobile-tile-grid account-tile-grid">
      <button type="button" class="mobile-tile account-tile" data-account-action="profile">
        <div class="icon blue">👤</div><div><h3>${adminMode ? "ملف المختص" : "البيانات الشخصية"}</h3><p>${adminMode ? "عرض حساب المختص والانتقال السريع للأدوات." : (logged?"عرض بياناتك وتحديثها":"تسجيل الدخول أو إنشاء حساب جديد")}</p></div>
      </button>
      <button type="button" class="mobile-tile account-tile" data-account-action="chat">
        <div class="icon">💬</div><div><h3>${adminMode ? "رسائل الأعضاء" : "رسائل المختص"}</h3><p>${adminMode ? "فتح الشات وإدارة المحادثات المباشرة." : "مراسلة المختص وفتح المحادثة الخاصة."}</p></div>
      </button>
      <button type="button" class="mobile-tile account-tile" data-account-action="global">
        <div class="icon green">🔔</div><div><h3>${adminMode ? "الرسائل العامة" : "التنبيهات"}</h3><p>${adminMode ? "إدارة الرسائل العامة المرسلة للأعضاء." : "عرض الرسائل والتنبيهات العامة داخل حسابك."}</p></div>
      </button>
      <button type="button" class="mobile-tile account-tile" data-account-action="services">
        <div class="icon orange">▦</div><div><h3>${adminMode ? "إدارة الخدمات" : "خدماتي"}</h3><p>${adminMode ? "الانتقال السريع لإدارة الخدمات والأسعار." : "الانتقال للخدمات المتاحة وإرسال طلب جديد بسرعة."}</p></div>
      </button>
    </div>
    <div class="mobile-list-card account-list-card">
      <div class="mobile-list-row">
        <div><h4>مظهر المنصة</h4><p>اختر الثيم الذي يناسبك مع وضوح أعلى للنصوص والأيقونات.</p></div>
      </div>
      <div data-theme-picker class="mobile-themes-strip"></div>
    </div>
  `;
  shell.querySelector("#mobileOpenAdminBtn")?.addEventListener("click",()=>etqanAccountAction(true));
  shell.querySelectorAll("[data-admin-action]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const action=btn.dataset.adminAction;
      etqanSetAdminMode(true);
      etqanActivateView("more");
      setTimeout(()=>{
        document.getElementById("admin")?.scrollIntoView({behavior:"smooth",block:"start"});
        if(action==="orders") etqanOpenTab("orders");
        if(action==="members") etqanOpenTab("membersAdmin");
        if(action==="chat") etqanOpenTab("chatAdmin");
        if(action==="global") etqanOpenTab("globalMessagesAdmin");
        if(action==="services") etqanOpenTab("servicesAdmin");
        if(action==="settings") etqanOpenTab("settings");
        if(action==="logout") document.getElementById("logoutBtn")?.click();
      },120);
    });
  });
  shell.querySelectorAll("[data-account-action]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const action=btn.dataset.accountAction;
      if(adminMode){
        if(action==="profile"){ toast("أدوات المختص السريعة تحت الاسم مباشرة"); return; }
        if(action==="chat"){ etqanSetAdminMode(true); etqanActivateView("more"); setTimeout(()=>{document.getElementById("admin")?.scrollIntoView({behavior:"smooth",block:"start"}); etqanOpenTab("chatAdmin");},120); return; }
        if(action==="global"){ etqanSetAdminMode(true); etqanActivateView("more"); setTimeout(()=>{document.getElementById("admin")?.scrollIntoView({behavior:"smooth",block:"start"}); etqanOpenTab("globalMessagesAdmin");},120); return; }
        if(action==="services"){ etqanSetAdminMode(true); etqanActivateView("more"); setTimeout(()=>{document.getElementById("admin")?.scrollIntoView({behavior:"smooth",block:"start"}); etqanOpenTab("servicesAdmin");},120); return; }
      }
      if(action==="profile"){
        if(!logged){ document.getElementById("memberAuth")?.scrollIntoView({behavior:"smooth",block:"start"}); return; }
        document.getElementById("memberDashboard")?.scrollIntoView({behavior:"smooth",block:"start"});
      }
      if(action==="chat"){
        if(!logged){ toast("سجّل دخول العضو أولًا"); return; }
        try{ openMemberChat(); }catch(e){ document.getElementById("memberChatPanel")?.classList.remove("hidden"); }
        document.getElementById("memberChatPanel")?.scrollIntoView({behavior:"smooth",block:"start"});
      }
      if(action==="global"){
        if(!logged){ toast("سجّل دخول العضو أولًا"); return; }
        if(document.getElementById("memberGlobalPanel")?.classList.contains("hidden")) document.getElementById("memberGlobalToggle")?.click();
        document.getElementById("memberGlobalPanel")?.scrollIntoView({behavior:"smooth",block:"start"});
      }
      if(action==="services"){
        etqanActivateView("services");
      }
    });
  });
  etqanRenderThemeSelectors();
}



function etqanBuildReportsRedesign(){
  const view=etqanEnsureMobileHead("reports","التقارير");
  if(!view) return;
  let shell=view.querySelector(".mobile-reports-shell");
  if(!shell){
    shell=document.createElement("div");
    shell.className="mobile-reports-shell";
    view.insertBefore(shell, view.children[1] || null);
  }
  const stats=etqanStatsForView();
  const total=Math.max(stats.total,1);
  const p1=Math.round((stats.done/total)*100);
  const p2=Math.round((stats.progress/total)*100);
  const p3=Math.max(0,100-p1-p2);
  const groups=etqanGroupedReportData();
  const defaultGroupKey=groups[0]?.key||"";
  shell.innerHTML=`
    <div class="mobile-report-hero">
      <div class="mobile-report-hero-top">
        <div>
          <span class="mobile-hero-badge">${etqanIsAdminMode()?"تقارير العملاء":"تقاريرك الخاصة"}</span>
          <h2>${etqanIsAdminMode()?"تقارير العملاء حسب الاسم":"كل تقاريرك في مكان واحد"}</h2>
          <p>${etqanIsAdminMode()?"تم جمع كل الخدمات والتقارير تحت اسم كل عميل، وبالضغط على الاسم تظهر جميع تقاريره.":"لن يظهر لك إلا تقاريرك أنت فقط، وتم جمع كل خدماتك تحت اسمك لسهولة المتابعة."}</p>
        </div>
        <div class="mobile-report-hero-icon">📈</div>
      </div>
      <div class="mobile-report-summary-grid">
        <div class="mobile-report-summary-card fresh"><b>${stats.fresh}</b><span>الجديد</span></div>
        <div class="mobile-report-summary-card progress"><b>${stats.progress}</b><span>قيد المراجعة</span></div>
        <div class="mobile-report-summary-card done"><b>${stats.done}</b><span>المكتمل</span></div>
      </div>
    </div>
    <div class="mobile-chart-card mobile-chart-card-refined">
      <div class="mobile-list-row compact">
        <div><h4>ملخص الأداء</h4><p>${etqanIsAdminMode()?"نظرة عامة على تقارير جميع العملاء داخل المنصة.":"متابعة سريعة لحالة تقاريرك وخدماتك الحالية."}</p></div>
        <span class="mobile-soft-pill">${etqanIsAdminMode()?`${groups.length} عميل`:`${stats.total} تقرير`}</span>
      </div>
      <div class="mobile-chart-layout">
        <div class="progress-donut" style="--p1:${p1}%;--p2:${p2}%">
          <div><b>${stats.total}</b><span>${etqanIsAdminMode()?"إجمالي التقارير":"تقاريرك"}</span></div>
        </div>
        <div class="mobile-chart-legend">
          <div class="mobile-legend-row"><span class="dot done"></span><div><h5>المكتمل</h5><p>${stats.done} عنصر</p></div><b>${p1}%</b></div>
          <div class="mobile-legend-row"><span class="dot progress"></span><div><h5>قيد المراجعة</h5><p>${stats.progress} عنصر</p></div><b>${p2}%</b></div>
          <div class="mobile-legend-row"><span class="dot fresh"></span><div><h5>الجديد</h5><p>${stats.fresh} عنصر</p></div><b>${p3}%</b></div>
        </div>
      </div>
    </div>
    <div class="mobile-report-groups">
      ${groups.length ? groups.map((group,idx)=>`
        <button type="button" class="mobile-report-group-card ${idx===0?"active":""}" data-report-group="${safeText(group.key)}">
          <div class="mobile-list-row compact">
            <div>
              <h4>${safeText(group.label)}</h4>
              <p>${group.total} تقرير • ${group.done} مكتمل • ${group.progress} متابعة</p>
            </div>
            <span class="mobile-soft-pill">${group.fresh} جديد</span>
          </div>
        </button>
      `).join("") : `<div class="mobile-list-card"><div class="mobile-list-row"><div><h4>لا توجد تقارير حتى الآن</h4><p>عند إضافة طلبات أو خدمات ستظهر هنا مباشرة.</p></div></div></div>`}
    </div>
    <div class="mobile-report-detail-panel" id="mobileReportDetailPanel"></div>
  `;
  const detailPanel=shell.querySelector("#mobileReportDetailPanel");
  let modal=shell.querySelector("#mobileReportModal");
  if(!modal){
    modal=document.createElement("div");
    modal.id="mobileReportModal";
    modal.className="mobile-report-modal hidden";
    modal.innerHTML=`
      <div class="mobile-report-modal-backdrop" data-report-modal-close></div>
      <div class="mobile-report-modal-dialog">
        <div class="mobile-report-modal-head">
          <div>
            <span class="mobile-hero-badge">تقارير العميل</span>
            <h3 id="mobileReportModalTitle">تفاصيل التقارير</h3>
          </div>
          <button type="button" class="mobile-report-modal-close" data-report-modal-close>✕</button>
        </div>
        <div class="mobile-report-modal-body" id="mobileReportModalBody"></div>
      </div>
    `;
    shell.appendChild(modal);
  }
  const bindReportOpenButtons=(root)=>{
    root.querySelectorAll("[data-report-open]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const ref=btn.dataset.reportOpen||"";
        const trackInput=document.getElementById("trackInput");
        modal.classList.add("hidden");
        if(trackInput){
          trackInput.value=ref;
          trackInput.focus();
          trackInput.scrollIntoView({behavior:"smooth",block:"center"});
          toast("تم فتح التقرير المحدد");
        }else{
          toast(ref || "تم فتح التقرير");
        }
      });
    });
  };
  const closeModal=()=>modal.classList.add("hidden");
  modal.querySelectorAll("[data-report-modal-close]").forEach(el=>el.onclick=closeModal);
  const openAdminGroupModal=(group)=>{
    if(!group) return;
    const canMessage = !!etqanFindMemberForGroup(group);
    modal.querySelector("#mobileReportModalTitle").textContent=`تقارير ${group.label}`;
    modal.querySelector("#mobileReportModalBody").innerHTML=`
      <div class="mobile-list-card report-owner-head">
        <div class="mobile-list-row compact">
          <div>
            <h4>${safeText(group.label)}</h4>
            <p>كل تقارير الخدمات الخاصة بهذا العميل داخل نافذة مستقلة أوضح وأسهل في التصفح.</p>
          </div>
          <span class="mobile-soft-pill">${group.total} تقرير</span>
        </div>
        <div class="mobile-report-owner-stats">
          <div class="mobile-mini-stat"><strong>${group.total}</strong><span>إجمالي</span></div>
          <div class="mobile-mini-stat"><strong>${group.done}</strong><span>مكتمل</span></div>
          <div class="mobile-mini-stat"><strong>${group.progress}</strong><span>متابعة</span></div>
          <div class="mobile-mini-stat"><strong>${group.fresh}</strong><span>جديد</span></div>
        </div>
        <div class="mobile-modal-actions">
          <button type="button" class="primary small" data-open-group-chat="${safeText(group.key)}" ${canMessage?"":"disabled"}>مراسلة العميل مباشرة</button>
        </div>
      </div>
      <div class="mobile-recent-list grouped-report-list modal-grouped-report-list">
        ${etqanBuildGroupItemsHtml(group)}
      </div>
    `;
    bindReportOpenButtons(modal);
    modal.querySelectorAll("[data-open-group-chat]").forEach(btn=>{
      btn.addEventListener("click",()=>etqanOpenAdminChatFromGroup(group));
    });
    modal.classList.remove("hidden");
  };
  const renderGroupDetails=(key)=>{
    const group=groups.find(g=>String(g.key)===String(key)) || groups[0];
    shell.querySelectorAll("[data-report-group]").forEach(btn=>btn.classList.toggle("active", btn.dataset.reportGroup===String(group?.key||"")));
    if(!group){
      detailPanel.innerHTML=`<div class="mobile-list-card"><div class="mobile-list-row"><div><h4>لا توجد تقارير</h4><p>لا يوجد ما يمكن عرضه الآن.</p></div></div></div>`;
      return;
    }
    if(etqanIsAdminMode()){
      detailPanel.innerHTML=`
        <div class="mobile-list-card report-owner-head admin-report-hint-card">
          <div class="mobile-list-row compact">
            <div>
              <h4>عرض تقارير العميل</h4>
              <p>اضغط على اسم العميل بالأعلى لفتح نافذة مستقلة تعرض جميع تقاريره بشكل أجمل.</p>
            </div>
            <button type="button" class="secondary open-member-reports-btn" data-open-member-reports="${safeText(group.key)}">فتح الآن</button>
          </div>
        </div>
      `;
      detailPanel.querySelector("[data-open-member-reports]")?.addEventListener("click",()=>openAdminGroupModal(group));
      return;
    }
    detailPanel.innerHTML=`
      <div class="mobile-list-card report-owner-head">
        <div class="mobile-list-row compact">
          <div>
            <h4>${safeText(group.label)}</h4>
            <p>هذه جميع تقاريرك المرتبطة بالخدمات المختلفة</p>
          </div>
          <span class="mobile-soft-pill">${group.total} تقرير</span>
        </div>
      </div>
      <div class="mobile-recent-list grouped-report-list">
        ${etqanBuildGroupItemsHtml(group)}
      </div>
    `;
    bindReportOpenButtons(detailPanel);
  };
  shell.querySelectorAll("[data-report-group]").forEach(btn=>btn.addEventListener("click",()=>{
    const group=groups.find(g=>String(g.key)===String(btn.dataset.reportGroup)) || groups[0];
    if(etqanIsAdminMode()) openAdminGroupModal(group);
    else renderGroupDetails(btn.dataset.reportGroup);
  }));
  renderGroupDetails(defaultGroupKey);
}


function etqanBuildMoreRedesign(){
  const view=etqanEnsureMobileHead("more","المزيد");
  if(!view) return;
  let shell=view.querySelector(".mobile-more-shell");
  if(!shell){
    shell=document.createElement("div");
    shell.className="mobile-more-shell";
    view.insertBefore(shell, view.children[1] || null);
  }
  shell.innerHTML=`
    <div class="mobile-hero-card more-hero-card">
      <div class="mobile-hero-topline">
        <span class="mobile-hero-badge">روابط سريعة</span>
        <div class="mobile-hero-avatar">☰</div>
      </div>
      <h3>كل ما تحتاجه في مكان واحد</h3>
      <h2>المزيد</h2>
      <p>وصول مباشر للأسئلة الشائعة، المساعد، التقييمات، التواصل، ولوحة المختص بنفس روح التطبيق.</p>
    </div>
    <div class="mobile-inline-menu refined-more-grid">
      <button type="button" class="mobile-tile" data-more-action="faq"><div class="icon">❓</div><div><h3>الأسئلة الشائعة</h3><p>إجابات سريعة للأسئلة الأكثر شيوعًا.</p></div></button>
      <button type="button" class="mobile-tile" data-more-action="ai"><div class="icon blue">✨</div><div><h3>مساعد إتقان</h3><p>اسأل المساعد الذكي عن الخدمات والطلبات.</p></div></button>
      <button type="button" class="mobile-tile" data-more-action="reviews"><div class="icon orange">★</div><div><h3>التقييمات</h3><p>عرض تقييمات العملاء وإضافة رأيك.</p></div></button>
      <button type="button" class="mobile-tile" data-more-action="support"><div class="icon green">☎</div><div><h3>تواصل معنا</h3><p>واتساب وتلجرام للتواصل السريع.</p></div></button>
      <button type="button" class="mobile-tile" data-more-action="admin"><div class="icon">🧑‍💼</div><div><h3>لوحة المختص</h3><p>فتح دخول المختص أو الانتقال إلى لوحة الإدارة.</p></div></button>
      <button type="button" class="mobile-tile" data-more-action="logout"><div class="icon orange">↩</div><div><h3>تسجيل الخروج</h3><p>خروج العضو الحالي من هذا الجهاز.</p></div></button>
      <div class="mobile-list-card wide more-theme-card">
        <div class="mobile-list-row"><div><h4>الثيمات</h4><p>اختر الثيم الذي يناسبك للتطبيق.</p></div><span class="mobile-soft-pill">مظهر</span></div>
        <div data-theme-picker class="mobile-themes-strip"></div>
      </div>
    </div>
  `;
  shell.querySelectorAll("[data-more-action]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const action=btn.dataset.moreAction;
      if(action==="faq"){ document.getElementById("faq")?.scrollIntoView({behavior:"smooth",block:"start"}); }
      if(action==="ai"){ document.getElementById("ai")?.scrollIntoView({behavior:"smooth",block:"start"}); document.getElementById("aiInput")?.focus(); }
      if(action==="reviews"){ document.getElementById("reviews")?.scrollIntoView({behavior:"smooth",block:"start"}); }
      if(action==="support"){ window.open(waDirectLink(),"_blank"); }
      if(action==="admin"){ etqanAccountAction(true); }
      if(action==="logout"){
        if(currentMember){ document.getElementById("memberLogoutBtn")?.click(); }
        else toast("لا يوجد عضو مسجل حاليًا");
      }
    });
  });
  etqanRenderThemeSelectors();
}

function etqanRefreshSpecialistButtons(){
  const open=!document.getElementById("adminPanel")?.classList.contains("hidden");
  const btn=document.getElementById("topSpecialistBtn");
  if(btn){
    btn.classList.toggle("admin-open", open);
    btn.textContent=open?"🧑‍💼":"👤";
    btn.title=open?"لوحة المختص":"دخول المختص";
    btn.setAttribute("aria-label", btn.title);
  }
  document.querySelectorAll("#mobileOpenAdminBtn").forEach(b=>b.textContent=open?"لوحة المختص":"فتح لوحة المختص");
}
function etqanRebuildMobileDesign(){
  if(!etqanIsMobileShell()) return;
  etqanBuildHomeRedesign();
  etqanBuildServicesRedesign();
  etqanBuildAccountRedesign();
  etqanBuildReportsRedesign();
  etqanBuildMoreRedesign();
  etqanRefreshSpecialistButtons();
}
const _etqanRenderMemberDashboardOriginal=renderMemberDashboard;
renderMemberDashboard=function(){
  _etqanRenderMemberDashboardOriginal();
  etqanRebuildMobileDesign();
};
const _etqanRenderOrdersOriginal=renderOrders;
renderOrders=function(){
  _etqanRenderOrdersOriginal();
  etqanRebuildMobileDesign();
};
const _etqanRenderServicesOriginal2=renderServices;
renderServices=function(){
  _etqanRenderServicesOriginal2();
  if(etqanIsMobileShell()) etqanRenderMobileServiceCards(document.getElementById("mobileServiceSearch")?.value||"");
  etqanRebuildMobileDesign();
};
const _etqanOrigLoginClick = $("#loginBtn").onclick;
$("#loginBtn").onclick = ()=>{ _etqanOrigLoginClick(); setTimeout(etqanRebuildMobileDesign,120); };
const _etqanOrigLogoutClick = $("#logoutBtn").onclick;
$("#logoutBtn").onclick = ()=>{ _etqanOrigLogoutClick(); setTimeout(etqanRebuildMobileDesign,120); };
document.addEventListener("DOMContentLoaded",()=>{
  setTimeout(()=>{
    etqanRebuildMobileDesign();
    etqanRenderThemeSelectors();
    etqanRefreshSpecialistButtons();
  },700);
});
setInterval(()=>{
  if(etqanIsMobileShell()) etqanRefreshSpecialistButtons();
},1200);



function etqanRemoveDuplicateBranding(){
  if(!etqanIsMobileShell()) return;
  const shell=document.getElementById("mobileAppShell");
  if(!shell) return;
  const blocks=[...shell.querySelectorAll("section,div,article")];
  let keepFirst=true;
  blocks.forEach(node=>{
    const text=(node.innerText||"").replace(/\s+/g," ").trim();
    if(!text) return;
    const hasBrand=text.includes("منصة إتقان التعليمية");
    const hasTag=text.includes("خدمات تعليمية احترافية بلمسة إبداعية");
    if(hasBrand && hasTag){
      if(keepFirst) keepFirst=false;
      else node.remove();
    }
  });
}
document.addEventListener("DOMContentLoaded",()=>setTimeout(etqanRemoveDuplicateBranding,700));
setInterval(()=>{ if(etqanIsMobileShell()) etqanRemoveDuplicateBranding(); },1800);



/* ===== Action binding patch: connect all icons and buttons to tasks ===== */
function etqanPrefillOrderForm(serviceName){
  const form=document.getElementById("orderForm");
  const select=document.getElementById("serviceSelect");
  if(select && serviceName){
    const options=[...select.options].map(o=>o.value);
    if(options.includes(serviceName)) select.value=serviceName;
  }
  if(form && currentMember){
    try{
      if(form.name && !form.name.value) form.name.value=currentMember.name || currentMember.username || "";
      if(form.phone && !form.phone.value) form.phone.value=currentMember.phone || "";
    }catch(_e){}
  }
}
function etqanOpenServiceRequest(serviceName, sourceLabel="الخدمة"){
  etqanPrefillOrderForm(serviceName);
  try{ etqanActivateView?.("services"); }catch(_e){}
  etqanScrollTo("#order");
  setTimeout(()=>{ try{ document.querySelector("#orderForm textarea[name='details']")?.focus(); }catch(_e){} },220);
  if(serviceName) toast(`تم فتح الطلب لخدمة: ${serviceName}`);
  else toast(`تم فتح قسم الطلب من ${sourceLabel}`);
}
function etqanBindOnce(el,key,handler){
  if(!el) return;
  const flag="bound_"+key;
  if(el.dataset && el.dataset[flag]==="1") return;
  if(el.dataset) el.dataset[flag]="1";
  el.addEventListener("click",handler);
}
function etqanWireAllInteractiveElements(root=document){
  const scope = root && root.querySelectorAll ? root : document;

  scope.querySelectorAll("#servicesGrid .card").forEach(card=>{
    const serviceName=card.querySelector("h3")?.textContent?.trim() || "";
    etqanBindOnce(card,"openService",e=>{
      if(e.target.closest("a,button")) return;
      etqanOpenServiceRequest(serviceName,"بطاقة الخدمة");
    });
    const icon=card.querySelector(".icon");
    if(icon){
      icon.style.cursor="pointer";
      etqanBindOnce(icon,"openServiceIcon",e=>{
        e.preventDefault(); e.stopPropagation();
        etqanOpenServiceRequest(serviceName,"أيقونة الخدمة");
      });
    }
  });

  scope.querySelectorAll("#pricesGrid .price").forEach(card=>{
    const serviceName=card.querySelector("h3")?.textContent?.replace(/\s+/g," ")?.trim() || "";
    etqanBindOnce(card,"priceOrder",e=>{
      if(e.target.closest("a,button")) return;
      etqanOpenServiceRequest(serviceName.replace(/^[^\w\u0600-\u06FF]+/,""),"بطاقة السعر");
    });
    card.style.cursor="pointer";
    card.title = "اضغط لفتح الطلب لهذه الخدمة";
  });

  scope.querySelectorAll(".adminOnlyLink").forEach(link=>{
    etqanBindOnce(link,"adminGate",e=>{
      if(etqanAdminVerified) return;
      e.preventDefault();
      etqanAccountAction(true);
      toast("سجّل دخول المختص أولاً للوصول إلى هذه الأداة");
    });
  });

  const heroCard = document.querySelector("#home .heroCard");
  if(heroCard){
    heroCard.style.cursor="pointer";
    etqanBindOnce(heroCard,"heroTrack",e=>{
      if(e.target.closest("a,button,input,textarea,select")) return;
      try{ etqanActivateView?.("reports"); }catch(_e){}
      etqanScrollTo("#track");
      document.getElementById("trackInput")?.focus();
      toast("تم فتح تتبع الطلب");
    });
  }

  const offers = scope.querySelectorAll("#offers .offer, #offers .card, .offerCard");
  offers.forEach(card=>{
    const title=card.querySelector("h3,h4,strong")?.textContent?.trim() || "";
    etqanBindOnce(card,"offerAction",e=>{
      if(e.target.closest("a,button")) return;
      etqanOpenServiceRequest(title,"العرض");
    });
    card.style.cursor="pointer";
  });

  scope.querySelectorAll("#why .whyCard, #why .card, .whyItem").forEach(card=>{
    etqanBindOnce(card,"whyAction",e=>{
      if(e.target.closest("a,button")) return;
      etqanScrollTo("#order");
      toast("أرسل متطلباتك وسيتابعها المختص");
    });
    card.style.cursor="pointer";
  });

  const trackInput=document.getElementById("trackInput");
  if(trackInput && !trackInput.dataset.bound_enterTrack){
    trackInput.dataset.bound_enterTrack="1";
    trackInput.addEventListener("keydown",e=>{
      if(e.key==="Enter"){
        e.preventDefault();
        document.getElementById("trackBtn")?.click();
      }
    });
  }

  const specialistBtn=document.getElementById("topSpecialistBtn");
  if(specialistBtn && !specialistBtn.dataset.bound_forceAdminAction){
    specialistBtn.dataset.bound_forceAdminAction="1";
    specialistBtn.addEventListener("click",e=>{
      e.preventDefault();
      etqanAccountAction(true);
    });
  }

  const notifyBtn=document.getElementById("topNotifyBtn");
  if(notifyBtn && !notifyBtn.dataset.bound_notifyFallback){
    notifyBtn.dataset.bound_notifyFallback="1";
    notifyBtn.addEventListener("click",()=>{
      const panel=document.getElementById("memberGlobalPanel");
      if(panel && currentMember){
        panel.classList.remove("hidden");
      }
    });
  }

  scope.querySelectorAll('a[href^="#"]').forEach(link=>{
    if(link.dataset.bound_anchorRouting==="1") return;
    link.dataset.bound_anchorRouting="1";
    link.addEventListener("click",e=>{
      const href=link.getAttribute("href") || "";
      if(href === "#" || !href.startsWith("#")) return;
      const target=document.querySelector(href);
      if(!target) return;
      e.preventDefault();
      etqanScrollTo(href);
    });
  });

  const reviewStars=scope.querySelectorAll(".reviewsMarquee span");
  reviewStars.forEach(item=>{
    etqanBindOnce(item,"reviewFocus",()=>{
      etqanScrollTo("#reviews");
      document.querySelector("#reviewForm input[name='name']")?.focus();
      toast("اكتب تقييمك وسيتم حفظه مباشرة");
    });
    item.style.cursor="pointer";
  });

  const analyticsCards=scope.querySelectorAll("#analytics .analyticsGrid > div");
  analyticsCards.forEach(card=>{
    etqanBindOnce(card,"analyticsToast",()=>{
      toast("هذه الإحصائية محدثة محليًا على هذا الجهاز");
    });
    card.style.cursor="pointer";
  });

  const memberCounts=scope.querySelectorAll("#memberDashboard .memberStats .stat, #memberDashboard .memberOverviewCard, .memberQuickCard");
  memberCounts.forEach(card=>{
    etqanBindOnce(card,"memberCard",()=>{
      etqanScrollTo("#members");
    });
    card.style.cursor="pointer";
  });
}
const _etqanRenderServicesPatched3 = renderServices;
renderServices = function(){
  _etqanRenderServicesPatched3();
  setTimeout(()=>etqanWireAllInteractiveElements(document),80);
};
const _etqanRenderMemberDashboardPatched2 = renderMemberDashboard;
renderMemberDashboard = function(){
  _etqanRenderMemberDashboardPatched2();
  setTimeout(()=>etqanWireAllInteractiveElements(document),80);
};
const _etqanRenderOrdersPatched2 = renderOrders;
renderOrders = function(){
  _etqanRenderOrdersPatched2();
  setTimeout(()=>etqanWireAllInteractiveElements(document),80);
};
document.addEventListener("DOMContentLoaded",()=>{
  setTimeout(()=>etqanWireAllInteractiveElements(document),500);
});


/* ===== ETQAN V4 LUXURY UPGRADE ===== */
(function(){
  if(window.__etqanLuxuryUpgradeV4) return;
  window.__etqanLuxuryUpgradeV4 = true;
  const LUXURY_BUILD = "1781102400";

  function etqanLuxuryDeadlineTone(value){
    const text=String(value||"").trim();
    if(!text) return {label:"مرن",className:"is-normal",note:"يمكن تنفيذ الطلب حسب الجدول المناسب بعد المراجعة."};
    if(/عاجل|اليوم|الليلة|ساعات|ساعة|فوري/.test(text)) return {label:"عاجل",className:"is-fast",note:"سيظهر للمختص أن الطلب ذو أولوية عالية عند المراجعة."};
    if(/غد|بكرة|يوم|48|24|قريب/.test(text)) return {label:"سريع",className:"is-medium",note:"مدة قصيرة؛ يفضّل كتابة جميع المتطلبات بوضوح لتسريع التنفيذ."};
    return {label:"مجدول",className:"is-normal",note:"مدة مناسبة تسمح بمراجعة أفضل وتنسيق أدق."};
  }

  function etqanInjectLuxuryBlocks(){
    const heroText=document.querySelector('#home .heroText');
    const installCard=document.getElementById('homeInstallCard');
    if(heroText && !document.getElementById('heroLuxuryProof')){
      const block=document.createElement('div');
      block.id='heroLuxuryProof';
      block.className='heroLuxuryProof';
      block.innerHTML=`
        <div class="heroLuxuryPill"><b>رد سريع</b><span>قنوات جاهزة للتواصل وبدء الطلب خلال لحظات.</span></div>
        <div class="heroLuxuryPill"><b>تنظيم احترافي</b><span>تجميع التفاصيل في نموذج واضح بدل الرسائل العشوائية.</span></div>
        <div class="heroLuxuryPill"><b>متابعة أسهل</b><span>رقم طلب وحالة تنفيذ لتقليل التشتيت والمتابعة اليدوية.</span></div>
        <div class="heroLuxuryPill"><b>تجربة أفخم</b><span>عرض أقوى للخدمات والطلبات مع واجهة أكثر إقناعًا وثقة.</span></div>
      `;
      (installCard||heroText.lastElementChild||heroText).insertAdjacentElement('afterend',block);
    }

    const heroCard=document.querySelector('#home .heroCard');
    if(heroCard && !document.getElementById('heroQuickTrust')){
      const trust=document.createElement('div');
      trust.id='heroQuickTrust';
      trust.className='heroQuickTrust';
      trust.innerHTML=`
        <div><strong>واتساب</strong><span>تأكيد مباشر</span></div>
        <div><strong>لوحة</strong><span>حفظ وتتبع</span></div>
        <div><strong>مرن</strong><span>مناسب للجوال</span></div>
      `;
      heroCard.appendChild(trust);
    }

    const explorer=document.getElementById('servicesExplorerPanel');
    if(explorer && !document.getElementById('servicesPopularWrap')){
      const wrap=document.createElement('div');
      wrap.id='servicesPopularWrap';
      wrap.className='servicesPopularWrap';
      wrap.innerHTML=`
        <h4>الأسرع طلبًا</h4>
        <div id='servicePopularChips' class='servicePopularChips'></div>
        <div class='servicesExplorerFooter'>
          <p class='hint'>اختر من الخدمات الشائعة وسيتم توجيهك مباشرة إلى نموذج الطلب.</p>
          <a class='secondary' href='#order' id='servicesExplorerCta'>مقارنة سريعة ثم طلب</a>
        </div>
      `;
      explorer.appendChild(wrap);
    }

    const orderForm=document.getElementById('orderForm');
    const orderSection=document.getElementById('order');
    if(orderForm && orderSection && !document.getElementById('etqanOrderShell')){
      const shell=document.createElement('div');
      shell.id='etqanOrderShell';
      shell.className='etqanOrderShell';
      orderSection.appendChild(shell);
      shell.appendChild(orderForm);

      const rows=orderForm.querySelectorAll('.row');
      if(rows[1] && !document.getElementById('deadlineSuggestions')){
        rows[1].insertAdjacentHTML('afterend',`
          <div id='deadlineSuggestions' class='deadlineSuggestions'>
            <button type='button' class='deadlineChip' data-deadline-fill='عاجل اليوم'>عاجل اليوم</button>
            <button type='button' class='deadlineChip' data-deadline-fill='خلال 24 ساعة'>خلال 24 ساعة</button>
            <button type='button' class='deadlineChip' data-deadline-fill='خلال يومين'>خلال يومين</button>
            <button type='button' class='deadlineChip' data-deadline-fill='خلال أسبوع'>خلال أسبوع</button>
          </div>
        `);
      }

      if(!document.getElementById('orderFormPremiumHint')){
        const hint=document.createElement('div');
        hint.id='orderFormPremiumHint';
        hint.className='orderFormPremiumHint';
        hint.innerHTML=`<b>نصيحة سريعة</b><span>كل ما كانت المتطلبات أوضح، كان التسعير والتنفيذ أسرع وأدق.</span>`;
        orderForm.appendChild(hint);
      }

      const aside=document.createElement('aside');
      aside.id='orderPreviewCard';
      aside.className='panel orderPreviewCard';
      aside.innerHTML=`
        <span class='previewEyebrow'>✨ معاينة الطلب قبل الإرسال</span>
        <h3>النسخة الأقوى للطلب</h3>
        <p class='previewLead'>راجع بياناتك بسرعة قبل الحفظ وفتح واتساب، عشان الرسالة توصل أوضح والمختص يفهم الطلب من أول مرة.</p>
        <div class='previewSummary'>
          <div class='previewSummaryItem'><b>العميل</b><span id='previewName'>اسم العميل</span></div>
          <div class='previewSummaryItem'><b>الخدمة</b><span id='previewService'>لم يتم اختيار الخدمة بعد</span></div>
          <div class='previewSummaryItem'><b>الجوال</b><span id='previewPhone'>سيظهر هنا بعد الكتابة</span></div>
          <div class='previewSummaryItem'><b>المدة</b><span><i id='previewDeadlineTag' class='previewDeadlineTag is-normal'>مرن</i></span></div>
          <div class='previewSummaryItem previewDetailsItem'><b>تفاصيل مختصرة</b><span id='previewDetails'>اكتب تفاصيل الطلب لتظهر هنا بشكل مختصر ومنظّم.</span></div>
        </div>
        <div class='orderPreviewHighlights'>
          <div><strong id='previewWords'>0 كلمة تقريبًا</strong><span>قياس سريع لمدى وضوح المتطلبات</span></div>
          <div><strong id='previewReadiness'>جاهز للمراجعة</strong><span>كل ما زادت التفاصيل ارتفعت جاهزية الطلب</span></div>
        </div>
        <p id='previewNote' class='previewNote'>سيتم حفظ الطلب أولًا داخل لوحة المختص، وبعدها يفتح واتساب برسالة مرتبة ومباشرة.</p>
        <div class='orderPreviewActions'>
          <button type='button' class='secondary' id='copyPreviewBtn'>نسخ ملخص الطلب</button>
          <a href='#services' class='primary' id='editServicesBtn'>تعديل الخدمة</a>
        </div>
      `;
      shell.appendChild(aside);
    }
  }

  function etqanRenderPopularServiceChips(){
    const mount=document.getElementById('servicePopularChips');
    if(!mount || !Array.isArray(services)) return;
    const list=services.slice(0,6).filter(Boolean);
    mount.innerHTML=list.map(item=>`<button type='button' class='servicePopularChip' data-popular-service='${safeText(item.title||"")}'><span>${safeText(item.title||"")}</span></button>`).join('');
    mount.querySelectorAll('[data-popular-service]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        etqanOpenServiceRequest(btn.dataset.popularService||'', 'الخدمات الشائعة');
        const select=document.getElementById('serviceSelect');
        if(select && btn.dataset.popularService) select.value=btn.dataset.popularService;
        etqanUpdateOrderPreview();
      });
    });
  }

  function etqanPreviewSummaryText(){
    const form=document.getElementById('orderForm');
    if(!form) return '';
    const name=String(form.elements.name?.value||'').trim();
    const phone=String(form.elements.phone?.value||'').trim();
    const service=String(form.elements.service?.value||'').trim();
    const deadline=String(form.elements.deadline?.value||'').trim();
    const details=String(form.elements.details?.value||'').trim();
    return [
      name?`الاسم: ${name}`:'',
      phone?`الجوال: ${phone}`:'',
      service?`الخدمة: ${service}`:'',
      deadline?`المدة: ${deadline}`:'',
      details?`التفاصيل: ${details}`:''
    ].filter(Boolean).join('\n');
  }

  window.etqanUpdateOrderPreview = function(){
    const form=document.getElementById('orderForm');
    if(!form) return;
    const name=String(form.elements.name?.value||'').trim() || 'اسم العميل';
    const phone=String(form.elements.phone?.value||'').trim() || 'سيظهر هنا بعد الكتابة';
    const service=String(form.elements.service?.value||'').trim() || 'لم يتم اختيار الخدمة بعد';
    const deadline=String(form.elements.deadline?.value||'').trim();
    const detailsRaw=String(form.elements.details?.value||'').trim();
    const details=detailsRaw ? detailsRaw.replace(/\s+/g,' ').slice(0,190) + (detailsRaw.replace(/\s+/g,' ').length>190 ? '...' : '') : 'اكتب تفاصيل الطلب لتظهر هنا بشكل مختصر ومنظّم.';
    const words=detailsRaw ? detailsRaw.split(/\s+/).filter(Boolean).length : 0;
    const readiness = words >= 20 ? 'جاهز جدًا' : words >= 10 ? 'جيد' : words >= 4 ? 'مقبول' : 'يحتاج تفاصيل';
    const tone=etqanLuxuryDeadlineTone(deadline);

    const setText=(id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
    setText('previewName', name);
    setText('previewPhone', phone);
    setText('previewService', service);
    setText('previewDetails', details);
    setText('previewWords', `${words} كلمة تقريبًا`);
    setText('previewReadiness', readiness);
    setText('previewNote', tone.note + ' سيتم فتح واتساب بعد حفظ الطلب برسالة مرتبة وواضحة.');
    const tag=document.getElementById('previewDeadlineTag');
    if(tag){
      tag.textContent=deadline ? `${tone.label} • ${deadline}` : 'مرن';
      tag.className=`previewDeadlineTag ${tone.className}`;
    }
  };

  function etqanBindLuxuryActions(){
    const form=document.getElementById('orderForm');
    if(form && !form.dataset.luxuryPreviewBound){
      form.dataset.luxuryPreviewBound='1';
      ['input','change','keyup'].forEach(evt=>form.addEventListener(evt,()=>window.etqanUpdateOrderPreview()));
      form.addEventListener('submit',()=>{
        const btn=form.querySelector('button[type="submit"]');
        if(!btn) return;
        const original=btn.dataset.originalLabel || btn.textContent;
        btn.dataset.originalLabel=original;
        btn.textContent='جاري حفظ الطلب...';
        setTimeout(()=>{ btn.textContent=btn.dataset.originalLabel || original; }, 2600);
      });
    }

    document.querySelectorAll('[data-deadline-fill]').forEach(btn=>{
      if(btn.dataset.luxuryBound==='1') return;
      btn.dataset.luxuryBound='1';
      btn.addEventListener('click',()=>{
        const input=document.querySelector('#orderForm input[name="deadline"]');
        if(input){
          input.value=btn.dataset.deadlineFill || '';
          window.etqanUpdateOrderPreview();
          input.focus();
        }
      });
    });

    const copyBtn=document.getElementById('copyPreviewBtn');
    if(copyBtn && copyBtn.dataset.luxuryBound!=='1'){
      copyBtn.dataset.luxuryBound='1';
      copyBtn.addEventListener('click',()=>etqanCopyText(etqanPreviewSummaryText(),'تم نسخ ملخص الطلب'));
    }

    const cta=document.getElementById('servicesExplorerCta');
    if(cta && cta.dataset.luxuryBound!=='1'){
      cta.dataset.luxuryBound='1';
      cta.addEventListener('click',()=>setTimeout(()=>window.etqanUpdateOrderPreview(),120));
    }
  }

  function etqanRunLuxuryUpgrade(){
    etqanInjectLuxuryBlocks();
    etqanRenderPopularServiceChips();
    etqanBindLuxuryActions();
    window.etqanUpdateOrderPreview();
  }

  const _renderServicesLuxuryBase = renderServices;
  renderServices = function(){
    _renderServicesLuxuryBase();
    setTimeout(etqanRunLuxuryUpgrade, 60);
  };

  const _renderMemberDashboardLuxuryBase = renderMemberDashboard;
  renderMemberDashboard = function(){
    _renderMemberDashboardLuxuryBase();
    setTimeout(etqanRunLuxuryUpgrade, 60);
  };

  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(etqanRunLuxuryUpgrade, 450);
    setTimeout(()=>{ try{ window.ETQAN_BUILD_VERSION = LUXURY_BUILD; }catch(_e){} }, 100);
  });
})();


/* ===== ETQAN V5 ROYAL CONVERSION UPGRADE ===== */
(function(){
  if(window.__etqanRoyalV5) return;
  window.__etqanRoyalV5 = true;
  const ROYAL_BUILD = "1781108800";

  const esc = (value) => String(value ?? '').replace(/[&<>\"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));

  function pickServiceByHint(hint){
    const field = document.querySelector('#serviceSelect, #orderForm select[name="service"]');
    if(!field) return false;
    const norm = String(hint || '').trim();
    if(!norm) return false;
    const option = Array.from(field.options || []).find(opt => String(opt.textContent || '').includes(norm) || String(opt.value || '').includes(norm));
    if(option){
      field.value = option.value;
      field.dispatchEvent(new Event('change', {bubbles:true}));
      return true;
    }
    return false;
  }

  function jumpToOrder(hint){
    pickServiceByHint(hint);
    const order = document.getElementById('order');
    if(order) order.scrollIntoView({behavior:'smooth', block:'start'});
    if(typeof window.etqanUpdateOrderPreview === 'function'){
      setTimeout(() => window.etqanUpdateOrderPreview(), 120);
    }
  }

  function ensureHeroRibbon(){
    const home = document.getElementById('home');
    const heroText = home?.querySelector('.heroText');
    if(!heroText || document.getElementById('v5HeroRibbon')) return;
    const ribbon = document.createElement('div');
    ribbon.id = 'v5HeroRibbon';
    ribbon.className = 'v5HeroRibbon';
    ribbon.innerHTML = `
      <div class="v5HeroMainCard">
        <span class="v5Eyebrow">نسخة V5 • أعلى تحويل وإقناع</span>
        <h3>واجهة أقوى تخلي العميل يفهم الخدمة ويطلب أسرع</h3>
        <p>رتبنا الانطباع الأول، أبرزنا الخدمات المطلوبة، وخَلّينا مسار الطلب أوضح من أول ضغطة لحد إرسال التفاصيل.</p>
        <div class="v5HeroMetrics">
          <div><strong>طلب أسرع</strong><span>اختيارات مختصرة بدل التشتيت</span></div>
          <div><strong>وضوح أعلى</strong><span>عرض أفخم للخدمات والمزايا</span></div>
          <div><strong>ثقة أكبر</strong><span>رسائل واضحة ومؤشرات جاهزية</span></div>
        </div>
        <div class="v5QuickCategories">
          <button type="button" class="v5QuickCategory" data-v5-service="حل الواجبات">حل الواجبات</button>
          <button type="button" class="v5QuickCategory" data-v5-service="عمل عروض">العروض التقديمية</button>
          <button type="button" class="v5QuickCategory" data-v5-service="عمل أبحاث">الأبحاث</button>
          <button type="button" class="v5QuickCategory" data-v5-service="عمل مشاريع">المشاريع</button>
        </div>
      </div>
      <div class="v5HeroSideCard">
        <span class="v5Eyebrow">جاهزية قبل واتساب</span>
        <h3>طلب مرتب بدل رسائل عشوائية</h3>
        <p>العميل يحدد الخدمة والمدة والتفاصيل بسرعة، والمختص يستقبل الطلب بصيغة أوضح وأسهل للمراجعة والمتابعة.</p>
        <div class="v5MiniChecklist">
          <div><b>1</b><span>اختيار الخدمة خلال ثوانٍ</span></div>
          <div><b>2</b><span>معاينة مختصرة قبل الإرسال</span></div>
          <div><b>3</b><span>انتقال مباشر إلى واتساب بعد الحفظ</span></div>
        </div>
      </div>
    `;
    heroText.insertAdjacentElement('afterend', ribbon);
  }

  function ensureServicesLead(){
    const servicesSection = document.getElementById('services');
    const grid = document.getElementById('servicesGrid');
    if(!servicesSection || !grid) return;
    if(!document.getElementById('v5ServicesLead')){
      const lead = document.createElement('p');
      lead.id = 'v5ServicesLead';
      lead.className = 'v5ServicesLead';
      lead.textContent = 'اختر من أبرز الخدمات مباشرة، وابدأ الطلب من مسار أسرع وأنظف يرفع احتمالية الإرسال الفوري.';
      grid.insertAdjacentElement('beforebegin', lead);
    }
    if(!document.getElementById('v5SectionDivider')){
      const divider = document.createElement('div');
      divider.id = 'v5SectionDivider';
      divider.className = 'v5SectionDivider';
      divider.innerHTML = '<span>اختيار سريع • عرض أوضح • طلب أسرع</span>';
      grid.insertAdjacentElement('beforebegin', divider);
    }
  }

  function decorateServiceCards(){
    const selectors = ['#servicesGrid > *', '#pricesGrid > *'];
    const cards = selectors.flatMap(sel => Array.from(document.querySelectorAll(sel)));
    let rank = 0;
    cards.forEach((card) => {
      if(!(card instanceof HTMLElement)) return;
      card.classList.add('v5ServiceGlow');
      if(!card.querySelector('.v5ServiceBadge') && rank < 4){
        const badge = document.createElement('span');
        badge.className = 'v5ServiceBadge';
        badge.textContent = rank === 0 ? 'الأكثر جذبًا' : rank === 1 ? 'طلب سريع' : rank === 2 ? 'اختيار شائع' : 'مناسب للجوال';
        card.insertAdjacentElement('afterbegin', badge);
        rank += 1;
      }
    });
  }

  function ensureTrustBoard(){
    const order = document.getElementById('order');
    if(!order || document.getElementById('v5TrustBoard')) return;
    const board = document.createElement('div');
    board.id = 'v5TrustBoard';
    board.className = 'v5TrustBoard';
    board.innerHTML = `
      <div class="v5TrustCard"><strong>تنظيم أعلى</strong><span>التفاصيل تتجمع في نقطة واحدة بدل المحادثات المتفرقة.</span></div>
      <div class="v5TrustCard"><strong>إقناع أفضل</strong><span>العميل يشوف الخدمات والمزايا بشكل أوضح وأفخم.</span></div>
      <div class="v5TrustCard"><strong>متابعة أسهل</strong><span>حفظ الطلب قبل واتساب يساعد في الرجوع السريع للحالة.</span></div>
      <div class="v5TrustCard"><strong>جوال أولًا</strong><span>التجربة محافظة على سرعة ووضوح ممتازين على الهاتف.</span></div>
    `;
    order.insertAdjacentElement('beforebegin', board);
  }

  function ensureStickyBar(){
    if(document.getElementById('v5StickyCtaBar')) return;
    const waBtn = document.getElementById('floatingWhatsappBtn') || document.getElementById('directWhatsappBtn') || document.getElementById('heroWhatsappBtn');
    const wrap = document.createElement('div');
    wrap.id = 'v5StickyCtaBar';
    wrap.className = 'v5StickyCtaBar';
    wrap.innerHTML = `
      <button type="button" class="v5StickyPrimary" id="v5QuickOrderBtn">ابدأ الطلب الآن</button>
      <a class="v5StickySecondary" id="v5StickyWaBtn" href="#">واتساب مباشر</a>
    `;
    document.body.appendChild(wrap);
    const btn = document.getElementById('v5QuickOrderBtn');
    if(btn) btn.addEventListener('click', () => jumpToOrder(''));
    const stickyWa = document.getElementById('v5StickyWaBtn');
    if(stickyWa && waBtn){
      const href = waBtn.getAttribute('href') || '#';
      stickyWa.setAttribute('href', href);
      stickyWa.addEventListener('click', (e) => {
        if(href === '#') e.preventDefault();
      });
    }
  }

  function bindRoyalActions(){
    document.querySelectorAll('[data-v5-service]').forEach((btn) => {
      if(btn.dataset.v5Bound === '1') return;
      btn.dataset.v5Bound = '1';
      btn.addEventListener('click', () => jumpToOrder(btn.dataset.v5Service || ''));
    });
  }

  function runRoyalUpgrade(){
    ensureHeroRibbon();
    ensureServicesLead();
    decorateServiceCards();
    ensureTrustBoard();
    ensureStickyBar();
    bindRoyalActions();
    try{ window.ETQAN_BUILD_VERSION = ROYAL_BUILD; }catch(_e){}
  }

  const _renderServicesBaseV5 = typeof renderServices === 'function' ? renderServices : null;
  if(_renderServicesBaseV5){
    renderServices = function(){
      _renderServicesBaseV5();
      setTimeout(runRoyalUpgrade, 80);
    };
  }

  const _renderMemberDashboardBaseV5 = typeof renderMemberDashboard === 'function' ? renderMemberDashboard : null;
  if(_renderMemberDashboardBaseV5){
    renderMemberDashboard = function(){
      _renderMemberDashboardBaseV5();
      setTimeout(runRoyalUpgrade, 80);
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runRoyalUpgrade, 500);
  });
})();


/* ===== ETQAN V6 PERSUASION & CONVERSION UPGRADE ===== */
(function(){
  if(window.__etqanV6Persuasion) return;
  window.__etqanV6Persuasion = true;

  const safe = (v)=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function goOrder(service='', pack=''){
    const sel=document.querySelector('#serviceSelect');
    if(sel && service){
      const opt=[...sel.options].find(o=>(o.textContent||'').includes(service) || (o.value||'').includes(service));
      if(opt) sel.value=opt.value;
    }
    const pkg=document.querySelector('#orderForm [name="package"]');
    if(pkg && pack) pkg.value=pack;
    document.getElementById('order')?.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>{try{window.etqanUpdateOrderPreview?.()}catch(e){}},150);
  }

  function ensurePersuasionHero(){
    const home=document.getElementById('home');
    if(!home || document.getElementById('v6ConversionProof')) return;
    const block=document.createElement('section');
    block.id='v6ConversionProof';
    block.className='v6ConversionProof section reveal';
    block.innerHTML=`
      <div class="v6ProofHead">
        <span>لماذا العميل يطلب من هنا؟</span>
        <h2>منصة تبدو منظمة، مو مجرد رقم واتساب</h2>
        <p>العميل يشوف خدمة واضحة، باقة مناسبة، خطوات مفهومة، ثم يرسل طلب مكتمل يساعد المختص على التسعير والرد بسرعة.</p>
      </div>
      <div class="v6ProofGrid">
        <div><b>01</b><strong>اختيار سريع</strong><p>خدمات وباقات مختصرة تقلل التردد.</p></div>
        <div><b>02</b><strong>طلب واضح</strong><p>حقول ذكية تجمع المستوى والمدة والحجم.</p></div>
        <div><b>03</b><strong>ثقة أعلى</strong><p>ضمانات واضحة ومسار متابعة بعد الإرسال.</p></div>
        <div><b>04</b><strong>تحويل مباشر</strong><p>واتساب يفتح برسالة جاهزة ومقنعة.</p></div>
      </div>`;
    home.insertAdjacentElement('afterend',block);
  }

  function ensurePackages(){
    const prices=document.getElementById('prices');
    if(!prices || document.getElementById('v6Packages')) return;
    const section=document.createElement('section');
    section.id='v6Packages';
    section.className='v6Packages section reveal';
    section.innerHTML=`
      <div class="sectionHead"><h2>باقات تساعد العميل يقرر بسرعة</h2><p>بدل السؤال المفتوح، الباقات تعطي العميل إحساس بالوضوح والاحتراف.</p></div>
      <div class="v6PackageGrid">
        <article class="v6PackageCard"><span>اقتصادية</span><h3>باقة أساسية</h3><p>مناسبة للمهام البسيطة والطلبات الواضحة.</p><ul><li>تنفيذ مرتب</li><li>تسليم بصيغة مناسبة</li><li>تواصل واتساب</li></ul><button type="button" data-v6-package="أساسية">اختيار الباقة</button></article>
        <article class="v6PackageCard featured"><em>الأكثر طلبًا</em><span>متوازنة</span><h3>باقة احترافية</h3><p>أفضل خيار لمعظم التقارير والعروض والأبحاث.</p><ul><li>تنسيق وتدقيق أفضل</li><li>مراجعة قبل التسليم</li><li>تعديلات حسب الاتفاق</li></ul><button type="button" data-v6-package="احترافية">اختيار الباقة</button></article>
        <article class="v6PackageCard"><span>أولوية</span><h3>باقة VIP</h3><p>للطلبات العاجلة أو المهمة التي تحتاج متابعة أعلى.</p><ul><li>أولوية في الرد</li><li>متابعة أوضح</li><li>تسليم منظم ومميز</li></ul><button type="button" data-v6-package="VIP">اختيار الباقة</button></article>
      </div>`;
    prices.insertAdjacentElement('beforebegin',section);
    section.querySelectorAll('[data-v6-package]').forEach(btn=>btn.addEventListener('click',()=>goOrder('',btn.dataset.v6Package||'')));
  }

  function ensureProcess(){
    const order=document.getElementById('order');
    if(!order || document.getElementById('v6Process')) return;
    const section=document.createElement('section');
    section.id='v6Process';
    section.className='v6Process section reveal';
    section.innerHTML=`
      <div class="sectionHead"><h2>كيف يتم تنفيذ الطلب؟</h2><p>مسار واضح يقلل الأسئلة ويزيد ثقة العميل قبل الدفع أو الاتفاق.</p></div>
      <div class="v6Timeline">
        <div><i>1</i><strong>أرسل التفاصيل</strong><span>الخدمة، المستوى، المدة، والمتطلبات.</span></div>
        <div><i>2</i><strong>مراجعة المختص</strong><span>يتم فهم الطلب وتحديد السعر والموعد.</span></div>
        <div><i>3</i><strong>بدء التنفيذ</strong><span>متابعة حسب الاتفاق وحالة الطلب.</span></div>
        <div><i>4</i><strong>تسليم منظم</strong><span>ملفات واضحة مع إمكانية ملاحظات بعد التسليم.</span></div>
      </div>`;
    order.insertAdjacentElement('beforebegin',section);
  }

  function enhanceOrderForm(){
    const form=document.getElementById('orderForm');
    if(!form || document.getElementById('v6OrderFields')) return;
    const rows=form.querySelectorAll('.row');
    const target=rows[1] || form.firstElementChild;
    const extra=document.createElement('div');
    extra.id='v6OrderFields';
    extra.className='v6OrderFields';
    extra.innerHTML=`
      <div class="row">
        <label>المستوى الدراسي
          <select name="level"><option value="">اختر إن وجد</option><option>ثانوي</option><option>دبلوم</option><option>بكالوريوس</option><option>ماجستير</option><option>تدريب/تطبيقي</option><option>أخرى</option></select>
        </label>
        <label>الباقة المناسبة
          <select name="package"><option value="">اختيار تلقائي/لاحق</option><option>أساسية</option><option>احترافية</option><option>VIP</option></select>
        </label>
      </div>
      <div class="row">
        <label>الحجم التقريبي<input name="pages" placeholder="مثال: 5 صفحات / 12 شريحة / ملف برمجي"></label>
        <label>أسلوب التسليم
          <select name="deliveryStyle"><option value="">حسب المتطلبات</option><option>ملف Word</option><option>PowerPoint</option><option>PDF</option><option>ملفات مشروع</option><option>أكثر من صيغة</option></select>
        </label>
      </div>
      <div class="v6SmartQuote"><b id="v6QuoteTitle">تقدير ذكي</b><span id="v6QuoteText">املأ الحقول وسنقترح لك الباقة الأنسب قبل الإرسال.</span></div>`;
    target.insertAdjacentElement('afterend',extra);
    form.addEventListener('input',updateSmartQuote);
    form.addEventListener('change',updateSmartQuote);
    updateSmartQuote();
  }

  function updateSmartQuote(){
    const form=document.getElementById('orderForm');
    if(!form) return;
    const service=String(form.elements.service?.value||'');
    const deadline=String(form.elements.deadline?.value||'');
    const details=String(form.elements.details?.value||'');
    const pages=String(form.elements.pages?.value||'');
    let pkg='أساسية';
    if(/عاجل|اليوم|24/.test(deadline) || /مشروع|برمجة|بحث|ماجستير/.test(service+details+pages)) pkg='VIP';
    else if(details.length>80 || /عرض|تقرير|بحث|شرائح|صفحات/.test(service+pages)) pkg='احترافية';
    const title=document.getElementById('v6QuoteTitle');
    const text=document.getElementById('v6QuoteText');
    if(title) title.textContent=`الباقة المقترحة: ${pkg}`;
    if(text) text.textContent = pkg==='VIP' ? 'مناسب للطلبات العاجلة أو التي تحتاج متابعة وتنسيق أعلى.' : pkg==='احترافية' ? 'مناسب لمعظم الطلبات التي تحتاج جودة وتنسيق ومراجعة.' : 'مناسب للطلبات البسيطة والواضحة.';
  }

  function ensureGuarantee(){
    const order=document.getElementById('order');
    if(!order || document.getElementById('v6Guarantee')) return;
    const box=document.createElement('div');
    box.id='v6Guarantee';
    box.className='v6Guarantee';
    box.innerHTML=`
      <div><strong>ضمان وضوح قبل التنفيذ</strong><span>لن يبدأ الاتفاق إلا بعد فهم المتطلبات والمدة والسعر بشكل واضح.</span></div>
      <div><strong>سرية وخصوصية</strong><span>المعلومات تُستخدم فقط للتواصل وتنفيذ الطلب.</span></div>
      <div><strong>تعديلات حسب الاتفاق</strong><span>يمكن توضيح الملاحظات بعد التسليم ضمن نطاق الطلب.</span></div>`;
    order.appendChild(box);
  }

  function bindButtons(){
    document.querySelectorAll('[data-v6-package]').forEach(btn=>{
      if(btn.dataset.v6Bound) return;
      btn.dataset.v6Bound='1';
      btn.addEventListener('click',()=>goOrder('',btn.dataset.v6Package||''));
    });
  }

  function run(){
    ensurePersuasionHero();
    ensurePackages();
    ensureProcess();
    enhanceOrderForm();
    ensureGuarantee();
    bindButtons();
    updateSmartQuote();
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(run,700));
  const oldRender=typeof renderServices==='function'?renderServices:null;
  if(oldRender){renderServices=function(){oldRender();setTimeout(run,120);};}
})();

/* Saudi student conversion behavior */
(function(){
  function setService(service){
    const select=document.getElementById('serviceSelect');
    if(select){
      const found=[...select.options].find(o=>o.textContent.trim()===service || o.value===service);
      if(found) select.value=found.value;
    }
    const order=document.getElementById('order');
    if(order) order.scrollIntoView({behavior:'smooth',block:'start'});
    const details=document.querySelector('#orderForm textarea[name="details"]');
    if(details && !details.value.trim()) details.value=`أحتاج خدمة: ${service}\nالموعد المطلوب:\nعدد الصفحات/الشرائح إن وجد:\nالتعليمات:`;
    try{ updateSmartQuote?.(); }catch(_e){}
  }
  function enhanceSaudiUX(){
    document.querySelectorAll('[data-service-pick]').forEach(a=>{
      if(a.dataset.saBound) return;
      a.dataset.saBound='1';
      a.addEventListener('click',()=>setTimeout(()=>setService(a.dataset.servicePick||''),80));
    });
    if(!document.getElementById('saFloatingCta')){
      const a=document.createElement('a');
      a.id='saFloatingCta';
      a.className='saFloatingCta';
      a.href='#order';
      a.innerHTML='<span>اطلب الآن</span><small>خلال دقيقة</small>';
      document.body.appendChild(a);
    }
    const form=document.getElementById('orderForm');
    if(form && !document.getElementById('saCompactNote')){
      const note=document.createElement('div');
      note.id='saCompactNote';
      note.className='saCompactNote';
      note.textContent='اكتب التفاصيل الأساسية فقط، وبعد الإرسال كمل الملفات والصور عبر واتساب.';
      form.insertBefore(note, form.firstChild);
    }
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(enhanceSaudiUX,800));
  const previousRender = typeof renderServices==='function' ? renderServices : null;
  if(previousRender){
    renderServices=function(){ previousRender(); setTimeout(enhanceSaudiUX,100); };
  }
})();
