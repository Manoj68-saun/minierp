import classes from "../Pages.module.css";
//import {Row,Col, Tabs, Skeleton, message} from 'antd';
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
// import BasicDetails from './BasicDetails'
// import BookingSize from './BookingSize';
// import dayjs from 'dayjs';
// import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";

//const { TabPane } = Tabs;

const SalesVieww = (props) => {
  const employeeData = useContext(DataContext);

  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [allData, setAllData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [ad, setAD] = useState(null);

  useEffect(() => {
    setAllData(null);
    setStoreData(null);
    setAD(null);

    axios
      .get(
        employeeData.URL +
          "/api/v1/salesOrder/" +
          props.match.params.id.toString(),
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        const data = response.data;
        setTimeout(() => {
          const response = {
            file: data,
          };
          window.open(response.file);
        }, 100);
      })

      // saveAs(blob, props.name + ".pdf")
      // message.success({
      // content: 'PDF Generated Successfully!!!!',
      //     className: 'custom-class',
      //     style: {
      //         marginTop: '20vh',
      //     },
      // });
      // props.setExporting(props.index)

      .catch((err) => {
        console.log(err);
        // props.setExporting(props.index)
      });
  }, []);
};
export default SalesVieww;
