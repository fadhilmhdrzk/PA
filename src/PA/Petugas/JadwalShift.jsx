import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function JadwalShift() {
  const { petugasList = [], activeNurse = {}, setActiveNurse } = useOutletContext()

  // Attendance simulation state
  const [checkInTime, setCheckInTime] = useState(() => {
    return localStorage.getItem('nurseCheckInTime') || ''
  })
  const [checkOutTime, setCheckOutTime] = useState(() => {
    return localStorage.getItem('nurseCheckOutTime') || ''
  })
  const [isCheckInActive, setIsCheckInActive] = useState(() => {
    return localStorage.getItem('nurseCheckInTime') !== null && localStorage.getItem('nurseCheckOutTime') === null
  })

  const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '', icon: 'success' })
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null })

  // Handle Check In
  const handleCheckIn = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setCheckInTime(timeStr)
    setCheckOutTime('')
    setIsCheckInActive(true)
    localStorage.setItem('nurseCheckInTime', timeStr)
    localStorage.removeItem('nurseCheckOutTime')
    setModalInfo({
      show: true,
      title: 'Absen Masuk Berhasil',
      message: `Absen masuk berhasil tercatat pada pukul ${timeStr}! Selamat bertugas.`,
      icon: 'success'
    })
  }

  // Handle Check Out
  const handleCheckOut = () => {
    setConfirmModal({
      show: true,
      title: 'Konfirmasi Absen Keluar',
      message: 'Apakah Anda yakin ingin melakukan absensi keluar untuk shift ini?',
      onConfirm: () => {
        const now = new Date()
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        setCheckOutTime(timeStr)
        setIsCheckInActive(false)
        localStorage.setItem('nurseCheckOutTime', timeStr)
        setConfirmModal({ show: false, title: '', message: '', onConfirm: null })
        setModalInfo({
          show: true,
          title: 'Absen Keluar Berhasil',
          message: `Absen keluar berhasil tercatat pada pukul ${timeStr}! Terima kasih atas pengabdian Anda hari ini.`,
          icon: 'success'
        })
      }
    })
  }

  // Handle Switch User (Simulation Helper)
  const handleSwitchNurse = (nurse) => {
    const selectedNurse = {
      nama: nurse.nama,
      nip: nurse.nip,
      shift: nurse.shift
    }
    setActiveNurse(selectedNurse)
    localStorage.setItem('activeNurse', JSON.stringify(selectedNurse))
    
    // Reset attendance simulation when switching nurse
    setCheckInTime('')
    setCheckOutTime('')
    setIsCheckInActive(false)
    localStorage.removeItem('nurseCheckInTime')
    localStorage.removeItem('nurseCheckOutTime')
    
    setModalInfo({
      show: true,
      title: 'Simulasi Ganti Perawat',
      message: `Simulasi berhasil! Anda sekarang bertindak sebagai ${nurse.nama} (Shift ${nurse.shift}).`,
      icon: 'info'
    })
  }

  // Shift categories metadata
  const shiftsInfo = [
    { name: 'Pagi', time: '07:00 - 14:00 WIB', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { name: 'Siang', time: '14:00 - 21:00 WIB', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { name: 'Malam', time: '21:00 - 07:00 WIB', color: 'bg-slate-800 text-slate-100 border-slate-700' }
  ]

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Simulation Helper Panel */}
      <div className="bg-amber-50 border border-amber-250 p-6 rounded-3xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500 text-white rounded-xl">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-black text-amber-900 uppercase">Perhatian: Alat Simulasi Petugas</h3>
            <p className="text-xs text-amber-800 mt-1 font-semibold leading-relaxed">
              Anda sedang membuka staff portal. Gunakan daftar di bawah ini untuk berganti akun perawat untuk melihat bagaimana dashboard merespons salam waktu, tugas shift spesifik, dan log tanda tangan perawat yang berbeda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 pt-2">
          {petugasList.map((nurse) => {
            const isActive = activeNurse.nama === nurse.nama
            return (
              <button
                key={nurse.id}
                onClick={() => handleSwitchNurse(nurse)}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between h-24 ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-900/10'
                    : 'bg-white hover:bg-amber-100/50 border-stone-200 text-stone-800 hover:border-amber-400'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">{nurse.shift} Shift</div>
                <div>
                  <h4 className="text-xs font-bold leading-tight line-clamp-1">{nurse.nama}</h4>
                  <p className={`text-[9px] mt-0.5 font-bold ${isActive ? 'text-amber-100' : 'text-stone-400'}`}>NIP: {nurse.nip}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Shift Schedules Roster */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[2rem] border border-stone-200/50 shadow-md space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-lg font-black text-stone-900 tracking-tight">Roster Jadwal Shift Perawat</h3>
            <p className="text-xs text-stone-500 font-semibold mt-0.5">Daftar pembagian shift harian petugas UPT Husnul Khotimah</p>
          </div>

          <div className="space-y-6">
            {shiftsInfo.map((shift) => {
              const staffOnShift = petugasList.filter(p => p.shift === shift.name)
              const isCurrentShift = activeNurse.shift === shift.name

              return (
                <div 
                  key={shift.name} 
                  className={`p-5 rounded-2xl border transition-all ${
                    isCurrentShift 
                      ? 'border-emerald-600 bg-emerald-50/15 shadow-sm' 
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3.5 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border ${shift.color}`}>
                        Shift {shift.name}
                      </span>
                      <span className="text-xs text-stone-500 font-bold">{shift.time}</span>
                    </div>
                    {isCurrentShift && (
                      <span className="bg-emerald-600 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                        Shift Anda Aktif
                      </span>
                    )}
                  </div>

                  {/* Staff List */}
                  <div className="pt-4 grid sm:grid-cols-2 gap-4">
                    {staffOnShift.map((staff) => (
                      <div key={staff.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                            {staff.nama[4] || staff.nama[0]}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-stone-900">{staff.nama}</h4>
                            <p className="text-[9px] text-stone-400 font-semibold">NIP: {staff.nip}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          staff.status === 'Aktif' 
                            ? 'bg-emerald-50 text-emerald-800' 
                            : 'bg-rose-50 text-red-700'
                        }`}>
                          {staff.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Attendance simulation */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-[2rem] border border-stone-200/50 shadow-md space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-sm font-black text-stone-900 tracking-tight uppercase">Absensi Kehadiran</h3>
            <p className="text-[10px] text-stone-500 font-semibold mt-0.5">Catat kehadiran kerja shift Anda secara digital</p>
          </div>

          <div className="space-y-6">
            
            {/* Status Indicators */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/60 space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Petugas Aktif</span>
                <span className="text-stone-900 font-bold">{activeNurse.nama}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Status Absen</span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                  isCheckInActive
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-850'
                    : 'bg-stone-100 border-stone-200 text-stone-500'
                }`}>
                  {isCheckInActive ? 'Bertugas' : 'Belum Absen'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Check In</span>
                <span className="text-stone-900 font-bold">{checkInTime || '--:--'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Check Out</span>
                <span className="text-stone-900 font-bold">{checkOutTime || '--:--'}</span>
              </div>
            </div>

            {/* Attendance Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCheckIn}
                disabled={isCheckInActive}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow transition-all ${
                  isCheckInActive
                    ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-950/10'
                }`}
              >
                Absen Masuk (Check-In)
              </button>

              <button
                onClick={handleCheckOut}
                disabled={!isCheckInActive}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow transition-all ${
                  !isCheckInActive
                    ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                    : 'bg-rose-650 hover:bg-rose-700 text-white'
                }`}
              >
                Absen Keluar (Check-Out)
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Modal Notification Info */}
      {modalInfo.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200/50 transform transition-all scale-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-lg font-black text-stone-900 mb-1">{modalInfo.title}</h3>
              <p className="text-xs text-stone-600 mb-6 leading-relaxed font-semibold">{modalInfo.message}</p>

              <button
                type="button"
                onClick={() => setModalInfo({ show: false, title: '', message: '', icon: 'success' })}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
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
              <div className="w-14 h-14 bg-rose-50 text-rose-650 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              
              <h3 className="text-lg font-black text-stone-900 mb-1">{confirmModal.title}</h3>
              <p className="text-xs text-stone-600 mb-6 leading-relaxed font-semibold">{confirmModal.message}</p>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: null })}
                  className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-750 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
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
