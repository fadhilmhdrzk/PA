import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function DataLansia(props) {
  const context = useOutletContext() || {}
  const lansiaList = props.lansiaList || context.lansiaList || []
  const setLansiaList = props.setLansiaList || context.setLansiaList
  const historiList = props.historiList || context.historiList || []
  const setHistoriList = props.setHistoriList || context.setHistoriList
  const [searchLansia, setSearchLansia] = useState('')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [selectedLansiaInfo, setSelectedLansiaInfo] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' })

  useEffect(() => {
    setCurrentPage(1)
    setSelectedIds([])
  }, [searchLansia, filterStatus, sortConfig])

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) {
      return (
        <svg className="w-3.5 h-3.5 text-stone-300 ml-1.5 inline-block opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      )
    }
    if (sortConfig.direction === 'asc') {
      return (
        <svg className="w-3.5 h-3.5 text-emerald-600 ml-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      )
    }
    return (
      <svg className="w-3.5 h-3.5 text-emerald-600 ml-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  const handleSelectAll = (items) => {
    const ids = items.map(item => item.id)
    const allSelected = ids.every(id => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !ids.includes(id)))
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...ids])])
    }
  }

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleBulkDelete = () => {
    setConfirmModal({
      show: true,
      title: 'Hapus Lansia Terpilih?',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data lansia terpilih secara permanen dari database?`,
      isDanger: true,
      onConfirm: () => {
        setLansiaList(prev => prev.filter(item => !selectedIds.includes(item.id)))
        setSelectedIds([])
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }

  // Modals States
  const [showLansiaModal, setShowLansiaModal] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [errorModal, setErrorModal] = useState({ show: false, message: '' })
  const [showKeluarkanModal, setShowKeluarkanModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    isDanger: false
  })
  const [keluarkanData, setKeluarkanData] = useState({
    lansiaId: null,
    nama: '',
    tanggalLahir: '',
    tanggalMasuk: '',
    statusKeluar: 'Kembali ke Keluarga',
    tanggalKeluar: new Date().toISOString().split('T')[0],
    statusKesehatan: 'Mandiri',
    keterangan: ''
  })
  const [currentLansia, setCurrentLansia] = useState({
    id: null,
    nama: '',
    tanggalLahir: '',
    fotoUrl: '',
    id_blok: '',
    blok: '',
    status: 'Mandiri',
    tanggalMasuk: '',
    tanggalKeluar: '--:--:----',
    golonganDarah: 'B+',
    alergi: 'Seafood',
    penyakitBawaan: 'Hipertensi',
    statusBerkas: 'LENGKAP',
    bpjs: 'Aktif (PBI)',
    logHarian: []
  })


  // Date and age helpers
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

  // Lists for dropdown date picker
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

  // Extract separate parts of date
  const [ly, lm, ld] = currentLansia.tanggalLahir && currentLansia.tanggalLahir.includes('-')
    ? currentLansia.tanggalLahir.split('-')
    : ['1950', '01', '01']

  // Initials generator
  const getInitials = (name) => {
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return words[0] ? words[0].substring(0, 2).toUpperCase() : 'L'
  }

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

  // --- Lansia CRUD Helpers ---
  const openAddLansia = () => {
    // Generate next available ID/NIP Lansia (id_blok)
    let maxNum = 0
    lansiaList.forEach(item => {
      if (item.id_blok && item.id_blok.toUpperCase().startsWith('L')) {
        const numStr = item.id_blok.substring(1) // Remove 'L'
        const num = parseInt(numStr, 10)
        if (!isNaN(num) && num > maxNum) {
          maxNum = num
        }
      }
    })
    const nextIdBlok = 'L' + String(maxNum + 1).padStart(4, '0')

    setCurrentLansia({
      id: null,
      nama: '',
      tanggalLahir: '1950-01-01',
      fotoUrl: '',
      id_blok: nextIdBlok,
      blok: 'Blok A - 01',
      status: 'Mandiri',
      tanggalMasuk: new Date().toISOString().split('T')[0],
      tanggalKeluar: '--:--:----',
      golonganDarah: 'B+',
      alergi: 'Tidak Ada',
      penyakitBawaan: 'Tidak Ada',
      statusBerkas: 'LENGKAP',
      bpjs: 'Aktif (PBI)',
      logHarian: []
    })
    setShowLansiaModal(true)
  }

  const openEditLansia = (lansia) => {
    setCurrentLansia(lansia)
    setShowLansiaModal(true)
  }

  const handleSaveLansia = (e) => {
    e.preventDefault()

    // Enforce unique id_blok check
    const isDuplicate = lansiaList.some(item => 
      item.id_blok.toLowerCase() === currentLansia.id_blok.toLowerCase() && 
      item.id !== currentLansia.id
    )
    if (isDuplicate) {
      setErrorModal({ show: true, message: `ID Lansia "${currentLansia.id_blok}" sudah digunakan! Silakan gunakan ID lain.` })
      return
    }

    if (currentLansia.id) {
      // Edit mode
      const updatedList = lansiaList.map(item => item.id === currentLansia.id ? currentLansia : item)
      setLansiaList(updatedList)
      if (selectedLansiaInfo && selectedLansiaInfo.id === currentLansia.id) {
        setSelectedLansiaInfo(currentLansia)
      }
    } else {
      // Add mode
      setLansiaList([...lansiaList, { ...currentLansia, id: Date.now() }])
    }
    setShowLansiaModal(false)
  }

  const handleDeleteLansia = (id) => {
    setConfirmModal({
      show: true,
      title: 'Hapus Lansia?',
      message: 'Apakah Anda yakin ingin menghapus data lansia ini secara permanen dari database?',
      isDanger: true,
      onConfirm: () => {
        setLansiaList(lansiaList.filter(item => item.id !== id))
        if (selectedLansiaInfo && selectedLansiaInfo.id === id) {
          setSelectedLansiaInfo(null)
        }
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }

  const openKeluarkanLansia = (lansia) => {
    setKeluarkanData({
      lansiaId: lansia.id,
      nama: lansia.nama,
      tanggalLahir: lansia.tanggalLahir,
      tanggalMasuk: lansia.tanggalMasuk,
      statusKeluar: 'Kembali ke Keluarga',
      tanggalKeluar: new Date().toISOString().split('T')[0],
      statusKesehatan: lansia.status,
      keterangan: ''
    })
    setShowKeluarkanModal(true)
  }

  const handleSaveKeluarkan = (e) => {
    e.preventDefault()

    setConfirmModal({
      show: true,
      title: 'Keluarkan Lansia?',
      message: `Apakah Anda yakin ingin mengeluarkan lansia "${keluarkanData.nama}" dari daftar lansia aktif?`,
      isDanger: false,
      onConfirm: () => {
        // Delete lansia from lansiaList (which deletes from lansia table in Supabase)
        const updatedList = lansiaList.filter(item => item.id !== Math.round(Number(keluarkanData.lansiaId)))
        setLansiaList(updatedList)

        // Also add to historiList (sync with Supabase histori_lansia)
        const lansiaToDischarge = lansiaList.find(item => item.id === keluarkanData.lansiaId)
        if (lansiaToDischarge) {
          const newHistoriItem = {
            id: lansiaToDischarge.id,
            nama: lansiaToDischarge.nama,
            tanggalLahir: lansiaToDischarge.tanggalLahir,
            tanggalMasuk: lansiaToDischarge.tanggalMasuk,
            tanggalKeluar: keluarkanData.tanggalKeluar,
            statusKesehatan: lansiaToDischarge.status,
            statusKeluar: keluarkanData.statusKeluar,
            keterangan: (keluarkanData.keterangan || '').trim() || '-',
            fotoUrl: lansiaToDischarge.fotoUrl || ''
          }
          setHistoriList([...historiList, newHistoriItem])
        }

        if (selectedLansiaInfo && selectedLansiaInfo.id === keluarkanData.lansiaId) {
          setSelectedLansiaInfo(null)
        }

        setShowKeluarkanModal(false)
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }


  // Filtering lists
  const activeLansiaList = lansiaList.filter(item => !item.statusHunian || item.statusHunian === 'Aktif')
  const filteredLansia = activeLansiaList.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchLansia.toLowerCase()) || 
                          (item.id_blok && item.id_blok.toLowerCase().includes(searchLansia.toLowerCase())) ||
                          (item.blok && item.blok.toLowerCase().includes(searchLansia.toLowerCase()))
    const matchesFilter = filterStatus === 'Semua' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Sort logic based on config
  const sortedLansia = [...filteredLansia].sort((a, b) => {
    if (sortConfig.key) {
      let aVal = a[sortConfig.key]
      let bVal = b[sortConfig.key]

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = (bVal || '').toLowerCase()
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    }
    return 0
  })

  // Pagination logic
  const itemsPerPage = 10
  const totalItems = sortedLansia.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLansia = sortedLansia.slice(startIndex, endIndex)

  // Print function
  const handlePrint = () => {
    window.print()
  }

  // Render Detail View
  if (selectedLansiaInfo) {
    const l = selectedLansiaInfo
    return (
      <>
        {/* Screen View */}
        <div className="print:hidden space-y-8 animate-fade-in text-left">
          {/* Top bar buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => setSelectedLansiaInfo(null)}
              className="flex items-center gap-2 text-stone-700 hover:text-stone-900 font-bold transition-all text-sm uppercase cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Daftar
            </button>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold py-2.5 px-5 rounded-xl text-xs uppercase shadow-sm transition-all cursor-pointer"
              >
                Cetak Rekam Medik
              </button>
            </div>
          </div>

          {/* Header Profile Card */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-stone-200/50 shadow-md flex flex-col md:flex-row gap-6 items-center">
            {/* Profile picture or initials box */}
            <div className="w-24 h-24 rounded-2xl bg-stone-100 flex items-center justify-center border border-stone-200 flex-shrink-0 overflow-hidden">
              {l.fotoUrl ? (
                <img 
                  src={l.fotoUrl} 
                  alt={l.nama} 
                  onClick={() => setLightboxImage(l.fotoUrl)}
                  className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" 
                />
              ) : (
                <span className="text-3xl font-black text-stone-900">{getInitials(l.nama)}</span>
              )}
            </div>

            <div className="flex-grow text-center md:text-left space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">{l.nama}</h3>
                <span className="inline-block text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border bg-emerald-50 border-emerald-100 text-emerald-800">
                  {l.status}
                </span>
              </div>

              {/* Sub Info Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-sm text-stone-600 font-semibold">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  ID: {l.id_blok || 'P0000'}
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Tgl Lahir: {formatDate(l.tanggalLahir)} ({calculateAge(l.tanggalLahir)} Th)
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {l.blok || 'Blok --'}
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Masuk: {formatDate(l.tanggalMasuk)}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-450">Keluar: {l.tanggalKeluar || '--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Layout Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Block - Medical Health */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[2rem] border border-stone-200/50 shadow-md space-y-8">
              <h4 className="text-lg font-black text-stone-900 border-b border-stone-100 pb-3">Ringkasan Kondisi Kesehatan</h4>
              
              {/* Blood type, Allergy, Hereditary disease boxes */}
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Blood type */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/50 flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Golongan Darah</span>
                  <div className="flex items-center gap-1.5 text-stone-900 font-extrabold text-2xl">
                    <svg className="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                    {l.golonganDarah || '--'}
                  </div>
                </div>

                {/* Allergy */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/50 flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Alergi</span>
                  <span className="text-stone-900 font-extrabold text-lg truncate max-w-full">
                    {l.alergi || 'Tidak Ada'}
                  </span>
                </div>

                {/* Hereditary disease */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/50 flex flex-col justify-center items-center text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Penyakit Bawaan</span>
                  <span className="text-stone-900 font-extrabold text-lg truncate max-w-full">
                    {l.penyakitBawaan || 'Tidak Ada'}
                  </span>
                </div>
              </div>

              {/* Daily check-in log */}
              <div className="space-y-6">
                <h5 className="text-sm font-bold text-stone-400 uppercase tracking-wider">Log Pemeriksaan Harian Petugas</h5>
                
                <div className="space-y-4">
                  {l.logHarian && l.logHarian.length > 0 ? (
                    l.logHarian.map((log, idx) => (
                      <div key={idx} className="border-l-4 border-stone-900 pl-4 py-2 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-stone-900">{log.waktu}</span>
                          <span className="text-emerald-700 font-semibold">{log.perawat}</span>
                        </div>
                        <p className="text-sm text-stone-600 font-medium leading-relaxed">{log.catatan}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-stone-400 font-semibold italic">Belum ada log pemeriksaan harian.</p>
                  )}
                </div>

              </div>
            </div>

            {/* Right Block - Admin Info */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-[2rem] border border-stone-200/50 shadow-md space-y-6">
              <h4 className="text-lg font-black text-stone-900 border-b border-stone-100 pb-3">Informasi Administratif</h4>
              
              <div className="space-y-4 font-semibold text-sm">
                <div className="flex justify-between items-center border-b border-stone-50 pb-3">
                  <span className="text-stone-500">Status Berkas</span>
                  <span className={`font-bold ${l.statusBerkas === 'LENGKAP' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {l.statusBerkas || 'BELUM LENGKAP'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">BPJS / Asuransi</span>
                  <span className="text-stone-900 font-bold">
                    {l.bpjs || 'Tidak Aktif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tampilan Cetak Resmi Rekam Medis (Hanya tampil saat mencetak) */}
        <div className="hidden print:block text-black font-sans p-4 bg-white max-w-4xl mx-auto leading-relaxed text-left">
          {/* Kop Surat (Letterhead) */}
          <div className="flex items-center justify-between border-b-4 border-double border-black pb-4 mb-6">
            <div className="w-16 h-16 flex items-center justify-center border border-black/20 mr-4 flex-shrink-0">
              <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-center flex-grow">
              <h2 className="text-base font-bold uppercase tracking-wide leading-tight">Yayasan Panti Sosial Tresna Werdha</h2>
              <h1 className="text-lg font-black uppercase tracking-wider leading-tight">PANTI SOSIAL HUSNUL KHOTIMAH</h1>
              <p className="text-[10px] font-semibold">Jl. Khotimah Utama No. 45, Kecamatan Sukajadi, Kota Bandung</p>
              <p className="text-[9px] font-medium text-stone-600">Telp: (022) 7654321 | Email: info@husnulkhotimah.or.id</p>
            </div>
            <div className="w-16 h-16"></div>
          </div>

          {/* Judul Dokumen */}
          <div className="text-center mb-6">
            <h2 className="text-base font-bold uppercase tracking-wider border-b border-black inline-block pb-0.5">DOKUMEN REKAM MEDIS LANSIA</h2>
            <p className="text-[9px] font-semibold uppercase tracking-widest mt-1">ID REKORD: {l.id_blok || 'P0000'}</p>
          </div>

          {/* Data Lansia Table */}
          <div className="grid grid-cols-2 gap-8 mb-6 border border-black p-4 rounded-xl">
            <div>
              <table className="w-full text-xs text-left">
                <tbody>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-semibold text-stone-600 w-1/3">Nama Lengkap</td>
                    <td className="py-2 font-bold text-black">: {l.nama}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-semibold text-stone-600">No. ID Lansia</td>
                    <td className="py-2 font-bold text-black">: {l.id_blok || 'P0000'}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-semibold text-stone-600">Tanggal Lahir</td>
                    <td className="py-2 font-medium text-black">: {formatDate(l.tanggalLahir)} ({calculateAge(l.tanggalLahir)} Tahun)</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-semibold text-stone-600">Blok / Kamar</td>
                    <td className="py-2 font-medium text-black">: {l.blok || '-'}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-semibold text-stone-600">Tanggal Masuk</td>
                    <td className="py-2 font-medium text-black">: {formatDate(l.tanggalMasuk)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full text-xs text-left">
                <tbody>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-semibold text-stone-600 w-1/3">Gol. Darah</td>
                    <td className="py-2 font-bold text-red-600">: {l.golonganDarah || '-'}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-semibold text-stone-600">Alergi</td>
                    <td className="py-2 font-medium text-black">: {l.alergi || 'Tidak Ada'}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-semibold text-stone-600">Penyakit Bawaan</td>
                    <td className="py-2 font-medium text-black">: {l.penyakitBawaan || 'Tidak Ada'}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-semibold text-stone-600">Status BPJS</td>
                    <td className="py-2 font-medium text-black">: {l.bpjs || 'Tidak Ada'}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-semibold text-stone-600">Status Medis</td>
                    <td className="py-2 font-bold text-black">: {l.status}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Log Pemeriksaan */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 border-b border-black pb-1">LOG PEMERIKSAAN HARIAN PETUGAS</h3>
            {l.logHarian && l.logHarian.length > 0 ? (
              <table className="w-full text-xs border border-black border-collapse text-left">
                <thead>
                  <tr className="bg-stone-100">
                    <th className="border border-black p-2 font-bold w-1/12 text-center">NO</th>
                    <th className="border border-black p-2 font-bold w-3/12">WAKTU</th>
                    <th className="border border-black p-2 font-bold w-3/12">PERAWAT</th>
                    <th className="border border-black p-2 font-bold w-5/12">CATATAN KONDISI / TINDAKAN</th>
                  </tr>
                </thead>
                <tbody>
                  {l.logHarian.map((log, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="border border-black p-2 text-center">{idx + 1}</td>
                      <td className="border border-black p-2 font-semibold">{log.waktu}</td>
                      <td className="border border-black p-2">{log.perawat}</td>
                      <td className="border border-black p-2 leading-relaxed">{log.catatan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xs text-stone-500 italic font-medium">Belum ada riwayat log pemeriksaan harian untuk lansia ini.</p>
            )}
          </div>

          {/* Tanda Tangan */}
          <div className="flex justify-end text-xs mt-12">
            <div className="text-center w-64">
              <p>Bandung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-semibold mt-1">Petugas Penanggung Jawab,</p>
              <div className="h-20"></div>
              <p className="font-bold border-b border-black pb-0.5 inline-block w-48">Admin Utama</p>
              <p className="text-[10px] text-stone-500 mt-0.5">Kepala UPT Husnul Khotimah</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Render Table View
  return (
    <div className="bg-white rounded-2xl border border-stone-200/50 shadow-md p-6 space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
        
        {/* Search */}
        <div className="flex-grow max-w-md">
          <input
            type="text"
            placeholder="Cari nama, ID, atau blok..."
            value={searchLansia}
            onChange={(e) => setSearchLansia(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-stone-855 font-semibold"
          />
        </div>

        {/* Filter & Add Button */}
        <div className="flex items-center gap-3 justify-end">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-emerald-600 text-stone-850 font-bold"
          >
            <option value="Semua">Semua Status</option>
            <option value="Mandiri">Mandiri</option>
            <option value="Semi Klinis">Semi Klinis</option>
            <option value="Klinis">Klinis</option>
          </select>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus Terpilih ({selectedIds.length})
            </button>
          )}

          <button
            onClick={openAddLansia}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Lansia
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto rounded-xl border border-stone-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-[11px] font-black uppercase text-stone-400 tracking-wider border-b border-stone-100">
            <tr>
              <th className="py-4 px-6 w-12">
                <input 
                  type="checkbox"
                  checked={paginatedLansia.length > 0 && paginatedLansia.every(item => selectedIds.includes(item.id))}
                  onChange={() => handleSelectAll(paginatedLansia)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th 
                onClick={() => requestSort('nama')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center">
                  NAMA
                  {renderSortArrow('nama')}
                </div>
              </th>
              <th 
                onClick={() => requestSort('id_blok')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center">
                  ID / BLOK
                  {renderSortArrow('id_blok')}
                </div>
              </th>
              <th 
                onClick={() => requestSort('status')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center justify-center">
                  STATUS
                  {renderSortArrow('status')}
                </div>
              </th>
              <th className="py-4 px-6 text-right pr-12">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
            {paginatedLansia.length > 0 ? (
              paginatedLansia.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-6 w-12">
                    <input 
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                      className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  {/* Column Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.fotoUrl ? (
                          <img 
                            src={item.fotoUrl} 
                            alt={item.nama} 
                            onClick={() => setLightboxImage(item.fotoUrl)}
                            className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" 
                          />
                        ) : (
                          <span className="text-xs font-black text-stone-750">{getInitials(item.nama)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{item.nama}</p>
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">
                          TGL LAHIR : {formatDate(item.tanggalLahir)} ({calculateAge(item.tanggalLahir)} TH)
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column ID / Blok */}
                  <td className="py-4 px-6">
                    <p className="font-semibold text-stone-900">{item.id_blok || 'P0000'}</p>
                    <p className="text-[10px] text-stone-500 font-semibold mt-0.5">{item.blok || 'Blok --'}</p>
                  </td>

                  {/* Column Status */}
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block text-[10px] font-extrabold px-3 py-1 rounded-full border bg-white border-stone-300 text-stone-700 uppercase tracking-wide">
                      {item.status}
                    </span>
                  </td>

                  {/* Column Actions */}
                  <td className="py-4 px-6 text-right pr-6">
                    <div className="flex justify-end gap-3.5">
                      {/* Info Button */}
                      <button
                        onClick={() => setSelectedLansiaInfo(item)}
                        className="cursor-pointer"
                        title="Detail Info"
                      >
                        <svg className="w-5 h-5 text-stone-600 hover:text-emerald-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditLansia(item)}
                        className="cursor-pointer"
                        title="Edit Data"
                      >
                        <svg className="w-5 h-5 text-stone-600 hover:text-emerald-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>

                      {/* Mutasi/Keluarkan Button */}
                      <button
                        onClick={() => openKeluarkanLansia(item)}
                        className="cursor-pointer"
                        title="Keluarkan / Mutasi ke Histori"
                      >
                        <svg className="w-5 h-5 text-stone-600 hover:text-amber-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteLansia(item.id)}
                        className="cursor-pointer"
                        title="Hapus Data"
                      >
                        <svg className="w-5 h-5 text-stone-600 hover:text-red-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-stone-400 font-semibold">Tidak ada data lansia ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
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
            {/* Prev Button */}
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

            {/* Page Numbers */}
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

            {/* Next Button */}
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

      {/* --- LANSIA MODAL --- */}
      {showLansiaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-extrabold text-stone-900 tracking-tight border-b border-stone-100 pb-3 mb-6">
              {currentLansia.id ? 'Edit Data Lansia' : 'Tambah Data Lansia Baru'}
            </h3>
            
            <form onSubmit={handleSaveLansia} className="space-y-4">
              {/* Profile Picture Uploader */}
              <div className="flex flex-col items-center gap-2 pb-4 border-b border-stone-100">
                <div className="relative w-20 h-20 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden group">
                  {currentLansia.fotoUrl ? (
                    <img src={currentLansia.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-stone-400">
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
                    {/* Day Select */}
                    <select
                      value={ld}
                      onChange={(e) => handleDateChange('day', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-2 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors"
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>

                    {/* Month Select */}
                    <select
                      value={lm}
                      onChange={(e) => handleDateChange('month', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-2 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors"
                    >
                      {months.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>

                    {/* Year Select */}
                    <select
                      value={ly}
                      onChange={(e) => handleDateChange('year', e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-2 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors"
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
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^0-9]/g, '')
                      const maxDigits = digits.slice(0, 4)
                      setCurrentLansia({ ...currentLansia, id_blok: 'L' + maxDigits })
                    }}
                    placeholder="Contoh: L0012"
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
                  onClick={() => setShowLansiaModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-3 px-5 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow cursor-pointer uppercase tracking-wider"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- KELUARKAN / MUTASI LANSIA MODAL --- */}
      {showKeluarkanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
            <h3 className="text-lg font-extrabold text-stone-900 tracking-tight border-b border-stone-100 pb-3 mb-6">
              Keluarkan / Mutasi Lansia ke Histori
            </h3>
            
            <form onSubmit={handleSaveKeluarkan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Nama Lansia</label>
                <input
                  type="text"
                  disabled
                  value={keluarkanData.nama}
                  className="w-full bg-stone-100 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Tanggal Keluar</label>
                  <input
                    type="date"
                    required
                    value={keluarkanData.tanggalKeluar}
                    onChange={(e) => setKeluarkanData({ ...keluarkanData, tanggalKeluar: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Status Keluar / Akhir</label>
                  <select
                    value={keluarkanData.statusKeluar}
                    onChange={(e) => setKeluarkanData({ ...keluarkanData, statusKeluar: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors"
                  >
                    <option value="Kembali ke Keluarga">Kembali ke Keluarga</option>
                    <option value="Meninggal Dunia">Meninggal Dunia</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Keterangan Tambahan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Dijemput oleh anak kandungnya, dipulangkan ke Bandung."
                  value={keluarkanData.keterangan}
                  onChange={(e) => setKeluarkanData({ ...keluarkanData, keterangan: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowKeluarkanModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-3 px-5 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow cursor-pointer uppercase tracking-wider"
                >
                  Keluarkan Lansia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Error Popup Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200/50 transform transition-all scale-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="flex flex-col items-center">
              {/* Icon Container */}
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-black text-stone-900 mb-2">Pemberitahuan</h3>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed font-semibold">
                {errorModal.message}
              </p>

              <button
                type="button"
                onClick={() => setErrorModal({ show: false, message: '' })}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200/50 transform transition-all scale-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="flex flex-col items-center">
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                confirmModal.isDanger ? 'bg-rose-50 text-rose-650' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {confirmModal.isDanger ? (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              
              <h3 className="text-lg font-black text-stone-900 mb-2">{confirmModal.title}</h3>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed font-semibold">
                {confirmModal.message}
              </p>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })}
                  className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-755 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold text-white transition-all shadow-md cursor-pointer ${
                    confirmModal.isDanger 
                      ? 'bg-rose-650 hover:bg-rose-700 shadow-rose-650/20' 
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  }`}
                >
                  Ya, Lanjutkan
                </button>
              </div>
            </div>
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
