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

  // Handle Check In
  const handleCheckIn = () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setCheckInTime(timeStr)
    setCheckOutTime('')
    setIsCheckInActive(true)
    localStorage.setItem('nurseCheckInTime', timeStr)
    localStorage.removeItem('nurseCheckOutTime')
    alert(`Absen masuk berhasil tercatat pada pukul ${timeStr}! Selamat bertugas.`)
  }

  // Handle Check Out
  const handleCheckOut = () => {
    if (confirm('Apakah Anda yakin ingin melakukan absensi keluar?')) {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setCheckOutTime(timeStr)
      setIsCheckInActive(false)
      localStorage.setItem('nurseCheckOutTime', timeStr)
      alert(`Absen keluar berhasil tercatat pada pukul ${timeStr}! Terima kasih atas pengabdian Anda hari ini.`)
    }
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
    
    alert(`Simulasi berhasil! Anda sekarang bertindak sebagai ${nurse.nama} (Shift ${nurse.shift}).`)
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

    </div>
  )
}
