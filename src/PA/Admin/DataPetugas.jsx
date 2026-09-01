import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function DataPetugas(props) {
  const context = useOutletContext() || {}
  const petugasList = props.petugasList || context.petugasList || []
  const setPetugasList = props.setPetugasList || context.setPetugasList
  const [searchPetugas, setSearchPetugas] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' })

  useEffect(() => {
    setCurrentPage(1)
    setSelectedIds([])
  }, [searchPetugas, sortConfig])

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
      title: 'Hapus Petugas Terpilih?',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data petugas terpilih secara permanen dari database?`,
      isDanger: true,
      onConfirm: () => {
        setPetugasList(prev => prev.filter(item => !selectedIds.includes(item.id)))
        setSelectedIds([])
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }

  // Modals States
  const [showPetugasModal, setShowPetugasModal] = useState(false)
  const [errorModal, setErrorModal] = useState({ show: false, message: '' })
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    isDanger: false
  })
  const [currentPetugas, setCurrentPetugas] = useState({ id: null, nama: '', nip: 'P0000', shift: 'Pagi', status: 'Aktif', fotoUrl: '' })
  const [lightboxImage, setLightboxImage] = useState(null)

  const handleFotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCurrentPetugas({ ...currentPetugas, fotoUrl: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  // --- Petugas CRUD Helpers ---
  const openAddPetugas = () => {
    setCurrentPetugas({ id: null, nama: '', nip: 'P0000', shift: 'Pagi', status: 'Aktif', fotoUrl: '' })
    setShowPetugasModal(true)
  }
  const openEditPetugas = (petugas) => {
    setCurrentPetugas(petugas)
    setShowPetugasModal(true)
  }
  const handleSavePetugas = (e) => {
    e.preventDefault()

    // Enforce unique NIP check
    const isDuplicate = petugasList.some(item => 
      item.nip.toLowerCase() === currentPetugas.nip.toLowerCase() && 
      item.id !== currentPetugas.id
    )
    if (isDuplicate) {
      setErrorModal({ show: true, message: `NIP Petugas "${currentPetugas.nip}" sudah digunakan! Silakan gunakan NIP lain.` })
      return
    }

    if (currentPetugas.id) {
      // Edit
      setPetugasList(petugasList.map(item => item.id === currentPetugas.id ? currentPetugas : item))
    } else {
      // Add
      setPetugasList([...petugasList, { ...currentPetugas, id: Date.now() }])
    }
    setShowPetugasModal(false)
  }
  const handleDeletePetugas = (id) => {
    setConfirmModal({
      show: true,
      title: 'Hapus Petugas?',
      message: 'Apakah Anda yakin ingin menghapus data petugas ini secara permanen dari database?',
      isDanger: true,
      onConfirm: () => {
        setPetugasList(petugasList.filter(item => item.id !== id))
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }

  // Filtering lists
  const filteredPetugas = petugasList.filter(item => {
    return item.nama.toLowerCase().includes(searchPetugas.toLowerCase()) || 
           item.nip.toLowerCase().includes(searchPetugas.toLowerCase())
  })

  // Sorting logic based on config
  const sortedPetugas = [...filteredPetugas].sort((a, b) => {
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
  const totalItems = sortedPetugas.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPetugas = sortedPetugas.slice(startIndex, endIndex)

  return (
    <div className="bg-white rounded-2xl border border-stone-200/50 shadow-md p-6 space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
        
        {/* Search */}
        <div className="flex-grow max-w-md">
          <input
            type="text"
            placeholder="Cari perawat berdasarkan nama atau NIP..."
            value={searchPetugas}
            onChange={(e) => setSearchPetugas(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-stone-855 font-semibold"
          />
        </div>

        {/* Add Button & Bulk Delete */}
        <div className="flex items-center gap-3">
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
            onClick={openAddPetugas}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Petugas
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto rounded-xl border border-stone-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-[11px] font-black uppercase text-stone-500 tracking-wider border-b border-stone-100">
            <tr>
              <th className="py-4 px-6 w-12">
                <input 
                  type="checkbox"
                  checked={paginatedPetugas.length > 0 && paginatedPetugas.every(item => selectedIds.includes(item.id))}
                  onChange={() => handleSelectAll(paginatedPetugas)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th 
                onClick={() => requestSort('nama')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center">
                  Nama Petugas
                  {renderSortArrow('nama')}
                </div>
              </th>
              <th 
                onClick={() => requestSort('nip')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center">
                  NIP / ID Petugas
                  {renderSortArrow('nip')}
                </div>
              </th>
              <th 
                onClick={() => requestSort('shift')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center">
                  Jadwal Shift
                  {renderSortArrow('shift')}
                </div>
              </th>
              <th 
                onClick={() => requestSort('status')} 
                className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
              >
                <div className="flex items-center">
                  Status Kehadiran
                  {renderSortArrow('status')}
                </div>
              </th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
            {paginatedPetugas.length > 0 ? (
              paginatedPetugas.map((item) => (
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
                          <span className="text-xs font-black text-stone-750">
                            {item.nama ? item.nama.split(' ').pop().substring(0, 2).toUpperCase() : 'P'}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-stone-900">{item.nama}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-stone-500">{item.nip}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block text-xs font-bold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-lg">
                      Shift {item.shift}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                      item.status === 'Aktif'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                        : 'bg-stone-50 border-stone-200 text-stone-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditPetugas(item)}
                        className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePetugas(item.id)}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-400 font-semibold">Tidak ada data petugas ditemukan</td>
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

      {/* --- PETUGAS MODAL --- */}
      {showPetugasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
            <h3 className="text-lg font-extrabold text-stone-900 tracking-tight border-b border-stone-100 pb-3 mb-6">
              {currentPetugas.id ? 'Edit Data Petugas' : 'Tambah Data Petugas Baru'}
            </h3>
            
            <form onSubmit={handleSavePetugas} className="space-y-4">
              {/* Profile Picture Uploader */}
              <div className="flex flex-col items-center gap-2 pb-4 border-b border-stone-100">
                <div className="relative w-20 h-20 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden group mx-auto">
                  {currentPetugas.fotoUrl ? (
                    <img src={currentPetugas.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-stone-400">
                      {currentPetugas.nama ? currentPetugas.nama.split(' ').pop().substring(0, 2).toUpperCase() : '?'}
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
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Unggah Foto Petugas</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={currentPetugas.nama}
                  onChange={(e) => setCurrentPetugas({ ...currentPetugas, nama: e.target.value })}
                  placeholder="Contoh: Ns. Ayu Lestari"
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-850 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">NIP / ID</label>
                  <input
                    type="text"
                    required
                    value={currentPetugas.nip}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^0-9]/g, '')
                      const maxDigits = digits.slice(0, 4)
                      setCurrentPetugas({ ...currentPetugas, nip: 'P' + maxDigits })
                    }}
                    placeholder="Contoh: P006"
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-855 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Shift Kerja</label>
                  <select
                    value={currentPetugas.shift}
                    onChange={(e) => setCurrentPetugas({ ...currentPetugas, shift: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors"
                  >
                    <option value="Pagi">Pagi</option>
                    <option value="Siang">Siang</option>
                    <option value="Malam">Malam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Status</label>
                  <select
                    value={currentPetugas.status}
                    onChange={(e) => setCurrentPetugas({ ...currentPetugas, status: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Cuti">Cuti</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowPetugasModal(false)}
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
              alt="Foto Petugas Fullscreen"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  )
}
