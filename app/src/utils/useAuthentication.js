import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
// import { isCreated } from './reducers/AuthStateReducer';
// import { useSelector } from 'react-redux';
export function useAuthentication() {
  const [liveUser, setUser] = useState(undefined);

  // const userCreated = useSelector(state => state.auth.userCreated);

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      
      // console.log('auth state changed');
      
      if (user) {

        // if(userCreated){
          setUser(user);
          // setData('user', user);
          // console.log('upar' + userCreated);
        }else{
          setUser(null);
          // console.log('niche' + userCreated);
        }
        // User is signed in, see docs for a list of available properties
      //   // https://firebase.google.com/docs/reference/js/firebase.User
      // } else {
      //   // User is signed out
      //   setUser(undefined);
      // }
    });

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return { liveUser };
}