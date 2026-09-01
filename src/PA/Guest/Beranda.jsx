import { Link } from 'react-router-dom'

export default function Beranda() {
  const stats = [
    { value: "40+", label: "Tahun Pengalaman", desc: "Mengasuh dengan ketulusan hati" },
    { value: "24/7", label: "Siaga Medis", desc: "Perawat & dokter standby setiap saat" },
    { value: "120+", label: "Lansia", desc: "Telah merasakan kehangatan keluarga kami" }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:py-32 overflow-hidden bg-gradient-to-b from-amber-50/40 via-stone-50 to-stone-50">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full filter blur-3xl opacity-60 -z-10 translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-amber-100/40 rounded-full filter blur-3xl opacity-50 -z-10 -translate-x-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="md:col-span-7 flex flex-col text-left space-y-6">

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-[1.12] tracking-tight">
                Masa Tua yang <br />
                <span className="text-gradient">Bahagia & Penuh Kasih</span>
              </h1>

              <p className="text-lg text-stone-600 max-w-xl leading-relaxed">
                Kami menyediakan hunian ramah lansia yang aman, asri, dan hangat. Didukung oleh tim medis profesional 24 jam serta beragam aktivitas seru demi mewujudkan hidup yang mandiri, bermakna, dan berkualitas.
              </p>

              {/* Dual CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/kontak"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-center px-8 py-4 rounded-full text-base font-bold shadow-lg shadow-emerald-950/10 hover:shadow-emerald-950/20 -translate-y-[1px] hover:-translate-y-[2px] transition-all"
                >
                  Konsultasi Gratis
                </Link>
                <Link
                  to="/fasilitas"
                  className="border-2 border-stone-800 hover:bg-stone-900 hover:text-white text-stone-800 text-center px-8 py-3.5 rounded-full text-base font-bold transition-all"
                >
                  Lihat Fasilitas Kami
                </Link>
              </div>

              {/* Key Trust Checkmarks */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-stone-200/80 max-w-md">
                <div className="flex items-center gap-2 text-stone-700 text-sm font-semibold">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Perawat Medis 24/7
                </div>
                <div className="flex items-center gap-2 text-stone-700 text-sm font-semibold">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Diet Gizi Terspesialisasi
                </div>
                <div className="flex items-center gap-2 text-stone-700 text-sm font-semibold">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lingkungan Taman Asri
                </div>
                <div className="flex items-center gap-2 text-stone-700 text-sm font-semibold">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Laporan Kesehatan Rutin
                </div>
              </div>

            </div>

            {/* Right Media Column */}
            <div className="md:col-span-5 relative mt-6 md:mt-0">
              {/* Premium Picture with custom styling */}
              <div className="relative mx-auto w-full max-w-[450px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-[10px] border-white bg-white">
                <img
                  src="/img/"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Outer decorative items */}
              <div className="absolute -bottom-6 -left-6 bg-amber-500 text-stone-950 px-6 py-4 rounded-2xl font-black text-center shadow-lg border-2 border-white -rotate-6 hidden sm:block">
                <p className="text-2xl font-bold -mb-1">100%</p>
                <p className="text-[10px] uppercase tracking-wider font-semibold">Penuh Kasih Sayang</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Statistics Bar */}
      <section className="bg-emerald-900 text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-amber-400">{stat.value}</span>
                <span className="text-base font-bold text-stone-100">{stat.label}</span>
                <span className="text-xs text-emerald-200/80 max-w-[180px]">{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
