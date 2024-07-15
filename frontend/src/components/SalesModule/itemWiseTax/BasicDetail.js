import {Row} from 'antd';
import classes from '../Pages.module.css';
import DataField from './DataField';

const BasicDetails = (props) => {

    const handleChange = (e,param) => {

        props.setData(data => {
            const newdata = [...data['itemTax']]
            newdata[0][param] = e.target.value
          //  console.log(newdata)
            return({
                
                ...data,
                itemTax : newdata
            })
        })
    }

    const handleSChange = (val,param) => {

        props.setData(data => {
            const newdata = [...data['itemTax']]
           
            newdata[0][param] = val
            return({
                ...data,
                itemTax : newdata
            })
           
        })
        
    }
    const handleDChange = (date, dateString, param) => {

        props.setData(data => {
            const newdata = [...data['itemTax']]
            newdata[0][param] = dateString
            return({
                ...data,
                itemTax : newdata
            })
        })
    }



    return(
        
        <div>
            <p></p>
            <Row className = {props.editMode ? classes['RowDEX'] : classes['RowD']}>
                { !props.create && <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "TAX CODE" param = "tax_code" value = {props.data.tax_code}/> }
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange}  options = {props.ad.HSN} type = "Select" name = "HSN CODE" param = "hsn" value = {props.data.hsn}/>
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleDChange} name = "NORM DATE" type="Date" param = "norm_date" value = {props.data.norm_date}/>    
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange}  options = {props.ad.HSN_STATUS} type = "Select" name = "HSN STATUS" param = "hsn_status" value = {props.data.hsn_status}/> 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleDChange} name = "FROM DATE" type="Date" param = "f_date" value = {props.data.f_date}/> 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleDChange} name = "TO DATE" type="Date" param = "t_date" value = {props.data.t_date}/>              
            </Row>
            
            
        </div>
    );
}

export default BasicDetails