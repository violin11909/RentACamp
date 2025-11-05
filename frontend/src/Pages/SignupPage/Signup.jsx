import { useState } from "react";
import { register } from "../../service/userService";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import RenderStep from "./RenderStep";


const Signup = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const onBack = () => {
    navigate("/");
  };

  const next = () => {
    if (checkSignUpInfo()) {
      setStep(2);
    }
  };

  const submitSignUp = async () => {
    if (checkSignUpInfo()) {
      const newUser = {
        name,
        email,
        password,
        tel: phone
      };

      try {
        const res = await register(newUser);
        if (res.success) {
          alert("Success");
          navigate('/');
        } else {
          alert(res.message || "Registration failed");
        }
      } catch(err) {
        console.log(err);
        alert("Error while registering user");
      }
    }
  };

  const checkSignUpInfo = () => {
    if (step == 1) {
      if (!email || !password || !confirmPassword) {
        alert("Please fill up the information!");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return false;
      }

      if (password.length < 6) {
        alert("Password cannot be less than 6 characters");
        return false;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
      }
      return true;
    } else if (step == 2) {
      if (!name || !phone) {
        alert("Please fill all information");
        return false;
      }
      if (phone.length < 10) {
        alert("Please fill a valid phone number");
        return false;
      }
      return true;
    }
    return false;
  };

  return (
    <div className="h-screen w-screen bg-gray-200 justify-center flex items-center">
      <img
        src="https://iili.io/Kg9FG3v.md.jpg"
        alt="bg-login"
        className="w-screen h-screen object-cover"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity backdrop-blur-xs">
        <div className="h-100 aspect-square rounded-lg flex flex-col items-center justify-center bg-white gap-3 p-20 relative">
          <div
            className="w-15 aspect-square rounded-full top-5 left-5 absolute flex justify-center items-center hover:bg-gray-300 cursor-pointer"
            onClick={onBack}
          >
            <FaArrowLeft size={30} />
          </div>

          <h1 className="font-bold text-3xl mb-3 relative text-center">Sign up to "RentACamp"</h1>
          <RenderStep
            step={step}
            email={email}
            setEmail={setEmail}
            setStep={setStep}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            next={next}
            submitSignUp={submitSignUp}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
