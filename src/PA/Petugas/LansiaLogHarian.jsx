import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function LansiaLogHarian() {
  const { lansiaList = [], setLansiaList, petugasList = [], activeNurse = {} } = useOutletContext()

  const [searchLansia, setSearchLansia] = useState('')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Selected Lansia for viewing log history
  const [selectedLansia, setSelectedLansia] = useState(null)
  
  // Modal for creating a new log
  const [showLogModal, setShowLogModal] = useState(false)
  const [targetLansia, setTargetLansia] = useState(null)

  // Modal for editing senior data
  const [showEditModal, setShowEditModal] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [currentLansia, setCurrentLansia] = useState({
    id: null,
    nama: '',
    tanggalLahir: '1950-01-01',
    fotoUrl: '',
    id_blok: '',
    blok: '',
    status: 'Mandiri',
    tanggalMasuk: '',
    tanggalKeluar: '--:--:----',
    golonganDarah: 'B+',
    alergi: 'Tidak Ada',
    penyakitBawaan: 'Tidak Ada',
    statusBerkas: 'LENGKAP',
    bpjs: 'Aktif (PBI)',
    logHarian: []
  })

  // Date lists for Picker
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1919 }, (_, i) => String(currentYear - i))

  const handleDateChange = (type, val) => {
    const [y, m, d] = currentLansia.tanggalLahir && currentLansia.tanggalLahir.includes('-')
      ? currentLansia.tanggalLahir.split('-')
      : ['1950', '01', '01']
    let newY = y || '1950'
    let newM = m || '01'
    let newD = d || '01'
    if (type === 'year') newY = val
    if (type === 'month') newM = val
    if (type === 'day') newD = val

    // Auto-adjust day if it exceeds the max days in the selected month/year
    const maxDays = new Date(Number(newY), Number(newM), 0).getDate()
    if (Number(newD) > maxDays) {
      newD = String(maxDays).padStart(2, '0')
    }

    setCurrentLansia({ ...currentLansia, tanggalLahir: `${newY}-${newM}-${newD}` })
  }

  // Extract separate parts of birthdate for dropdown select
  const [ly, lm, ld] = currentLansia.tanggalLahir && currentLansia.tanggalLahir.includes('-')
    ? currentLansia.tanggalLahir.split('-')
    : ['1950', '01', '01']

  const handleFotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCurrentLansia({ ...currentLansia, fotoUrl: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOpenEditModal = (lansia) => {
    setCurrentLansia(lansia)
    setShowEditModal(true)
  }

  const handleSaveLansia = (e) => {
    e.preventDefault()
    const updatedList = lansiaList.map(item => item.id === currentLansia.id ? currentLansia : item)
    setLansiaList(updatedList)

    // update active details if we are currently viewing it
    if (selectedLansia && selectedLansia.id === currentLansia.id) {
      setSelectedLansia(currentLansia)
    }
    setShowEditModal(false)
  }

  // Log Form State
  const [logForm, setLogForm] = useState({
    perawat: activeNurse.nama || 'Ns. Rina Lestari',
    tensi: '120/80',
    suhu: '36.5',
    gulaDarah: '',
    makanPagi: true,
    makanSiang: true,
    makanMalam: false,
    minumObat: true,
    mandi: true,
    catatanTambahan: ''
  })

  // Synchronize active nurse when component loads or change active nurse
  useEffect(() => {
    if (activeNurse.nama) {
      setLogForm(prev => ({ ...prev, perawat: activeNurse.nama }))
    }
  }, [activeNurse])

  // Helper date and age
  const getTodayDateStr = () => {
    return new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const calculateAge = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const birthDate = new Date(dateStr)
      if (isNaN(birthDate.getTime())) return '-'
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    } catch {
      return '-'
    }
  }

  const getInitials = (name) => {
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return words[0] ? words[0].substring(0, 2).toUpperCase() : 'L'
  }

  // Filter & Search
  const sortedLansia = [...lansiaList].sort((a, b) => b.id - a.id)
  const filteredLansia = sortedLansia.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchLansia.toLowerCase()) || 
                          (item.id_blok && item.id_blok.toLowerCase().includes(searchLansia.toLowerCase())) ||
                          (item.blok && item.blok.toLowerCase().includes(searchLansia.toLowerCase()))
    const matchesFilter = filterStatus === 'Semua' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Pagination
  const itemsPerPage = 8
  const totalItems = filteredLansia.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLansia = filteredLansia.slice(startIndex, endIndex)

  // Open Log Modal
  const handleOpenLogModal = (lansia) => {
    setTargetLansia(lansia)
    setLogForm({
      perawat: activeNurse.nama || 'Ns. Rina Lestari',
      tensi: '120/80',
      suhu: '36.5',
      gulaDarah: '',
      makanPagi: false,
      makanSiang: false,
      makanMalam: false,
      minumObat: false,
      mandi: false,
      catatanTambahan: ''
    })
    setShowLogModal(true)
  }

  // Handle Save Log
  const handleSaveLog = (e) => {
    e.preventDefault()
    if (!targetLansia) return

    // Format current date-time for log
    const now = new Date()
    const waktuStr = now.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }) + ' ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

    // Generate formatted log text
    let metrics = []
    if (logForm.tensi) metrics.push(`Tensi: ${logForm.tensi} mmHg`)
    if (logForm.suhu) metrics.push(`Suhu: ${logForm.suhu} °C`)
    if (logForm.gulaDarah) metrics.push(`Gula Darah: ${logForm.gulaDarah} mg/dL`)

    let activities = []
    if (logForm.makanPagi) activities.push('Sarapan')
    if (logForm.makanSiang) activities.push('Makan Siang')
    if (logForm.makanMalam) activities.push('Makan Malam')
    if (logForm.minumObat) activities.push('Minum Obat')
    if (logForm.mandi) activities.push('Mandi')

    const activityStr = activities.length > 0 ? `Aktivitas: ${activities.join(', ')}` : 'Aktivitas: Tidak ada'
    const notesStr = logForm.catatanTambahan ? `Catatan: ${logForm.catatanTambahan}` : ''

    const combinedCatatan = [metrics.join(' | '), activityStr, notesStr].filter(Boolean).join(' • ')

    const newLogEntry = {
      waktu: waktuStr,
      perawat: logForm.perawat,
      catatan: combinedCatatan
    }

    // Append to target lansia's logs
    const updatedLansiaList = lansiaList.map(lansia => {
      if (lansia.id === targetLansia.id) {
        return {
          ...lansia,
          logHarian: [newLogEntry, ...(lansia.logHarian || [])]
        }
      }
      return lansia
    })

    setLansiaList(updatedLansiaList)
    setShowLogModal(false)
    setTargetLansia(null)
    
    // If selected log history is currently open for this lansia, update the display selection
    if (selectedLansia && selectedLansia.id === targetLansia.id) {
      setSelectedLansia({
        ...targetLansia,
        logHarian: [newLogEntry, ...(targetLansia.logHarian || [])]
      })
    }
  }

  // Handle Delete Log Entry
  const handleDeleteLog = (lansiaId, logIdx) => {
    if (confirm('Hapus log pemeriksaan harian ini?')) {
      const updatedList = lansiaList.map(lansia => {
        if (lansia.id === lansiaId) {
          const updatedLogs = [...(lansia.logHarian || [])]
          updatedLogs.splice(logIdx, 1)
          return {
            ...lansia,
            logHarian: updatedLogs
          }
        }
        return lansia
      })
      setLansiaList(updatedList)

      // update view history
      if (selectedLansia && selectedLansia.id === lansiaId) {
        const updatedLogs = [...(selectedLansia.logHarian || [])]
        updatedLogs.splice(logIdx, 1)
        setSelectedLansia({
          ...selectedLansia,
          logHarian: updatedLogs
        })
      }
    }
  }

  // View Log History View
  if (selectedLansia) {
    const l = selectedLansia
    return (
      <div className="space-y-6 animate-fade-in text-left">
        {/* Back Button & Action Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => setSelectedLansia(null)}
            className="flex items-center gap-2 text-stone-700 hover:text-stone-900 font-bold transition-all text-sm uppercase cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Daftar
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => handleOpenEditModal(l)}
              className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-705 font-bold py-2.5 px-5 rounded-xl text-xs uppercase shadow-sm transition-all cursor-pointer"
            >
              Edit Data Lansia
            </button>
            <button
              onClick={() => handleOpenLogModal(l)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase shadow transition-all cursor-pointer"
            >
              Catat Log Baru
            </button>
          </div>
        </div>

        {/* Lansia Profile Card mini */}
        <div className="bg-white p-6 rounded-[2rem] border border-stone-200/50 shadow-md flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center border border-stone-200 overflow-hidden flex-shrink-0">
            {l.fotoUrl ? (
              <img 
                src={l.fotoUrl} 
                alt={l.nama} 
                onClick={() => setLightboxImage(l.fotoUrl)}
                className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" 
              />
            ) : (
              <span className="text-xl font-black text-stone-900">{getInitials(l.nama)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-stone-900">{l.nama}</h3>
              <span className="text-[9px] font-extrabold px-2 py-0.5 border rounded-full uppercase bg-stone-50 border-stone-200 text-stone-700">
                {l.status}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-semibold mt-1">
              ID: {l.id_blok || 'P0000'} • {l.blok} • {calculateAge(l.tanggalLahir)} Tahun
            </p>
          </div>
        </div>

        {/* Medical History Timeline */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-stone-200/50 shadow-md space-y-6">
          <h4 className="text-base font-extrabold text-stone-950 border-b border-stone-100 pb-3">Riwayat Pemeriksaan Harian</h4>
          
          <div className="space-y-6 relative pl-4 border-l-2 border-stone-100 ml-2">
            {l.logHarian && l.logHarian.length > 0 ? (
              l.logHarian.map((log, idx) => (
                <div key={idx} className="relative space-y-2 group">
                  {/* Circle dot on timeline */}
                  <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-4 ring-emerald-50"></div>
                  
                  <div className="flex justify-between items-center text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-900 bg-stone-100 px-2 py-0.5 rounded-lg">{log.waktu}</span>
                      <span className="text-stone-400">oleh</span>
                      <span className="text-emerald-700">{log.perawat}</span>
                    </div>

                    {/* Delete button for perawat logs */}
                    <button
                      onClick={() => handleDeleteLog(l.id, idx)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity font-semibold cursor-pointer text-[10px] uppercase"
                    >
                      Hapus
                    </button>
                  </div>
                  
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/50">
                    <p className="text-sm text-stone-700 font-medium leading-relaxed">{log.catatan}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-400 font-semibold italic text-center py-6">Belum ada riwayat catatan harian untuk lansia ini.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // List View
  return (
    <div className="bg-white rounded-2xl border border-stone-200/50 shadow-md p-6 space-y-6 animate-fade-in text-left">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
        
        {/* Search */}
        <div className="flex-grow max-w-md">
          <input
            type="text"
            placeholder="Cari nama lansia, ID, atau blok kamar..."
            value={searchLansia}
            onChange={(e) => setSearchLansia(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-stone-855 font-semibold"
          />
        </div>

        {/* Filter select */}
        <div className="flex items-center gap-3 justify-end">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-emerald-600 text-stone-850 font-bold cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="Mandiri">Mandiri</option>
            <option value="Semi Klinis">Semi Klinis</option>
            <option value="Klinis">Klinis</option>
          </select>
        </div>
      </div>

      {/* Grid of Elderly Cards (aesthetic design instead of table) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedLansia.length > 0 ? (
          paginatedLansia.map((item) => {
            const lastLog = item.logHarian && item.logHarian[0]
            
            return (
              <div 
                key={item.id} 
                className="bg-stone-50 rounded-3xl border border-stone-200/50 hover:border-emerald-600/30 p-5 flex flex-col justify-between transition-all hover:shadow-lg shadow-sm hover:shadow-stone-900/5 group text-left"
              >
                <div>
                  {/* Top card block */}
                  <div className="flex items-center justify-between gap-3.5 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                        {item.fotoUrl ? (
                          <img 
                            src={item.fotoUrl} 
                            alt={item.nama} 
                            onClick={() => setLightboxImage(item.fotoUrl)}
                            className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" 
                          />
                        ) : (
                          <span className="text-sm font-black text-stone-800">{getInitials(item.nama)}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-950 leading-snug truncate max-w-[110px]">{item.nama}</h4>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{item.id_blok || 'P0000'}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="text-stone-400 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-stone-200/50 transition-all cursor-pointer flex-shrink-0"
                      title="Edit Data Lansia"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>

                  {/* Body info */}
                  <div className="space-y-2 border-t border-stone-200/60 pt-3 text-xs font-semibold text-stone-600">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Blok Kamar</span>
                      <span className="text-stone-900 font-bold">{item.blok || 'Blok --'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Usia</span>
                      <span className="text-stone-900 font-bold">{calculateAge(item.tanggalLahir)} Tahun</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400">Status</span>
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                        item.status === 'Klinis'
                          ? 'bg-red-50 border-red-100 text-red-700'
                          : item.status === 'Semi Klinis'
                            ? 'bg-amber-50 border-amber-100 text-amber-700'
                            : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Last check log snippet */}
                  <div className="mt-4 p-3 bg-white rounded-2xl border border-stone-200/60 min-h-[70px] flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Log Terakhir</span>
                    <p className="text-[11px] text-stone-600 font-medium leading-relaxed line-clamp-2 mt-1">
                      {lastLog ? lastLog.catatan : 'Belum ada pencatatan pemeriksaan.'}
                    </p>
                    {lastLog && (
                      <span className="text-[9px] text-stone-400 font-semibold block text-right mt-1">{lastLog.waktu}</span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-stone-200/60">
                  <button
                    onClick={() => handleOpenLogModal(item)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-wide cursor-pointer shadow transition-colors text-center"
                  >
                    Catat Log
                  </button>
                  <button
                    onClick={() => setSelectedLansia(item)}
                    className="bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 font-bold py-2 rounded-xl text-[10px] uppercase tracking-wide cursor-pointer transition-colors text-center"
                  >
                    Riwayat
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-12 text-center text-stone-400 font-semibold">Tidak ada data lansia ditemukan</div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-stone-100 text-stone-600 font-semibold text-xs">
          <div>
            Menampilkan <span className="text-stone-900 font-bold">{totalItems === 0 ? 0 : startIndex + 1}</span> -{' '}
            <span className="text-stone-900 font-bold">{Math.min(endIndex, totalItems)}</span> dari{' '}
            <span className="text-stone-900 font-bold">{totalItems}</span> data
          </div>
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border border-stone-200 transition-colors flex items-center justify-center cursor-pointer ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-stone-50 text-stone-400' : 'bg-white hover:bg-stone-50 text-stone-750'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg border font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border border-stone-200 transition-colors flex items-center justify-center cursor-pointer ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-stone-50 text-stone-400' : 'bg-white hover:bg-stone-50 text-stone-750'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* --- ADD DAILY LOG MODAL --- */}
      {showLogModal && targetLansia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative text-left overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-extrabold text-stone-900 tracking-tight border-b border-stone-100 pb-3 mb-6">
              Catat Log Pemeriksaan Harian: <span className="text-emerald-700">{targetLansia.nama}</span>
            </h3>
            
            <form onSubmit={handleSaveLog} className="space-y-5">
              {/* Petugas Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Petugas Pemeriksa</label>
                <select
                  value={logForm.perawat}
                  onChange={(e) => setLogForm({ ...logForm, perawat: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors"
                >
                  <option value={activeNurse.nama}>{activeNurse.nama} (Saya)</option>
                  {petugasList
                    .filter(p => p.nama !== activeNurse.nama && p.status === 'Aktif')
                    .map(p => (
                      <option key={p.id} value={p.nama}>{p.nama}</option>
                    ))
                  }
                </select>
              </div>

              {/* Vitals: Tensi & Suhu & Gula Darah */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Tensi (mmHg)</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 120/80"
                    value={logForm.tensi}
                    onChange={(e) => setLogForm({ ...logForm, tensi: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-850 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Suhu Tubuh (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="Contoh: 36.5"
                    value={logForm.suhu}
                    onChange={(e) => setLogForm({ ...logForm, suhu: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-850 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Gula Darah (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="Opsional (e.g. 110)"
                    value={logForm.gulaDarah}
                    onChange={(e) => setLogForm({ ...logForm, gulaDarah: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-850 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              {/* Checkbox Activities */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Rencana Rutinitas Harian ({getTodayDateStr()})</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Makan Pagi */}
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-250 bg-stone-50 hover:bg-stone-100/50 cursor-pointer select-none text-xs font-bold text-stone-700">
                    <input 
                      type="checkbox"
                      checked={logForm.makanPagi}
                      onChange={(e) => setLogForm({ ...logForm, makanPagi: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                    />
                    Sarapan Pagi
                  </label>

                  {/* Makan Siang */}
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-250 bg-stone-50 hover:bg-stone-100/50 cursor-pointer select-none text-xs font-bold text-stone-700">
                    <input 
                      type="checkbox"
                      checked={logForm.makanSiang}
                      onChange={(e) => setLogForm({ ...logForm, makanSiang: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                    />
                    Makan Siang
                  </label>

                  {/* Makan Malam */}
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-250 bg-stone-50 hover:bg-stone-100/50 cursor-pointer select-none text-xs font-bold text-stone-700">
                    <input 
                      type="checkbox"
                      checked={logForm.makanMalam}
                      onChange={(e) => setLogForm({ ...logForm, makanMalam: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                    />
                    Makan Malam
                  </label>

                  {/* Minum Obat */}
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-250 bg-stone-50 hover:bg-stone-100/50 cursor-pointer select-none text-xs font-bold text-stone-700">
                    <input 
                      type="checkbox"
                      checked={logForm.minumObat}
                      onChange={(e) => setLogForm({ ...logForm, minumObat: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                    />
                    Minum Obat Rutin
                  </label>

                  {/* Mandi */}
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-250 bg-stone-50 hover:bg-stone-100/50 cursor-pointer select-none text-xs font-bold text-stone-700">
                    <input 
                      type="checkbox"
                      checked={logForm.mandi}
                      onChange={(e) => setLogForm({ ...logForm, mandi: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                    />
                    Mandi & Bersih diri
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Kondisi & Catatan Tambahan</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Mengeluh pusing di kepala belakang, nafsu makan stabil, tidur nyenyak."
                  value={logForm.catatanTambahan}
                  onChange={(e) => setLogForm({ ...logForm, catatanTambahan: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-sm font-semibold text-stone-850 focus:outline-none focus:border-emerald-600 transition-colors"
                ></textarea>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => { setShowLogModal(false); setTargetLansia(null); }}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-3 px-5 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow cursor-pointer uppercase tracking-wider"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT LANSIA MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-extrabold text-stone-900 tracking-tight border-b border-stone-100 pb-3 mb-6">
              Edit Data Lansia (Petugas Panel)
            </h3>
            
            <form onSubmit={handleSaveLansia} className="space-y-4">
              {/* Profile Picture Uploader */}
              <div className="flex flex-col items-center gap-2 pb-4 border-b border-stone-100">
                <div className="relative w-20 h-20 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden group">
                  {currentLansia.fotoUrl ? (
                    <img src={currentLansia.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-stone-405">
                      {currentLansia.nama ? getInitials(currentLansia.nama) : '?'}
                    </span>
                  )}
                  {/* Upload Overlay */}
                  <label className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Unggah Foto Lansia</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={currentLansia.nama}
                    onChange={(e) => setCurrentLansia({ ...currentLansia, nama: e.target.value })}
                    placeholder="Contoh: H. M. Yunus"
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-850 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Tanggal Lahir</label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Day */}
                    <select
                      value={ld}
                      onChange={(e) => handleDateChange('day', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-2 py-3 rounded-xl text-xs font-bold text-stone-850 focus:outline-none focus:border-emerald-600 transition-colors"
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>

                    {/* Month */}
                    <select
                      value={lm}
                      onChange={(e) => handleDateChange('month', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-2 py-3 rounded-xl text-xs font-bold text-stone-850 focus:outline-none focus:border-emerald-600 transition-colors"
                    >
                      {months.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>

                    {/* Year */}
                    <select
                      value={ly}
                      onChange={(e) => handleDateChange('year', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-2 py-3 rounded-xl text-xs font-bold text-stone-850 focus:outline-none focus:border-emerald-600 transition-colors"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">ID / NIP Lansia</label>
                  <input
                    type="text"
                    required
                    value={currentLansia.id_blok}
                    onChange={(e) => setCurrentLansia({ ...currentLansia, id_blok: e.target.value })}
                    placeholder="Contoh: P0012"
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Blok / Kamar</label>
                  <input
                    type="text"
                    required
                    value={currentLansia.blok}
                    onChange={(e) => setCurrentLansia({ ...currentLansia, blok: e.target.value })}
                    placeholder="Contoh: Blok A - 01"
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Status Kesehatan</label>
                <select
                  value={currentLansia.status}
                  onChange={(e) => setCurrentLansia({ ...currentLansia, status: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors"
                >
                  <option value="Mandiri">Mandiri</option>
                  <option value="Semi Klinis">Semi Klinis</option>
                  <option value="Klinis">Klinis</option>
                </select>
              </div>

              {/* Extra Medical Info */}
              <div className="grid grid-cols-3 gap-4 border-t border-stone-100 pt-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Gol. Darah</label>
                  <select
                    value={currentLansia.golonganDarah}
                    onChange={(e) => setCurrentLansia({ ...currentLansia, golonganDarah: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Alergi</label>
                  <input
                    type="text"
                    value={currentLansia.alergi}
                    onChange={(e) => setCurrentLansia({ ...currentLansia, alergi: e.target.value })}
                    placeholder="Seafood/Debu"
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Penyakit Bawaan</label>
                  <input
                    type="text"
                    value={currentLansia.penyakitBawaan}
                    onChange={(e) => setCurrentLansia({ ...currentLansia, penyakitBawaan: e.target.value })}
                    placeholder="Hipertensi"
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Extra Admin Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Status Berkas</label>
                  <select
                    value={currentLansia.statusBerkas}
                    onChange={(e) => setCurrentLansia({ ...currentLansia, statusBerkas: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none"
                  >
                    <option value="LENGKAP">LENGKAP</option>
                    <option value="BELUM LENGKAP">BELUM LENGKAP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">BPJS / Asuransi</label>
                  <input
                    type="text"
                    value={currentLansia.bpjs}
                    onChange={(e) => setCurrentLansia({ ...currentLansia, bpjs: e.target.value })}
                    placeholder="Contoh: Aktif (PBI)"
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-3 px-5 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow cursor-pointer uppercase tracking-wider"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- LIGHTBOX MODAL --- */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-xl w-full max-h-[80vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={lightboxImage}
              alt="Foto Lansia Fullscreen"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  )
}
