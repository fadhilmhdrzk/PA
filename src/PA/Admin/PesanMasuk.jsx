import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function PesanMasuk(props) {
  const context = useOutletContext() || {}
  const pesanList = props.pesanList || context.pesanList || []
  const setPesanList = props.setPesanList || context.setPesanList

  const [searchQuery, setSearchQuery] = useState('')
  const [pageUncontacted, setPageUncontacted] = useState(1)
  const [pageContacted, setPageContacted] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' })

  useEffect(() => {
    setPageUncontacted(1)
    setPageContacted(1)
  }, [searchQuery, sortConfig])

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

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    isDanger: false
  })

  // Date and Time formatter
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return dateStr
    }
  }

  // Toggle message status
  const handleToggleStatus = (item) => {
    const nextStatus = item.status === 'Belum Dibaca' ? 'Sudah Hubungi' : 'Belum Dibaca'
    const statusText = nextStatus === 'Sudah Hubungi' ? 'Sudah Hubungi (Arsip)' : 'Belum Hubungi (Penting)'
    
    setConfirmModal({
      show: true,
      title: 'Ubah Status Pesan?',
      message: `Apakah Anda yakin ingin mengubah status pesan dari "${item.nama}" menjadi "${statusText}"?`,
      isDanger: false,
      onConfirm: () => {
        const updated = pesanList.map(p => p.id === item.id ? { ...p, status: nextStatus } : p)
        setPesanList(updated)
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }

  // Delete message
  const handleDeletePesan = (id) => {
    setConfirmModal({
      show: true,
      title: 'Hapus Pesan?',
      message: 'Apakah Anda yakin ingin menghapus pesan konsultasi ini secara permanen dari database?',
      isDanger: true,
      onConfirm: () => {
        setPesanList(pesanList.filter(p => p.id !== id))
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null, isDanger: false })
      }
    })
  }

  // Format phone number to international WhatsApp format (62...)
  const formatWhatsAppLink = (phone, name) => {
    let cleanPhone = phone.replace(/[^0-9]/g, '')
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1)
    }
    const message = encodeURIComponent(`Halo ${name}, kami dari UPT Panti Sosial Tresna Werdha Riau. Kami telah menerima formulir konsultasi rencana yang Anda kirimkan. Apakah ada yang bisa kami bantu?`)
    return `https://wa.me/${cleanPhone}?text=${message}`
  }

  // Sort function helper
  const sortList = (list) => {
    return [...list].sort((a, b) => {
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
  }
  
  const matchesSearch = (item) => {
    return item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.noWhatsapp.includes(searchQuery) ||
           (item.pesan && item.pesan.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const uncontactedList = pesanList.filter(item => item.status === 'Belum Dibaca' && matchesSearch(item))
  const contactedList = pesanList.filter(item => item.status === 'Sudah Hubungi' && matchesSearch(item))

  const sortedUncontacted = sortList(uncontactedList)
  const sortedContacted = sortList(contactedList)

  // Pagination for Uncontacted
  const itemsPerPage = 5
  const totalUncontacted = uncontactedList.length
  const totalPagesUncontacted = Math.ceil(totalUncontacted / itemsPerPage) || 1
  const startUncontacted = (pageUncontacted - 1) * itemsPerPage
  const endUncontacted = startUncontacted + itemsPerPage
  const paginatedUncontacted = sortedUncontacted.slice(startUncontacted, endUncontacted)

  // Pagination for Contacted
  const totalContacted = contactedList.length
  const totalPagesContacted = Math.ceil(totalContacted / itemsPerPage) || 1
  const startContacted = (pageContacted - 1) * itemsPerPage
  const endContacted = startContacted + itemsPerPage
  const paginatedContacted = sortedContacted.slice(startContacted, endContacted)

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Messages summary counters */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md shadow-stone-900/5 flex flex-col justify-between min-h-[110px]">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Total Pesan Konsultasi</h3>
          <span className="text-3xl font-black text-stone-955 mt-2">{pesanList.length}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md shadow-stone-900/5 flex flex-col justify-between min-h-[110px]">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Belum Dihubungi</h3>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-black text-stone-955">{pesanList.filter(p => p.status === 'Belum Dibaca').length}</span>
            <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Penting</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md shadow-stone-900/5 flex flex-col justify-between min-h-[110px]">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Sudah Dihubungi</h3>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-black text-stone-955">{pesanList.filter(p => p.status === 'Sudah Hubungi').length}</span>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Selesai</span>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/50 shadow-md p-5 flex items-center">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Cari pesan berdasarkan nama, WA, atau isi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-600 text-stone-855 font-semibold animate-fade-in"
          />
        </div>
      </div>

      {/* TABLE 1: BELUM DIHUBUNGI */}
      <div className="bg-white rounded-2xl border border-stone-200/50 shadow-md p-6 space-y-4">
        <h4 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-3 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span>Daftar Pesan Baru (Belum Hubungi)</span>
            <span className="bg-amber-50 text-amber-850 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-amber-100">
              {totalUncontacted}
            </span>
          </div>
        </h4>

        <div className="overflow-x-auto rounded-xl border border-stone-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-[11px] font-black uppercase text-stone-400 tracking-wider border-b border-stone-100">
              <tr>
                <th 
                  onClick={() => requestSort('createdAt')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    TANGGAL MASUK
                    {renderSortArrow('createdAt')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('nama')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    PENGIRIM
                    {renderSortArrow('nama')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('noWhatsapp')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    NO. WHATSAPP
                    {renderSortArrow('noWhatsapp')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('pesan')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    PESAN KONSULTASI
                    {renderSortArrow('pesan')}
                  </div>
                </th>
                <th className="py-4 px-6 text-center">STATUS</th>
                <th className="py-4 px-6 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
              {paginatedUncontacted.length > 0 ? (
                paginatedUncontacted.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 text-xs font-bold text-stone-900 whitespace-nowrap">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="py-4 px-6 font-bold text-stone-955">{item.nama}</td>
                    <td className="py-4 px-6 text-stone-600 font-semibold whitespace-nowrap">{item.noWhatsapp}</td>
                    <td className="py-4 px-6 text-stone-500 font-medium max-w-sm whitespace-pre-wrap leading-relaxed">
                      {item.pesan || <span className="italic text-stone-300">Tidak ada pesan tertulis</span>}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className="inline-block text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider cursor-pointer bg-amber-50 border-amber-100 text-amber-800 hover:opacity-80 transition-all"
                        title="Klik untuk tandai sudah dihubungi"
                      >
                        Belum Hubungi
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex justify-end items-center gap-3">
                        <a
                          href={formatWhatsAppLink(item.noWhatsapp, item.nama)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3.5 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wide transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 2.112.551 4.165 1.6 6.002L.05 23.85a.75.75 0 0 0 .918.918l5.632-1.55c1.848 1.054 3.901 1.606 6.012 1.606 6.63 0 12-5.373 12-12s-5.37-12-12-12zm0 22.02c-1.91 0-3.774-.492-5.437-1.424a.75.75 0 0 0-.585-.052l-3.861 1.062 1.062-3.861a.75.75 0 0 0-.052-.585C2.176 15.792 1.684 13.928 1.684 12c0-5.7 4.63-10.316 10.316-10.316 5.7 0 10.316 4.615 10.316 10.316 0 5.701-4.615 10.32-10.316 10.32zm5.304-7.469c-.29-.145-1.716-.848-1.98-.946-.264-.097-.457-.145-.65.145-.192.29-.747.946-.915 1.139-.168.193-.336.216-.627.071-1.077-.538-1.986-1.002-2.78-1.688-.636-.55-.989-1.226-1.12-1.455-.132-.23-.014-.354.1-.47.104-.103.23-.264.343-.396.113-.132.152-.22.227-.367.075-.145.038-.276-.018-.39-.057-.113-.457-1.102-.627-1.512-.165-.397-.333-.343-.457-.349-.118-.006-.254-.007-.39-.007s-.356.05-.542.254c-.186.203-.711.695-.711 1.696s.729 1.97 1.033 2.378c.304.407 1.436 2.19 3.48 3.07 2.044.88 2.044.586 2.408.55.364-.037 1.716-.701 1.958-1.378.243-.677.243-1.258.172-1.377-.07-.12-.26-.192-.55-.337z"/>
                          </svg>
                          Chat WA
                        </a>
                        <button
                          onClick={() => handleDeletePesan(item.id)}
                          className="cursor-pointer"
                          title="Hapus Pesan"
                        >
                          <svg className="w-5 h-5 text-stone-600 hover:text-rose-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400 font-semibold">
                    Tidak ada pesan baru yang belum dihubungi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Uncontacted */}
        {totalPagesUncontacted > 1 && (
          <div className="flex justify-end gap-1 pt-2">
            <button
              onClick={() => setPageUncontacted(p => Math.max(p - 1, 1))}
              disabled={pageUncontacted === 1}
              className={`p-2 rounded-lg border border-stone-200 transition-colors flex items-center justify-center cursor-pointer ${
                pageUncontacted === 1 ? 'opacity-50 cursor-not-allowed bg-stone-50 text-stone-400' : 'bg-white hover:bg-stone-50 text-stone-750'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPagesUncontacted }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setPageUncontacted(page)}
                className={`w-7 h-7 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                  pageUncontacted === page
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setPageUncontacted(p => Math.min(p + 1, totalPagesUncontacted))}
              disabled={pageUncontacted === totalPagesUncontacted}
              className={`p-2 rounded-lg border border-stone-200 transition-colors flex items-center justify-center cursor-pointer ${
                pageUncontacted === totalPagesUncontacted ? 'opacity-50 cursor-not-allowed bg-stone-50 text-stone-400' : 'bg-white hover:bg-stone-50 text-stone-750'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* TABLE 2: SUDAH DIHUBUNGI */}
      <div className="bg-white rounded-2xl border border-stone-200/50 shadow-md p-6 space-y-4">
        <h4 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-3 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span>Riwayat Pesan Selesai (Sudah Hubungi)</span>
            <span className="bg-emerald-50 text-emerald-850 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-emerald-100">
              {totalContacted}
            </span>
          </div>
        </h4>

        <div className="overflow-x-auto rounded-xl border border-stone-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-[11px] font-black uppercase text-stone-400 tracking-wider border-b border-stone-100">
              <tr>
                <th 
                  onClick={() => requestSort('createdAt')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    TANGGAL MASUK
                    {renderSortArrow('createdAt')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('nama')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    PENGIRIM
                    {renderSortArrow('nama')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('noWhatsapp')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    NO. WHATSAPP
                    {renderSortArrow('noWhatsapp')}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('pesan')} 
                  className="py-4 px-6 cursor-pointer select-none group hover:text-stone-750 transition-colors"
                >
                  <div className="flex items-center">
                    PESAN KONSULTASI
                    {renderSortArrow('pesan')}
                  </div>
                </th>
                <th className="py-4 px-6 text-center">STATUS</th>
                <th className="py-4 px-6 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
              {paginatedContacted.length > 0 ? (
                paginatedContacted.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 text-xs font-bold text-stone-900 whitespace-nowrap">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="py-4 px-6 font-bold text-stone-955">{item.nama}</td>
                    <td className="py-4 px-6 text-stone-600 font-semibold whitespace-nowrap">{item.noWhatsapp}</td>
                    <td className="py-4 px-6 text-stone-500 font-medium max-w-sm whitespace-pre-wrap leading-relaxed">
                      {item.pesan || <span className="italic text-stone-300">Tidak ada pesan tertulis</span>}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className="inline-block text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider cursor-pointer bg-emerald-50 border-emerald-100 text-emerald-800 hover:opacity-80 transition-all"
                        title="Klik untuk tandai belum dihubungi"
                      >
                        Sudah Hubungi
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex justify-end items-center gap-3">
                        <a
                          href={formatWhatsAppLink(item.noWhatsapp, item.nama)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3.5 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wide transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 2.112.551 4.165 1.6 6.002L.05 23.85a.75.75 0 0 0 .918.918l5.632-1.55c1.848 1.054 3.901 1.606 6.012 1.606 6.63 0 12-5.373 12-12s-5.37-12-12-12zm0 22.02c-1.91 0-3.774-.492-5.437-1.424a.75.75 0 0 0-.585-.052l-3.861 1.062 1.062-3.861a.75.75 0 0 0-.052-.585C2.176 15.792 1.684 13.928 1.684 12c0-5.7 4.63-10.316 10.316-10.316 5.7 0 10.316 4.615 10.316 10.316 0 5.701-4.615 10.32-10.316 10.32zm5.304-7.469c-.29-.145-1.716-.848-1.98-.946-.264-.097-.457-.145-.65.145-.192.29-.747.946-.915 1.139-.168.193-.336.216-.627.071-1.077-.538-1.986-1.002-2.78-1.688-.636-.55-.989-1.226-1.12-1.455-.132-.23-.014-.354.1-.47.104-.103.23-.264.343-.396.113-.132.152-.22.227-.367.075-.145.038-.276-.018-.39-.057-.113-.457-1.102-.627-1.512-.165-.397-.333-.343-.457-.349-.118-.006-.254-.007-.39-.007s-.356.05-.542.254c-.186.203-.711.695-.711 1.696s.729 1.97 1.033 2.378c.304.407 1.436 2.19 3.48 3.07 2.044.88 2.044.586 2.408.55.364-.037 1.716-.701 1.958-1.378.243-.677.243-1.258.172-1.377-.07-.12-.26-.192-.55-.337z"/>
                          </svg>
                          Chat WA
                        </a>
                        <button
                          onClick={() => handleDeletePesan(item.id)}
                          className="cursor-pointer"
                          title="Hapus Pesan"
                        >
                          <svg className="w-5 h-5 text-stone-600 hover:text-rose-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400 font-semibold">
                    Belum ada riwayat pesan yang sudah dihubungi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Contacted */}
        {totalPagesContacted > 1 && (
          <div className="flex justify-end gap-1 pt-2">
            <button
              onClick={() => setPageContacted(p => Math.max(p - 1, 1))}
              disabled={pageContacted === 1}
              className={`p-2 rounded-lg border border-stone-200 transition-colors flex items-center justify-center cursor-pointer ${
                pageContacted === 1 ? 'opacity-50 cursor-not-allowed bg-stone-50 text-stone-400' : 'bg-white hover:bg-stone-50 text-stone-750'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPagesContacted }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setPageContacted(page)}
                className={`w-7 h-7 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                  pageContacted === page
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setPageContacted(p => Math.min(p + 1, totalPagesContacted))}
              disabled={pageContacted === totalPagesContacted}
              className={`p-2 rounded-lg border border-stone-200 transition-colors flex items-center justify-center cursor-pointer ${
                pageContacted === totalPagesContacted ? 'opacity-50 cursor-not-allowed bg-stone-50 text-stone-400' : 'bg-white hover:bg-stone-50 text-stone-750'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

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
