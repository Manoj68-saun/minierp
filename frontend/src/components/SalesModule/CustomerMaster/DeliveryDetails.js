import {Row} from 'antd';
import classes from '../Pages.module.css';
import DataField from './DataField';
import DeliveryDetailsEdit from './DeliveryDetailsEdit';

const DeliveryDetails = (props) => {
    return(
        !props.editMode
        ?
        props.data.map((data, index) => {
            return(
                <div key = {index}>
                    <p></p>
                    <Row className = {props.editMode ? classes['RowDEX'] : classes['RowD']}>
                        <DataField editMode = {false} lg = {12} md = {24} name = "NAME" id="name" value = {data.name}/> 
                        <DataField editMode = {false} lg = {12} md = {24} options = {props.ad.CITY_CODE} type = "Select" id="city_code" name = "CITY" value = {data.city_code}/> 
                        <DataField editMode = {false} lg = {12} md = {24} name = "ADDRESS" id="address" value = {data.add_1}/> 
                        <DataField editMode = {false} lg = {12} md = {24} name = "PIN CODE" id="pincode" value = {data.pin}/> 
                        <DataField editMode = {false} lg = {8} md = {24} options = {props.ad.LOCALITY_CODE} type = "Select" id="locality" name = "LOCALITY" value = {data.locality_code}/> 
                        <DataField editMode = {false} lg = {8} md = {24} name = "GST NUMBER" id="gst_number" value = {data.gst_number}/> 
                            
                    </Row>  
                    <p></p>
                </div>
            );
        })
           
        :
        <>
            <p></p>
            <DeliveryDetailsEdit cityOptions = {props.ad.CITY} localityOptions = {props.ad.LOCALITY_CODE}  data = {props.data} setData = {props.setData} />
        </>
    );
}

export default DeliveryDetails;