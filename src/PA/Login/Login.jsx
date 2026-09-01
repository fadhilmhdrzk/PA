import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Email dan Password wajib diisi!')
      return
    }

    setError('')
    setLoading(true)

    // Sign in using Supabase Auth (using email)
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    })

    if (authError) {
      setError('Login gagal: ' + authError.message)
      setLoading(false)
      return
    }

    // Fetch the user's role from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      setError('Role pengguna tidak ditemukan di database profiles.')
      setLoading(false)
      return
    }

    setLoading(false)

    // Redirect user to the corresponding dashboard based on their role
    if (profile.role === 'admin') {
      navigate('/dashboard/admin')
    } else if (profile.role === 'perawat') {
      navigate('/dashboard/petugas')
    } else {
      setError('Peran pengguna tidak dikenal.')
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-stone-100/50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[2rem] border border-stone-200/50 shadow-xl shadow-stone-900/5 text-left">
        <div className="text-center mb-8">
          <div className="bg-emerald-100 text-emerald-800 p-3 rounded-2xl w-fit mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Selamat Datang</h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Silakan masuk untuk mengakses sistem UPT Social Home Husnul Khotimah
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-semibold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan email"
              className="w-full bg-stone-50 border border-stone-200 px-4 py-3.5 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full bg-stone-50 border border-stone-200 px-4 py-3.5 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-600 transition-colors text-sm font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-950/10 hover:shadow-emerald-950/20 transition-all text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk / Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
