import {Row} from 'antd';
import classes from '../Pages.module.css';
import DataField from './DataField';
import VendorDetailsEdit from './VendorDetailsEdit';

const VendorDetails = (props) => {
    return(
        !props.editMode
        ?
        props.data.map((data, index) => {
            return(
                <div key = {index}>
                    <p></p>
                    <Row className = {props.editMode ? classes['RowDEX'] : classes['RowD']}>
                     
                        <DataField editMode = {false} lg = {8} md = {24}  options = {props.ad.DISTRIBUTOR_CODE} type = "Select" name = "CUSTOMER/VENDOR" value = {data.distributor_code}/>             

                    </Row>  
                    <p></p>
                </div>
            );
        })
           
        :
        <>
            <p></p>
            <VendorDetailsEdit options = {props.ad.DISTRIBUTOR_CODE} data = {props.data} setData = {props.setData} />
        </>
    );
}

export default VendorDetails;