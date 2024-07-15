import {Row} from 'antd';
import classes from '../Pages.module.css';
import DataField from './DataField';

const BasicDetails = (props) => {

    const handleChange = (e,param) => {

        props.setData(data => {
            const newdata = [...data['VoucherHeader']]
            newdata[0][param] = e.target.value
            return({
                ...data,
                VoucherHeader : newdata
            })
        })
    }

    const handleSChange = (val,param) => {

        props.setData(data => {
            const newdata = [...data['VoucherHeader']]
            newdata[0][param] = val
            return({
                ...data,
                VoucherHeader : newdata
            })
        })
    }

    const handleDChange = (date, dateString, param) => {

        props.setData(data => {
            const newdata = [...data['VoucherHeader']]
            newdata[0][param] = dateString
            return({
                ...data,
                VoucherHeader : newdata
            })
        })
    }



    return(
        <div>
            <p></p>
            <Row className = {props.editMode ? classes['RowDEX'] : classes['RowD']}>
                { !props.create && <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "VOUCHER CODE" param = "voucher_code" value = {props.data.voucher_code}/> }
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange}  options = {props.ad.VOUCHER_TYPE} type = "Select" name = "Voucher Type" param = "voucher_type" value = {props.data.voucher_type}/>  
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleDChange} name = "VOUCHER DATE" type="Date" param = "voucher_date" value = {props.data.voucher_date}/> 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "REF VOUCHER NO" param = "ref_voucher_code" value = {props.data.ref_voucher_code}/>  
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange}  options = {props.ad.ACCOUNT_CODEH} type = "Select" name = "Account" param = "account_codeh" value = {props.data.account_codeh}/>  
              {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange}  options = {props.ad.ACCOUNT_CODE} type = "Select" name = "Account" param = "account_code" value = {props.data.account_code}/>  */}                 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleDChange} name = "CHEQUE DATE" type="Date" param = "cheque_date" value = {props.data.cheque_date}/>    
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "CHEQUE NO" param = "cheque_no" value = {props.data.cheque_no}/> 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "CREDIT"  param = "cr" value = {props.data.cr}/> 
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "DEBIT"  param = "dr" value = {props.data.dr}/> 
                
                {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange} options = {props.ad.ITEM_HOME_YN} type = "Select" name = "PRIORITY" param = "ITEM_HOME_YN" value = {props.data.item_home_yn}/>           */}
            </Row>
            
            
        </div>
    );
}

export default BasicDetails;
