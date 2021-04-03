import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser] = useState({
    isSignedIn : false,
    name : '',
    email : '',
    photo : ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  const signInClick = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const credential = res.credential;
      const token = credential.accessToken;
      const {displayName,email,photoURL} = res.user;
      const userSignIn = {
        isSignedIn : true,
        name : displayName,
        email : email,
        photo : photoURL
      }
      setUser(userSignIn);
    }).catch(err => {
      console.log(err.message);
    })
  }

  const signOutClick = () => {
    firebase.auth().signOut()
    .then(res => {
      const userSignOut = {
        isSignedIn : false,
        name : '',
        email : '',
        password : '',
        photo : ''
      }
      setUser(userSignOut);
    }).catch(err => {
      console.log(err.message);
    })
  }

  return (
    <div className="App">
      {
        user.isSignedIn 
        ?  <button onClick={signOutClick}>Sign Out</button>
        : <button onClick={signInClick}>Sign In</button> 
      }
      {
        user.isSignedIn && <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
    </div>
  );
}

export default App;
