'use client'

import CardUjian from "@/app/components/CardUjian"
import Header from "@/app/components/Header"
import { useEffect, useState } from "react"

const Home = () => {

    const [ujians, setUjians] = useState([])
    const [loading, setLoading] = useState(true)

    const getUjian = async () =>{
        const get = await fetch("http://127.0.0.1:8000/api/ujian");
        const res = await get.json()
        setUjians(res.data)
        setLoading(false)
    }

    useEffect(()=>{
        getUjian()
    }, [])

    return (
        <>
        <Header/>
        <CardUjian ujians={ujians} loading={loading}/>
        </>
    )
}

export default Home