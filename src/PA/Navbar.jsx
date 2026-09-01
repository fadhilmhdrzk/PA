import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Layanan', path: '/layanan' },
    { name: 'Fasilitas', path: '/fasilitas' },
    { name: 'Tentang Kami', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Kontak', path: '/kontak' },
  ]

  const activeLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? 'text-emerald-700 font-bold' : 'text-stone-600 hover:text-emerald-700'
    }`

  const activeLinkMobileClass = ({ isActive }) =>
    `font-semibold py-1 transition-colors ${
      isActive ? 'text-emerald-700 font-bold' : 'text-stone-700 hover:text-emerald-700'
    }`

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-md shadow-emerald-900/10 text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-left">
              <span className="font-extrabold text-xl tracking-tight text-stone-900 block">UPT Sosial Tresna Werdha</span>
              <span className="text-[10px] text-emerald-700 font-semibold tracking-wider uppercase block -mt-1">Husnul Khotimah</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={activeLinkClass}>
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Login Button */}
          <div className="hidden md:flex items-center justify-end w-[148px]">
            <Link
              to="/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            >
              Masuk / Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-stone-700 hover:text-emerald-700 p-2 rounded-lg transition-colors focus:outline-none cursor-pointer"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden bg-stone-50 border-b border-stone-200 px-4 pt-2 pb-6 flex flex-col gap-4 animate-fade-in text-left">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={activeLinkMobileClass}
            >
              {item.name}
            </NavLink>
          ))}
          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 rounded-full font-bold shadow-md mt-2 block"
          >
            Masuk / Login
          </Link>
        </div>
      )}
    </nav>
  )
}
