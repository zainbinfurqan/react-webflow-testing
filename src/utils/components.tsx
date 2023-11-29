import { componentStructureParams } from "../interfaces"

export const componentConstruction = {
    button : (params: componentStructureParams) => {
        // try {
            const classNumber = Math.floor(Math.random() * 1000000)
            params.className = params.shouldInlcudeRandomNumberToClassName ? params.className + classNumber : params.className
            const newElement = webflow.createDOM('button')
            newElement.setTextContent(params.title)
            // const style = webflow.createStyle(`button_${params.className}_${classNumber}`)
            if(params.styles.length){
                newElement.setStyles(params.styles)

            }
            if(params.attributes.length) {
                for (const {name, value} of params.attributes || []) {
                    newElement.setAttribute(name, value)
                }
            }
            // style.setProperties({
            //     ...params.styles
            // })
            return newElement
        // } catch (error) {
        //   webflow.notify({
        //         type:'Error',
        //         message: (error as Error).message
        //     })
        //     return webflow.createDOM('null')
        // }
    }
}