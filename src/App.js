import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import ExspenseTracker from "./pages/expense-tracker";
import AuthContextProvider from "./context/auth-context";
import ExpenseProvider from "./context/exp-track-context";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthContextProvider>
          <ExpenseProvider>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/expenseTracker" element={<ExspenseTracker />} />
            </Routes>
          </ExpenseProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
