export default function Fasilitas() {
  const facilities = [
    {
      title: "Kamar Tidur dan Bangsal",
      desc: "Ruang istirahat layak huni yang bersih, aman, dan nyaman bagi para lansia selama tinggal di panti.",
      image: "/img/"
    },
    {
      title: "Kebutuhan Sehat & Makan",
      desc: "Penjadwalan makan harian dengan menu gizi seimbang serta dukungan pemeriksaan kesehatan dasar berkala.",
      image: "/img/"
    },
    {
      title: "Bimbingan Fisik dan Mental",
      desc: "Kegiatan rutin senam lansia, jalan santai keliling panti, pembinaan keterampilan produktif, serta bimbingan rohani/spiritual.",
      image: "/img/"
    },
    {
      title: "Sarana Pendukung",
      desc: "Area taman hijau yang asri dan fasilitas ruang bersama untuk saling berinteraksi dan bersosialisasi antar lansia.",
      image: "/img/"
    }
  ]

  return (
    <section className="py-24 bg-stone-100/60 border-y border-stone-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-700 tracking-wider uppercase mb-3">Fasilitas Layanan dan Sarana</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
            Mendukung Kenyamanan &amp; Kesejahteraan Lansia
          </p>
          <p className="text-base text-stone-600">
            UPT. Pelayanan Sosial Tresna Werdha Khusnul Khotimah menyediakan sarana prasarana layak huni serta program dukungan kesehatan, fisik, dan spiritual untuk menunjang kehidupan hari tua lansia terlantar secara layak.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {facilities.map((fac, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-stone-200/50 shadow-sm flex flex-col sm:flex-row group">
              <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden relative">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors"></div>
              </div>
              <div className="p-8 sm:w-3/5 flex flex-col justify-center text-left">
                <h3 className="text-lg font-bold text-stone-900 mb-2">{fac.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">{fac.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
