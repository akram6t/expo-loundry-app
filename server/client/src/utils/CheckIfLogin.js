import axios from "axios";
import { URL_CHECK_IF_LOGIN, HEADER_API } from "./Constant";

const CheckToken = async (fullToken) => {
     try {
        const response = await axios.post(URL_CHECK_IF_LOGIN,
        {
            authToken: fullToken
        }, 
        HEADER_API);
  
        if (response.status === 200) {
          const {status, isLogined, message} = response.data;
          if(status){
            if(isLogined){
                return true
            }
          }
        } else {
          console.error('Error check token: ', response.statusText);
        }
      } catch (error) {
        console.error('Error check auth token: ', error);
      }

      return false;

     
}

export default CheckToken;