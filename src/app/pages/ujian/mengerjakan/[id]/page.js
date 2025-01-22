'use client'

import Ujian from '@/app/components/Ujian'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'

const CACHE_NAME = 'ujian-soal-cache'
const CACHE_KEY = 'ujian-soal-data'
const CACHE_EXPIRATION_TIME = 2 * 60 * 1000 // 2 menit dalam milidetik

const UjianPage = () => {
  const [datas, setDatas] = useState([])
  const [loading, setLoading] = useState(true)
  const [terjawab, setTerjawab] = useState('')

  const router = useRouter()

  // Fungsi untuk mengambil soal
  const getSoal = useCallback(async () => {
    try {
      // Cek apakah data ada di cache dan apakah cache sudah kedaluwarsa
      if ('caches' in window) {
        const cacheResponse = await caches.match(CACHE_KEY)

        if (cacheResponse) {
          const cacheData = await cacheResponse.json()
          const currentTime = Date.now()
          const cacheAge = currentTime - cacheData.timestamp

          // Jika cache masih valid
          if (cacheAge < CACHE_EXPIRATION_TIME) {
            setDatas(cacheData.data) // Ambil data dari cache
            setLoading(false)
            return
          } else {
            // Hapus cache yang sudah kedaluwarsa
            await caches.delete(CACHE_KEY)
          }
        }
      }

      // Jika tidak ada cache atau cache sudah kedaluwarsa, ambil data baru dari API
      const response = await fetch(`http://127.0.0.1:8000/api/soals?ujian_id=${localStorage.getItem("ujian_id")}&user_id=${localStorage.getItem("user_id")}`)
      const res = await response.json()

      if (res) {
        const { data, current_page, next_page_url, prev_page_url, total } = res.data
        localStorage.setItem("soal_id", data[0].soal.id)
        localStorage.setItem("current_page", current_page)
        fetchJawaban(data[0].soal.id)

        const cacheData = {
          data: {
            dataSoal: data[0].soal,
            current_page,
            next_link: next_page_url,
            prev_link: prev_page_url,
            total,
          },
          timestamp: Date.now(), // Simpan timestamp untuk cache expiration
        }

        // Simpan data ke cache
        if ('caches' in window) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(CACHE_KEY, new Response(JSON.stringify(cacheData)))
        }

        setDatas({
          dataSoal: data[0].soal,
          current_page,
          next_link: next_page_url,
          prev_link: prev_page_url,
          total,
        })
      }
    } catch (error) {
      console.error("Error fetching soal:", error)
    } finally {
    }
  }, [])

  // Fungsi untuk mengambil jawaban
  const fetchJawaban = useCallback(async (soalId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/jawaban/${soalId}/${localStorage.getItem("user_id")}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      const res = await response.json()

      if (res && res.data) {
        setLoading(false)
        setTerjawab({
          jawaban: res.data.jawaban,
        })
      } else {
        setTerjawab({
          jawaban: ''
        })
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching jawaban:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fungsi untuk mengupdate soal (next/prev)
  const updateSoal = async (data) => {
    setLoading(true)
    setTerjawab({
      jawaban: ''
    })
    const newPage = data.action === 'next' ? data.current_page + 1 : data.current_page - 1
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/soals?ujian_id=${localStorage.getItem("ujian_id")}&user_id=${localStorage.getItem("user_id")}&page=${newPage}`)
      const res = await response.json()

      if (res) {
        const { data, current_page, next_page_url, prev_page_url, total } = res.data
        localStorage.setItem("soal_id", data[0].soal.id)
        localStorage.setItem("current_page", current_page)

        fetchJawaban(data[0].soal.id)

        const cacheData = {
          data: {
            dataSoal: data[0].soal,
            current_page,
            next_link: next_page_url,
            prev_link: prev_page_url,
            total,
          },
          timestamp: Date.now(), // Simpan timestamp untuk cache expiration
        }

        // Simpan data ke cache
        if ('caches' in window) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(CACHE_KEY, new Response(JSON.stringify(cacheData)))
        }

        setDatas({
          dataSoal: data[0].soal,
          current_page,
          next_link: next_page_url,
          prev_link: prev_page_url,
          total,
        })
      }
    } catch (error) {
      console.error("Error updating soal:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      updateSoal({
        action: 'next',
        current_page: parseInt(localStorage.getItem('current_page')),
      })
    } else if (e.key === "ArrowLeft") {
      updateSoal({
        action: 'prev',
        current_page: parseInt(localStorage.getItem('current_page')),
      })
    }
  }

  // Memanggil API untuk soal pertama dan jawaban saat komponen pertama kali dimuat
  useEffect(() => {
    let kesempatan = 2
    const handleCurang = () => {
      kesempatan--
      // if(kesempatan == 1){
      //     toast('1x lagi melakukan kecurangan, ujian otomatis selesai', {
      //         icon: '🧐',
      //     });
      //   }else if(kesempatan <= 0){
      //     toast.success('Anda melakukan kecurangan, Ujian telah selesai, Terimakasih');
      //     redirect("/pages/auth/login")
      // }
    }

    window.addEventListener('blur', handleCurang)
    window.addEventListener('keydown', handleKeyDown)

    const soalId = localStorage.getItem("soal_id")
    if (soalId) {
      fetchJawaban(soalId)
    }

    getSoal()

    return () => {
      window.removeEventListener('blur', handleCurang)
      toast.dismiss()
    }
  }, [])

  return (
    <Ujian
      soals={datas}
      updateSoal={updateSoal}
      loading={loading}
      terjawab={terjawab}
      updateTerjawab={setTerjawab}
    />
  )
}

export default UjianPage
