import React, { useEffect, useState } from 'react'
import { extractCodeFromUrl } from './utils/extractCodeFromUrl';
import { localStorage } from './utils/localStorage';
import {fetchApi} from './utils/fetchApi'

export default function App() {

  const [isLogin,setIsLogin] = useState(false)
  const [authenticateFlow,setAuthenticateFlow] = useState<any>({})
  const [isLoading, setIsloading] = useState(false)

  useEffect(()=> {
    const  authenticationFlow =localStorage.getItem('authenticateFlowFlag')
    setAuthenticateFlow(authenticationFlow)
    const isLoggedIn = window.localStorage.getItem('weblow-nextjs');
    const currentAuthentication = localStorage.getItem('currentFlow');
    if(isLoggedIn){
      Object.keys(isLoggedIn).length> 0 &&  setIsLogin(true)
    }

    const code:string | null = extractCodeFromUrl(currentAuthentication?.id)
      if(code !== null){
      (async () => {
        if(currentAuthentication?.id === 'webflow'){
          localStorage.setitem('authenticateFlowFlag',{isWebFlowAuthenticate: true,isSaleforceAuthenticate:false})
          await fetchAccessTokenForWebFlow(code)
      }
      if(currentAuthentication?.id === 'saleforce'){
          localStorage.setitem('authenticateFlowFlag',{isWebFlowAuthenticate: true,isSaleforceAuthenticate:true})
          await fetchAccessTokenForSaleForce(code)
      }
      })()   
      const  authenticationFlow =localStorage.getItem('authenticateFlowFlag')
      setAuthenticateFlow(authenticationFlow)
    }
},[])

  const fetchAccessTokenForWebFlow = async (code: string) => {
    try {
    setIsloading(true)
    const user = localStorage.getItem('weblow-nextjs')
    const res = await fetchApi({url:'http://localhost:3001/webflow-auth-token', method: 'POST', header: {"Content-type": "application/json"}, body:{code,user:user.userId}});
    if(res){
      setIsloading(false)
    }
  } catch (error) {
      console.log({error})
    }
  }

  const fetchAccessTokenForSaleForce = async (code: string) => {
    try {
    setIsloading(true)
    const user = localStorage.getItem('weblow-nextjs')
    const res = await fetchApi({url:`${process.env.REACT_APP_SERVER_URL}saleforce-auth-token`, method: 'POST', header: {"Content-type": "application/json"}, body:{code,user:user.userId}});
      if(res){
        setIsloading(false)
      }
  } catch (error) {
      console.log({error})
    }
  }

  const login = async () => {
    try {
    setIsloading(true)
    const res = await fetchApi({url: `${process.env.REACT_APP_SERVER_URL}login`, method: 'POST' ,header: {'Content-Type': 'application/json'}, 
      body: {
          fullName: 'user' +  Math.floor(Math.random() * 100000),
          browserUniqeId: Math.floor(Math.random() * 100000),
      }})
        if(res){
          localStorage.setitem('weblow-nextjs',{
            userId: res.newAuth.user,
            token: res.newAuth.tokens,
            browserUniqeId:res.newUser.browserUniqeId
          }) 
    setIsloading(false)
    setIsLogin (true)
    }
    } catch (error) {
      
    }
  }

  const navigateSaleforceAuth = () => {
    localStorage.setitem('currentFlow',{id:'saleforce'})
    window.location.replace(`${process.env.REACT_APP_SALEFORCE_AUTH_CODE_URL}?client_id=${process.env.REACT_APP_SALEFORCE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_WEBFLOW_REDIRECT_URL}&response_type=code`)
  }

  const navigateToWebFlowAuth = () => {
    localStorage.setitem('currentFlow',{id:'webflow'})
    window.location.replace(`${process.env.REACT_APP_WEBFLOW_AUTH_CODE_URL}?client_id=${process.env.REACT_APP_WEBFLOW_CLIENT_ID}&response_type=code`)
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {isLoading && <div className="flex items-center justify-center min-h-screen p-5  min-w-screen">
        <div className="flex space-x-2 animate-pulse">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        </div>
      </div>}
      {!isLogin && <button type="button" onClick={login} className="py-3 m-4 w-fit px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Login</button>}
      {isLogin && !authenticateFlow?.isWebFlowAuthenticate && <button type="button" onClick={navigateToWebFlowAuth} className="py-3  w-fit m-4 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Authorize With Webflow</button>}
      {isLogin && authenticateFlow?.isWebFlowAuthenticate  && !authenticateFlow?.isSaleforceAuthenticate && <button type="button" onClick={navigateSaleforceAuth} className="py-3 px-4  w-fit m-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Authorize With Saleforce</button>}
    
    </main>
  )
}