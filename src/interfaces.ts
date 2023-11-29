export type componentStructureParams = {
    title: string, 
    className: string,
    shouldInlcudeRandomNumberToClassName : boolean
    styles: Style[],
    attributes: {
        name:string,
        value: string
    }[]
}