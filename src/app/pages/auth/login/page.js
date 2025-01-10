'use client'

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";



const Login = () => {


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const toastLoading = toast.loading("Sedang memproses...")
        const get = await fetch('http://127.0.0.1:8000/api/login',{
                method:"POST",
                headers : {
                    'Content-Type' : 'application/json'
                },
                body:JSON.stringify({
                    username:username,
                    password:password
                })
            }
        )
        const res = await get.json();
        if(res && res.statusCode == 200){
            localStorage.setItem("token", res.token)
            toast.success("Berhasil login", {
                id:toastLoading
            })
            router.push('/pages/home')
        }else{
            toast.error(res.message, {
                id:toastLoading
            })
        }
    }

    return (
        <>
            <div className="flex flex-col h-screen items-center justify-center bg-white">
                <div className="w-full p-9">
                    <div className="flex items-center justify-center mb-[50px] text-gray-800">
                        <div className="">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="size-[80px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                        </div>
                        <div className="text-[40px] font-bold">UjianKu</div>
                    </div>
                    <h1 className="font-semibold text-lg mb-3 text-gray-700">Masuk ke akunmu</h1>
                    <form onSubmit={handleLogin}>
                        <div className="">
                            <input className="w-full outline-none border border-[1px] p-4 shadow my-3 rounded-lg" placeholder="Username" value={username} onChange={(e) => {
                                setUsername(e.target.value)
                            }} type="text"/>
                        </div>
                        <div className="">
                            <input className="w-full outline-none border border-[1px] p-4 shadow my-3 rounded-lg" placeholder="Password" value={password} onChange={(e) => {
                                setPassword(e.target.value)
                            }} type="text"/>
                        </div>
                        <div className="">
                            <button type="submit" className="w-full outline-none border border-[1px] p-4 shadow my-3 rounded-lg bg-blue-500 text-white font-semibold">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login