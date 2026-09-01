import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, NavLink, Outlet } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

// Initial Mock data for Lansia
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

export default function DashboardPetugas() {
  const navigate = useNavigate()
  const location = useLocation()

  // Track the logged-in staff. Default to Ns. Rina Lestari (Shift Siang) since it matches current afternoon time.
  const [activeNurse, setActiveNurse] = useState(() => {
    const saved = localStorage.getItem('activeNurse')
    return saved ? JSON.parse(saved) : { nama: 'Ns. Rina Lestari', nip: 'P002', shift: 'Siang' }
  })

  // State for Lansia
  const [lansiaList, setLansiaList] = useState([])

  // State for Petugas
  const [petugasList, setPetugasList] = useState([])

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

  // State for logout confirmation modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // State for mobile sidebar menu toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  // Persist Petugas (no longer synced to localStorage, managed by Supabase)

  // Handle Logout
  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const headerText = location.pathname.endsWith('lansia')
    ? 'Log Harian Lansia'
    : location.pathname.endsWith('shift')
      ? 'Jadwal Shift & Kehadiran'
      : 'Overview Petugas'

  return (
    <div className="h-screen flex bg-stone-100 text-stone-850 font-sans overflow-hidden relative">
      
      {/* Mobile Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col justify-between flex-shrink-0 h-full text-left transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div>
          {/* Header Panel */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Staff Portal</h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Caregiver & Nurse Panel</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            <NavLink
              to="/dashboard/petugas"
              end
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              OVERVIEW
            </NavLink>
            <NavLink
              to="/dashboard/petugas/lansia"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              LOG HARIAN LANSIA
            </NavLink>
            <NavLink
              to="/dashboard/petugas/shift"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              JADWAL SHIFT
            </NavLink>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm select-none">
              {activeNurse.nama.split(' ').pop().substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate max-w-[140px]">{activeNurse.nama}</p>
              <p className="text-[9px] text-slate-450 font-semibold uppercase tracking-wide">Shift {activeNurse.shift}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-450 hover:bg-rose-500/10 hover:text-rose-400 transition-all cursor-pointer text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden h-full">
        
        {/* Header Bar */}
        <header className="h-20 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 text-left">
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
              <p className="text-xs sm:text-sm font-extrabold text-stone-900">{activeNurse.nama}</p>
              <p className="text-[9px] sm:text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Perawat</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white font-bold text-base sm:text-lg flex items-center justify-center border-2 border-stone-100 shadow-sm uppercase">
              {activeNurse.nama[0]}
            </div>
          </div>
        </header>

        {/* Sub-view Content Section */}
        <div className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto h-full text-left">
          <Outlet context={{ lansiaList, setLansiaList: updateLansiaList, petugasList, setPetugasList: updatePetugasList, activeNurse, setActiveNurse }} />
        </div>
      </main>


      {/* Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200/50 transform transition-all scale-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="flex flex-col items-center">
              {/* Icon Container */}
              <div className="w-14 h-14 bg-rose-50 text-rose-650 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              
              <h3 className="text-lg font-black text-stone-900 mb-1">Konfirmasi Keluar</h3>
              <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                Apakah Anda yakin ingin keluar dari <span className="font-semibold text-stone-850">Petugas Panel</span>?
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
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-all shadow-md shadow-rose-600/20 cursor-pointer"
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
