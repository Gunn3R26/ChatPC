import React from "react";
import Add from "../images/addAvatar.png";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {db, auth, storage} from "../firebase"
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import {ref, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import {doc, setDoc} from "firebase/firestore"


const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // create user
      const res = await createUserWithEmailAndPassword(auth,email,password);

      // create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      try{
        // update prfile (using await to ensure it completes)
        await updateProfile(res.user,{
          displayName,
          photoURL: downloadURL,
        });

        // create user on firestore
        await setDoc(doc(db, "users", res.user.uid),{
          uid: res.user.uid,
          displayName,
          email,
          photoURL: downloadURL,
        });

        // create empty user chats on firestore
        await setDoc(doc(db, "userChats", res.user.uid), {});
        navigate("/Login");
      }catch(err){
        console.log(err);
        setErr(true);
        setLoading(false);
      }
    }catch(err){
      setErr(true);
      setLoading(false);
      console.log(err);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">ChatPC</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
