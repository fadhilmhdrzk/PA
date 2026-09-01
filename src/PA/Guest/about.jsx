export default function About() {
  return (
    <div className="bg-stone-50 min-h-screen text-left">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-emerald-900 text-white py-20 overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800/40 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-950/50 rounded-full -translate-x-10 translate-y-10 blur-xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="md:col-span-7 space-y-6">
              <span className="bg-emerald-800 border border-emerald-700/50 text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Profil UPT PSTW Husnul Khotimah
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">
                Tentang Kami
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg leading-relaxed font-medium">
                UPT. Pelayanan Sosial Tresna Werdha Khusnul Khotimah Dinas Sosial Provinsi Riau melaksanakan pelayanan rehabilitasi sosial dasar bagi lanjut usia terlantar di dalam panti dengan berpedoman pada Peraturan Menteri Sosial RI No. 5 Tahun 2018.
              </p>
              <div className="pt-2 border-t border-emerald-800/80 flex items-center gap-2">
                <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Status Kelembagaan:</span>
                <span className="text-xs bg-emerald-800 text-white font-extrabold px-3 py-1 rounded-md uppercase">Pemerintah Provinsi Riau</span>
              </div>
            </div>
            
            {/* Right Image Column */}
            <div className="md:col-span-5 relative">
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-2xl border-8 border-white/10 bg-emerald-950">
                <img
                  src="/img/Tentang Kami.png"
                  alt="UPT PSTW Husnul Khotimah"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-amber-500 text-stone-950 px-5 py-2.5 rounded-2xl shadow-lg font-black text-xs uppercase tracking-wider">
                Rehabilitasi Sosial Dasar
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISI & MISI SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Visi Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              
              <div>
                <svg className="w-12 h-12 text-emerald-300/60 mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <h3 className="text-xs font-black text-emerald-300 tracking-widest uppercase mb-4">Visi UPT</h3>
                <p className="text-xl sm:text-2xl font-bold leading-relaxed tracking-tight text-emerald-50">
                  Terwujudnya kesejahteraan dan perlindungan sosial bagi para lanjut usia yang didukung oleh melembaganya nilai keikhlasan, kekeluargaan berdasarkan iman dan taqwa.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-emerald-800 text-xs text-emerald-300/60 font-semibold uppercase tracking-wider">
                UPT PSTW Husnul Khotimah Riau
              </div>
            </div>

            {/* Misi List */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div>
                <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Langkah Kami</span>
                <h2 className="text-3xl font-black text-stone-900 tracking-tight mt-1">Misi Lembaga</h2>
              </div>
              
              <div className="space-y-4">
                {/* Misi 1 */}
                <div className="flex gap-4 p-5 rounded-2xl border border-stone-100 bg-stone-50 hover:bg-stone-100/50 transition-colors">
                  <div className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-lg flex items-center justify-center font-black flex-shrink-0 text-sm mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-base mb-1">Meningkatkan Kualitas Hidup</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Meningkatkan harkat dan martabat serta kualitas hidup lanjut usia melalui program kesejahteraan sosial yang terencana.
                    </p>
                  </div>
                </div>

                {/* Misi 2 */}
                <div className="flex gap-4 p-5 rounded-2xl border border-stone-100 bg-stone-50 hover:bg-stone-100/50 transition-colors">
                  <div className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-lg flex items-center justify-center font-black flex-shrink-0 text-sm mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-base mb-1">Penyediaan Sarana & Prasarana Harmonis</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Meningkatkan sarana dan prasarana pelayanan panti, kerjasama antar individu serta kesadaran hidup berkeluarga dan bermasyarakat yang harmonis.
                    </p>
                  </div>
                </div>

                {/* Misi 3 */}
                <div className="flex gap-4 p-5 rounded-2xl border border-stone-100 bg-stone-50 hover:bg-stone-100/50 transition-colors">
                  <div className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-lg flex items-center justify-center font-black flex-shrink-0 text-sm mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-base mb-1">Pemberdayaan Keterampilan Potensial</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Meningkatkan pemberdayaan keterampilan lanjut usia potensial, membantu mencegah dan mengatasi masalah kesejahteraan sosial lanjut usia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. TIMELINE SEJARAH SINGKAT */}
      <section className="py-20 bg-stone-50 border-t border-b border-stone-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Rekam Jejak</span>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight mt-1 mb-12">Sejarah Singkat Lembaga</h2>
          
          <div className="relative border-l-2 border-stone-200 text-left pl-6 ml-4 space-y-10">
            {/* 1982 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 bg-emerald-600 w-4 h-4 rounded-full border-4 border-white shadow-sm"></span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">18 Mei 1982</span>
              <h4 className="text-lg font-bold text-stone-900 mt-2">Peresmian Awal Sasana Tresna Werdha</h4>
              <p className="text-sm text-stone-600 leading-relaxed mt-1">
                Berdasarkan SK Menteri Sosial RI diresmikan dengan nama Sasana Tresna Werdha Khusnul Khotimah Pekanbarudi bawah naungan Departemen Sosial RI.
              </p>
            </div>

            {/* 1984 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 bg-emerald-600 w-4 h-4 rounded-full border-4 border-white shadow-sm"></span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">31 Januari 1984</span>
              <h4 className="text-lg font-bold text-stone-900 mt-2">Diresmikan Penggunaan Operasional</h4>
              <p className="text-sm text-stone-600 leading-relaxed mt-1">
                Penggunaan panti secara resmi diresmikan oleh Menteri Sosial Republik Indonesia saat itu, Ibu Nani Sudarsono, SH.
              </p>
            </div>

            {/* 1995 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 bg-emerald-600 w-4 h-4 rounded-full border-4 border-white shadow-sm"></span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">Tahun 1995</span>
              <h4 className="text-lg font-bold text-stone-900 mt-2">Perubahan Menjadi Panti Sosial (PSTWKK)</h4>
              <p className="text-sm text-stone-600 leading-relaxed mt-1">
                Sasana berganti nama menjadi Panti Sosial Tresna Werdha Khusnul Khotimah (PSTWKK) untuk menguatkan pelayanan rehabilitasi sosial lanjut usia.
              </p>
            </div>

            {/* 2017 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 bg-emerald-600 w-4 h-4 rounded-full border-4 border-white shadow-sm"></span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">Pergub Riau 2017 - Sekarang</span>
              <h4 className="text-lg font-bold text-stone-900 mt-2">UPT Pelayanan Sosial Kelas A di Riau</h4>
              <p className="text-sm text-stone-600 leading-relaxed mt-1">
                Dengan ditetapkannya Pergub Riau No. 69 Tahun 2017, panti ini diserahkan di bawah naungan Dinas Sosial Riau dan ditetapkan sebagai UPT. Pelayanan Sosial Tresna Werdha Khusnul Khotimah Kelas A.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROGRAM LAYANAN GRIDS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div>
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Rehabilitasi Sosial</span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mt-1">Program Layanan Unggulan</h2>
            <p className="text-stone-500 max-w-xl mx-auto text-sm font-semibold mt-2">
              Pendekatan pekerjaan sosial profesional untuk mewujudkan keberfungsian dan peran kemasyarakatan lanjut usia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 text-left">
            
            {/* Program 1 */}
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="bg-emerald-50 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base mb-2">Asesmen & Diagnosis</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pekerja Sosial melakukan asesmen mendalam dan penyusunan rencana intervensi psikososial untuk membantu adaptasi lansia di panti.
              </p>
            </div>

            {/* Program 2 */}
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="bg-emerald-50 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base mb-2">Perawatan & Pengasuhan</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Layanan asuhan dasar di wisma didampingi Pengasuh (ASN) & tenaga honorer, serta konsultasi dan pengawasan medis harian oleh perawat/dokter.
              </p>
            </div>

            {/* Program 3 */}
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="bg-emerald-50 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base mb-2">Pelatihan Vokasional</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pemberdayaan keterampilan motorik mingguan seperti merajut, membuat sapu lidi, anyaman piring, dan kerajinan tangan kemoceng secara produktif.
              </p>
            </div>

            {/* Program 4 */}
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="bg-emerald-50 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base mb-2">Bimbingan Mental Spiritual</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Meningkatkan sikap religius lansia melalui ceramah agama rutin, mengaji bersama, dan kerja sama bimbingan keagamaan bagi lansia non-muslim.
              </p>
            </div>

            {/* Program 5 */}
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="bg-emerald-50 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base mb-2">Bimbingan Jasmani (Fisik)</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Menjaga kebugaran jasmani lansia melalui olahraga jalan santai keliling lingkungan panti dan aktivitas senam lansia berkala.
              </p>
            </div>

            {/* Program 6 */}
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="bg-emerald-50 text-emerald-700 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-extrabold text-stone-900 text-base mb-2">Konseling & Bantuan Sosial</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pelayanan bantuan sosial berupa sandang, pangan, papan, konseling kelompok/individu oleh psikolog, serta aksesibilitas jaminan kesehatan.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. STRUKTUR ORGANISASI */}
      <section className="py-20 bg-stone-50 border-t border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div>
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Struktur Organisasi</span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mt-1">Bagan Organisasi UPT</h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-xs sm:text-sm font-semibold mt-2">
              Lampiran: Peraturan Gubernur Riau Nomor 69 Tahun 2017 Tanggal 29 Desember 2017
            </p>
          </div>

          {/* Visual Org Chart Tree */}
          <div className="pt-12 flex flex-col items-center">
            
            {/* Level 1: Kepala UPT */}
            <div className="flex flex-col items-center relative">
              <div className="bg-emerald-900 text-white px-8 py-5 rounded-2xl shadow-lg border-2 border-emerald-800 text-center min-w-[240px] transform hover:scale-105 transition-all duration-300">
                <h4 className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">Kepala UPT</h4>
                <p className="font-extrabold text-lg mt-1">NGADIONO, S.Sos</p>
              </div>
              {/* Vertical Line Down */}
              <div className="w-0.5 h-10 bg-emerald-600/40"></div>
            </div>

            {/* Level 2: Sub Bagian Tata Usaha */}
            <div className="w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start justify-center">
              {/* Dummy placeholder for spacing on left */}
              <div className="hidden md:block w-1/2"></div>
              
              {/* Center line helper */}
              <div className="hidden md:block w-0.5 bg-emerald-600/40 self-stretch min-h-[80px]"></div>

              {/* Sub TU card container */}
              <div className="w-full md:w-1/2 flex items-center justify-center md:justify-start pl-0 md:pl-10 relative">
                {/* Horizontal connecting line on desktop */}
                <div className="hidden md:block absolute left-0 top-[26px] w-10 h-0.5 bg-emerald-600/40"></div>
                
                <div className="bg-white text-stone-850 px-6 py-4 rounded-xl border border-stone-200 shadow-md text-center md:text-left min-w-[240px] max-w-[280px] transform hover:scale-105 transition-all duration-300">
                  <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Kepala Sub Bagian Tata Usaha</h5>
                  <p className="font-bold text-stone-900 text-sm mt-1">DESI PERWITASARY, M.Si</p>
                </div>
              </div>
            </div>

            {/* Vertical Continuation Line */}
            <div className="w-0.5 h-10 bg-emerald-600/40"></div>

            {/* Level 3: Sections Split (Left & Right) */}
            <div className="w-full max-w-4xl">
              {/* Horizontal branch line on desktop */}
              <div className="hidden md:block w-[50%] mx-auto border-t-2 border-emerald-600/40"></div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-stretch md:items-start pt-6 md:pt-0">
                
                {/* Left Section: Seksi Pembinaan Sosial */}
                <div className="flex-1 flex flex-col items-center relative">
                  {/* Vertical connector line on desktop */}
                  <div className="hidden md:block w-0.5 h-6 bg-emerald-600/40 absolute -top-6"></div>
                  <div className="bg-white text-stone-850 px-6 py-4 rounded-xl border border-stone-200 shadow-md text-center min-w-[220px] max-w-[260px] transform hover:scale-105 transition-all duration-300">
                    <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Kepala Seksi Pembinaan Sosial</h5>
                    <p className="font-bold text-stone-900 text-sm mt-1">NAJARIS, SH</p>
                  </div>
                </div>

                {/* Center Section Connector */}
                <div className="hidden md:flex flex-col items-center relative w-12">
                  <div className="w-0.5 h-[130px] bg-emerald-600/40 absolute -top-[54px] z-0"></div>
                </div>

                {/* Right Section: Seksi Pelayanan Sosial */}
                <div className="flex-1 flex flex-col items-center relative">
                  {/* Vertical connector line on desktop */}
                  <div className="hidden md:block w-0.5 h-6 bg-emerald-600/40 absolute -top-6"></div>
                  <div className="bg-white text-stone-850 px-6 py-4 rounded-xl border border-stone-200 shadow-md text-center min-w-[220px] max-w-[260px] transform hover:scale-105 transition-all duration-300">
                    <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Kepala Seksi Pelayanan Sosial</h5>
                    <p className="font-bold text-stone-900 text-sm mt-1">SUHARDI BIJAWANGSA, S.Ag</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Spacer */}
            <div className="w-0.5 h-12 bg-emerald-600/40 md:h-16"></div>

            {/* Level 4: Kelompok Jabatan Fungsional */}
            <div className="flex flex-col items-center relative">
              <div className="bg-stone-800 text-white px-8 py-5 rounded-2xl shadow-lg border border-stone-700 text-center min-w-[250px] transform hover:scale-105 transition-all duration-300">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Kelompok Jabatan</h4>
                <p className="font-extrabold text-base mt-1 uppercase tracking-wide">Fungsional</p> 
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
