'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import Confetti from 'react-confetti'

const CACHE_NAMES = [
    'ujian-cache',
    'ujian-soal-cache',
    'ujian-detail-cache',
    'ujian-sudah-cache',
  ];

const Hasil = () => {
    const [hasilUjian, setHasilUjian] = useState(null)
    const [loading, setLoading] = useState(true)
    const [windowWidth, setWindowWidth] = useState(0)
    const [windowHeight, setWindowHeight] = useState(0)

    // Fungsi untuk menghapus cache dengan nama-nama tertentu
    const hapusCache = async () => {
        if ('caches' in window) {
        try {
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

    // Ambil data hasil ujian dari API
    const getHasilUjian = async () => {
        try {
            const ujianId = localStorage.getItem("ujian_id")
            const userId = localStorage.getItem("user_id")

            const response = await fetch("http://127.0.0.1:8000/api/ujian/hasil", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ujian_id: ujianId,
                    user_id: userId
                })
            })

            const result = await response.json()

            if (response.ok) {
                setHasilUjian(result.data)
                hapusCache()
                localStorage.removeItem("ujian_id");
            } else {
                console.error("Failed to fetch hasil ujian:", result.message)
            }
        } catch (error) {
            console.error('Error fetching hasil ujian:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getHasilUjian()

        // Update ukuran jendela untuk confetti
        setWindowWidth(window.innerWidth)
        setWindowHeight(window.innerHeight)

        window.addEventListener('resize', () => {
            setWindowWidth(window.innerWidth)
            setWindowHeight(window.innerHeight)
        })

        return () => {
            window.removeEventListener('resize', () => {
                setWindowWidth(window.innerWidth)
                setWindowHeight(window.innerHeight)
            })
        }
    }, [])

    if (loading) {
        return (
            <div className="bg-cyan-700 flex h-full h-screen flex-col text-white px-[50px] mb-[80px] items-center justify-center">
                <div className="text-center p-4 text-lg font-semibold text-green-300">Memuat Hasil Ujian...</div>
            </div>
        )
    }

    if (!hasilUjian) {
        return (
            <div className="bg-cyan-700 flex h-screen flex-col text-white px-[50px] mb-[80px] items-center justify-center">
                <div className="text-center p-4 text-lg font-semibold text-green-300">Tidak ada hasil ujian ditemukan</div>
            </div>
        )
    }

    return (
        <>
            {/* Menambahkan efek confetti yang turun dari atas */}
            <Confetti
                width={windowWidth-20}
                height={windowHeight}
                gravity={0.2} // Kecepatan confetti turun
                numberOfPieces={500}
                recycle={false}
                tweenDuration={2000}
                confettiSource={{ x: windowWidth / 2, y: 0 }} // Memulai dari atas (y: 0)
            />
            <div className="bg-cyan-700 flex flex-col text-white px-[50px] mb-[5vh] pb-[80px]">
                <div className="mb-2">
                    <h3 className="text-center p-4 text-lg font-semibold text-green-300">Hasil Ujian</h3>
                </div>
                <div>
                    <h3 className="">Total Jawaban Benar</h3>
                    <h1 className="font-semibold text-2xl text-green-300">{hasilUjian.benar} dari {hasilUjian.benar + hasilUjian.salah} soal</h1>
                </div>
                <div className="bg-gradient-to-b from-cyan-500 to-blue-600 mt-9 px-5 py-9 rounded-xl shadow-lg">
                    <h3 className="text-center font-semibold text-3xl">Nilai Kamu</h3>
                    <h1 className="flex justify-center flex-col items-center">
                        <div className="p-9 text-[50px] font-bold bg-yellow-400 rounded-full m-5 h-[200px] w-[200px] flex items-center justify-center">
                            {hasilUjian.nilai}
                        </div>
                    </h1>
                </div>
                <div className="mt-9 w-full">
                    <Link href="/pages/home" className="bg-blue-500 block p-4 text-xl font-semibold text-center rounded-lg flex items-center justify-center gap-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <div>Home</div>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Hasil
