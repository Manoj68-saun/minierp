import {Row} from 'antd';
import classes from '../Pages.module.css';
import DataField from './DataField';
import ItemSizeEdit from './ItemSizeEdit';

const ItemSize = (props) => {
    return(
        !props.editMode
        ?
        props.data.map((data, index) => {
            return(
                <div key = {index}>
                    <p></p>
                    <Row className = {props.editMode ? classes['RowDEX'] : classes['RowD']}>
                     
                        <DataField editMode = {false} lg = {12} md = {24}  options = {props.ad.SIZE_CODE} type = "Select" name = "SIZE DETAILS" value = {data.size_code}/>             

                    </Row>  
                    <p></p>
                </div>
            );
        })
           
        :
        <>
            <p></p>
            <ItemSizeEdit options = {props.ad.SIZE_CODE} data = {props.data} setData = {props.setData} />
        </>
    );
}

export default ItemSize;