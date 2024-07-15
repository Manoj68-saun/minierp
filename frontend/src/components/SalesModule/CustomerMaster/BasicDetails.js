import {Row} from 'antd';
import classes from '../Pages.module.css';
import DataField from './DataField';

const BasicDetails = (props) => {

    const handleChange = (e,param) => {

        props.setData(data => {
            const newdata = [...data['customerMaster']]
            newdata[0][param] = e.target.value
            return({
                ...data,
                customerMaster : newdata
            })
        })
    }

    const handleSChange = (val,param) => {

        props.setData(data => {
            const newdata = [...data['customerMaster']]
            newdata[0][param] = val
            return({
                ...data,
                customerMaster : newdata
            })
        })
    }
    const handleDChange = (date, dateString, param) => {

        props.setData(data => {
            const newdata = [...data['customerMaster']]
            newdata[0][param] = dateString
            return({
                ...data,
                customerMaster : newdata
            })
        })
    }



    return(
        
        <div>
            <p></p>
            <Row className = {props.editMode ? classes['RowDEX'] : classes['RowD']}>
                { !props.create && <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "CUSTOMER CODE" param = "distributor_code" value = {props.data.distributor_code}/> }
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "CUSTOMER NAME" id="customer_name" param = "distributor_name" required="True" value = {props.data.distributor_name}/> 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange}  options = {props.ad.ACC_GROUP_CODE} type = "Select" id="debitor_group" name = "DEBITOR GROUP" param = "acc_group_code" value = {props.data.acc_group_code}/>  
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange}  options = {props.ad.EXT_ENTITY_TYPE_CODE } type = "Select" id="customer_type" required="True" name = "CUSTOMER TYPE" param = "ext_entity_type_code" value = {props.data.ext_entity_type_code}/> 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "ADDRESS" id="address" param = "address" required="True" value = {props.data.address}/>  
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange} options = {props.ad.CITY} type = "Select" id="city" name = "CITY" param = "city" required="True" value = {props.data.city}/>  
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange} options = {props.ad.LOCALITY_CODE} type = "Select" id="locality" name = "LOCALITY" param = "locality_code" required="True" value ={props.data.locality_code}/>  
                {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "HSN NO" param = "hsn" value = {props.data.hsn}/>  */}
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "PIN" param = "pin_no" id="pin_no" required="True" value = {props.data.pin_no} numberVal={props.onlyNumber}/> 
                 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "GST NO" id="s_tax_no" param = "s_tax_no" value = {props.data.s_tax_no}/> 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "PAN NO" id="pan_no" param = "pan_no" value = {props.data.pan_no}/>  
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "PAYMENT DAYS" id="payment_days" param = "payment_days" value = {props.data.payment_days}/> 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "INTEREST RATE(MO)" id="monthly_intrest" param = "monthly_intrest" value = {props.data.monthly_intrest}/> 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "INTEREST RATE(YEAR)" id="yearly_intrest" param = "yearly_intrest" value = {props.data.yearly_intrest}/> 
                
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "ECC NO" param = "ecc_no" id="ecc_no" value = {props.data.ecc_no}/> 
                
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "CST NUMBER" id="cst_number" param = "cst_no" value = {props.data.cst_no}/> 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "ACCOUNT CODE" param = "account_code" id="account_code" value = {props.data.account_code}/> 
            </Row>
            
            
        </div>
    );
}

export default BasicDetails