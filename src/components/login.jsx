import React, { useContext } from "react";
import { Context } from "../context/auth-context";

const Login = ({ isSignUp }) => {
  const {
    signUp,
    signIn,
    signInWithGoogle,
    email,
    password,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPass,
  } = useContext(Context);
  
  return (
    <div className="rightSide flex flex-col justify-center  bg-blue-200 rounded-lg py-8">
      <h2 className="text-3xl font-semibold text-gray-500 pb-5">
        {isSignUp ? "Login" : "Register"}
      </h2>
      <form className="form flex flex-col gap-4 px-24 ">
        {!isSignUp && (
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isSignUp && (
          <input
            type="password"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        )}
        <button
          onClick={
            isSignUp
              ? (e) => { e.preventDefault(); signIn(email, password) }
              : (e) => { e.preventDefault(); signUp(email, password) }
          }
          className=" bg-blue-500 text-white font-medium py-2 shadow-md"
        >
          {isSignUp ? "Login" : "Register"}
        </button>
      </form>
      <span className="hrLine block py-4 text-gray-700 font-medium">Or</span>
      <button onClick={signInWithGoogle} className=" mx-auto  px-20 py-2  bg-white text-blue-600 font-medium shadow-md ">
        Continue with Google
      </button>
    </div>
  );
};

export default Login;
