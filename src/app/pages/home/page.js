'use client'

import CardUjian from "@/app/components/CardUjian"
import Header from "@/app/components/Header"
import { useEffect, useState } from "react"

const CACHE_NAME = 'ujian-cache'
const CACHE_KEY = 'ujian-data'
const CACHE_EXPIRATION_TIME = 2 * 60 * 1000 // 2 menit dalam milidetik

const Home = () => {
    const [ujians, setUjians] = useState([])
    const [loading, setLoading] = useState(true)

    // Fungsi untuk mendapatkan data ujian dari API dan menyimpannya ke cache
    const getUjian = async () => {
        try {
            const get = await fetch("http://127.0.0.1:8000/api/ujian")
            const res = await get.json()

            // Menyimpan data ke dalam cache bersama dengan timestamp
            if ('caches' in window) {
                caches.open(CACHE_NAME).then(cache => {
                    const cacheData = {
                        data: res.data,
                        timestamp: Date.now()
                    }
                    cache.put(CACHE_KEY, new Response(JSON.stringify(cacheData)))
                })
            }

            setUjians(res.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching ujian data:', error)
        }
    }

    useEffect(() => {
        // Cek apakah data sudah ada di cache dan apakah cache sudah kedaluwarsa
        if ('caches' in window) {
            caches.match(CACHE_KEY).then(cacheResponse => {
                if (cacheResponse) {
                    cacheResponse.json().then((cacheData) => {
                        const currentTime = Date.now()
                        const cacheAge = currentTime - cacheData.timestamp

                        // Jika cache sudah kedaluwarsa, ambil data baru dari API
                        if (cacheAge > CACHE_EXPIRATION_TIME) {
                            console.log("Hit API, memperbarui cache")
                            caches.delete(CACHE_KEY)  // Hapus cache yang sudah expired
                            getUjian() // Ambil data baru dari API
                        } else {
                            console.log("Hit data dari cache")
                            setUjians(cacheData.data)
                            setLoading(false)
                        }
                    })
                } else {
                    // Jika tidak ada data di cache, panggil API
                    getUjian()
                }
            })
        } else {
            // Jika Cache API tidak tersedia, fallback ke API
            getUjian()
        }

        // Set interval untuk memanggil API setiap 2 menit (120.000 ms)
        const intervalId = setInterval(() => {
            getUjian()
        }, CACHE_EXPIRATION_TIME) // 2 menit

        // Cleanup interval saat komponen di-unmount
        return () => clearInterval(intervalId)
    }, [])

    return (
        <>
            <Header />
            <CardUjian ujians={ujians} loading={loading} />
        </>
    )
}

export default Home
