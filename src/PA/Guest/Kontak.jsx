import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Kontak() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    careType: 'asuhan_harian',
    message: ''
  })

  // Handle Supabase form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const { error } = await supabase
        .from('pesan_konsultasi')
        .insert([
          {
            nama: formData.name,
            no_whatsapp: formData.phone,
            pesan: formData.message || ''
          }
        ])

      if (error) throw error

      setFormSubmitted(true)
      setFormData({ name: '', phone: '', careType: 'asuhan_harian', message: '' })
      setTimeout(() => {
        setFormSubmitted(false)
      }, 5000)
    } catch (err) {
      console.error(err)
      setErrorMessage('Gagal mengirim formulir. Silakan coba beberapa saat lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-24 bg-stone-100/60 border-t border-stone-200/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Form Card */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-[2rem] border border-stone-200/50 shadow-xl shadow-stone-900/5 flex flex-col justify-between text-left">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-2">Konsultasi Rencana</h3>
              <p className="text-sm sm:text-base text-stone-600 mb-8 leading-relaxed">
                Isi formulir singkat di bawah ini. Tim kami akan menghubungi Anda kembali dalam waktu maksimal 24 jam untuk menjawab pertanyaan Anda.
              </p>

              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-6 rounded-2xl text-center space-y-3 animate-fade-in mb-6">
                  <div className="bg-emerald-600 text-white p-3 rounded-full w-fit mx-auto shadow-md">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-extrabold text-lg">Pesan Berhasil Terkirim!</h4>
                  <p className="text-sm text-stone-600">
                    Terima kasih atas kepercayaan Anda. Konselor lansia kami sedang memproses permintaan Anda dan akan segera menghubungi nomor telepon Anda.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Nama Lengkap Anda</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors placeholder:text-stone-400 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">No. WhatsApp / Telepon</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contoh: 081234567890"
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors placeholder:text-stone-400 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Pesan</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors placeholder:text-stone-400 text-sm font-semibold"
                    ></textarea>
                  </div>

                  {errorMessage && (
                    <p className="text-xs font-bold text-rose-650 bg-rose-50 border border-rose-100 p-3 rounded-xl text-center">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-950/10 hover:shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider`}
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Formulir Konsultasi'}
                    {!isSubmitting && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Contact details card */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            
            {/* Card 1: Details */}
            <div className="bg-emerald-900 text-white p-8 sm:p-10 rounded-[2rem] flex flex-col justify-between flex-grow shadow-xl">
              <div className="space-y-6">
                <h4 className="text-xl font-bold tracking-tight text-amber-400 border-b border-emerald-800 pb-3">Informasi Hubungi Kami</h4>
                
                <div className="space-y-4">
                  {/* Alamat */}
                  <div className="flex gap-4 items-start">
                    <div className="bg-emerald-800 p-2.5 rounded-xl text-emerald-300 mt-1 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-emerald-300 tracking-wider uppercase">Alamat Panti</h5>
                      <p className="text-sm font-semibold mt-0.5 leading-relaxed text-stone-100">
                        Jl. Kaharuddin Nst No.116, Perhentian Marpoyan, Kec. Marpoyan Damai, Kota Pekanbaru, Riau 28288
                      </p>
                    </div>
                  </div>

                  {/* Kontak Telp/WA */}
                  <div className="flex gap-4 items-start">
                    <div className="bg-emerald-800 p-2.5 rounded-xl text-emerald-300 mt-1 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-emerald-300 tracking-wider uppercase">Telepon / WhatsApp</h5>
                      <p className="text-sm font-semibold mt-0.5 text-stone-100">+62 812-3456-7890</p>
                      <p className="text-[11px] text-emerald-200/70">(Konseling fast-response 24/7)</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4 items-start">
                    <div className="bg-emerald-800 p-2.5 rounded-xl text-emerald-300 mt-1 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-emerald-300 tracking-wider uppercase">Surel Elektronik (Email)</h5>
                      <p className="text-sm font-semibold mt-0.5 text-stone-100"> tresnawerdha.riau@gmail.com</p>
                    </div>
                  </div>

                  {/* Operasional */}
                  <div className="flex gap-4 items-start">
                    <div className="bg-emerald-800 p-2.5 rounded-xl text-emerald-300 mt-1 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-emerald-300 tracking-wider uppercase">Jam Kunjungan</h5>
                      <p className="text-sm font-semibold mt-0.5 text-stone-100">Setiap Hari: 09:00 - 17:00 WIB</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t border-emerald-800 flex gap-4">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20UPT%20Husnul%20Khotimah,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20panti%20sosial."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3.5 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 2.112.551 4.165 1.6 6.002L.05 23.85a.75.75 0 0 0 .918.918l5.632-1.55c1.848 1.054 3.901 1.606 6.012 1.606 6.63 0 12-5.373 12-12s-5.37-12-12-12zm0 22.02c-1.91 0-3.774-.492-5.437-1.424a.75.75 0 0 0-.585-.052l-3.861 1.062 1.062-3.861a.75.75 0 0 0-.052-.585C2.176 15.792 1.684 13.928 1.684 12c0-5.7 4.63-10.316 10.316-10.316 5.7 0 10.316 4.615 10.316 10.316 0 5.701-4.615 10.32-10.316 10.32zm5.304-7.469c-.29-.145-1.716-.848-1.98-.946-.264-.097-.457-.145-.65.145-.192.29-.747.946-.915 1.139-.168.193-.336.216-.627.071-1.077-.538-1.986-1.002-2.78-1.688-.636-.55-.989-1.226-1.12-1.455-.132-.23-.014-.354.1-.47.104-.103.23-.264.343-.396.113-.132.152-.22.227-.367.075-.145.038-.276-.018-.39-.057-.113-.457-1.102-.627-1.512-.165-.397-.333-.343-.457-.349-.118-.006-.254-.007-.39-.007s-.356.05-.542.254c-.186.203-.711.695-.711 1.696s.729 1.97 1.033 2.378c.304.407 1.436 2.19 3.48 3.07 2.044.88 2.044.586 2.408.55.364-.037 1.716-.701 1.958-1.378.243-.677.243-1.258.172-1.377-.07-.12-.26-.192-.55-.337z"/>
                  </svg>
                  Hubungi via WhatsApp
                </a>
              </div>
            </div>

            {/* Card 2: Real Google Map */}
            <div className="bg-white rounded-[2rem] border border-stone-200/50 shadow-md h-64 overflow-hidden relative">
              <iframe
                title="Panti Sosial Tresna Werdha Riau Location"
                src="https://maps.google.com/maps?q=Jl.%20Kaharuddin%20Nasution%20No.4%2C%20Pekanbaru%2C%20Riau&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
