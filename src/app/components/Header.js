'use client'

import { useEffect, useState } from "react"

const Header = () => {

    const [user, setUser] = useState([])
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
          setUser(res)
        }
      }

      useEffect(()=>{
        const token = localStorage['token']
        dataUser(token)
      },[])
    return (
        <>
        <div className="flex bg-white p-4 items-center justify-between space-x-3">
            <div className="">
                <div className="inline-block w-[50px] h-[50px] bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1">
                <h6 className="text-gray-400 text-sm">Hello👋</h6>
                <h3 className="text-gray-800 font-bold text-md">{user.username}</h3>
            </div>
            <div className=""></div>
        </div>
        </>
    )
}

export default Header