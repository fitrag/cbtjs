'use client'

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'  // Import useRouter

// Nama-nama cache yang ingin dihapus
const CACHE_NAMES = [
  'ujian-cache',
  'ujian-soal-cache',
  'ujian-detail-cache',
  'ujian-sudah-cache',
];

const Header = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter() // Inisialisasi useRouter

  // Fungsi untuk mengambil data user dari API
  const dataUser = async (token) => {
    if (!token) {
      console.log("token tidak ada")
    } else {
      const getUser = await fetch("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const res = await getUser.json()
      localStorage.setItem('kelas_id', res.kelas_id)

      // Simpan data user ke localStorage
      localStorage.setItem('user', JSON.stringify(res))
      // Set state user dan loading
      setLoading(false)
      setUser(res)
    }
  }

  // Fungsi untuk menghapus cache dengan nama-nama tertentu
  const hapusCache = async () => {
    if ('caches' in window) {
      try {
        // Loop untuk menghapus setiap cache dengan nama yang ada dalam CACHE_NAMES
        for (let cacheName of CACHE_NAMES) {
          const cache = await caches.open(cacheName);
          await cache.keys().then(keys => {
            keys.forEach(key => {
              cache.delete(key);
            });
          });
          console.log(`Cache ${cacheName} berhasil dihapus`);
        }
      } catch (error) {
        console.error('Gagal menghapus cache:', error);
      }
    }
  };

  const handleLogout = async () => {
    setLoading(true)

    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem('token')

      if (!token) {
        console.log("Token tidak ada, redirecting to home")
        router.push('/')  // Jika token tidak ada, redirect ke halaman utama
        return
      }

      // Kirim permintaan POST ke endpoint logout Laravel Sanctum
      const response = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Jika logout berhasil, hapus token dan user dari localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // Hapus semua cache setelah logout
        await hapusCache()

        // Redirect ke halaman utama setelah logout
        router.push('/')
      } else {
        console.error('Logout gagal')
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat logout', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Cek token di localStorage
    const token = localStorage.getItem('token')

    // Jika token tidak ada, arahkan pengguna ke halaman utama '/'
    if (!token) {
      router.push('/')  // Redirect ke halaman utama
      return
    }

    // Cek jika sudah ada data user di localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser)) // Jika ada, set user langsung
      setLoading(false) // Set loading false
    } else {
      // Jika belum ada data user di localStorage, ambil dari API
      dataUser(token)
    }
  }, [router]) // Pastikan useRouter dipantau sebagai dependency

  return (
    <>
      <div className="flex bg-white p-5 items-center justify-between space-x-3 shadow-sm">
        <div className="">
          <div className="inline-block w-[50px] h-[50px] bg-green-500 rounded-full"></div>
        </div>
        <div className="flex-1">
          {!loading ? (
            <div>
              <h3 className="text-gray-800 font-bold text-md">{user?.nama}</h3>
              <h6 className="text-gray-400 text-sm">{user?.kelas?.nama}</h6>
            </div>
          ) : (
            <div className="animate-pulse">
              <div className="h-3 bg-slate-200 rounded w-[20vw]"></div>
              <div className="h-3 mt-2 bg-slate-200 rounded w-[15vw]"></div>
            </div>
          )}
        </div>
        <div className="">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-3 rounded-lg"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

export default Header
