export const fetchApi = async (obj:{url: string, method: string, body: {},header:{}}) => {
    try {
        let options:any = {
            method: obj.method,
            headers:{...obj.header}, 
        }
        if(obj.body){
            options = {...options, body :JSON.stringify(obj.body)}
        }
        const response = await fetch(obj.url,{...options})
        return await response.json();
    } catch (error) {
        
    }
}