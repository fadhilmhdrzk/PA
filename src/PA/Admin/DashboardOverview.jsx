import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function DashboardOverview(props) {
  const context = useOutletContext() || {}
  const lansiaList = props.lansiaList || context.lansiaList || []
  const petugasList = props.petugasList || context.petugasList || []
  const transaksiList = props.transaksiList || context.transaksiList || []
  const setTransaksiList = props.setTransaksiList || context.setTransaksiList

  const totalLansia = lansiaList.length
  const totalPerawatAktif = petugasList.filter(p => p.status === 'Aktif').length
  const butuhPantauan = lansiaList.filter(l => l.status === 'Klinis' || l.status === 'Semi Klinis').length

  // Calculate status percentages
  const countStatus = (status) => lansiaList.filter(l => l.status === status).length
  const mandiriPct = totalLansia ? Math.round((countStatus('Mandiri') / totalLansia) * 100) : 0
  const semiKlinisPct = totalLansia ? Math.round((countStatus('Semi Klinis') / totalLansia) * 100) : 0
  const klinisPct = totalLansia ? Math.round((countStatus('Klinis') / totalLansia) * 100) : 0

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [showPaguModal, setShowPaguModal] = useState(false)
  const [tempPagu, setTempPagu] = useState('')
  const [currentTransaksi, setCurrentTransaksi] = useState({
    id: null,
    tanggal: '',
    kategori: 'Konsumsi Lansia (Makan 3x)',
    nominal: '',
    tipe: 'Pengeluaran',
    keterangan: '',
    buktiFoto: ''
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCurrentTransaksi(prev => ({ ...prev, buktiFoto: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Constants
  const paguAnggaran = context.paguAnggaran || 50000000
  
  const openEditPagu = () => {
    setTempPagu(paguAnggaran.toString())
    setShowPaguModal(true)
  }
  const categories = [
    'Konsumsi Lansia (Makan 3x)',
    'Kesehatan & Obat-obatan',
    'Pemeliharaan & Kebersihan',
    'Lainnya / Administrasi'
  ]

  // Calculated Stats
  const realisasiBelanja = transaksiList.reduce(
    (acc, t) => acc + (t.tipe === 'Pengeluaran' ? Number(t.nominal) : 0),
    0
  )
  const totalPemasukan = transaksiList.reduce(
    (acc, t) => acc + (t.tipe === 'Pemasukan' ? Number(t.nominal) : 0),
    0
  )
  const sisaAnggaran = paguAnggaran - realisasiBelanja + totalPemasukan
  const terpakaiPct = Math.round((realisasiBelanja / paguAnggaran) * 100)
  const sisaPct = Math.max(0, Math.min(100, Math.round((sisaAnggaran / paguAnggaran) * 100)))

  // Helper formatting
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })
      .format(num)
      .replace('IDR', 'Rp.');
  }

  // Calculate sum per category for progress bars
  const getCategoryStats = (category) => {
    const sum = transaksiList
      .filter((t) => t.kategori === category && t.tipe === 'Pengeluaran')
      .reduce((acc, t) => acc + Number(t.nominal), 0)
    const pct = realisasiBelanja ? Math.round((sum / realisasiBelanja) * 100) : 0
    return { sum, pct }
  }

  // Handle CRUD
  const openAddTransaksi = () => {
    setCurrentTransaksi({
      id: null,
      tanggal: new Date().toISOString().split('T')[0],
      kategori: 'Konsumsi Lansia (Makan 3x)',
      nominal: '',
      tipe: 'Pengeluaran',
      keterangan: '',
      buktiFoto: ''
    })
    setShowModal(true)
  }

  const handleSaveTransaksi = (e) => {
    e.preventDefault()
    if (setTransaksiList) {
      setTransaksiList([
        { ...currentTransaksi, id: Date.now() },
        ...transaksiList
      ])
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Stats Cards Row */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Stat 1: Total Lansia */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md shadow-stone-900/5 flex flex-col justify-between min-h-[140px]">
          <h3 className="text-xs font-bold text-stone-500 tracking-wider uppercase">Total Lansia</h3>
          <div className="flex justify-between items-baseline mt-4">
            <span className="text-4xl font-black text-stone-900 tracking-tight">{totalLansia}</span>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Aktif</span>
          </div>
        </div>

        {/* Stat 2: Perawat Aktif */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md shadow-stone-900/5 flex flex-col justify-between min-h-[140px]">
          <h3 className="text-xs font-bold text-stone-500 tracking-wider uppercase">Perawat Aktif</h3>
          <div className="flex justify-between items-baseline mt-4">
            <span className="text-4xl font-black text-stone-900 tracking-tight">{totalPerawatAktif}</span>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">On Duty</span>
          </div>
        </div>

        {/* Stat 3: Butuh Pantauan */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md shadow-stone-900/5 flex flex-col justify-between min-h-[140px]">
          <h3 className="text-xs font-bold text-stone-500 tracking-wider uppercase">Butuh Pantauan</h3>
          <div className="flex justify-between items-baseline mt-4">
            <span className="text-4xl font-black text-stone-900 tracking-tight">{butuhPantauan}</span>
            <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Medis / Semi</span>
          </div>
        </div>

      </div>

      {/* Main Grid for Finance & Distributions */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Summary Anggaran */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Row Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Pagu Anggaran */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md flex flex-col justify-between min-h-[140px]">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Pagu Anggaran</h3>
                <button
                  onClick={openEditPagu}
                  className="text-[10px] font-extrabold text-emerald-650 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                >
                  Ubah Pagu
                </button>
              </div>
              <div className="mt-4 space-y-1">
                <span className="text-3xl font-black text-stone-900 tracking-tight">
                  {formatRupiah(paguAnggaran)}
                </span>
              </div>
            </div>

            {/* Realisasi Belanja */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md flex flex-col justify-between min-h-[140px]">
              <h3 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Realisasi Belanja</h3>
              <div className="mt-4 space-y-1">
                <span className="text-3xl font-black text-stone-900 tracking-tight">
                  {formatRupiah(realisasiBelanja)}
                </span>
                <p className="text-xs text-rose-600 font-bold flex items-center gap-1 mt-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                  {terpakaiPct}% Terpakai
                </p>
              </div>
            </div>

          </div>

          {/* Sisa Anggaran Box */}
          <div className="bg-[#444a5e] p-6 rounded-3xl border border-stone-700/10 shadow-lg text-white flex flex-col justify-between min-h-[130px] transition-all hover:shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-stone-300 tracking-wider uppercase">Sisa Anggaran</h3>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                sisaAnggaran < 0
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {sisaPct}% Tersisa
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <span className={`text-4xl font-black tracking-tight block ${
                sisaAnggaran < 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {formatRupiah(sisaAnggaran)}
              </span>
              <div className="w-full bg-stone-700/60 h-3 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    sisaAnggaran < 0 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${sisaPct}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Distribusi Pengeluaran Card */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-stone-200/50 shadow-md">
            <h3 className="text-base font-extrabold text-stone-850 tracking-tight border-b border-stone-100 pb-3 mb-6">
              Distribusi Pengeluaran Operasional
            </h3>
            <div className="space-y-6">
              {categories.map((cat) => {
                const stats = getCategoryStats(cat)
                return (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between items-end text-xs">
                      <div className="text-left">
                        <p className="font-bold text-stone-800">{cat}</p>
                        <p className="text-[10px] text-stone-400 font-bold mt-0.5">{formatRupiah(stats.sum)}</p>
                      </div>
                      <span className="font-extrabold text-stone-900">{stats.pct}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${stats.pct}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Actions & Status Distributions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Actions card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/50 shadow-md space-y-4">
            <h3 className="text-xs font-black text-stone-400 tracking-wider uppercase border-b border-stone-100 pb-3">
              Aksi Keuangan
            </h3>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={openAddTransaksi}
                className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 p-4 rounded-2xl flex items-center justify-between text-stone-800 font-bold text-sm cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-stone-400 text-lg font-normal">+</span> Input Belanja Baru
                </span>
                <span className="text-stone-300">&gt;</span>
              </button>
              <button
                onClick={() => window.print()}
                className="w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 p-4 rounded-2xl flex items-center justify-between text-stone-800 font-bold text-sm cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak Rekap Bulanan
                </span>
                <span className="text-stone-300">&gt;</span>
              </button>
            </div>
          </div>

          {/* Status Progress Bar Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/50 shadow-md text-left space-y-4">
            <h3 className="text-xs font-black text-stone-400 tracking-wider uppercase border-b border-stone-100 pb-3">
              Status Distribusi Mandiri/Klinis
            </h3>
            
            <div className="space-y-5">
              {/* Status 1: Mandiri */}
              <div>
                <div className="flex justify-between text-xs font-bold text-stone-700 mb-2">
                  <span>Mandiri</span>
                  <span>{mandiriPct}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${mandiriPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Status 2: Semi Klinis */}
              <div>
                <div className="flex justify-between text-xs font-bold text-stone-700 mb-2">
                  <span>Semi Klinis</span>
                  <span>{semiKlinisPct}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${semiKlinisPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Status 3: Klinis */}
              <div>
                <div className="flex justify-between text-xs font-bold text-stone-700 mb-2">
                  <span>Klinis</span>
                  <span>{klinisPct}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${klinisPct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* --- ADD/EDIT TRANSAKSI MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
            <h3 className="text-lg font-extrabold text-stone-900 tracking-tight border-b border-stone-100 pb-3 mb-6">
              Tambah Transaksi Keuangan Baru
            </h3>
            
            <form onSubmit={handleSaveTransaksi} className="space-y-4">
              {/* Tipe & Tanggal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Tipe Transaksi</label>
                  <select
                    value={currentTransaksi.tipe}
                    onChange={(e) => setCurrentTransaksi({ ...currentTransaksi, tipe: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs font-bold text-stone-850 focus:outline-none focus:border-emerald-600 transition-colors"
                  >
                    <option value="Pengeluaran">Pengeluaran (Belanja)</option>
                    <option value="Pemasukan">Pemasukan (Hibah/Bantuan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={currentTransaksi.tanggal}
                    onChange={(e) => setCurrentTransaksi({ ...currentTransaksi, tanggal: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              {/* Kategori & Nominal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Kategori</label>
                  <select
                    value={currentTransaksi.kategori}
                    onChange={(e) => setCurrentTransaksi({ ...currentTransaksi, kategori: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs font-bold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Nominal (Rupiah)</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 1500000"
                    value={currentTransaksi.nominal}
                    onChange={(e) => setCurrentTransaksi({ ...currentTransaksi, nominal: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Keterangan Belanja</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Pembelian beras 10 karung untuk konsumsi lansia"
                  value={currentTransaksi.keterangan}
                  onChange={(e) => setCurrentTransaksi({ ...currentTransaksi, keterangan: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                ></textarea>
              </div>

              {/* Upload Bukti */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Bukti Nota / Kwitansi (Foto)</label>
                {currentTransaksi.buktiFoto ? (
                  <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 p-3 rounded-xl">
                    <img
                      src={currentTransaksi.buktiFoto}
                      alt="Nota Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-stone-250"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-stone-700">Foto Bukti Terunggah</p>
                      <button
                        type="button"
                        onClick={() => setCurrentTransaksi(prev => ({ ...prev, buktiFoto: '' }))}
                        className="text-[10px] font-extrabold text-rose-650 hover:underline mt-0.5 cursor-pointer"
                      >
                        Hapus Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-500 focus:outline-none focus:border-emerald-600 transition-colors file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-extrabold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100/80 cursor-pointer file:cursor-pointer"
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-3 px-5 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow cursor-pointer uppercase tracking-wider"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PAGU MODAL --- */}
      {showPaguModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-left">
            <h3 className="text-lg font-extrabold text-stone-900 tracking-tight border-b border-stone-100 pb-3 mb-6">
              Ubah Pagu Anggaran
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              if (context.setPaguAnggaran) {
                context.setPaguAnggaran(Number(tempPagu))
              }
              setShowPaguModal(false)
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Nominal Pagu Baru (Rupiah)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 50000000"
                  value={tempPagu}
                  onChange={(e) => setTempPagu(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowPaguModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-3 px-5 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow cursor-pointer uppercase tracking-wider"
                >
                  Simpan Pagu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
