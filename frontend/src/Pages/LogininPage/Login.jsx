import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const { user, Login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const sendLogin = async () => {
    if (!email || !password) {
      alert("Please fill up the information!")
      return;
    }
    const res = await Login(email.trim(), password);
    if (res) nav("/homepage");
  }

  const gotoSignUp = () => {
    nav("/signup");
  };

  if(user) nav('/homepage');
 
  return (
    <>

      <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity backdrop-blur-xs">
        <div className="h-100 aspect-square flex flex-col items-center justify-center bg-white gap-3 p-20 rounded-lg">
          <h1 className="text-3xl mb-3 font-bold text-center">RentACamp</h1>
          <input
            type="text"
            placeholder="Email"
            value={email}
            className="rounded-lg text-md text-black border border-gray-600 p-2 w-full focus:border-teal-400 focus:border-2 outline-none"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="rounded-lg text-md text-black border border-gray-600 p-2 w-full focus:border-teal-400 focus:border-2 outline-none"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            className="font-bold rounded-lg py-3 w-full bg-blue-400 hover:bg-blue-500 text-white text-md cursor-pointer"
            onClick={sendLogin}
          >
            Login
          </button>

          <div className="text-end w-full ">
            <span
              className="cursor-pointer hover:bg-gray-300 px-2 pb-0.5 rounded-md"
              onClick={gotoSignUp}
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Login;
