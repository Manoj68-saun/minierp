import landingLogo from '../../assets/landingLogo.png'
import classes from './LandingPage.module.css';
import { Link } from 'react-router-dom';

const landingPage = (props) => {
  // console.log(props,"landingPage")
    return (
      
        <div className = {classes["LandDiv"]} >
          <img className  = {classes["LandLogo"]} src={landingLogo} alt="Logo" />
          
          <h1 className =  {classes["LandH2"]} >Keep Tracking, Better Winning</h1>
          <p 
            className =  {classes["LandP"]} 
            style = {{color: "#1F3247"}}
          >
            Online platform to manage and generate dynamic reports
          </p>
          <div  className = {classes["LandButton"]}>
            <Link to = "/signIn">
              <button onClick = {props.setType("employee")} className = {classes['Create']}>Sign In</button>
            </Link>
          </div>
          <p></p>
          {/* <p 
            className = {classes["LandP"]} 
            style = {{color: "#1777C4"}} 
          >
            New to O2C? 
            <Link to = "/signup" style = {{textDecoration: "underline"}}>
              <strong>Sign Up</strong>
            </Link>
          </p> */}
        </div>
      );
};

export default (landingPage);