 import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'

export default function DashboardPetugasOverview() {
  const { lansiaList = [], activeNurse = {} } = useOutletContext()
  const navigate = useNavigate()

  // Calculate statistics
  const totalLansia = lansiaList.length
  const klinisCount = lansiaList.filter(l => l.status === 'Klinis').length
  const semiKlinisCount = lansiaList.filter(l => l.status === 'Semi Klinis').length

  // Calculate logs recorded today
  const getTodayDateStr = () => {
    const today = new Date()
    return today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const todayStr = getTodayDateStr()

  const logsRecordedToday = lansiaList.reduce((acc, lansia) => {
    const todayLogs = (lansia.logHarian || []).filter(log => log.waktu && log.waktu.includes(todayStr))
    return acc + todayLogs.length
  }, 0)

  // Shift specific tasks list
  const shiftTasksMap = {
    Pagi: [
      { id: 1, text: 'Serah terima laporan shift malam', checked: false },
      { id: 2, text: 'Pendampingan mandi pagi & sarapan lansia', checked: false },
      { id: 3, text: 'Pemberian obat rutin pagi hari', checked: false },
      { id: 4, text: 'Pemeriksaan vital sign (tensi & suhu) berkala', checked: false },
      { id: 5, text: 'Pendampingan jemur pagi & senam ringan', checked: false }
    ],
    Siang: [
      { id: 1, text: 'Serah terima laporan shift pagi', checked: false },
      { id: 2, text: 'Pendampingan makan siang lansia', checked: false },
      { id: 3, text: 'Pemberian obat siang & pengawasan istirahat', checked: false },
      { id: 4, text: 'Pengecekan berkala kenyamanan kamar lansia', checked: false },
      { id: 5, text: 'Pendampingan makan malam & minum obat sore', checked: false }
    ],
    Malam: [
      { id: 1, text: 'Serah terima laporan shift siang', checked: false },
      { id: 2, text: 'Pemberian obat malam & pengawasan tidur', checked: false },
      { id: 3, text: 'Patroli berkala keliling seluruh blok (A, B, C)', checked: false },
      { id: 4, text: 'Pengecekan tombol darurat (panic button) di kamar lansia', checked: false },
      { id: 5, text: 'Pencatatan laporan akhir shift malam', checked: false }
    ]
  }

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const currentShift = activeNurse.shift || 'Pagi'
    setTasks(shiftTasksMap[currentShift] || shiftTasksMap.Pagi)
  }, [activeNurse.shift])

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t))
  }

  // Get current time greeting
  const getGreeting = () => {
    const hours = new Date().getHours()
    if (hours < 11) return 'Selamat Pagi'
    if (hours < 15) return 'Selamat Siang'
    if (hours < 19) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Welcome Banner Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-slate-900 p-8 sm:p-10 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Shift {activeNurse.shift || 'Siang'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {getGreeting()}, {activeNurse.nama || 'Perawat'}!
          </h1>
          <p className="text-sm text-stone-300 font-medium leading-relaxed">
            Terima kasih atas dedikasi dan kasih sayang Anda dalam mendampingi para orang tua kita hari ini. Pastikan untuk selalu mencatat perkembangan kesehatan lansia secara berkala.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => navigate('/dashboard/petugas/lansia')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Catat Log Lansia Sekarang
            </button>
          </div>
        </div>
        
        {/* Subtle decorative background circle */}
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-emerald-500/5 translate-x-10 translate-y-10 blur-xl pointer-events-none"></div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Stat 1: Total Lansia */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md flex flex-col justify-between min-h-[130px]">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Daftar Lansia</h3>
          <div className="flex justify-between items-baseline mt-4">
            <span className="text-4xl font-black text-stone-900 tracking-tight">{totalLansia}</span>
            <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">Orang</span>
          </div>
        </div>

        {/* Stat 2: Lansia Klinis */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md flex flex-col justify-between min-h-[130px]">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Kondisi Klinis</h3>
          <div className="flex justify-between items-baseline mt-4">
            <span className="text-4xl font-black text-red-650 tracking-tight">{klinisCount}</span>
            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Butuh Pantauan</span>
          </div>
        </div>

        {/* Stat 3: Lansia Semi Klinis */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md flex flex-col justify-between min-h-[130px]">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Semi Klinis</h3>
          <div className="flex justify-between items-baseline mt-4">
            <span className="text-4xl font-black text-amber-600 tracking-tight">{semiKlinisCount}</span>
            <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Perawatan Sedang</span>
          </div>
        </div>

        {/* Stat 4: Pemeriksaan Hari Ini */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-md flex flex-col justify-between min-h-[130px]">
          <h3 className="text-xs font-bold text-stone-400 tracking-wider uppercase">Pemeriksaan Hari Ini</h3>
          <div className="flex justify-between items-baseline mt-4">
            <span className="text-4xl font-black text-emerald-600 tracking-tight">{logsRecordedToday}</span>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Log Tercatat</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Tasks & Announcements */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Shift Tasks */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[2rem] border border-stone-200/50 shadow-md space-y-6">
          <div className="border-b border-stone-100 pb-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-stone-900 tracking-tight">Rencana Tugas Shift {activeNurse.shift}</h3>
              <p className="text-xs text-stone-500 font-semibold mt-0.5">Daftar agenda pelayanan rutin yang wajib diselesaikan</p>
            </div>
            <span className="bg-slate-100 text-slate-700 text-[11px] font-extrabold px-3 py-1.5 rounded-xl uppercase">
              {tasks.filter(t => t.checked).length} / {tasks.length} Selesai
            </span>
          </div>

          <div className="space-y-3.5">
            {tasks.map(task => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-2xl border flex items-center gap-3.5 cursor-pointer transition-all ${
                  task.checked 
                    ? 'bg-stone-55/70 border-stone-200 text-stone-400 line-through' 
                    : 'bg-stone-50 border-stone-200/80 hover:bg-stone-100 text-stone-800 font-semibold'
                }`}
              >
                <div className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center transition-colors ${
                  task.checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                }`}>
                  {task.checked && (
                    <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-bold tracking-tight select-none">{task.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Bulletin / Announcements */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Need Attention Card */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-stone-200/50 shadow-md space-y-4 text-left">
            <h3 className="text-xs font-black text-stone-400 tracking-wider uppercase border-b border-stone-100 pb-3">
              Lansia Klinis (Butuh Pantauan Khusus)
            </h3>
            
            <div className="divide-y divide-stone-100">
              {lansiaList.filter(l => l.status === 'Klinis').map(l => (
                <div key={l.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-stone-900">{l.nama}</p>
                    <p className="text-[10px] text-stone-450 font-bold uppercase tracking-wider">{l.blok} • {l.penyakitBawaan || 'Pasca Stroke'}</p>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 bg-red-50 border border-red-100 text-red-700 rounded-full uppercase tracking-wider">
                    Pantau Tensi
                  </span>
                </div>
              ))}
              {lansiaList.filter(l => l.status === 'Klinis').length === 0 && (
                <p className="text-xs text-stone-400 font-semibold italic pt-2">Semua lansia dalam kondisi stabil.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
