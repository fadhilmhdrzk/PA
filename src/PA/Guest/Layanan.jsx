import { Link } from 'react-router-dom'

export default function Layanan() {
  const services = [
    {
      title: "Kebutuhan Fisik",
      desc: "Penyediaan tempat tinggal layak huni (wisma/asrama), pakaian, serta pemenuhan konsumsi dan nutrisi harian lansia.",
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Perawatan Kesehatan",
      desc: "Pemeriksaan kesehatan fisik rutin harian/mingguan, pengelolaan obat-obatan, serta pendampingan medis dasar oleh perawat panti.",
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Bimbingan Mental & Spiritual",
      desc: "Kegiatan keagamaan rutin, pengajian bersama, ceramah rohani, dan pembinaan sikap hidup berkeluarga berlandaskan iman dan takwa.",
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Bimbingan Sosial & Psikososial",
      desc: "Konseling individu, terapi aktivitas kognitif/seni kelompok, serta fasilitasi interaksi sosial guna menjaga kestabilan psikologis dan emosi.",
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Pemeliharaan & Terminasi",
      desc: "Layanan perlindungan hak berkelanjutan hingga pendampingan proses pemakaman dan akhir hayat lansia sesuai standar operasional panti.",
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ]

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-700 tracking-wider uppercase mb-3">Program Layanan</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
            Rehabilitasi Sosial Dasar Lanjut Usia Terpadu
          </p>
          <p className="text-base text-stone-600">
            UPT. Pelayanan Sosial Tresna Werdha Khusnul Khotimah menyelenggarakan pelayanan rehabilitasi sosial dasar bagi lanjut usia terlantar guna memulihkan fungsi sosial mereka secara manusiawi.
          </p>
        </div>

        {/* Grid Cards (3 Column layout for better spacing of 5 cards) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-stone-200/60 card-hover flex flex-col text-left justify-between shadow-sm transform hover:scale-[1.02] transition-all duration-300">
              <div>
                <div className="bg-emerald-50 p-4 rounded-2xl w-fit mb-6 text-emerald-600">
                  {svc.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{svc.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{svc.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link to="/kontak" className="text-emerald-700 hover:text-emerald-800 text-xs font-bold inline-flex items-center gap-1">
                  Tanya Lebih Lanjut
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
