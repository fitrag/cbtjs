'use client'
import { useRouter } from "next/navigation"

const CardUjian = ({ujians, loading}) => {
    
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
                    <div className="flex shadow space-x-4 items-center bg-white rounded-lg p-5 my-2">
                        <div className="w-[100px]">
                            <div className="bg-blue-200 p-3 rounded-lg h-[100px] flex items-center justify-center font-bold text-lg text-white text-3xl">{ujian.kelas.nama}</div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{ujian.nama}</h3>
                            <h3 className="text-gray-500 text-xs">Fadila Fitra Kusuma Jaya</h3>
                            <h3 className="text-gray-500 text-sm mt-2">{ujian.soals.length} Soal - {ujian.waktu/60} menit</h3>
                            <div className="flex-1 bg-blue-500 text-center text-white p-2 rounded-lg mt-4 text-sm cursor-pointer" onClick={() => {
                                selectedUjian(ujian.id)
                            }}>Mulai ujian</div>
                        </div>
                    </div>
                </div>
            ))
         : <div className="bg-gray-100 flex h-screen items-center justify-center">Belum ada ujian</div>
         }
         </div>
        </>
    )
}

export default CardUjian