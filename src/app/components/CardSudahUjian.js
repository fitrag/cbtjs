'use client'
import { useRouter } from "next/navigation"

const CardSudahUjian = ({ujians, loading}) => {
    
    const router = useRouter();

    const selectedUjian = (id) => {
        router.push(`/pages/ujian/${id}`)
    }

    return (
        <>
        <div className="mb-[90px] py-4 h-screen">
        {
            loading ?
            <>
                <div className="flex flex-col mt-1 mx-5 animate-pulse">
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
                </div>
                <div className="flex flex-col mt-1 mx-5 animate-pulse">
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
                </div>
                <div className="flex flex-col mt-1 mx-5 animate-pulse">
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
                </div>
            </>
            :
            ujians.length > 0 ?
            ujians.map((ujian, index) => (
                <div className="flex flex-col mt-1 mx-5" key={index}>
                    <div className="flex shadow space-x-4 text-white items-center bg-green-400 rounded-lg p-5 my-2">
                        <div className="w-[100px]">
                            <div className="bg-green-500 p-3 rounded-lg h-[100px] flex items-center justify-center font-bold text-lg text-white text-3xl">{ujian.kelas.nama}</div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{ujian.nama}</h3>
                            <h3 className="text-xs">Fadila Fitra Kusuma Jaya</h3>
                            <h3 className="text-sm mt-2">{ujian.soals_count} Soal - {ujian.waktu/60} menit</h3>
                            <div className="flex-1 bg-green-500 text-center text-white p-2 rounded-lg mt-4 text-sm cursor-pointer">Sudah Ujian</div>
                        </div>
                    </div>
                </div>
            ))
         : <div className="bg-gray-100 flex mt-[20vh] items-center justify-center flex-col">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[150px] text-slate-300 mb-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
            <h3>Belum ada ujian selesai</h3>
         </div>
         }
         </div>
        </>
    )
}

export default CardSudahUjian