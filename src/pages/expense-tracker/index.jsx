import React, { Fragment, useContext,useEffect,useState } from "react";
import { Context } from "../../context/auth-context";
import defaultImg from "../../assets/user-profile.jpg";
import { ExpContext } from "../../context/exp-track-context";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faCaretDown, faCaretUp, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import TemporaryAlert from "../../components/TemporaryAlertMsg";
import { formatDistanceToNow } from "date-fns";
import Loader from "../../components/loader";

const ExspenseTracker = () => {
  const { logOut, userData, loading, handleDeleteUser } = useContext(Context);
  const {
    total,
    deleteTransc,
    handleAddTransaction,
    desc,
    price,
    transaction,
    setDesc,
    setPrice,
    setType,
  } = useContext(ExpContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const displayName = userData?.displayName ?? "Username";
  const [userPhotoUrl, setUserPhotoUrl] = useState(defaultImg);
  useEffect(() => {
    if (userData) {
      if (userData.photoURL) {;
        setUserPhotoUrl(userData.photoURL);
      } else {
        setUserPhotoUrl(defaultImg)
      }
    }
  },[userData])
  const formatElapsedTime = (timestamp) => {
    if (timestamp) {
      // get the time of transaction
      const date = timestamp.toDate();
      //get time now
      const now = new Date();
      // calculated a one day in milliSeconds
      const oneDayInMs = 24 * 60 * 60 * 1000;
      // compare if date of transaction less than a one day
      if (now - date < oneDayInMs) {
        return formatDistanceToNow(timestamp.toDate(), {
          addSuffix: true,
        });
      } else {
        const date = timestamp.toDate();
        return date.toLocaleString();
      }
    }
  };
  return (
    <div className="expense-tracker-container">
      {loading ? <Loader /> : null}
      <div className="container mx-auto h-screen ">
        <div className="header w-full px-10 py-3   rounded flex justify-between items-center  bg-white  shadow-sm ">
          <h2 className="font-bold capitalize text-blue-900 text-lg">
            {displayName}'s Expense Tracker
          </h2>
          <div className="flex items-center flex-row gap-2">
            <img
              src={userPhotoUrl}
              alt="userPhoto"
              className=" w-11 rounded-full"
            />
            <button onClick={toggleMenu}>
              {isMenuOpen ? (
                <FontAwesomeIcon icon={faCaretUp} />
              ) : (
                <FontAwesomeIcon icon={faCaretDown} />
              )}
            </button>
            <div className={`btns top-20 right-12  ${isMenuOpen?'flex':'hidden'} gap-2 rounded`}>
              {" "}
              <button
                className="bg-blue-200 hover:bg-blue-300 transition-colors h-10 px-3 rounded-md font-medium"
                onClick={logOut}
              >
                Logout
              </button>
              <button
                className="bg-blue-400 text-white hover:bg-blue-500 transition-colors h-10 px-3 rounded-md font-medium"
                onClick={handleDeleteUser}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
        <div className="userExpenseTrackerInfo  flex flex-col lg:flex-wrap xl:flex-row w-full items-center text-left my-4">
          <div className="balance flex  w-full lg:w-6/12  xl:w-5/12 justify-around items-center bg-blue-200 p-5 me-2 rounded drop-shadow-sm">
            <span className="font-semibold">Your Balance :</span> $
            {total.balance}
            <p className="income w-fit p-3 bg-white rounded shadow-lg">
              <span className="font-semibold">Income :</span> $
              {total.totalIncome}
            </p>
            <p className="expense p-3 w-fit bg-white rounded shadow-lg">
              <span className="font-semibold">Expenses :</span> $
              {total.totalExpenses}
            </p>
          </div>
          <div className="addTrans lg:w-1/2 my-4 flex flex-col md:flex-row items-center justify-center rounded ">
            <div className="flex flex-col gap-2 w-fit">
              <input
                type="text"
                className=" bg-blue-200 shadow-sm"
                name="desc"
                value={desc}
                placeholder="Description"
                onChange={(e) => setDesc(e.target.value)}
              />
              <input
                type="text"
                className=" bg-blue-200 shadow-sm"
                name="price"
                value={price}
                placeholder="Price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className=" inline-flex items-center gap-2 m-4">
              <input
                type="radio"
                name="type"
                id="type1"
                onChange={() => setType("expense")}
              />
              <label htmlFor="type1">Expense</label>
              <input
                type="radio"
                name="type"
                id="type2"
                onChange={() => setType("income")}
              />
              <label htmlFor="type2">Income</label>
            </div>
            <button
              onClick={() => handleAddTransaction()}
              className="bg-blue-200 hover:bg-blue-300 transition-colors text-md px-3 py-1 h-fit rounded shadow-sm"
            >
              Add Transaction
            </button>
          </div>
        </div>
        <h2 className="text-blue-900 capitalize font-bold text-xl my-5 mx-2 text-left">
          Transactions
        </h2>
        <div className="transactions grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 p-5 shadow-sm rounded">
          {!loading && 
            transaction.map((trans) => {
              return (
                <Fragment key={trans.docID}>
                  <div className="capitalize m-auto border-slate-500 border-b-4 hover:border-blue-300 hover:border-2 bg-white shadow-md rounded-lg p-4 w-48 text-left ">
                    <div className="w-100 mb-2 flex justify-between items-center">
                      <p className=" text-xs  text-slate-500">
                        {formatElapsedTime(trans.createdAt)}
                      </p>
                      <FontAwesomeIcon
                        onClick={() => deleteTransc(trans.docID)}
                        icon={faTrashCan}
                        className=" text-red-700 cursor-pointer hover:text-red-900"
                      />
                    </div>
                    <h2 className="font-semibold">{trans.transDesc}</h2>
                    <h3 className=" text-slate-600">${trans.transPrice}</h3>
                    <p
                      className={`font-medium ${
                        trans.transcType === "expense"
                          ? "text-red-600"
                          : "text-green-700"
                      }`}
                    >
                      {trans.transcType}
                    </p>
                  </div>
                </Fragment>
              );
            })}
        </div>
        <TemporaryAlert />
      </div>
    </div>
  );
};

export default ExspenseTracker;
