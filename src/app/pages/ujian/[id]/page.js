'use client'
import Header from "@/app/components/Header"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const CACHE_NAME = 'ujian-detail-cache'
const CACHE_KEY = 'ujian-detail-data'
const CACHE_EXPIRATION_TIME = 2 * 60 * 1000 // 2 menit dalam milidetik

const Detail = () => {
    const [ujian, setUjian]     = useState([])
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState("")
    
    const params = useParams()
    const id = params.id
    const router = useRouter()

    // Fungsi untuk mengambil data ujian dari API dan menyimpannya ke dalam cache
    const getUjian = async (id) => {
        const get = await fetch(`http://127.0.0.1:8000/api/ujian/${id}`)
        const res = await get.json()
        const data = res.data
        
        // Menyimpan data ujian ke dalam cache dengan timestamp
        if ('caches' in window) {
            caches.open(CACHE_NAME).then(cache => {
                const cacheData = {
                    data: data,
                    timestamp: Date.now()
                }
                cache.put(CACHE_KEY, new Response(JSON.stringify(cacheData)))
            })
        }
        
        setUjian(data)
        setLoading(false)
    }

    const handleToken = async (e) => {
        e.preventDefault()

        if (!token) {
            toast.error("Masukkan token")
        } else {
            const get = await fetch(`http://127.0.0.1:8000/api/ujian/${id}/token/${token}/${localStorage.getItem("user_id")}`, {
            })
            const res = await get.json()
            const toastLoading = toast.loading("Memeriksa token...")
            if (token === res.token) {
                toast.success("Token benar! Selamat mengerjakan", {
                    id: toastLoading
                })
                localStorage.setItem("ujian_id", res.ujian_id)
                localStorage.setItem("skor", 0)

                if ((localStorage.getItem("waktu_ujian")) === "NaN" || !localStorage.getItem("waktu_ujian")) {
                    localStorage.setItem("waktu_ujian", res.waktu_ujian)
                    localStorage.setItem("total_waktu", res.waktu_ujian)
                }
                router.push(`/pages/ujian/mengerjakan/${id}`)
            } else {
                toast.error("Token salah!", {
                    id: toastLoading
                })
                setToken('')
            }
        }
    }

    useEffect(() => {
        // Cek apakah ada data di cache dan apakah cache sudah kedaluwarsa
        if ('caches' in window) {
            caches.match(CACHE_KEY).then(cacheResponse => {
                if (cacheResponse) {
                    cacheResponse.json().then((cacheData) => {
                        const currentTime = Date.now()
                        const cacheAge = currentTime - cacheData.timestamp

                        // Jika cache sudah kedaluwarsa, hapus cache dan ambil data baru dari API
                        if (cacheAge > CACHE_EXPIRATION_TIME) {
                            console.log("Hit API, memperbarui cache")
                            caches.delete(CACHE_KEY)  // Hapus cache yang sudah expired
                            getUjian(id) // Ambil data baru dari API
                        } else {
                            console.log("Hit data dari cache")
                            setUjian(cacheData.data) // Ambil data dari cache
                            setLoading(false)
                        }
                    })
                } else {
                    // Jika tidak ada data di cache, ambil data baru dari API
                    getUjian(id)
                }
            })
        } else {
            // Jika Cache API tidak tersedia, fallback ke API
            getUjian(id)
        }

        // Set interval untuk memanggil API setiap 2 menit (120.000 ms)
        const intervalId = setInterval(() => {
            getUjian(id)
            console.log("Hit data")
        }, CACHE_EXPIRATION_TIME) // 2 menit

        // Cleanup interval saat komponen di-unmount
        return () => clearInterval(intervalId)
    }, [id])

    return (
        <>
            <Header />
            {
                loading ?
                    <>
                        <div className="flex flex-col h-screen mt-1 mx-5 animate-pulse">
                            <div className="flex shadow space-x-4 items-center bg-white rounded-lg p-5 my-2">
                                <div className="w-[100px]">
                                    <div className="bg-slate-200 p-3 rounded-lg h-[100px] flex items-center justify-center font-bold text-lg text-white text-3xl"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="h-6 mt-2 bg-slate-200 rounded"></div>
                                    <div className="h-4 mt-3 bg-slate-200 rounded"></div>
                                    <div className="h-3 mt-4 bg-slate-200 rounded"></div>
                                    <div className="h-8 bg-slate-200 rounded mt-4"></div>
                                </div>
                            </div>
                            <div className="mt-2 flex-wrap bg-white p-4 shadow rounded-lg">
                                <div className="h-12 bg-slate-200 rounded"></div>
                                <div className="h-9 mt-2 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </>
                    :
                    <div className="flex flex-col flex-wrap mt-1 mx-5 h-screen" key={ujian.id}>
                        <div className="flex shadow space-x-4 items-center bg-white rounded-lg p-5 my-2">
                            <div className="w-[100px]">
                                <div className="bg-blue-200 p-3 rounded-lg h-[100px] flex items-center justify-center font-bold text-lg text-white text-3xl">{ujian.kelas?.nama}</div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-800">{ujian.nama}</h3>
                                <h3 className="text-gray-500 text-xs">Fadila Fitra Kusuma Jaya</h3>
                                <h3 className="text-gray-500 text-sm mt-2">{ujian.soals?.length} Soal - {ujian.waktu / 60} menit</h3>
                            </div>
                        </div>
                        <div className="mt-2 flex-wrap bg-white p-4 shadow rounded-lg">
                            <form onSubmit={handleToken}>
                                <input className="w-full border rounded-lg p-3 outline-none" value={token} onChange={(e) => { setToken(e.target.value) }} placeholder="Token Ujian" />
                                <button type="submit" className="w-full bg-blue-500 p-3 rounded-lg mt-2 text-white">Mulai</button>
                            </form>
                        </div>
                    </div>
            }
        </>
    )
}

export default Detail
