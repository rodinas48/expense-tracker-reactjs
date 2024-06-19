import React, { useState } from "react";
import "./style.css";
import Login from "../../components/login";
import TemporaryAlert from "../../components/TemporaryAlertMsg";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  return (
    <div className="container mx-auto h-screen flex flex-col lg:flex-row justify-center items-center">
      <div
        className={`leftSide ${
          isSignUp ? "signUpImg" : "signInImg"
        } p-10 mt-10 lg:mt-0 flex flex-col gap-4`}
      >
        <h2 className=" text-gray-800 text-4xl font-bold">
          {isSignUp ? "Register" : "Login"}
        </h2>
        <p className=" text-gray-500">
          {isSignUp
            ? "Register Now and Fell the New Digital World"
            : "Already have an Account?"}
        </p>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="bg-white w-fit mx-auto border-2 border-solid border-blue-500 hover:bg-blue-500 text-blue-500 hover:text-blue-50 font-semibold transition-color duration-150 px-6 py-2 rounded-full"
        >
          {isSignUp ? " Sign Up" : "Login"}
        </button>
      </div>
      <Login isSignUp={isSignUp} />
      <TemporaryAlert />
    </div>
  );
};

export default Auth;
