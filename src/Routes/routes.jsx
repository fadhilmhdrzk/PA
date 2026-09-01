import { Routes, Route } from 'react-router-dom'
import Beranda from '../PA/Guest/Beranda'
import Layanan from '../PA/Guest/Layanan'
import Fasilitas from '../PA/Guest/Fasilitas'
import MengapaKami from '../PA/Guest/about'
import FAQ from '../PA/Guest/FAQ'
import Kontak from '../PA/Guest/Kontak'
import Login from '../PA/Login/Login'
import DashboardAdmin from '../PA/Admin/DashboardAdmin'
import DashboardOverview from '../PA/Admin/DashboardOverview'
import DataLansia from '../PA/Admin/DataLansia'
import DataPetugas from '../PA/Admin/DataPetugas'
import DataKeuangan from '../PA/Admin/DataKeuangan'
import DataHistori from '../PA/Admin/DataHistori'
import PesanMasuk from '../PA/Admin/PesanMasuk'
import DashboardPetugas from '../PA/Petugas/DashboardPetugas'
import DashboardPetugasOverview from '../PA/Petugas/DashboardPetugasOverview'
import LansiaLogHarian from '../PA/Petugas/LansiaLogHarian'
import JadwalShift from '../PA/Petugas/JadwalShift'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Beranda />} />
      <Route path="/layanan" element={<Layanan />} />
      <Route path="/fasilitas" element={<Fasilitas />} />
      <Route path="/about" element={<MengapaKami />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/kontak" element={<Kontak />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/admin" element={<DashboardAdmin />}>
        <Route index element={<DashboardOverview />} />
        <Route path="datalansia" element={<DataLansia />} />
        <Route path="datapetugas" element={<DataPetugas />} />
        <Route path="keuangan" element={<DataKeuangan />} />
        <Route path="histori" element={<DataHistori />} />
        <Route path="pesan" element={<PesanMasuk />} />
      </Route>
      <Route path="/dashboard/petugas" element={<DashboardPetugas />}>
        <Route index element={<DashboardPetugasOverview />} />
        <Route path="lansia" element={<LansiaLogHarian />} />
        <Route path="shift" element={<JadwalShift />} />
      </Route>
    </Routes>
  )
}
