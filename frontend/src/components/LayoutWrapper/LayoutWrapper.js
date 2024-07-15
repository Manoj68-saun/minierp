import React from 'react';
import classes from './LayoutWrapper.module.css';

const layout = (props) => {

return (     
    <React.Fragment > 
        <header style = {{position : "absolute", top : "0", width: "100vw"}}>
            
        </header>
        <main className = {classes['Main']}>
            {props.children}
        </main >
        {/* <footer style = {{position : "absolute", bottom : "0"}}>
            <p style = {{fontSize : "10px", color : "#1F3247"}} >Copyright © 2010-2020 <br /> Term and conditions   |   Privacy Policy </p>
        </footer> */}
    </React.Fragment>
)
};

export default (layout);
