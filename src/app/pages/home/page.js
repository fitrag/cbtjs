import Header from "@/app/components/Header"

const Home = () => {
    return (
        <>
        <Header/>
            <div className="flex flex-col m-4 mb-[90px]">
                <div className="flex shadow space-x-4 items-center bg-white rounded-lg p-5 my-2">
                    <div className="w-[100px]">
                        <div className="bg-blue-200 p-3 rounded-lg h-[100px] flex items-center justify-center font-bold text-lg text-white text-3xl">RPL</div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">PTS Rekayasa Perangkat Lunak</h3>
                        <h3 className="text-gray-500 text-sm">Fadila Fitra Kusuma Jaya</h3>
                        <div className="flex-1 bg-blue-500 text-center text-white p-2 rounded-lg mt-4 text-sm">Mulai ujian</div>
                    </div>
                </div>
                <div className="flex shadow space-x-4 items-center bg-white rounded-lg p-5 my-2">
                    <div className="w-[100px]">
                        <div className="bg-blue-200 p-3 rounded-lg h-[100px] flex items-center justify-center font-bold text-lg text-white text-3xl">DKV</div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">PTS Dasar Desain Grafis</h3>
                        <h3 className="text-gray-500 text-sm">Muhammad Shohibul Anam</h3>
                        <div className="flex-1 bg-blue-500 text-center text-white p-2 rounded-lg mt-4 text-sm">Mulai ujian</div>
                    </div>
                </div>
                <div className="flex shadow space-x-4 items-center bg-white rounded-lg p-5 my-2">
                    <div className="w-[100px]">
                        <div className="bg-blue-200 p-3 rounded-lg h-[100px] flex items-center justify-center font-bold text-lg text-white text-3xl">DKV</div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">PTS Dasar Desain Grafis</h3>
                        <h3 className="text-gray-500 text-sm">Muhammad Shohibul Anam</h3>
                        <div className="flex-1 bg-blue-500 text-center text-white p-2 rounded-lg mt-4 text-sm">Mulai ujian</div>
                    </div>
                </div>
                <div className="flex shadow space-x-4 items-center bg-white rounded-lg p-5 my-2">
                    <div className="w-[100px]">
                        <div className="bg-blue-200 p-3 rounded-lg h-[100px] flex items-center justify-center font-bold text-lg text-white text-3xl">DKV</div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">PTS Dasar Desain Grafis</h3>
                        <h3 className="text-gray-500 text-sm">Muhammad Shohibul Anam</h3>
                        <div className="flex-1 bg-blue-500 text-center text-white p-2 rounded-lg mt-4 text-sm">Mulai ujian</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home