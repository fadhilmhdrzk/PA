import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function DataKeuangan(props) {
  const context = useOutletContext() || {}
  const transaksiList = props.transaksiList || context.transaksiList || []
  const setTransaksiList = props.setTransaksiList || context.setTransaksiList

  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'tanggal', direction: 'desc' })

  useEffect(() => {
    setCurrentPage(1)
    setSelectedIds([])
  }, [searchQuery, filterCategory, sortConfig])

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

  const [showModal, setShowModal] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    isDanger: false
  })
  const [currentTransaksi, setCurrentTransaksi] = useState({
    id: null,
    tanggal: '',
    kategori: 'Konsumsi Lansia (Makan 3x)',
    nominal: '',
    tipe: 'Pengeluaran',
    keterangan: '',
    buktiFoto: ''
  })

  const handleBulkDelete = () => {
    setConfirmModal({
      show: true,
      title: 'Hapus Transaksi Terpilih?',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data transaksi terpilih secara permanen dari database?`,
      isDanger: true,
      onConfirm: () => {
        setTransaksiList(prev => prev.filter(item => !selectedIds.includes(item.id)))
        setSelectedIds([])
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }

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
  const categories = [
    'Konsumsi Lansia (Makan 3x)',
    'Kesehatan & Obat-obatan',
    'Pemeliharaan & Kebersihan',
    'Lainnya / Administrasi'
  ]

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

  const openEditTransaksi = (t) => {
    setCurrentTransaksi(t)
    setShowModal(true)
  }

  const handleSaveTransaksi = (e) => {
    e.preventDefault()
    if (currentTransaksi.id) {
      // Edit
      setTransaksiList(
        transaksiList.map((item) => (item.id === currentTransaksi.id ? currentTransaksi : item))
      )
    } else {
      // Add
      setTransaksiList([
        { ...currentTransaksi, id: Date.now() },
        ...transaksiList
      ])
    }
    setShowModal(false)
  }

  const handleDeleteTransaksi = (id) => {
    setConfirmModal({
      show: true,
      title: 'Hapus Transaksi?',
      message: 'Apakah Anda yakin ingin menghapus transaksi ini secara permanen dari database?',
      isDanger: true,
      onConfirm: () => {
        setTransaksiList(transaksiList.filter((item) => item.id !== id))
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }

  // Filter list
  const filteredTransaksi = transaksiList.filter((t) => {
    const matchesSearch =
      t.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.kategori.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'Semua' || t.kategori === filterCategory
    return matchesSearch && matchesCategory
  })

  // Sorting logic based on config
  const sortedTransaksi = [...filteredTransaksi].sort((a, b) => {
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
  const totalItems = sortedTransaksi.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTransaksi = sortedTransaksi.slice(startIndex, endIndex)

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* BOTTOM SECTION: TRANSAKSI KEUANGAN TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200/50 shadow-md p-6 space-y-6">
        
        {/* Header table */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
          
          {/* Search bar */}
          <div className="flex-grow max-w-md">
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-stone-855 font-semibold"
            />
          </div>

          {/* Filter & Add button */}
          <div className="flex items-center gap-3 justify-end">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-stone-50 border border-stone-200 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-emerald-600 text-stone-850 font-bold"
            >
              <option value="Semua">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
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
              onClick={openAddTransaksi}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Transaksi
            </button>
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto rounded-xl border border-stone-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-[11px] font-black uppercase text-stone-400 tracking-wider border-b border-stone-100">
              <tr>
                <th className="py-4 px-6 w-12">
                  <input 
                    type="checkbox"
                    checked={paginatedTransaksi.length > 0 && paginatedTransaksi.every(item => selectedIds.includes(item.id))}
                    onChange={() => handleSelectAll(paginatedTransaksi)}
                    className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th 
                  onClick={() => requestSort('tanggal')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    TANGGAL
                    {renderSortArrow('tanggal')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('keterangan')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    KETERANGAN
                    {renderSortArrow('keterangan')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('kategori')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    KATEGORI
                    {renderSortArrow('kategori')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('nominal')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    NOMINAL
                    {renderSortArrow('nominal')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('tipe')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors text-center"
                >
                  <div className="flex items-center justify-center">
                    TIPE
                    {renderSortArrow('tipe')}
                  </div>
                </th>
                <th className="py-4 px-6 text-center">BUKTI</th>
                <th className="py-4 px-6 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
              {paginatedTransaksi.length > 0 ? (
                paginatedTransaksi.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 w-12">
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                    {/* Tanggal */}
                    <td className="py-4 px-6 text-xs font-bold text-stone-900">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Keterangan */}
                    <td className="py-4 px-6 font-semibold text-stone-900 max-w-xs truncate" title={item.keterangan}>
                      {item.keterangan}
                    </td>

                    {/* Kategori */}
                    <td className="py-4 px-6 text-xs text-stone-500 font-bold">
                      {item.kategori}
                    </td>

                    {/* Nominal */}
                    <td className="py-4 px-6 font-bold text-stone-900">
                      {formatRupiah(item.nominal)}
                    </td>

                    {/* Tipe */}
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${
                        item.tipe === 'Pengeluaran'
                          ? 'bg-rose-50 border-rose-100 text-rose-800'
                          : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                      }`}>
                        {item.tipe}
                      </span>
                    </td>

                    {/* Bukti Foto */}
                    <td className="py-4 px-6 text-center print:hidden">
                      {item.buktiFoto ? (
                        <div className="flex justify-center">
                          <img
                            src={item.buktiFoto}
                            alt="Bukti Nota"
                            onClick={() => setLightboxImage(item.buktiFoto)}
                            className="w-10 h-10 rounded-lg object-cover cursor-pointer border border-stone-200 hover:scale-110 transition-transform shadow-xs"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400 font-bold">-</span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => openEditTransaksi(item)}
                          className="cursor-pointer"
                          title="Edit"
                        >
                          <svg className="w-5 h-5 text-stone-650 hover:text-emerald-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTransaksi(item.id)}
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
                  <td colSpan={8} className="py-8 text-center text-stone-400 font-semibold">
                    Tidak ada riwayat transaksi keuangan ditemukan
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

      </div>

      {/* --- ADD/EDIT TRANSAKSI MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
            <h3 className="text-lg font-extrabold text-stone-900 tracking-tight border-b border-stone-100 pb-3 mb-6">
              {currentTransaksi.id ? 'Edit Transaksi Keuangan' : 'Tambah Transaksi Keuangan Baru'}
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
              alt="Bukti Nota Fullscreen"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200/50 transform transition-all scale-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                confirmModal.isDanger ? 'bg-rose-50 text-rose-650' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {confirmModal.isDanger ? (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' 
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
    </div>
  )
}
