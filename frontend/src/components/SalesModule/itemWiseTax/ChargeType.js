//import {Row} from 'antd';
import { Row, Col, Form, Input, Space, Button, DatePicker, Select, InputNumber } from 'antd';
import classes from '../Pages.module.css';
import DataField from './DataField';
//import BoonkigSizeEdit from './BookingSizeEdit';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import TaxNew from './TaxNew';
//import { useState, useEffect, useContext} from 'react';
const { Option } = Select


const ChargeType = (props) => {
   
    
   



      
    
    
    
    
        const handleValueChanges = (changedValues, allValues) => {
    
            props.setData(data => {
                return ({
                    ...data,
                    taxDet: allValues.taxDet
                  
                })
               
            }
            )
            console.log( allValues.taxDet)
        }
        return (
            props.editMode
            ?
            <Form layout="vertical" name="filter_form" onValuesChange={handleValueChanges}  autoComplete="off">
                <Form.List name="taxDet" initialValue={props.data}>
                    {(fields, { add, remove }) => {
    
                        return (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Space key={key} className={classes['Space']} align="center">
                                        <Row gutter={16}>
                                            <p></p>
                                            <Col lg={8} md={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'charge_code']}
                                                    fieldKey={[fieldKey, 'charge_code']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>CHARGE NAME</div>}
                                                    rules={[{ required: true, message: 'Missing Name' }]}
                                                >
                                                    <Select
                                                        bordered={false}
                                                        style={{ width: "100%", textAlign: "left", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        placeholder="Select"
                                                        optionFilterProp="children"
    
    
                                                    >
                                                        {
                                                            props.ad.CHARGE_CODE.rows.map((option) => {
                                                                return (
                                                                    <Option style={{ textTransform: "capitalize", color: "#1777C4" }} key={option[props.ad.CHARGE_CODE.fields[0].name]} value={option[props.ad.CHARGE_CODE.fields[0].name]}>{option[props.ad.CHARGE_CODE.fields[1].name]}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'charge_value']}
    
                                                    fieldKey={[fieldKey, 'charge_value']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>CHARGE VALUE</div>}
                                                    rules={[
                                                        // {
                                                        //     required: true,
                                                        //     message: 'Field should not be blank!!'
                                                        // },
                                                        // {
                                                        //     type: 'number',
                                                        //     message: "please enter only numeric value"
                                                        // },
    
                                                    ]}
                                                >
                                                    <Input
                                                        style={{ width: "100%", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        bordered={false}
                                                        placeholder="Enter Tax Value"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'charge_type']}
                                                    fieldKey={[fieldKey, 'charge_type']}
    
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>CHARGE TYPE</div>}
                                                    rules={[{ required: true, message: 'Missing Name' }]}
                                                >
                                                    <Select
                                                        bordered={false}
                                                        style={{ width: "100%", textAlign: "left", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        placeholder="Select"
                                                        optionFilterProp="children"
    
                                                    >
                                                        {
                                                            props.ad.CHARGE_TYPE
                                                            .rows.map((option) => {
                                                                return (
                                                                    <Option style={{ textTransform: "capitalize", color: "#1777C4" }} key={option[props.ad.CHARGE_TYPE.fields[0].name]} value={option[props.ad.CHARGE_TYPE.fields[0].name]}>{option[props.ad.CHARGE_TYPE.fields[1].name]}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'charge_type_on']}
                                                    fieldKey={[fieldKey, 'charge_type_on']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>ON QTY/AMOUNT </div>}
                                                    rules={[{ required: true, message: 'Missing Name' }]}
                                                >
                                                    <Select
                                                        bordered={false}
                                                        style={{ width: "100%", textAlign: "left", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        placeholder="Select"
                                                        optionFilterProp="children"
    
                                                    >
                                                        {
                                                            props.ad.CHARGE_TYPE_ON
                                                            .rows.map((option) => {
                                                                return (
                                                                    <Option style={{ textTransform: "capitalize", color: "#1777C4" }} key={option[props.ad.CHARGE_TYPE_ON.fields[0].name]} value={option[props.ad.CHARGE_TYPE_ON.fields[0].name]}>{option[props.ad.CHARGE_TYPE_ON.fields[1].name]}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
    
                                            <Col lg={6} md={12}>
                                                <Form.Item
                                                    {...restField}
                                                    
                                                    name={[name, 'ref_charge']}
                                                    fieldKey={[fieldKey, 'ref_charge']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>REFFRED CHARGE</div>}
                                                    rules={[{ required: true, message: 'Missing Name' }]}
                                    
    
                                                >
                                                    <Select
                                                        bordered={false}
                                                        style={{ width: "100%", textAlign: "left", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        placeholder="Select"
                                                        optionFilterProp="children"
                                                    >
                                                        {
                                                            props.ad.REF_CHARGE.rows.map((option) => {
                                                                return (
                                                                    <Option style={{ textTransform: "capitalize", color: "#1777C4" }} key={option[props.ad.REF_CHARGE.fields[0].name]} value={option[props.ad.REF_CHARGE.fields[0].name]}>{option[props.ad.REF_CHARGE.fields[1].name]}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
    
    
                                            <Col lg={6} md={12}>
                                                <Form.Item
    
    
                                                    {...restField}
    
                                                    name={[name, 'ref_on']}
                                                    fieldKey={[fieldKey, 'ref_on']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}> ON RUNNING/AMOUNT</div>}
                                                    rules={[{ required: true, message: 'Missing Name' }]}
                                                >
                                                    <Select   
    
                                                        bordered={false}
                                                        style={{ width: "100%", textAlign: "left", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        placeholder="Select"
                                                        optionFilterProp="children"
                                                    >
                                                        {
                                                            props.ad.REF_ON
                                                            .rows.map((option) => {
                                                                return (
                                                                    <Option style={{ textTransform: "capitalize", color: "#1777C4" }} key={option[props.ad.REF_ON.fields[0].name]} value={option[props.ad.REF_ON.fields[0].name]}>{option[props.ad.REF_ON.fields[1].name]}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            
                                            <Col lg={8} md={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'use_for']}
                                                    fieldKey={[fieldKey, 'use_for']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>USED FOR</div>}
                                                    rules={[{ required: true, message: 'Missing Name' }]}
                                                >
                                                    <Select
                                                        bordered={false}
                                                        style={{ width: "100%", textAlign: "left", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        placeholder="Select"
                                                        optionFilterProp="children"
    
                                                    >
                                                        {
                                                            props.ad.USE_FOR
                                                            .rows.map((option) => {
                                                                return (
                                                                    <Option style={{ textTransform: "capitalize", color: "#1777C4" }} key={option[props.ad.USE_FOR.fields[0].name]} value={option[props.ad.USE_FOR.fields[0].name]}>{option[props.ad.USE_FOR.fields[1].name]}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'deal_type']}
                                                    fieldKey={[fieldKey, 'deal_type']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>DEAL TYPE</div>}
                                                    rules={[{ required: true, message: 'Missing Name' }]}
                                                >
                                                    <Select
                                                        bordered={false}
                                                        style={{ width: "100%", textAlign: "left", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        placeholder="Select"
                                                        optionFilterProp="children"
    
                                                    >
                                                        {
                                                            props.ad.DEAL_TYPE
                                                            .rows.map((option) => {
                                                                return (
                                                                    <Option style={{ textTransform: "capitalize", color: "#1777C4" }} key={option[props.ad.DEAL_TYPE.fields[0].name]} value={option[props.ad.DEAL_TYPE.fields[0].name]}>{option[props.ad.DEAL_TYPE.fields[1].name]}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            
                                            <Col lg={8} md={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'include_cost']}
                                                    fieldKey={[fieldKey, 'include_cost']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>INCLUDE IN COST</div>}
                                                    rules={[{ required: true, message: 'Missing Name' }]}
                                                >
                                                    <Select
                                                        bordered={false}
                                                        style={{ width: "100%", textAlign: "left", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        placeholder="Select"
                                                        optionFilterProp="children"
    
                                                    >
                                                        {
                                                            props.ad.INCLUDE_COST
                                                            .rows.map((option) => {
                                                                return (
                                                                    <Option style={{ textTransform: "capitalize", color: "#1777C4" }} key={option[props.ad.INCLUDE_COST.fields[0].name]} value={option[props.ad.INCLUDE_COST.fields[0].name]}>{option[props.ad.INCLUDE_COST.fields[1].name]}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
       
        
    
                                            
    
    
    
                                            <Col lg={21} md={0}>
    
                                            </Col>
                                            <Col lg={1} md={24}>
                                                <MinusCircleOutlined className={classes['Remove']} onClick={() => { remove(name) }} />
                                            </Col>
                                            <Col lg={1} md={24}>
                                                <PlusCircleOutlined className={classes['Add']} onClick={() => { add() }} />
                                            </Col>
                                            <Col lg={1} md={24}>
    
                                            </Col>
                                            <Col lg={24} md={24}>
                                                <hr></hr>
                                            </Col>
                                        </Row>
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" className={classes['DashedButton']} onClick={() => { add() }}>
                                        Add Booking
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }}
                </Form.List>
            </Form>
        
    
        :
        <>
            {

    
        props.data.map((data, index) => {
             
           
            return(
                <div key = {index}>
                    <p></p>
                    <Row className = {props.editMode ? classes['RowDEX'] : classes['RowD']}>
                        <DataField editMode = {false} lg = {12} md = {24} options = {props.ad.CHARGE_CODE} type = "Select" name = "CHARGE NAME" value = {data.charge_code}/>
                        <DataField editMode = {false} lg = {12} md = {24} name = "CHARGE VALUE" value = {data.igst}/> 
                        <DataField editMode = {false} lg = {12} md = {24} options = {props.ad.CHARGE_TYPE} type = "Select" name = "CHARGE TYPE" value = {data.charge_type}/> 
                        <DataField editMode = {false} lg = {12} md = {24} options = {props.ad.CHARGE_TYPE_ON} type = "Select" name = "ON" value = {data.charge_type_on}/>  
                        <DataField editMode = {false} lg = {8} md = {24}  options = {props.ad.REF_CHARGE} type = "Select"  name = "REFFRED CHARGE" value = {data.ref_charge}   />
                        <DataField editMode = {false} lg = {8} md = {24} options = {props.ad.REF_ON} type = "Select" name = "ON" value = {data.ref_on}/> 
                        <DataField editMode = {false} lg = {8} md = {24} options = {props.ad.USE_FOR} type = "Select" name = "USED FOR" value = {data.use_for}/> 
                        <DataField editMode = {false} lg = {8} md = {24} options = {props.ad.DEAL_TYPE} type = "Select" name = "DEAL TYPE" value = {data.deal_type}/> 
                        <DataField editMode = {false} lg = {8} md = {24} options = {props.ad.INCLUDE_COST} type = "Select" name = "INCLUDE IN COST" value = {data.include_cost}/> 
                                        
            </Row>
                    <p></p>
                </div>
               
            );
           
        })
    }
    
        </>
    )
}

export default ChargeType;