export default function Loading() {
  return (
    <>
      {/* Top micro progress bar loader */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 z-[9999] animate-pulse"></div>

      {/* Screen glassmorphic loading overlay */}
      <div className="fixed inset-0 bg-stone-50/70 backdrop-blur-md z-[9998] flex flex-col items-center justify-center transition-all duration-300">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinning circle */}
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
          </div>
        </div>
      </div>
    </>
  )
}
