//import {Row} from 'antd';
import { Row, Col, Form, Input, Space, Button, DatePicker, Select, InputNumber } from 'antd';
import classes from '../Pages.module.css';
import DataField from './DataField';
//import BoonkigSizeEdit from './BookingSizeEdit';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
// import TaxNew from './TaxNew';
//import { useState, useEffect, useContext} from 'react';
const { Option } = Select


const VDetailPart = (props) => {
console.log(props)

//     const handleChangee = (changedValues, allValues) => {
    
//         props.setData(data => {
//             console.log("ytu");
//             console.log(data)

// if (data.VoucherDetail[0].entry_type ==='C' && data.VoucherDetail[0].amount !==null){
// console.log("hello");
// console.log(data.VoucherDetail[0].entry_type)
// }
// else if (data.VoucherDetail[0].entry_type ==='D' && data.VoucherDetail[0].amount !==null){
//     console.log("manoj");
//     console.log(data.VoucherDetail[0].entry_type)
// }
// // else if (data.VoucherDetail[1].entry_type ==='C'){
// //     console.log("ooooo");
// //     console.log(data.VoucherDetail[1].entry_type)
// // }
// // else if (data.VoucherDetail[1].entry_type ==='D'){
// //     console.log("manoj");
// //     console.log(data.VoucherDetail[1].entry_type)
// // }

//             // for(var i=0; i<data.VoucherDetail.length; i++){
//         //    if(data.VoucherDetail[i].entry_type =='C'){
//         //    var sumcr = 0;
//         //    for(var i=0; i<data.VoucherDetail.length; i++){
//         //    sumcr+= parseInt(data.VoucherDetail[i].amount)
//         //    }
//         //    console.log("sumcr" ,sumcr)
//         // }
//         // else if(data.VoucherDetail[i].entry_type =='D'){
//         //     var sumdr = 0;
//         //     for(var i=0; i<data.VoucherDetail.length; i++){
//         //     sumdr+= parseInt(data.VoucherDetail[i].amount)
//         //     }
//         //     console.log("sumdr" ,sumdr)
//         //  }
        
//     // }
//                       //  console.log("after loop" ,sumcr)
//         //    var sum = 0;
//         //         for(var i=0; i<data.VoucherDetail.length; i++){
//         //      sum+= parseInt(data.VoucherDetail[i].amount)
        
//        // }
//           //  console.log(sum)
//             return ({
//                 ...data,
//              //   bookingSize: allValues.bookingSize
//             })  
//         })
//     }
         
        const handleValueChanges = (changedValues, allValues) => {
    
            props.setData(data => {
                // console.log(data)
                // if (data.VoucherDetail[0].entry_type =='C'){
                //     console.log(data.VoucherDetail[0].amount)
                // }
                // else if (data.VoucherDetail[0].entry_type =='D'){
                //     console.log(data.VoucherDetail[0].amount)
                // }
                // else  if (data.VoucherDetail[1].entry_type =='C'){
                //     console.log(data.VoucherDetail[1].amount)
                // }
                // else if (data.VoucherDetail[1].entry_type =='D'){
                //     console.log(data.VoucherDetail[1].amount)
                // }
                return ({
                    ...data,
                    VoucherDetail: allValues.VoucherDetail
                  
                })
              // console.log(data)
            }
            )
            console.log( allValues.VoucherDetail)
        }
        return (
            props.editMode
            ?
            <Form layout="vertical" name="filter_form" onValuesChange={handleValueChanges}  autoComplete="off">
                <Form.List name="VoucherDetail" initialValue={props.data}>
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
                                                    name={[name, 'entry_type']}
                                                    fieldKey={[fieldKey, 'entry_type']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>ENTITY TYPE</div>}
                                                    rules={[{ required: true, message: 'Missing Name' }]}
                                                >
                                                    <Select  
                                                        bordered={false}
                                                        style={{ width: "100%", textAlign: "left", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        placeholder="Select"
                                                        optionFilterProp="children"
    
    
                                                    >
                                                        {
                                                            props.ad.ENTRY_TYPE.rows.map((option) => {
                                                                return (
                                                                    <Option style={{ textTransform: "capitalize", color: "#1777C4" }} key={option[props.ad.ENTRY_TYPE.fields[0].name]} value={option[props.ad.ENTRY_TYPE.fields[0].name]}>{option[props.ad.ENTRY_TYPE.fields[1].name]}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                           
                                           
                                            <Col lg={8} md={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'account_code']}
                                                    fieldKey={[fieldKey, 'account_code']}
    
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>ACCOUNT</div>}
                                                    rules={[{ required: true, message: 'Missing Name' }]}
                                                >
                                                    <Select
                                                        bordered={false}
                                                        style={{ width: "100%", textAlign: "left", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        placeholder="Select"
                                                        optionFilterProp="children"
    
                                                    >
                                                        {
                                                            props.ad.ACCOUNT_CODEH
                                                            .rows.map((option) => {
                                                                return (
                                                                    <Option style={{ textTransform: "capitalize", color: "#1777C4" }} key={option[props.ad.ACCOUNT_CODEH.fields[0].name]} value={option[props.ad.ACCOUNT_CODEH.fields[0].name]}>{option[props.ad.ACCOUNT_CODEH.fields[1].name]}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'amount']}
    
                                                    fieldKey={[fieldKey, 'amount']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>AMOUNT</div>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Field should not be blank!!'
                                                        },
                                                        {
                                                            type: 'number',
                                                            message: "please enter only numeric value"
                                                        },
    
                                                    ]}
                                                >
                                                    <Input  
                                                        style={{ width: "100%", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        bordered={false}
                                                        placeholder="Enter Amount"
                                                    />
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
                                        Add New Row
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
                        <DataField editMode = {false} lg = {12} md = {24} options = {props.ad.ENTRY_TYPE} type = "Select" name = "ENTITY TYPE" value = {data.entry_type}/>
          
                        <DataField editMode = {false} lg = {12} md = {24} options = {props.ad.ACCOUNT_CODE} type = "Select" name = "CHARGE TYPE" value = {data.charge_type}/> 
                        <DataField editMode = {false} lg = {8} md = {24} name = "AMOUNT" value = {data.amount}/>
                                        
            </Row>
                    <p></p>
                </div>
               
            );
           
        })
    }
    
        </>
    )
}

export default VDetailPart;