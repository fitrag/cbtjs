import Header from "@/app/components/Header"

const Home = () => {
    return (
        <>
        <Header/>
            <div className="flex flex-col m-4">
                <div className="flex shadow bg-white rounded-lg p-5 my-2">
                    <div className="w-[100px]">
                        <div className="bg-blue-300 p-3 rounded-lg h-[100px] flex items-center justify-center">ABV</div>
                    </div>
                    <div className="flex-1 px-3">
                        <h3 className="font-semibold text-gray-800">PTS Rekayasa Perangkat Lunak</h3>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home