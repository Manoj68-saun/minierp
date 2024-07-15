import {Row} from 'antd';
import classes from '../Pages.module.css';
import DataField from './DataField';
import GradeDetailsEdit from './GradeDetailsEdit';

const GradeDetails = (props) => {
    return(
        !props.editMode
        ?
        props.data.map((data, index) => {
            return(
                <div key = {index}>
                    <p></p>
                    <Row className = {props.editMode ? classes['RowDEX'] : classes['RowD']}>
                       
                        <DataField editMode = {false} lg = {12} md = {24}  options = {props.ad.QUALITY_CODE} type = "Select" name = "GARDE DETAILS" value = {data.quality_code}/>             

                    </Row>  
                    <p></p>
                </div>
            );
        })
           
        :
        <>
            <p></p>
            <GradeDetailsEdit options = {props.ad.QUALITY_CODE} data = {props.data} setData = {props.setData} />
        </>
    );
}

export default GradeDetails;