export const extractCodeFromUrl =(currentFlow: string) => {

    const splitUrlForCode = window.location.href.split('?')
    if(splitUrlForCode.length > 1 &&  splitUrlForCode[1].split('=')[0] === 'code'){
        let code = splitUrlForCode[1].split('=')[1];
        if(currentFlow === 'saleforce'){
            return code.split("%")[0] + '=='
        }
        return code
    }
   
    return null
     
}