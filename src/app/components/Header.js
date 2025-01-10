'use client'

import { useEffect, useState } from "react"

const Header = () => {

    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(true)
    const dataUser = async (token) => {
        if(!token){
          console.log("token tidak ada")
        }else{
          const getUser = await fetch("http://127.0.0.1:8000/api/user",
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          })
          const res = await getUser.json()
          setLoading(false)
          setUser(res)
        }
      }

      useEffect(()=>{
        const token = localStorage['token']
        dataUser(token)
      },[])
    return (
        <>
        <div className="flex bg-white p-5 items-center justify-between space-x-3">
            <div className="">
                <div className="inline-block w-[50px] h-[50px] bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1">
                {
                  !loading ? 
                  <div>
                    {/* <h6 className="text-gray-400 text-sm">Hello👋</h6> */}
                    <h3 className="text-gray-800 font-bold text-md">{user.nama}</h3>
                    <h6 className="text-gray-400 text-sm">{user.kelas.nama}</h6>
                  </div>
                  :
                <div className="animate-pulse">
                  <div className="h-3 bg-slate-200 rounded w-[20vw]"></div>
                  <div className="h-3 mt-2 bg-slate-200 rounded w-[15vw]"></div>
                </div>
                }
            </div>
            <div className=""></div>
        </div>
        </>
    )
}

export default Header