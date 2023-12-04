import React, { useEffect, useState } from 'react'

export default function App() {

  const [isLogin,setIsLogin] = useState(false)
  const [isWebFlowAuthenticated,setIsWebFlowAuthenticated] = useState(false)

  useEffect(()=> {
    const isLoggedIn = window.localStorage.getItem('weblow-nextjs');
    if(isLoggedIn){
      Object.keys(isLoggedIn).length> 0 &&  setIsLogin(true)
    }
    const url_1 = window.location.href.split('?')
    console.log(url_1)
    if(url_1.length>1 &&  url_1[1].split('=')[0] === 'code'){
      const url_2 = url_1[1].split('=')[1];
    (async () => {
      await fetchAccessToken(url_2)
    })()
    }
})

  const fetchAccessToken = async (code: string) => {
    try {
      const response = await fetch('https://api.webflow.com/oauth/access_token',{
        method:'POST',
        body: JSON.stringify({
          client_id: '',
          code,
          grant_type: 'authorization_code'
        }),
        headers: {
          "Content-type": "application/json"
        }
      })
      const res = await response.json()
      console.log(res)
    } catch (error) {
      console.log({error})
    }
   
  }

  const login = async () => {
    try {
      const response = await fetch('http://localhost:3001/login',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: 'user' +  Math.floor(Math.random() * 100000),
          browserUniqeId: Math.floor(Math.random() * 100000),
        })
      })
      const res = await response.json();
      window.localStorage.setItem('weblow-nextjs', JSON.stringify({
        userId: res.newAuth.user,
        token: res.newAuth.tokens,
        browserUniqeId:res.newUser.browserUniqeId
      }))
      setIsLogin (true)
    } catch (error) {
      
    }
  }

  const navigateSaleforceAuth = () => {
    window.location.replace('https://drive-nosoftware-8736.my.salesforce.com/services/oauth2/authorize?client_id=&redirect_uri=https://926f-2404-160-8173-a298-6ce1-d19-376a-bbd.ngrok-free.app&response_type=code')
  }

  const navigateToWebFlowAuth = () => {
    window.location.replace('https://webflow.com/oauth/authorize?client_id=&response_type=code')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!isLogin && <button type="button" onClick={login} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Login</button>}
      {isLogin && <button type="button" onClick={navigateToWebFlowAuth} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Authorize With Webflow</button>}
      {<button type="button" onClick={navigateSaleforceAuth} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Authorize With Saleforce</button>}
    
    </main>
  )
}