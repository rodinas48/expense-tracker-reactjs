import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import Cookies from "js-cookie";
import { auth, db } from "../config/firebase-config";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

export const Context = createContext();
const AuthContextProvider = (props) => {
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  // usestates
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedData = JSON.parse(userCookie);
      setUserData(parsedData);
      navigate("/expenseTracker");
    }
  }, [navigate]);

  const signUp = async (email, password) => {
    setAlertMsg("");
    setLoading(true);
    try {
      if (
        username !== "" &&
        email !== "" &&
        password !== "" &&
        confirmPass !== ""
      ) {
        if (password === confirmPass) {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await updateProfile(userCredential.user, { displayName: username });
          setUserData(userCredential.user);
          Cookies.set("user", JSON.stringify(userCredential.user), {
            expires: 7,
          });
          navigate("/expenseTracker");
          setIsSuccess(true);
          setAlertMsg("Account Created Successfully !");
        } else {
          setAlertMsg("Confirm password does not match password");
        }
      } else {
        setAlertMsg("Please fill out all fields");
      }
    } catch (error) {
      setAlertMsg(`${error.message}!`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setAlertMsg("");
    setLoading(true);
    try {
      if (email !== "" || password !== "") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUserData(userCredential.user);
        Cookies.set("user", JSON.stringify(userCredential.user), {
          expires: 7,
        });
        navigate("/expenseTracker");
        setIsSuccess(true);
        setAlertMsg("Account Logged in successfully !");
      } else {
        setAlertMsg("Please fill out all fields");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      if (error.code === "auth/invalid-credential") {
        setAlertMsg("Invalid Email or Password");
      } else {
        setAlertMsg("sign in Failed ! please try again later");
      }
    } finally {
      setLoading(false);
    }
  };
  const signInWithGoogle = async () => {
    setAlertMsg("");
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      setUserData(userCredential.user);
      Cookies.set("user", JSON.stringify(userCredential.user), { expires: 7 });
      navigate("/expenseTracker");
      setIsSuccess(true);
      setAlertMsg("Account Signed in successfully !");
    } catch (error) {
      setAlertMsg("Sign in with Google Failed ! please try again later");
    } finally {
      setLoading(false);
    }
  };
  const logOut = async () => {
    setAlertMsg("");
    try {
      await signOut(auth);
      setUserData(null);
      Cookies.remove("user");
      navigate("/");
      setIsSuccess(true);
      setAlertMsg("Account Logged out successfully !");
    } catch (error) {
      setAlertMsg("Signout failed please try again!");
    }
  };

  const handleDeleteUser = async () => {
    const user = auth.currentUser;
    console.log(user);

    if (user) {
      setLoading(true);
      const batch = writeBatch(db);
      try {
        const transactionCollecRef = collection(db, "transactions");
        const q = query(transactionCollecRef, where("userID", "==", user.uid));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        await deleteUser(user);
        Cookies.remove("user");
        navigate("/");
        setIsSuccess(true);
        setAlertMsg("Account deleted successfully !");
      } catch (error) {
        setAlertMsg("Error deleting user:", error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const contextValue = {
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
    username,
    email,
    password,
    confirmPass,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPass,
    setAlertMsg,
    alertMsg,
    userData,
    setLoading,
    loading,
    isSuccess,
    setIsSuccess,
    handleDeleteUser,
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default AuthContextProvider;
