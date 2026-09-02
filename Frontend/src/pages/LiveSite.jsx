import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const LiveSite = () => {
    const [html, setHtml] = useState("")
    const [error, setError] = useState("")
    const {id} = useParams()
    useEffect(()=>{
          const handleGetWebsite = async()=>{
            try {
                const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/getbyslug/${id}`,{withCredentials:true})        
                setHtml(res.data.latestCode)          
            } catch (error) {
                console.log(error)
                setError(error.response?.data?.message || "Failed to load live site")
            }
          }
          handleGetWebsite()
    },[id])

    if (error) {
  return (
    <div className="h-screen flex items-center justify-center bg-[#09090b] text-red-500 font-mono uppercase tracking-widest text-sm">
      {error}
    </div>
  )
}
  return (
  <iframe 
  title='Live site' 
  srcDoc={html} 
  className='w-screen h-screen border-none'
  sandbox='allow-scripts allow-same-origin allow-forms'/>
  )
}

export default LiveSite
