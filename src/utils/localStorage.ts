export const localStorage = {
    getItem: (key:string)=>{
        return JSON.parse(window.localStorage.getItem(key) || "{}")
    },
    setitem: (key:string,data:any)=>{
        window.localStorage.setItem(key,JSON.stringify(data))
    },
}