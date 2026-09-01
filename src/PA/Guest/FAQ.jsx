import { useState } from 'react'

export default function FAQ() {
  const [activeFaq, setActiveFaq] = useState(null)

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const faqData = [
    {
      q: "Apa itu UPT PSTW Khusnul Khotimah?",
      a: "Tempat rehabilitasi dan pelayanan sosial resmi milik pemerintah daerah untuk para lansia agar mendapat penghidupan yang layak."
    },
    {
      q: "Bantuan apa saja yang diberikan?",
      a: "Penyediaan tempat tinggal, makan dan pakaian layak, perawatan kesehatan dasar, bimbingan rohani/agama, serta kegiatan rekreasi atau keterampilan ringan. "
    },
    {
      q: "Siapa yang berhak mendapat layanan?",
      a: "Prioritas utama adalah lansia terlantar, kurang mampu, atau tidak memiliki keluarga yang merawat di wilayah Provinsi Riau."
    }
  ]

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-emerald-700 tracking-wider uppercase mb-3">TANYA JAWAB</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
            Pertanyaan yang Sering Diajukan
          </p>
          <p className="text-base text-stone-600 max-w-xl mx-auto">
            Masih ragu atau ingin tahu lebih dalam? Kami merangkum beberapa hal mendasar yang sering ditanyakan keluarga calon residen kami.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full p-6 text-left flex items-center justify-between font-bold text-stone-900 text-base sm:text-lg focus:outline-none hover:text-emerald-700 transition-colors"
              >
                <span>{faq.q}</span>
                <span className={`bg-stone-100 p-2 rounded-xl text-stone-500 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-emerald-700 bg-emerald-50' : ''}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              {/* Answer panel */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === i ? 'max-h-[500px] border-t border-stone-100' : 'max-h-0'}`}
              >
                <p className="p-6 text-sm sm:text-base text-stone-600 leading-relaxed text-left">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
