import {Row} from 'antd';
import classes from '../Pages.module.css';
import DataField from './DataField';
import AccountDetailsEdit from './AccountDetailsEdit';

const AccountDetails = (props) => {
    return(
        !props.editMode
        ?
        props.data.map((data, index) => {
            return(
                <div key = {index}>
                    <p></p>
                    <Row className = {props.editMode ? classes['RowDEX'] : classes['RowD']}>
                     
                        <DataField editMode = {false} lg = {12} md = {24}  options = {props.ad.ACCOUNT_CODE} type = "Select" name = "ACCOUNT DETAILS" value = {data.account_code}/>             

                    </Row>  
                    <p></p>
                </div>
            );
        })
           
        :
        <>
            <p></p>
            <AccountDetailsEdit options = {props.ad.ACCOUNT_CODE} data = {props.data} setData = {props.setData} />
        </>
    );
}

export default AccountDetails;