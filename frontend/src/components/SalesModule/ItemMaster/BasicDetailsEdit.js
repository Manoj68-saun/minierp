// import {Row, Col, Form, Input, Space, Button, Select} from 'antd';
// import classes from '../Pages.module.css';
// import { MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons';

// const { Option } = Select;

// const BasicDetailsEdit = (props) => {

//     const handleValueChanges = (changedValues, allValues) => {
//         props.setData(data => {
//             return({
//                 ...data,
//                 itemSize: allValues.itemSize
//             })
//         })
//     }

//     return(
//         <Form layout="vertical" name="filter_form" onValuesChange = {handleValueChanges} autoComplete="off">
//             <Form.List name="itemSize" initialValue = {props.data}>
//                 {(fields, { add, remove }) => { 
                    
//                     return(
//                     <>
//                         {fields.map(({ key, name, fieldKey, ...restField}) => (
//                         // <Space key={key} className = {classes['Space']} align="center">
//                             <Row key={key} gutter = {16}>
//                                 <p></p>
//                                 <Col lg = {8} md = {24}>
//                                 <Form.Item
//                                     {...restField}
//                                     name={[name, 'EXTERNAL_ENTITY_GROUP_NAME']}
//                                     fieldKey={[fieldKey, 'EXTERNAL_ENTITY_GROUP_NAME']}
//                                     label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>DEALER GROUP</div>}
//                                     rules={[{ required: true, message: 'Missing Name' }]}
//                                 >
//                                     <Input
//                                         style={{ width: "100%" , float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
//                                         bordered = {false}
//                                         placeholder="Enter Name"
//                                     />
//                                 </Form.Item>
//                             </Col>
//                                 <Col lg = {12} md = {24}>
//                                     <Form.Item
//                                         {...restField}
//                                         name={[name, 'SIZE_CODE']}
//                                         fieldKey={[fieldKey, 'SIZE_CODE']}
//                                         label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>SIZE DETAILS</div>}
//                                         rules={[{ required: true, message: 'Missing City' }]}
//                                     >
//                                         <Select
//                                             showSearch
//                                             bordered = {false}
//                                             dropdownStyle = {{textTransform: "capitalize"}}
//                                             style={{ width: "100%" , textAlign: "left", backgroundColor : "white",  textTransform: "capitalize", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}
//                                             placeholder="Search to Select"
//                                             optionFilterProp="children"
//                                             filterOption={(input, option) =>
//                                             option.children >= 0
//                                             }
//                                             filterSort={(optionA, optionB) =>
//                                             optionA.children
//                                             }
//                                         >
                                            
//                                             {
//                                                 props.options.rows.map((option) => {
//                                                     return(
//                                                         <Option style = {{textTransform: "capitalize", color: "#1777C4"}} key = {option[props.options.fields[0].name]} value={option[props.options.fields[0].name]}>{option[props.options.fields[1].name]}</Option>
//                                                     );
//                                                 })
//                                             }
//                                         </Select>
//                                     </Form.Item>
//                                 </Col>
                                
                            
//                                 <Col lg = {21} md = {0}>
                                    
//                                 </Col>
                              
//                             </Row>                                                     
//                         // </Space>
//                         ))}
                       
//                     </>
//                 )}}
//             </Form.List>
//         </Form>
//     )
// }

// export default BasicDetailsEdit;