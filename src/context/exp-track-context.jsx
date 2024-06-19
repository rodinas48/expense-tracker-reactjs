import React, { createContext, useContext, useEffect, useState } from "react";
import { Context } from "./auth-context";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase-config";
export const ExpContext = createContext();
const ExpenseProvider = (props) => {
  const { setAlertMsg, userData,setLoading } = useContext(Context);
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("expense");
  const [transaction, setTransaction] = useState([]);
  const [total, setTotal] = useState({
    balance: 0.0,
    income: 0.0,
    expenses: 0.0,
  });

  const transactionCollecRef = collection(db, "transactions");

  const handleAddTransaction = async () => {
    setAlertMsg("");
    if (desc === "" || price === "" || type === "") {
      setAlertMsg("Please fill out all fields");
      return;
    }
    if (isNaN(Number(price))) {
      setAlertMsg("please enter a number");
      return;
    }
    if (type === "expense" && price > total.balance) {
      setAlertMsg("Insufficient balance for this expense");
      return;
    }
setLoading(true); 
    try {
      await addDoc(transactionCollecRef, {
        userID: userData.uid,
        transDesc: desc,
        transPrice: Number(price),
        transcType: type,
        createdAt: serverTimestamp(),
      });

      setDesc("");
      setPrice("");
      setType("expense");
      getTransactions();
    } catch (error) {
      setAlertMsg("Failed to add transaction. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const getTransactions = async () => {
    if (userData) {
      setLoading(true); 
      try {
        const queryTranscations = query(
          transactionCollecRef,
          where("userID", "==", userData.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(queryTranscations);
        const transactionsArray = [];
        let totalIncome = 0;
        let totalExpenses = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const docID = doc.id;
          transactionsArray.push({ ...data, docID });
          if (data.transcType === "expense") {
            totalExpenses += Number(data.transPrice);
          } else {
            totalIncome += Number(data.transPrice);
          }
        });
        setTransaction(transactionsArray);
        let balance = totalIncome - totalExpenses;
        setTotal({
          balance,
          totalIncome,
          totalExpenses,
        });
      } catch (error) {
        setAlertMsg(error.message);
      } finally {
        setLoading(false); 
      }
    }
  };
  const deleteTransc = async (transId) => {
    setLoading(true); 
    try {
          const docRef = doc(db, "transactions", transId);
      await deleteDoc(docRef);
      getTransactions();
    } catch (error) {
      setAlertMsg("Failed to delete transaction. Please try again later");
    } finally {
      setLoading(false); 
    }
  };
  useEffect(() => {
    getTransactions();
  }, [userData]);
  const contextValue = {
    handleAddTransaction,
    transaction,
    deleteTransc,
    total,
    desc,
    price,
    type,
    setDesc,
    setPrice,
    setType,
    getTransactions,
    
  };
  return (
    <ExpContext.Provider value={contextValue}>
      {props.children}
    </ExpContext.Provider>
  );
};

export default ExpenseProvider;
