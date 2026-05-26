export default function EtqanDashboard() {
  const services = [
    { title: 'كيبة السداد', icon: '💳' },
    { title: 'كيبة WIFI', icon: '📶' },
    { title: 'البرامج', icon: '📱' },
    { title: 'معرض الالعاب', icon: '🎮' },
    { title: 'غذي حسابك', icon: '💼' },
    { title: 'ادارة العملاء', icon: '⚙️' },
    { title: 'الدفتر المحاسبي', icon: '📊' },
    { title: 'الدعم الفني', icon: '🎧' },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f4f4]">
      <div className="bg-[#5b4487] rounded-b-[45px] px-5 pt-6 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button className="w-16 h-16 rounded-3xl bg-white/10 text-white text-3xl">☰</button>
            <button className="relative w-16 h-16 rounded-3xl bg-white/10 text-white text-3xl">
              🔔
              <span className="absolute -top-2 -left-2 bg-red-500 text-white text-sm w-8 h-8 rounded-full flex items-center justify-center">
                37
              </span>
            </button>
          </div>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            className="w-20 h-20 rounded-full border-4 border-white"
          />
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-5xl font-black text-white">
            منصة إتقان التعليمية
          </h1>

          <p className="text-white/80 text-xl mt-5">
            خدمات تعليمية احترافية بلمسة إبداعية
          </p>
        </div>
      </div>

      <div className="px-5 mt-10">
        <h2 className="text-4xl font-black mb-8">
          الخدمات الأساسية
        </h2>

        <div className="grid grid-cols-4 gap-5">
          {services.map((service, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-24 h-24 rounded-3xl bg-white shadow-lg flex items-center justify-center text-4xl">
                {service.icon}
              </div>

              <span className="text-sm font-bold text-center">
                {service.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="grid grid-cols-5 text-center">
          <button>الرئيسية</button>
          <button>الخدمات</button>
          <button>حسابي</button>
          <button>التقارير</button>
          <button>المزيد</button>
        </div>
      </div>
    </div>
  );
}
