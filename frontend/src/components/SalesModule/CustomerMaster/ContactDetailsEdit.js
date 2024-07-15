import {Row, Col, Form, Input, Space, Button, Select} from 'antd';
import classes from '../Pages.module.css';
import { MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons';
import { useForm } from "react-hook-form";

const { Option } = Select;

const ContactDetailsEdit = (props) => {
  
   
    const handleValueChanges = (changedValues, allValues) => {
        props.setData(data => {
            return({
                ...data,
                contactDetails: allValues.contactDetails
            })
        })
    }



    return(
        <Form layout="vertical" name="filter_form" onValuesChange = {handleValueChanges} autoComplete="off">
            <Form.List name="contactDetails" initialValue = {props.data}>
                {(fields, { add, remove }) => { 
                    console.log(props.data)
                    console.log(fields)
                    
                    return(
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField}) => (
                        <Space key={key} className = {classes['Space']} align="center">
                            <Row gutter = {16}>
                                <p></p>
                                
                                <Col lg = {8} md = {24}>
                                    <Form.Item
                                        {...restField}
                                       
                                        name={[name, 'contact_person']}
                                        fieldKey={[fieldKey, 'contact_person']}
                                        label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>CONTACT PERSON</div>}
                                        rules={[{ required: true, message: 'Field should not be blank!!' }]}
                                    >
                                        <Input
                                            style={{ width: "100%" , float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                                            bordered = {false}
                                            placeholder="Enter Name"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col lg = {8} md = {24}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'contact_no']}
                                        fieldKey={[fieldKey, 'contact_no']}
                                        label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>CONTACT NUMBER</div>}
                                        rules={[
                                            { required: true,
                                             message: 'Field should not be blank!!'
                                            },
                                            {
                                                type: 'number',
                                                min: 10,
                                                message:"please enter minimum 10 charcter"
                                              },
                                        
                                        ]}
                                      
                                    
                                    >
                                 
                                        <Input
                                         
                                            style={{ width: "100%" , float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                                            bordered = {false}
                                            placeholder="Enter contact no"
                                            />
                                    </Form.Item>
                                </Col>
                                <Col lg = {8} md = {24}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'email_id']}
                                        fieldKey={[fieldKey, 'email_id']}
                                        label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>EMAIL ID</div>}
                                        rules= {[

                                            { required: true,
                                                message: 'Field should not be blank!!'
                                               },
                                            {
                                              required: true,
                                              type: "email",
                                              message: "The input is not valid E-mail!"
                                            }
                                          ]}
                                        >
                                      

                                        <Input
                                            style={{ width: "100%" , float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                                            bordered = {false}
                                            placeholder="Enter Email ID"
                                        />
                       
                                    </Form.Item>
                                </Col>
                                <Col lg = {8} md = {24}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'department']}
                                        fieldKey={[fieldKey, 'department']}
                                        label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>DEPARTMENT</div>}
                                        rules={[{ required: true, message: 'Field should not be blank!!' }]}
                                    >
                                        <Input
                                            style={{ width: "100%" , float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                                            bordered = {false}
                                            placeholder="Enter Department"
                                        />
                                    </Form.Item>
                                </Col>
                               
                                <Col lg = {21} md = {0}>
                                    
                                </Col>
                                <Col lg = {1} md = {24}>
                                    <MinusCircleOutlined className = {classes['Remove']} onClick={() => { remove(name) }} />
                                </Col>
                                <Col lg = {1} md = {24}>
                                    <PlusCircleOutlined className = {classes['Add']} onClick={() => {add()}} />
                                </Col>
                                <Col lg = {1} md = {24}>
                                    
                                </Col>
                                <Col lg = {24} md = {24}>
                                    <hr></hr>
                                </Col>
                            </Row>                                                     
                        </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" className = {classes['DashedButton']}onClick={() => {add()}}>
                                Add Contact Details
                            </Button>
                        </Form.Item>
                    </>
                )}}
            </Form.List>
        </Form>
    )
}

export default (ContactDetailsEdit)
