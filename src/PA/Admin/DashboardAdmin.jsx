import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, NavLink, Outlet } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

// Initial Mock data for Keuangan
const initialTransaksiList = []

const initialLansiaList = [
  {
    id: 23001,
    nama: 'H. Ahmad Dahlan',
    tanggalLahir: '1948-01-12',
    fotoUrl: '',
    id_blok: 'P0012',
    blok: 'Blok A - 01',
    status: 'Mandiri',
    tanggalMasuk: '2023-01-12',
    tanggalKeluar: '--:--:----',
    golonganDarah: 'B+',
    alergi: 'Seafood',
    penyakitBawaan: 'Hipertensi',
    statusBerkas: 'LENGKAP',
    bpjs: 'Aktif (PBI)',
    logHarian: []
  },
  {
    id: 23002,
    nama: 'Siti Aminah',
    tanggalLahir: '1949-02-10',
    fotoUrl: '',
    id_blok: 'P0057',
    blok: 'Blok B - 04',
    status: 'Semi Klinis',
    tanggalMasuk: '2023-02-10',
    tanggalKeluar: '--:--:----',
    golonganDarah: 'O',
    alergi: 'Debu',
    penyakitBawaan: 'Diabetes Mellitus',
    statusBerkas: 'LENGKAP',
    bpjs: 'Aktif (Mandiri)',
    logHarian: []
  },
  {
    id: 22001,
    nama: 'Rusli Effendi',
    tanggalLahir: '1951-11-22',
    fotoUrl: '',
    id_blok: 'P0042',
    blok: 'Blok A - 03',
    status: 'Klinis',
    tanggalMasuk: '2022-11-22',
    tanggalKeluar: '--:--:----',
    golonganDarah: 'A+',
    alergi: 'Tidak Ada',
    penyakitBawaan: 'Pasca Stroke',
    statusBerkas: 'LENGKAP',
    bpjs: 'Aktif (PBI)',
    logHarian: []
  }
]

const initialPetugasList = [
  { id: 1, nama: 'Ns. Hendra Wijaya', nip: 'P001', shift: 'Pagi', status: 'Aktif', fotoUrl: '' },
  { id: 2, nama: 'Ns. Rina Lestari', nip: 'P002', shift: 'Siang', status: 'Aktif', fotoUrl: '' },
  { id: 3, nama: 'Ns. Andi Pratama', nip: 'P003', shift: 'Malam', status: 'Aktif', fotoUrl: '' },
  { id: 4, nama: 'Ns. Dewi Sartika', nip: 'P004', shift: 'Pagi', status: 'Aktif', fotoUrl: '' },
  { id: 5, nama: 'Ns. Lukman Hakim', nip: 'P005', shift: 'Malam', status: 'Cuti', fotoUrl: '' },
]

