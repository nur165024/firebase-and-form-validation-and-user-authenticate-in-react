import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user,setUser] = useState({
    isSignedIn : false,
    name : '',
    email : '',
    password : '',
    photo : '',
    error : '',
    success : false,
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  // firebase signin
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
      // console.log(err.message);
    })
  }
  
  // firebase signout
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
      // console.log(err.message);
    })
  }

  // input field validation
  const inputFieldBlur = (e) => {
    let fieldValidation = true;
    if (e.target.name === 'email') {
      const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      fieldValidation = pattern.test(e.target.value);
    }

    if (e.target.name === 'password') {
      const userPasswordLength = e.target.value.length > 6;
      const userPasswordRx = /^[A-Za-z]\w{7,}$/.test(e.target.value);
      fieldValidation = userPasswordLength && userPasswordRx;
    }

    let userInfo = {...user};
    if (fieldValidation) { 
      userInfo[e.target.name] = e.target.value;
      setUser(userInfo);
    }
  }

  // firebase form submit
  const formSubmitUser = (e) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user}
        newUserInfo.error = ''     
        newUserInfo.success = true        
        setUser(newUserInfo)
      })
      .catch(err => {
        const newUserInfo = {...user}
        newUserInfo.error = err.message;        
        newUserInfo.success = '';        
        setUser(newUserInfo);
      });
    }

    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const logInUser = {...user}
        logInUser.error = ''
        logInUser.success = true     
        setUser(logInUser)
      })
      .catch(err => {
        const logInUser = {...user}
        logInUser.error = err.message;
        logInUser.success = ''; 
        setUser(logInUser);
      });
    }
    e.preventDefault();
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
      <br/>
      <h3>Create new User</h3>
      <span style={{color:'red'}}>{user.error}</span>
      {
        user.success && <span style={{color:'green'}}>User {newUser ? 'Created' : 'Logged In'} Successfully!</span>
      }
      <br/>
      <form onSubmit={formSubmitUser}>
        <input type="checkbox" onChange={() => setNewUser(!newUser)} /> Create new User
        <br/>
        {newUser && <input required onBlur={inputFieldBlur} type="text" name="name" placeholder="Enter your Name" />}
        <br/>
        <input required onBlur={inputFieldBlur} type="text" name="email" placeholder="Enter your Email address" />
        <br/>
        <input required onBlur={inputFieldBlur} type="password" name="password" placeholder="Enter your password" />
        <br/>
        <br/>
        {
          !newUser 
          ? <input type="submit" value="Logged In"/>
          : <input type="submit" value="Signup"/>
        }
        
      </form>
    </div>
  );
}

export default App;
