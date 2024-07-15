import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetails from "./BasicDetails";
import ContactDetails from "./ContactDetails";
import DeliveryDetails from "./DeliveryDetails";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const identifiers = ["contactDetails", "deliveryDetails"];

const CustomerNew = (props) => {
  const employeeData = useContext(DataContext);
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [allData, setAllData] = useState({
    customerMaster: [
      {
        distributor_name: null,
        address: null,
        pan_no: null,
        s_tax_no: null,
        payment_days: null,
        monthly_intrest: null,
        yearly_intrest: null,
        account_code: null,
        ecc_no: null,
        pin_no: null,
        cst_no: null,
        acc_group_code: null,
        ext_entity_type_code: null,
        city: null,
        locality_code: null,
      },
    ],

    contactDetails: [],
    deliveryDetails: [],
  });
  const [ad, setAD] = useState(null);

  useEffect(() => {
    setEditMode(true);
    setAD(null);
    setLoading(false);
    {
      /*
        axios
        .get(employeeData.URL + '/api/v1/customerm/acc-group',{
            withCredentials: true
        })
        .then((response) => {

            console.log(response);
            setAD(ad => {
                let newad = response.data.data
                return ({
                    ...newad,
                  
                });
            })
        })
        .catch((error) => {
            console.log(error);
        })

    */
    }
    axios
      .get(employeeData.URL + "/api/v1/customerm/additional-data", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setAD((ad) => {
          let newad = response.data.data;

          return {
            ...newad,
          };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSave = (event) => {
    console.log(allData);
    //  console.log(   allData.contactDetails)
    //  console.log(   allData.contactDetails[0]['contact_person'])
    //      console.log(allData.contactDetails['contact_person']);
    var formv = true;
    if (
      allData.customerMaster[0].distributor_name == null &&
      allData.customerMaster[0].ext_entity_type_code == null &&
      allData.customerMaster[0].address == null &&
      allData.customerMaster[0].city == null &&
      allData.customerMaster[0].locality_code == null &&
      allData.customerMaster[0].pin_no == null
    ) {
      // console.log("header feilds are empty");
      message.error({
        content: "Please Fill the Mandatory Fields!!!",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });

      return;
    } else if (allData.customerMaster[0].distributor_name == null) {
      // console.log("header feilds are empty");
      document.getElementById("customer_name").focus();
      // const element=document.getElementById('item_nam');
      //      element.getElementsByTagName('input')[0].focus();
      message.error({
        content: "Customer name can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.customerMaster[0].ext_entity_type_code == null) {
      // console.log("header feilds are empty");
      document.getElementById("customer_type").focus();
      // const element=document.getElementById('item_nam');
      //      element.getElementsByTagName('input')[0].focus();
      message.error({
        content: "Customer Type can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.customerMaster[0].address == null) {
      document.getElementById("address").focus();
      // const element=document.getElementById('item_nam');
      //      element.getElementsByTagName('input')[0].focus();
      message.error({
        content: "Address can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.customerMaster[0].city == null) {
      document.getElementById("city").focus();
      // const element=document.getElementById('item_nam');
      //      element.getElementsByTagName('input')[0].focus();
      message.error({
        content: "City can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.customerMaster[0].locality_code == null) {
      document.getElementById("locality").focus();
      // const element=document.getElementById('item_nam');
      //      element.getElementsByTagName('input')[0].focus();
      message.error({
        content: "Locality can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.customerMaster[0].pin_no == null) {
      document.getElementById("pin_no").focus();
      // const element=document.getElementById('item_nam');
      //      element.getElementsByTagName('input')[0].focus();
      message.error({
        content: "Pin can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.contactDetails.length == 0) {
      message.error({
        content: "Please Fill the Mandatory Fields in Contact Details Tab!!!",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.deliveryDetails.length == 0) {
      message.error({
        content: "Please Fill the Mandatory Fields in  Delivery Details tab!!!",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    }

    //     else if(allData.contactDetails.length>0){
    //     for(var i=0;i<allData.contactDetails.length;i++){

    //         if(allData.contactDetails[i]==undefined|| allData.contactDetails[i]['contact_person']==null || allData.contactDetails[i]['contact_no']==null || allData.contactDetails[i]['email_id']==null  || allData.contactDetails[i]['department']==null)

    //         var errorDetails=allData.contactDetails[i]==undefined?'Contact Person can not be null in Contact Details tab':allData.contactDetails[i]['contact_no']==null?'Contact No can not be null in Contact Details tab':allData.contactDetails[0]['email_id']==null?'Email Id can not be null in Contact Details tab':allData.contactDetails[i]['department']==null?'Department can not be null in Contact Details tab':'';
    //     }
    //         message.error({
    //             content: errorDetails,
    //             className: 'custom-class',
    //             style: {
    //                 marginTop: '1vh',
    //             },
    //         });

    //     return;
    // }

    // else if(allData.deliveryDetails.length>0){
    //     console.log(allData.deliveryDetails.length)
    //     for(var i=0;i<allData.deliveryDetails.length;i++)
    //     {
    //      if( allData.deliveryDetails[i]==undefined|| allData.deliveryDetails[i]['name']==null ||allData.deliveryDetails[i]['city_code']==null || allData.deliveryDetails[i]['add_1']==null || allData.deliveryDetails[i]['pin']==null || allData.deliveryDetails[i]['locality_code']==null || allData.deliveryDetails[i]['gst_number'])

    //     var errorDetails=allData.deliveryDetails[i]==undefined ?'name can not be null in Delivery Details Tab':allData.deliveryDetails[i]['city_code']==null?'Delivery City can not be null in Delivery Details Tab':allData.deliveryDetails[i]['add_1']==null?'Delivery Address can not be null in Delivery Details Tab':allData.deliveryDetails[i]['pin']==null?'Delivery Pin can not be null in Delivery Details Tab':allData.deliveryDetails[i]['locality_code']==null?'Locality can not be null in Delivery Details Tab':allData.deliveryDetails[i]['gst_number']==null?'Gst can not be null in Delivery Details Tab':'';
    //     }

    //         message.error({
    //             content: errorDetails,
    //             className: 'custom-class',
    //             style: {
    //                 marginTop: '1vh',
    //             },
    //         });

    //   return;
    // }

    identifiers.forEach((val) => {
      let count = 0;
      console.log(val);
      allData[val].forEach((data) => {
        console.log(allData[val]);
        console.log(data);
        if (!data) {
          formv = formv && false;
          if (count === 0) {
            message.error({
              content: "Empty Fields In " + val.toUpperCase() + " Tab!!!",
              className: "custom-class",
              style: {
                marginTop: "1vh",
              },
            });
          }

          count = count + 1;
        }
        //     //     else if(  data['contact_person']==null || data['contact_no']==null || data['email_id']==null  || data['department']==null||data['name']==null || data['city_code']==null || data['add_1']==null || data['pin']==null || data['locality_code']==null || data['gst_number'])
        //     //     {
        //     //     var errorDetails=data['contact_person']==null ?'Contact Person can not be null in Contact Details tab':data['contact_no']==null?'Contact No can not be null in Contact Details tab':data['email_id']==null?'Email Id can not be null in Contact Details tab':data['department']==null?'Department can not be null in Contact Details tab':
        //     //     data['name']==null?'name can not be null in Delivery Details Tab':data['city_code']==null?'Delivery City can not be null in Delivery Details Tab':data['add_1']==null?'Delivery Address can not be null in Delivery Details Tab':data['pin']==null?'Delivery Pin can not be null in Delivery Details Tab':data['locality_code']==null?'Locality can not be null in Delivery Details Tab':data['gst_number']==null?'Gst can not be null in Delivery Details Tab':'';
        //     //     formv = formv&&false
        //     //     {
        //     //         message.error({
        //     //             content: errorDetails,
        //     //             className: 'custom-class',
        //     //             style: {
        //     //                 marginTop: '1vh',
        //     //             },
        //     //         });
        //     //     }

        //     //   }

        //     //  if(!data|| data['name']==null || data['city_code']==null || data['add_1']==null || data['pin']==null || data['locality_code']==null || data['gst_number']){
        //     //     var errorDelivery=data==undefined? 'name can not be null in Delivery Details Tab':data['city_code']==null?'Delivery City can not be null in Delivery Details Tab':data['add_1']==null?'Delivery Address can not be null in Delivery Details Tab':data['pin']==null?'Delivery Pin can not be null in Delivery Details Tab':data['locality_code']==null?'Locality can not be null in Delivery Details Tab':data['gst_number']==null?'Gst can not be null in Delivery Details Tab':'';
        //     //     formv = formv&&false
        //     //     message.error({
        //     //         content: errorDelivery,
        //     //         className: 'custom-class',
        //     //         style: {
        //     //             marginTop: '1vh',
        //     //         },
        //     //     });
        //     //     ;
        //     // }
      });
    });

    if (formv) {
      setLoading(true);
      const postData = {
        ...allData,
        contactDetails: allData.contactDetails.map((dep) => {
          return {
            ...dep,
          };
        }),
        deliveryDetails: allData.deliveryDetails.map((dep) => {
          return {
            ...dep,
          };
        }),
      };

      console.log(postData);

      axios
        .post(employeeData.URL + "/api/v1/customerm", postData, {
          withCredentials: true,
          credentials: "include",
        })
        .then((response) => {
          if (response.data.status === "fail") {
            message.error({
              content: response.data.message,
              className: "custom-class",
              style: {
                marginTop: "2vh",
              },
            });

            setLoading(false);
          } else {
            message.success({
              content: "customer master Created Successfully!!!",
              className: "custom-class",
              style: {
                marginTop: "2vh",
              },
            });
            setLoading(false);
            history("/sales/customerMaster/customer-details");
          }
        })
        .catch((err) => {
          message.error({
            content: "An Error Occurred!!!!",
            className: "custom-class",
            style: {
              marginTop: "2vh",
            },
          });
          setLoading(false);
        });
    }
  };

  const handleCancel = (event) => {
    setLoading(false);
    history.replace("/sales/customerMaster/customer-details");
  };

  return (
    <>
      {ad ? (
        <Row className={classes["RowP"]}>
          <Col
            lg={editMode ? 13 : 19}
            md={editMode ? 13 : 19}
            className={classes["Col"]}
          ></Col>
          {editMode ? (
            <>
              <Col md={4}>
                {loading ? (
                  <SyncLoader color={"rgba(255,163,77,0.8)"} size={10} />
                ) : (
                  <button
                    style={{ backgroundColor: "#D0F0C0", color: "#234F1E" }}
                    onClick={(event) => handleSave(event)}
                    className={classes["ProfileButton"]}
                  >
                    Save
                  </button>
                )}
              </Col>
              <Col md={4}>
                {loading ? (
                  <SyncLoader color={"rgba(255,163,77,0.8)"} size={10} />
                ) : (
                  <button
                    style={{ backgroundColor: "#FC9483", color: "#640000" }}
                    onClick={(event) => handleCancel(event)}
                    className={classes["ProfileButton"]}
                  >
                    Cancel
                  </button>
                )}
              </Col>
            </>
          ) : (
            <Col md={4}>
              <button
                onClick={() => setEditMode(true)}
                className={classes["ProfileButton"]}
              >
                Edit Details
              </button>
            </Col>
          )}
          <Col lg={1} md={1}></Col>
          <Col lg={24} md={24} className={classes["Col"]}>
            <div className={classes["EditView"]}>
              <Tabs
                defaultActiveKey="0"
                centered
                style={{ height: "100%" }}
                tabPosition={"left"}
                type="line"
                tabBarGutter="0"
              >
                <TabPane tab={<span>Basic Details</span>} key="0">
                  <BasicDetails
                    create={true}
                    ad={ad}
                    setData={setAllData}
                    data={allData.customerMaster[0]}
                    editMode={editMode}
                  />
                </TabPane>
                <TabPane tab={<span>Contact Details</span>} key="1">
                  <ContactDetails
                    ad={ad}
                    setData={setAllData}
                    data={allData.contactDetails}
                    editMode={editMode}
                  />
                </TabPane>
                <TabPane tab={<span>Delivery Details</span>} key="2">
                  <DeliveryDetails
                    ad={ad}
                    setData={setAllData}
                    data={allData.deliveryDetails}
                    editMode={editMode}
                  />
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      ) : (
        <>
          <Skeleton active={true} />
          <Skeleton active={true} />
          <Skeleton active={true} />
          <Skeleton active={true} />
        </>
      )}
    </>
  );
};

export default CustomerNew;
