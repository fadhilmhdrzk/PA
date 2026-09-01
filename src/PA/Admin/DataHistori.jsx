import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function DataHistori(props) {
  const context = useOutletContext() || {}
  const lansiaList = props.lansiaList || context.lansiaList || []
  const setLansiaList = props.setLansiaList || context.setLansiaList
  const dbHistoriList = props.historiList || context.historiList || []
  const setDbHistoriList = props.setHistoriList || context.setHistoriList

  const historiList = dbHistoriList.map(item => ({
    id: item.id,
    nama: item.nama,
    tanggalLahir: item.tanggalLahir,
    tanggalMasuk: item.tanggalMasuk,
    tanggalKeluar: item.tanggalKeluar,
    status: item.statusKesehatan || 'Mandiri',
    statusHunian: item.statusKeluar || 'Kembali ke Keluarga',
    keteranganKeluar: item.keterangan || '',
    fotoUrl: item.fotoUrl || ''
  }))

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatusKeluar, setFilterStatusKeluar] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' })

  useEffect(() => {
    setCurrentPage(1)
    setSelectedIds([])
  }, [searchQuery, filterStatusKeluar, sortConfig])

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
      title: 'Hapus Histori Terpilih?',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data histori terpilih secara permanen dari database?`,
      isDanger: true,
      onConfirm: () => {
        setDbHistoriList(prev => prev.filter(item => !selectedIds.includes(item.id)))
        setSelectedIds([])
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }

  const getInitials = (name) => {
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return words[0] ? words[0].substring(0, 2).toUpperCase() : 'L'
  }

  // Modals States
  const [showModal, setShowModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    isDanger: false
  })
  const [currentHistori, setCurrentHistori] = useState({
    id: null,
    nama: '',
    tanggalLahir: '',
    tanggalMasuk: '',
    tanggalKeluar: '',
    statusKesehatan: 'Mandiri',
    statusKeluar: 'Kembali ke Keluarga',
    keterangan: ''
  })

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatusKeluar])

  // Helper date formatting
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

  // Handle CRUD
  const openAddHistori = () => {
    setCurrentHistori({
      id: null,
      nama: '',
      tanggalLahir: '',
      tanggalMasuk: new Date().toISOString().split('T')[0],
      tanggalKeluar: new Date().toISOString().split('T')[0],
      statusKesehatan: 'Mandiri',
      statusKeluar: 'Kembali ke Keluarga',
      keterangan: '',
      fotoUrl: ''
    })
    setShowModal(true)
  }

  const openEditHistori = (item) => {
    setCurrentHistori({
      id: item.id,
      nama: item.nama,
      tanggalLahir: item.tanggalLahir,
      tanggalMasuk: item.tanggalMasuk,
      tanggalKeluar: item.tanggalKeluar,
      statusKesehatan: item.status,
      statusKeluar: item.statusHunian,
      keterangan: item.keteranganKeluar || '',
      fotoUrl: item.fotoUrl || ''
    })
    setShowModal(true)
  }

  const handleSaveHistori = (e) => {
    e.preventDefault()
    if (currentHistori.id) {
      // Edit mode
      const updatedDbHistori = dbHistoriList.map(dbItem => {
        if (dbItem.id === currentHistori.id) {
          return {
            ...dbItem,
            nama: currentHistori.nama,
            tanggalLahir: currentHistori.tanggalLahir,
            tanggalMasuk: currentHistori.tanggalMasuk,
            tanggalKeluar: currentHistori.tanggalKeluar,
            statusKesehatan: currentHistori.statusKesehatan,
            statusKeluar: currentHistori.statusKeluar,
            keterangan: currentHistori.keterangan,
            fotoUrl: currentHistori.fotoUrl
          }
        }
        return dbItem
      })
      setDbHistoriList(updatedDbHistori)
    } else {
      // Add mode
      const newId = Date.now()
      const newDbHistori = {
        id: newId,
        nama: currentHistori.nama,
        tanggalLahir: currentHistori.tanggalLahir,
        tanggalMasuk: currentHistori.tanggalMasuk,
        tanggalKeluar: currentHistori.tanggalKeluar,
        statusKesehatan: currentHistori.statusKesehatan,
        statusKeluar: currentHistori.statusKeluar,
        keterangan: currentHistori.keterangan,
        fotoUrl: currentHistori.fotoUrl || ''
      }
      setDbHistoriList([...dbHistoriList, newDbHistori])
    }
    setShowModal(false)
  }

  const handleDeleteHistori = (id) => {
    setConfirmModal({
      show: true,
      title: 'Hapus Histori?',
      message: 'Apakah Anda yakin ingin menghapus data histori ini secara permanen dari database?',
      isDanger: true,
      onConfirm: () => {
        setDbHistoriList(dbHistoriList.filter(item => item.id !== id))
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }

  const handleRestoreLansia = (id) => {
    const rowToRestore = dbHistoriList.find(item => item.id === id)
    if (!rowToRestore) return

    setConfirmModal({
      show: true,
      title: 'Kembalikan Lansia?',
      message: 'Apakah Anda yakin ingin mengembalikan lansia ini menjadi penghuni aktif?',
      isDanger: false,
      onConfirm: () => {
        // 1. Delete from dbHistoriList (which deletes from histori_lansia in Supabase)
        setDbHistoriList(dbHistoriList.filter(item => item.id !== id))

        // 2. Generate next available NIP/ID Lansia
        let maxNum = 0
        lansiaList.forEach(item => {
          if (item.id_blok && item.id_blok.toUpperCase().startsWith('L')) {
            const numStr = item.id_blok.substring(1)
            const num = parseInt(numStr, 10)
            if (!isNaN(num) && num > maxNum) {
              maxNum = num
            }
          }
        })
        const nextIdBlok = 'L' + String(maxNum + 1).padStart(4, '0')

        // 3. Insert back to active lansiaList (inserts into lansia in Supabase)
        const newLansiaRecord = {
          id: Date.now(),
          nama: rowToRestore.nama,
          tanggalLahir: rowToRestore.tanggalLahir || '1950-01-01',
          fotoUrl: rowToRestore.fotoUrl || '',
          id_blok: nextIdBlok,
          blok: 'Blok A - 01',
          status: rowToRestore.statusKesehatan || 'Mandiri',
          tanggalMasuk: rowToRestore.tanggalMasuk || new Date().toISOString().split('T')[0],
          tanggalKeluar: '--:--:----',
          statusHunian: 'Aktif',
          keteranganKeluar: '',
          bpjs: 'Aktif (PBI)',
          golonganDarah: 'O',
          alergi: 'Tidak Ada',
          penyakitBawaan: 'Tidak Ada',
          statusBerkas: 'LENGKAP',
          logHarian: []
        }
        setLansiaList([...lansiaList, newLansiaRecord])
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }

  // Filter & Search & Sort (Newest by ID descending)
  const filteredHistori = historiList.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatusKeluar === 'Semua' || item.statusHunian === filterStatusKeluar
    return matchesSearch && matchesFilter
  })

  // Sorting logic based on config
  const sortedHistori = [...filteredHistori].sort((a, b) => {
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
  const totalItems = sortedHistori.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedHistori = sortedHistori.slice(startIndex, endIndex)

  return (
    <div className="bg-white rounded-2xl border border-stone-200/50 shadow-md p-6 space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
        
        {/* Search */}
        <div className="flex-grow max-w-md">
          <input
            type="text"
            placeholder="Cari nama lansia histori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-stone-855 font-semibold"
          />
        </div>

        {/* Filter & Add Button */}
        <div className="flex items-center gap-3 justify-end">
          <select
            value={filterStatusKeluar}
            onChange={(e) => setFilterStatusKeluar(e.target.value)}
            className="bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-emerald-600 text-stone-850 font-bold"
          >
            <option value="Semua">Semua Status Keluar</option>
            <option value="Kembali ke Keluarga">Kembali ke Keluarga</option>
            <option value="Meninggal Dunia">Meninggal Dunia</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus Terpilih ({selectedIds.length})
            </button>
          )}

          <button
            onClick={openAddHistori}
            className="bg-emerald-650 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Histori
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
                  checked={paginatedHistori.length > 0 && paginatedHistori.every(item => selectedIds.includes(item.id))}
                  onChange={() => handleSelectAll(paginatedHistori)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th 
                onClick={() => requestSort('nama')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center">
                  NAMA LANSIA
                  {renderSortArrow('nama')}
                </div>
              </th>
              <th 
                onClick={() => requestSort('tanggalMasuk')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center">
                  TANGGAL MASUK
                  {renderSortArrow('tanggalMasuk')}
                </div>
              </th>
              <th 
                onClick={() => requestSort('tanggalKeluar')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center">
                  TANGGAL KELUAR
                  {renderSortArrow('tanggalKeluar')}
                </div>
              </th>
              <th 
                onClick={() => requestSort('statusHunian')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center">
                  STATUS KELUAR
                  {renderSortArrow('statusHunian')}
                </div>
              </th>
              <th 
                onClick={() => requestSort('keteranganKeluar')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center">
                  KETERANGAN
                  {renderSortArrow('keteranganKeluar')}
                </div>
              </th>
              <th className="py-4 px-6 text-right">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
            {paginatedHistori.length > 0 ? (
              paginatedHistori.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-6 w-12">
                    <input 
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                      className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
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
                          <span className="text-xs font-black text-stone-755">{getInitials(item.nama)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{item.nama}</p>
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">
                          Lahir: {formatDate(item.tanggalLahir) || '-'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-stone-900 font-semibold">{formatDate(item.tanggalMasuk)}</td>
                  <td className="py-4 px-6 text-stone-900 font-semibold">{formatDate(item.tanggalKeluar) || '-'}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${
                      item.statusHunian === 'Meninggal Dunia'
                        ? 'bg-rose-50 border-rose-100 text-rose-800'
                        : item.statusHunian === 'Kembali ke Keluarga'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}>
                      {item.statusHunian}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-stone-600 text-xs max-w-xs truncate" title={item.keteranganKeluar}>
                    {item.keteranganKeluar || '-'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      {/* Restore Button */}
                      <button
                        onClick={() => handleRestoreLansia(item.id)}
                        className="cursor-pointer"
                        title="Kembalikan ke Aktif"
                      >
                        <svg className="w-5 h-5 text-stone-650 hover:text-emerald-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>

                      <button
                        onClick={() => openEditHistori(item)}
                        className="cursor-pointer"
                        title="Edit"
                      >
                        <svg className="w-5 h-5 text-stone-650 hover:text-emerald-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteHistori(item.id)}
                        className="cursor-pointer"
                        title="Hapus"
                      >
                        <svg className="w-5 h-5 text-stone-650 hover:text-rose-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-stone-400 font-semibold">
                  Tidak ada data histori lansia ditemukan
                </td>
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

      {/* --- ADD/EDIT TRANSAKSI MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
            <h3 className="text-lg font-extrabold text-stone-900 tracking-tight border-b border-stone-100 pb-3 mb-6">
              {currentHistori.id ? 'Edit Data Histori Lansia' : 'Tambah Data Histori Lansia'}
            </h3>
            
            <form onSubmit={handleSaveHistori} className="space-y-4">
              {/* Profile Picture Uploader */}
              <div className="flex flex-col items-center gap-2 pb-4 border-b border-stone-100">
                <div className="relative w-20 h-20 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden group mx-auto">
                  {currentHistori.fotoUrl ? (
                    <img src={currentHistori.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-stone-400">
                      {currentHistori.nama ? getInitials(currentHistori.nama) : '?'}
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
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setCurrentHistori({ ...currentHistori, fotoUrl: reader.result })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Unggah Foto Lansia Histori</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={currentHistori.nama}
                  onChange={(e) => setCurrentHistori({ ...currentHistori, nama: e.target.value })}
                  placeholder="Contoh: Alm. H. Sudirman"
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-850 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Tanggal Lahir</label>
                  <input
                    type="date"
                    required
                    value={currentHistori.tanggalLahir}
                    onChange={(e) => setCurrentHistori({ ...currentHistori, tanggalLahir: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Status Kesehatan Akhir</label>
                  <select
                    value={currentHistori.statusKesehatan}
                    onChange={(e) => setCurrentHistori({ ...currentHistori, statusKesehatan: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors"
                  >
                    <option value="Mandiri">Mandiri</option>
                    <option value="Semi Klinis">Semi Klinis</option>
                    <option value="Klinis">Klinis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Tanggal Masuk</label>
                  <input
                    type="date"
                    required
                    value={currentHistori.tanggalMasuk}
                    onChange={(e) => setCurrentHistori({ ...currentHistori, tanggalMasuk: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Tanggal Keluar</label>
                  <input
                    type="date"
                    required
                    value={currentHistori.tanggalKeluar}
                    onChange={(e) => setCurrentHistori({ ...currentHistori, tanggalKeluar: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Status Keluar / Akhir</label>
                <select
                  value={currentHistori.statusKeluar}
                  onChange={(e) => setCurrentHistori({ ...currentHistori, statusKeluar: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors"
                >
                  <option value="Kembali ke Keluarga">Kembali ke Keluarga</option>
                  <option value="Meninggal Dunia">Meninggal Dunia</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Keterangan Tambahan</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Dirawat selama 5 tahun, kembali ke keluarga di Bandung"
                  value={currentHistori.keterangan}
                  onChange={(e) => setCurrentHistori({ ...currentHistori, keterangan: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                ></textarea>
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
                  Simpan
                </button>
              </div>
            </form>
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
                  className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-750 transition-all cursor-pointer"
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
              alt="Foto Lansia Histori Fullscreen"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  )
}
