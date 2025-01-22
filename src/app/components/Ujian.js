'use client'

import { useEffect, useState, useCallback } from "react";
import LoadingUjian from "./LoadingUjian";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CACHE_NAMES = [
  'ujian-cache',
  'ujian-soal-cache',
  'ujian-detail-cache',
];

const Ujian = ({ soals, updateSoal, loading, terjawab, updateTerjawab }) => {

  const router = useRouter();

  const totalTime = parseInt(localStorage.getItem("waktu_ujian"));
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [progress, setProgress] = useState(100);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Fungsi untuk menangani perubahan soal (prev/next)
  const gantiSoal = useCallback((action) => {
    updateSoal({
      action: action,
      current_page: soals.current_page,
    });
  }, [soals, updateSoal]);

  // Fungsi untuk menangani pilihan jawaban
  const pilihJawaban = useCallback(async (soal_id, jawaban, user_id) => {
    try {
        const toastLoading = toast.loading('Sedang menyimpan...');
        const insert = await fetch("http://127.0.0.1:8000/api/jawaban", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            soal_id,
            user_id,
            jawaban
            })
        });

        const resInsert = await insert.json();
        if(resInsert){
          if(resInsert.data.status == 'Benar'){
            localStorage['skor'] = parseInt(localStorage['skor'])+resInsert.data.skor
          }else{
            localStorage['skor'] = parseInt(localStorage['skor']) <= 0 ? 0 : parseInt(localStorage['skor'])-resInsert.data.skor
          }
        }

        const getJawaban = await fetch(`http://127.0.0.1:8000/api/jawaban/${localStorage.getItem("soal_id")}/${localStorage.getItem("user_id")}`, {
            headers: {
            'Content-Type': 'application/json'
            }
        });
        
        const res = await getJawaban.json();
        if (res) {
            updateTerjawab({ jawaban: res.data.jawaban });
        }
        if(insert){
            toast.success('Jawaban disimpan', {
                id: toastLoading,
            });
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
        toast.error('Upss ada yang tidak beres', {
            id: toastLoading,
        });
    }
  }, [updateTerjawab]);

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

  // Mengelola timer dan progress
  useEffect(() => {
    
    if (localStorage.getItem("waktu_ujian") == 'NaN' || timeLeft <= 0){
      toast.success('Waktu habis ujian telah selesai, Terimakasih telah mengerjakan');
      router.push("/pages/home")
      localStorage.removeItem("ujian_id")
      localStorage.removeItem("current_page")
      localStorage.removeItem("total_waktu")
      localStorage.removeItem("waktu_ujian")
      localStorage.removeItem("soal_id")
      
      // Menghapus cache setelah waktu habis
      hapusCache();
    };

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        localStorage.setItem("waktu_ujian", timeLeft)
        return prevTime - 1;
      });
    }, 1000);

    // Update progress setiap detik
    const progressPercentage = (timeLeft / localStorage.getItem("total_waktu")) * 100;
    setProgress(progressPercentage);

    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <div>
      <section className="bg-gradient-to-b from-sky-400 to-sky-600 text-white px-5 pt-4 pb-9 rounded-br-[50px] rounded-bl-[50px] h-[50vh]">
        <header className="flex justify-between items-center mb-1">
          <div className="font-semibold text-lg bg-blue-300 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>                    
          </div>
          <div className="font-semibold text-lg text-center">SOAL {soals.current_page}/{soals.total}</div>
          <div className="font-semibold text-md bg-blue-300 p-2 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 me-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {formatTime(timeLeft)}
          </div>
        </header>

        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div className="relative w-100 h-[15px] bg-blue-600 rounded-full">
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                transition: 'all 1s linear',
              }}
              className={timeLeft < 10 ? 'bg-red-500 rounded-full' : timeLeft < 60 ? 'bg-yellow-500 rounded-full' : 'bg-green-400 rounded-full'}
            />
          </div>
        </div>
      </section>

      <section className="relative top-[-30vh] mx-5">

      <div className="flex mb-2">
        <div className="flex-1">
          {soals.prev_link && (
              <div className="bg-blue-300 p-2 cursor-pointer mx-1 mb-2 text-white rounded-lg inline-block float-start" onClick={() => gantiSoal('prev')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </div>
          )}
          </div>
        <div className="flex-1">
          {soals.next_link && (
            <div className="bg-blue-300 p-2 cursor-pointer mx-1 mb-2 text-white rounded-lg inline-block float-end" onClick={() => gantiSoal('next')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
          )}
          </div>
        </div>

        { loading ? <LoadingUjian/> :
          <div className="bg-white shadow-md rounded-[25px]" key={soals.dataSoal.id}>
            <div className="px-4 py-5 font-light" dangerouslySetInnerHTML={{ __html: soals.dataSoal.soal }} />
            <div className="px-4 pb-4">
              {['A', 'B', 'C', 'D'].map((opsi) => (
                <div
                  key={opsi}
                  onClick={() => terjawab.jawaban != opsi ? pilihJawaban(soals.dataSoal.id, opsi, parseInt(localStorage.getItem('user_id'))) : ''}
                  className={terjawab.jawaban === opsi ? 'rounded-full cursor-pointer p-5 hover:border-green-500 border-green-600 bg-green-500 text-white font-semibold border-[2px] my-2' : 'rounded-full cursor-pointer p-5 hover:border-green-500 border-[1px] my-2'}>
                  {opsi}. {soals.dataSoal[`opsi_${opsi.toLowerCase()}`]}
                </div>
              ))}
            </div>
          </div>
        }

        <div className="mt-7 flex">
          {soals.prev_link && (
            <div className="bg-red-500 p-5 flex-1 cursor-pointer mx-1 mb-2 text-white text-center font-normal text-xl rounded-2xl border-b-[5px] border-red-600" onClick={() => gantiSoal('prev')}>
              Sebelumnya
            </div>
          )}
          {soals.next_link && (
            <div className="bg-green-500 p-5 flex-1 cursor-pointer mx-1 mb-2 text-white text-center font-normal text-xl rounded-2xl border-b-[5px] border-green-600" onClick={() => gantiSoal('next')}>
              Selanjutnya
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Ujian;
