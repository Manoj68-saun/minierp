import {Row, Col, Form, Input, Space, Button, Select} from 'antd';
import classes from '../Pages.module.css';
import { MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons';

const { Option } = Select;

const VendorDetailsEdit = (props) => {

    const handleValueChanges = (changedValues, allValues) => {
        props.setData(data => {
            return({
                ...data,
                customerDetails: allValues.customerDetails
            })
        })
    }

    return(
        <Form layout="vertical" name="filter_form" onValuesChange = {handleValueChanges} autoComplete="off">
            <Form.List name="customerDetails" initialValue = {props.data}>
                {(fields, { add, remove }) => { 
                    
                    return(
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField}) => (
                        // <Space key={key} className = {classes['Space']} align="center">
                            <Row key={key} gutter = {16}>
                                <p></p>
                                <Col lg = {8} md = {24}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'distributor_code']}
                                        fieldKey={[fieldKey, 'distributor_code']}
                                        label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>CUSTOMER/VENDOR</div>}
                                        rules={[{ required: true, message: 'Missing City' }]}
                                    >
                                        <Select
                                            bordered = {false}
                                            style={{ width: "100%" , textAlign: "left", float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                                            placeholder="Select"
                                            optionFilterProp="children"
                                        >
                                            
                                            {
                                                props.options.rows.map((option) => {
                                                    return(
                                                        <Option style = {{textTransform: "capitalize", color: "#1777C4"}} key = {option[props.options.fields[0].name]} value={option[props.options.fields[0].name]}>{option[props.options.fields[1].name]}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
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
                               
                                <Col lg = {24} md = {24}>
                                    <hr></hr>
                                </Col>
                            </Row>                                                     
                        // </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" className = {classes['DashedButton']}onClick={() => {add()}}>
                                Add Vendor
                            </Button>
                        </Form.Item>
                    </>
                )}}
            </Form.List>
        </Form>
    )
}

export default VendorDetailsEdit;