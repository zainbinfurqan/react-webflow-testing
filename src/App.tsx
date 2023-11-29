import React from 'react';
import logo from './logo.svg';
import './App.css';
import { componentConstruction } from './utils/components';


const styles =[{
  name: 'btn-01',
  properties: {
    'background-color': 'red',
    'padding-top': '2rem',
    'padding-bottom': '2rem',
    'padding-left': '2rem',
    'padding-right': '2rem',
    'color':'white'
  }
},
// {
//   name: 'is-active',
//   properties: {
//     'background-color': 'green',
//   }
// }
]

const attributes =[
  {
    name: 'type',
    value: 'button'
  }
]

function App() {

  const handleClick = async () => {
    const selectedElement = await webflow.getSelectedElement()
    if(!selectedElement) {
      await webflow.notify({
        type:'Error',
        message:'Please select an element'
      })
      return;
    }
    if(!selectedElement?.children){
      await webflow.notify({
        type:'Error',
        message:'the selected element cannot have childrens'
      })
      return;
    }
    const children = selectedElement.getChildren()

//-------------------start different styles for single element-------------------//
    const elmStyles = await Promise.all(
      (styles || []).map(async ({name,properties}) => {
        let style = await webflow.getStyleByName(name);
        console.log("style",style)
        if(!style) {
          style = webflow.createStyle(name);
          console.log("style",style)
          style.setProperties(properties)
        }
        return style
      })
    )
//-------------------end different styles for single element-------------------//
    


//----------------------------adding children----------------------------//
    selectedElement.setChildren([...children, 
      componentConstruction.button({
        title:'click me new one',
        className:'btn-01', 
        shouldInlcudeRandomNumberToClassName:false,
        styles: elmStyles,
        attributes
      })
      ]);
    await selectedElement.save()
  }

  return (
    <div className="App">
     <button onClick={handleClick}>Click me</button>
    </div>
  );
}

export default App;
