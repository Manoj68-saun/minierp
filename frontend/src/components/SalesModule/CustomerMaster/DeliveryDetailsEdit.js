import {Row, Col, Form, Input, Space, Button, DatePicker, Select,InputNumber} from 'antd';
import classes from '../Pages.module.css';
import { MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons';

const {Option} = Select

const DependentEdit = (props) => {

    const handleValueChanges = (changedValues, allValues) => {
        props.setData(data => {
            return({
                ...data,
                deliveryDetails: allValues.deliveryDetails
            })
        })
    }

    return(
        <Form layout="vertical" name="filter_form" onValuesChange = {handleValueChanges} autoComplete="off">
            <Form.List name="deliveryDetails" initialValue = {props.data}>
                {(fields, { add, remove }) => { 
                    
                    return(
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField}) => (
                        <Space key={key} className = {classes['Space']} align="center">
                            <Row gutter = {16}>
                                <p></p>
                                <Col lg = {8} md = {24}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        fieldKey={[fieldKey, 'name']}
                                        label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>NAME</div>}
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
                                        name={[name, 'city_code']}
                                        fieldKey={[fieldKey, 'city_code']}
                                        label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>CITY</div>}
                                        rules={[{ required: true, message: 'Field should not be blank!!'}]}

                                    >
                                        <Select
                                            bordered = {false}
                                            style={{ width: "100%" , textAlign: "left", float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                                            placeholder="Select"
                                            optionFilterProp="children"
                                        >
                                            {
                                                props.cityOptions.rows.map((option) => {
                                                    return(
                                                        <Option style = {{textTransform: "capitalize", color: "#1777C4"}} key = {option[props.cityOptions.fields[0].name]} value={option[props.cityOptions.fields[0].name]}>{option[props.cityOptions.fields[1].name]}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col lg = {8} md = {24}>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'add_1']}
                                    fieldKey={[fieldKey, 'add_1']}
                                    label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>ADDRESS</div>}
                                    rules={[{ required: true, message: 'Field should not be blank!!' }]}
                                >
                                    <Input
                                        style={{ width: "100%" , float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                                        bordered = {false}
                                        placeholder="Enter Address"
                                    />
                                </Form.Item>
                            </Col>
                            <Col lg = {8} md = {24}>
                            <Form.Item
                                {...restField}
                                name={[name, 'pin']}
                                fieldKey={[fieldKey, 'pin']}
                                label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>PIN NUMBER</div>}
                                rules=
                                {[
                                    { 
                                        required: true, 
                                        message: 'Field should not be blank!!'
                                    },
                                    { 
                                     
                                      
                                        message:'Pin No can be numeric 0 to 9'



                                       
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" , float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                                    bordered = {false}
                                    placeholder="Enter Pin Number"
                                />
                            </Form.Item>
                        </Col>
                              
                              
                                <Col lg = {8} md = {24}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'locality_code']}
                                        fieldKey={[fieldKey, 'locality_code']}
                                        label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>LOCALITY</div>}
                                        rules=
                                        {[
                                            { 
                                                required: true, 
                                                message: 'Field should not be blank!!' 
                                            },
                                        
                                        ]}
                                    >
                                        <Select
                                            bordered = {false}
                                            style={{ width: "100%" , textAlign: "left", float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                                            placeholder="Select"
                                            optionFilterProp="children"
                                        >
                                            {
                                                props.localityOptions.rows.map((option) => {
                                                    return(
                                                        <Option style = {{textTransform: "capitalize", color: "#1777C4"}} key = {option[props.localityOptions.fields[0].name]} value={option[props.localityOptions.fields[0].name]}>{option[props.localityOptions.fields[1].name]}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col lg = {8} md = {24}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'gst_number']}
                                        fieldKey={[fieldKey, 'gst_number']}
                                        label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>GST NUMBER</div>}
                                        rules=
                                        {[
                                            { 
                                                required: true, 
                                                message: 'Field should not be blank!!'
                                            },
                                            { 
                                                type: 'number',
                                                message:'should be combination of numbers and alphabets' 
                                                
                                            },
                                        ]}
                                    >
                                        <Input
                                            style={{ width: "100%" , float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                                            bordered = {false}
                                            placeholder="Enter GST Number"
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
                                Add Delivery 
                            </Button>
                        </Form.Item>
                    </>
                )}}
            </Form.List>
        </Form>
    )
}

export default (DependentEdit)