export default function DashboardAdmin() {
  const navigate = useNavigate()
  const location = useLocation()

  const headerText = location.pathname.endsWith('datalansia')
    ? 'Data Lansia'
    : location.pathname.endsWith('datapetugas')
      ? 'Data Petugas'
      : location.pathname.endsWith('keuangan')
        ? 'Data Keuangan'
        : location.pathname.endsWith('histori')
          ? 'Data Histori'
          : location.pathname.endsWith('pesan')
            ? 'Pesan Masuk'
            : 'Dashboard'

  // State for Lansia
  const [lansiaList, setLansiaList] = useState([])

  // State for Petugas
  const [petugasList, setPetugasList] = useState([])

  // State for Keuangan initialized from localStorage
  const [transaksiList, setTransaksiList] = useState(() => {
    const saved = localStorage.getItem('transaksiList')
    return saved ? JSON.parse(saved) : initialTransaksiList
  })

  // State for Keuangan Pagu Anggaran initialized from localStorage
  const [paguAnggaran, setPaguAnggaran] = useState(() => {
    const saved = localStorage.getItem('paguAnggaran')
    return saved ? Number(saved) : 50000000
  })

  useEffect(() => {
    localStorage.setItem('paguAnggaran', paguAnggaran.toString())
  }, [paguAnggaran])

  // State for Histori
  const [historiList, setHistoriList] = useState([])

  // State for Pesan Konsultasi
  const [pesanList, setPesanList] = useState([])

  // State for logout confirmation modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // State for mobile sidebar menu toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])


  // Mapper helpers for Supabase
  const mapToDb = (item) => ({
    id: item.id,
    nama: item.nama,
    tanggal_lahir: item.tanggalLahir,
    foto_url: item.fotoUrl,
    id_blok: item.id_blok,
    blok: item.blok,
    status: item.status,
    tanggal_masuk: item.tanggalMasuk,
    tanggal_keluar: item.tanggalKeluar === '--:--:----' ? null : item.tanggalKeluar,
    golongan_darah: item.golonganDarah,
    alergi: item.alergi,
    penyakit_bawaan: item.penyakitBawaan,
    status_berkas: item.statusBerkas,
    bpjs: item.bpjs,
    log_harian: item.logHarian || [],
    status_hunian: item.statusHunian || 'Aktif',
    keterangan_keluar: item.keteranganKeluar || null
  })

  const mapToUi = (dbItem) => ({
    id: dbItem.id,
    nama: dbItem.nama,
    tanggalLahir: dbItem.tanggal_lahir,
    fotoUrl: dbItem.foto_url,
    id_blok: dbItem.id_blok,
    blok: dbItem.blok,
    status: dbItem.status,
    tanggalMasuk: dbItem.tanggal_masuk,
    tanggalKeluar: dbItem.tanggal_keluar || '--:--:----',
    golonganDarah: dbItem.golongan_darah,
    alergi: dbItem.alergi,
    penyakitBawaan: dbItem.penyakit_bawaan,
    statusBerkas: dbItem.status_berkas,
    bpjs: dbItem.bpjs,
    logHarian: dbItem.log_harian || [],
    statusHunian: dbItem.status_hunian || 'Aktif',
    keteranganKeluar: dbItem.keterangan_keluar || ''
  })

  // Mapper helpers for Petugas
  const mapPetugasToDb = (item) => ({
    id: item.id,
    nama: item.nama,
    nip: item.nip,
    shift: item.shift,
    status: item.status,
    foto_url: item.fotoUrl || null
  })

  const mapPetugasToUi = (dbItem) => ({
    id: dbItem.id,
    nama: dbItem.nama,
    nip: dbItem.nip,
    shift: dbItem.shift,
    status: dbItem.status,
    fotoUrl: dbItem.foto_url || ''
  })

  // Mapper helpers for Histori Lansia
  const mapHistoriToDb = (item) => ({
    id: item.id,
    nama: item.nama,
    tanggal_lahir: item.tanggalLahir || null,
    tanggal_masuk: item.tanggalMasuk,
    tanggal_keluar: item.tanggalKeluar,
    status_kesehatan: item.statusKesehatan,
    status_keluar: item.statusKeluar,
    keterangan: item.keterangan || null,
    foto_url: item.fotoUrl || null
  })

  const mapHistoriToUi = (dbItem) => ({
    id: dbItem.id,
    nama: dbItem.nama,
    tanggalLahir: dbItem.tanggal_lahir || '',
    tanggalMasuk: dbItem.tanggal_masuk,
    tanggalKeluar: dbItem.tanggal_keluar,
    statusKesehatan: dbItem.status_kesehatan,
    statusKeluar: dbItem.status_keluar,
    keterangan: dbItem.keterangan || '',
    fotoUrl: dbItem.foto_url || ''
  })

  // Mapper helpers for Pesan Konsultasi
  const mapPesanToDb = (item) => ({
    id: item.id,
    nama: item.nama,
    no_whatsapp: item.noWhatsapp,
    pesan: item.pesan,
    status: item.status,
    created_at: item.createdAt
  })

  const mapPesanToUi = (dbItem) => ({
    id: dbItem.id,
    nama: dbItem.nama,
    noWhatsapp: dbItem.no_whatsapp,
    pesan: dbItem.pesan,
    status: dbItem.status || 'Belum Dibaca',
    createdAt: dbItem.created_at
  })

  // Keep latest value in ref to avoid stale closures
  const lansiaListRef = useRef(lansiaList)
  useEffect(() => {
    lansiaListRef.current = lansiaList
  }, [lansiaList])

  // Fetch Lansia from Supabase
  useEffect(() => {
    const fetchLansia = async () => {
      const { data, error } = await supabase
        .from('lansia')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error('Gagal memuat data lansia:', error.message)
      } else {
        if (data && data.length > 0) {
          setLansiaList(data.map(mapToUi))
        } else {
          // If database is empty, seed with initial data
          const dbData = initialLansiaList.map(mapToDb)
          const { error: insertError } = await supabase.from('lansia').insert(dbData)
          if (insertError) {
            console.error('Gagal mengisi data awal:', insertError.message)
          } else {
            setLansiaList(initialLansiaList)
          }
        }
      }
    }
    fetchLansia()
  }, [])

  // Keep latest value petugas in ref
  const petugasListRef = useRef(petugasList)
  useEffect(() => {
    petugasListRef.current = petugasList
  }, [petugasList])

  // Fetch Petugas from Supabase
  useEffect(() => {
    const fetchPetugas = async () => {
      const { data, error } = await supabase
        .from('petugas')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('Gagal memuat data petugas:', error.message)
      } else {
        if (data && data.length > 0) {
          setPetugasList(data.map(mapPetugasToUi))
        } else {
          // If database is empty, seed with initial data
          const dbData = initialPetugasList.map(mapPetugasToDb)
          const { error: insertError } = await supabase.from('petugas').insert(dbData)
          if (insertError) {
            console.error('Gagal mengisi data petugas awal:', insertError.message)
          } else {
            setPetugasList(initialPetugasList)
          }
        }
      }
    }
    fetchPetugas()
  }, [])

  const pesanListRef = useRef(pesanList)
  useEffect(() => {
    pesanListRef.current = pesanList
  }, [pesanList])

  // Fetch Pesan Konsultasi from Supabase
  useEffect(() => {
    const fetchPesan = async () => {
      const { data, error } = await supabase
        .from('pesan_konsultasi')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error('Gagal memuat data pesan:', error.message)
      } else {
        if (data) {
          setPesanList(data.map(mapPesanToUi))
        }
      }
    }
    fetchPesan()
  }, [])

  const updatePesanList = async (newListOrFunc) => {
    const currentList = pesanListRef.current
    let nextList
    if (typeof newListOrFunc === 'function') {
      nextList = newListOrFunc(currentList)
    } else {
      nextList = newListOrFunc
    }

    setPesanList(nextList)

    const oldMap = new Map(currentList.map(item => [item.id, item]))
    const newMap = new Map(nextList.map(item => [item.id, item]))

    // Find and delete removed items
    for (const oldId of oldMap.keys()) {
      if (!newMap.has(oldId)) {
        const { error } = await supabase.from('pesan_konsultasi').delete().eq('id', oldId)
        if (error) {
          console.error('Gagal menghapus pesan dari Supabase:', error.message)
        }
      }
    }

    // Find and update modified items
    for (const [newId, newItem] of newMap.entries()) {
      const oldItem = oldMap.get(newId)
      if (oldItem && (oldItem.status !== newItem.status)) {
        const { error } = await supabase
          .from('pesan_konsultasi')
          .update({ status: newItem.status })
          .eq('id', newId)
        if (error) {
          console.error('Gagal mengupdate status pesan di Supabase:', error.message)
        }
      }
    }
  }

  // Sync Petugas state updates to Supabase
  const updatePetugasList = async (newListOrFunc) => {
    const currentList = petugasListRef.current
    let nextList
    if (typeof newListOrFunc === 'function') {
      nextList = newListOrFunc(currentList)
    } else {
      nextList = newListOrFunc
    }

    setPetugasList(nextList)

    const oldMap = new Map(currentList.map(item => [item.id, item]))
    const newMap = new Map(nextList.map(item => [item.id, item]))

    // Find and delete removed items
    for (const oldId of oldMap.keys()) {
      if (!newMap.has(oldId)) {
        const { error } = await supabase.from('petugas').delete().eq('id', oldId)
        if (error) {
          console.error('Gagal menghapus petugas dari Supabase:', error.message)
          alert('Gagal menghapus petugas dari database: ' + error.message)
        }
      }
    }

    // Find and insert/update added/modified items
    for (const [newId, newItem] of newMap.entries()) {
      const oldItem = oldMap.get(newId)
      if (!oldItem) {
        const dbPayload = mapPetugasToDb(newItem)
        delete dbPayload.id // Let Supabase auto-generate sequential ID
        const { data, error } = await supabase.from('petugas').insert([dbPayload]).select('id').single()
        if (error) {
          console.error('Gagal menambah petugas ke Supabase:', error.message)
          alert('Gagal menambah petugas ke database: ' + error.message)
        } else if (data) {
          setPetugasList(prev => prev.map(item => item.id === newId ? { ...item, id: data.id } : item))
        }
      } else if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
        const { error } = await supabase.from('petugas').update(mapPetugasToDb(newItem)).eq('id', newId)
        if (error) {
          console.error('Gagal memperbarui petugas di Supabase:', error.message)
          alert('Gagal memperbarui petugas di database: ' + error.message)
        }
      }
    }
  }

  // Keep latest value histori in ref
  const historiListRef = useRef(historiList)
  useEffect(() => {
    historiListRef.current = historiList
  }, [historiList])

  // Fetch Histori from Supabase
  useEffect(() => {
    const fetchHistori = async () => {
      const { data, error } = await supabase
        .from('histori_lansia')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error('Gagal memuat data histori:', error.message)
      } else {
        if (data && data.length > 0) {
          setHistoriList(data.map(mapHistoriToUi))
        }
      }
    }
    fetchHistori()
  }, [])

  // Auto-sync missing history records from lansia table to histori_lansia table, then delete them from lansia table
  useEffect(() => {
    const syncAndClean = async () => {
      if (lansiaList.length > 0 && historiList.length === 0) {
        const inactiveSeniors = lansiaList.filter(item => item.statusHunian && item.statusHunian !== 'Aktif')
        if (inactiveSeniors.length > 0) {
          console.log('Auto-syncing inactive seniors to histori_lansia table...', inactiveSeniors)
          const newHistoriRecords = inactiveSeniors.map(item => ({
            id: item.id,
            nama: item.nama,
            tanggalLahir: item.tanggalLahir,
            tanggalMasuk: item.tanggalMasuk,
            tanggalKeluar: item.tanggalKeluar,
            statusKesehatan: item.status,
            statusKeluar: item.statusHunian,
            keterangan: item.keteranganKeluar || '',
            fotoUrl: item.fotoUrl || ''
          }))
          
          // 1. Save to historiList
          updateHistoriList(newHistoriRecords)
          
          // 2. Delete from lansia table in Supabase
          for (const senior of inactiveSeniors) {
            const { error } = await supabase.from('lansia').delete().eq('id', senior.id)
            if (error) {
              console.error(`Gagal menghapus lansia non-aktif ${senior.nama} dari tabel lansia:`, error.message)
            }
          }
          
          // 3. Remove them from lansiaList state in UI
          setLansiaList(prev => prev.filter(item => !item.statusHunian || item.statusHunian === 'Aktif'))
        }
      }
    }
    syncAndClean()
  }, [lansiaList, historiList])

  // Sync Histori state updates to Supabase
  const updateHistoriList = async (newListOrFunc) => {
    const currentList = historiListRef.current
    let nextList
    if (typeof newListOrFunc === 'function') {
      nextList = newListOrFunc(currentList)
    } else {
      nextList = newListOrFunc
    }

    setHistoriList(nextList)

    const oldMap = new Map(currentList.map(item => [item.id, item]))
    const newMap = new Map(nextList.map(item => [item.id, item]))

    // Find and delete removed items
    for (const oldId of oldMap.keys()) {
      if (!newMap.has(oldId)) {
        const { error } = await supabase.from('histori_lansia').delete().eq('id', oldId)
        if (error) {
          console.error('Gagal menghapus histori dari Supabase:', error.message)
          alert('Gagal menghapus histori dari database: ' + error.message)
        }
      }
    }

    // Find and insert/update added/modified items
    for (const [newId, newItem] of newMap.entries()) {
      const oldItem = oldMap.get(newId)
      if (!oldItem) {
        const dbPayload = mapHistoriToDb(newItem)
        delete dbPayload.id // Let Supabase auto-generate sequential ID
        const { data, error } = await supabase.from('histori_lansia').insert([dbPayload]).select('id').single()
        if (error) {
          console.error('Gagal menambah histori ke Supabase:', error.message)
          alert('Gagal menambah histori ke database: ' + error.message)
        } else if (data) {
          setHistoriList(prev => prev.map(item => item.id === newId ? { ...item, id: data.id } : item))
        }
      } else if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
        const { error } = await supabase.from('histori_lansia').update(mapHistoriToDb(newItem)).eq('id', newId)
        if (error) {
          console.error('Gagal memperbarui histori di Supabase:', error.message)
          alert('Gagal memperbarui histori di database: ' + error.message)
        }
      }
    }
  }

  // Helper to generate a 5-digit cohort-based ID
  const generateCohortId = async (tanggalMasuk) => {
    let year2Digits = '26'
    if (tanggalMasuk && tanggalMasuk.includes('-')) {
      const year = tanggalMasuk.split('-')[0]
      year2Digits = year.substring(2, 4)
    } else if (tanggalMasuk && tanggalMasuk.includes(' ')) {
      const parts = tanggalMasuk.split(' ')
      const year = parts[parts.length - 1]
      year2Digits = year.substring(2, 4)
    }

    const minId = Number(year2Digits + '000') // e.g. 23000
    const maxId = Number(year2Digits + '999') // e.g. 23999

    const { data, error } = await supabase
      .from('lansia')
      .select('id')
      .gte('id', minId)
      .lte('id', maxId)
      .order('id', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Gagal mengambil ID terakhir:', error.message)
      return minId + 1
    }

    if (data && data.length > 0) {
      return Number(data[0].id) + 1
    }

    return minId + 1
  }

  // Sync Lansia state updates to Supabase
  const updateLansiaList = async (newListOrFunc) => {
    const currentList = lansiaListRef.current
    let nextList
    if (typeof newListOrFunc === 'function') {
      nextList = newListOrFunc(currentList)
    } else {
      nextList = newListOrFunc
    }

    setLansiaList(nextList)

    const oldMap = new Map(currentList.map(item => [item.id, item]))
    const newMap = new Map(nextList.map(item => [item.id, item]))

    // Find and delete removed items
    for (const oldId of oldMap.keys()) {
      if (!newMap.has(oldId)) {
        const { error } = await supabase.from('lansia').delete().eq('id', oldId)
        if (error) {
          console.error('Gagal menghapus data dari Supabase:', error.message)
          alert('Gagal menghapus dari database: ' + error.message)
        }
      }
    }

    // Find and insert/update added/modified items
    for (const [newId, newItem] of newMap.entries()) {
      const oldItem = oldMap.get(newId)
      if (!oldItem) {
        const generatedId = await generateCohortId(newItem.tanggalMasuk)
        const dbPayload = mapToDb({ ...newItem, id: generatedId })
        const { error } = await supabase.from('lansia').insert([dbPayload])
        if (error) {
          console.error('Gagal menambah data ke Supabase:', error.message)
          alert('Gagal menambah data ke database: ' + error.message)
        } else {
          // Replace temp ID with the database sequential ID
          setLansiaList(prev => prev.map(item => item.id === newId ? { ...item, id: generatedId } : item))
        }
      } else if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
        const { error } = await supabase.from('lansia').update(mapToDb(newItem)).eq('id', newId)
        if (error) {
          console.error('Gagal memperbarui data di Supabase:', error.message)
          alert('Gagal memperbarui data di database: ' + error.message)
        }
      }
    }
  }

  // Persist Petugas (no longer synced to localStorage, managed by Supabase)

  // Persist Keuangan to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('transaksiList', JSON.stringify(transaksiList))
    } catch (e) {
      console.error('LocalStorage write failed:', e)
    }
  }, [transaksiList])

  // Persist Histori (no longer synced to localStorage, managed by Supabase)

  // Handle Logout
  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  return (
    <div className="h-screen flex bg-stone-100 text-stone-850 font-sans overflow-hidden print:h-auto print:overflow-visible print:bg-white relative">
      
      {/* Mobile Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 flex flex-col justify-between flex-shrink-0 h-full text-left transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 print:hidden ${
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div>
          {/* Header Panel */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-stone-900 tracking-tight">Admin Panel</h1>
              <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-0.5">Husnul Khotimah</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-stone-400 hover:text-stone-600 p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            <NavLink
              to="/dashboard/admin"
              end
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              DASHBOARD
            </NavLink>
            <NavLink
              to="/dashboard/admin/datalansia"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              DATA LANSIA
            </NavLink>
            <NavLink
              to="/dashboard/admin/datapetugas"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              DATA PETUGAS
            </NavLink>
            <NavLink
              to="/dashboard/admin/keuangan"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              DATA KEUANGAN
            </NavLink>
            <NavLink
              to="/dashboard/admin/histori"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              DATA HISTORI
            </NavLink>
            <NavLink
              to="/dashboard/admin/pesan"
              className={({ isActive }) =>
                `w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                PESAN MASUK
              </span>
              {pesanList.filter(p => p.status === 'Belum Dibaca').length > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {pesanList.filter(p => p.status === 'Belum Dibaca').length}
                </span>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Back Button */}
        <div className="p-4 border-t border-stone-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden h-full print:h-auto print:overflow-visible">
        
        {/* Header Bar */}
        <header className="h-20 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 text-left print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight uppercase">
              {headerText}
            </h2>
          </div>

          {/* Profile Card */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right">
              <p className="text-xs sm:text-sm font-extrabold text-stone-900">Admin</p>
              <p className="text-[9px] sm:text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Kepala UPT</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white font-bold text-base sm:text-lg flex items-center justify-center border-2 border-stone-100 shadow-sm uppercase">
              A
            </div>
          </div>
        </header>

        {/* Sub-view Content Section */}
        <div className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto h-full text-left print:p-0 print:overflow-visible">
          
          <Outlet context={{ lansiaList, setLansiaList: updateLansiaList, petugasList, setPetugasList: updatePetugasList, transaksiList, setTransaksiList, historiList, setHistoriList: updateHistoriList, paguAnggaran, setPaguAnggaran, pesanList, setPesanList: updatePesanList }} />

        </div>
      </main>


      {/* Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200/50 transform transition-all scale-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="flex flex-col items-center">
              {/* Icon Container */}
              <div className="w-14 h-14 bg-red-50 text-red-650 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              
              <h3 className="text-lg font-black text-stone-900 mb-1">Konfirmasi Keluar</h3>
              <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                Apakah Anda yakin ingin keluar dari <span className="font-semibold text-stone-850">Admin Panel</span>?
              </p>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutConfirm(false)
                    navigate('/')
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-all shadow-md shadow-red-600/20 cursor-pointer"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
