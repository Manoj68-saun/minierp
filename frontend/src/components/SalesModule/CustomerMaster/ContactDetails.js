import {Row} from 'antd';
import classes from '../Pages.module.css';
import DataField from './DataField';
import ContactDetailsEdit from './ContactDetailsEdit';

const ContactDetails= (props) => {
    console.log(props)//  editMode='True'
    console.log(!props.editMode)  // False
    
    return(
        !props.editMode
        ?
        props.data.map((data, index) => {
            return(
                <div key = {index}>
                    <p></p>
                    <Row className = {props.editMode ? classes['RowDEX'] : classes['RowD']}>
                        <DataField editMode = {false} lg = {12} md = {24} name = "CONTACT PERSON" id="contact_person" value = {data.contact_person}/> 
                        <DataField editMode = {false} lg = {12} md = {24} name = "CONTACT NUMBER" id="contact_number" value = {data.contact_no}/> 
                        <DataField editMode = {false} lg = {12} md = {24} name = "EMAIL_ID" id="email_id" value = {data.email_id}/> 
                        <DataField editMode = {false} lg = {12} md = {24} name = "DEPARTMENT" id="department" value = {data.department}/>              
                    </Row>  
                    <p></p>
                </div>
            );
        })
           
        :
        <>
            <p></p>
            <ContactDetailsEdit data = {props.data} setData = {props.setData} />
        </>
    );
}

export default ContactDetails;