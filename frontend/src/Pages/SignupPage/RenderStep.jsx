const inputClass =
  "rounded-lg text-md text-black border border-gray-600 p-2 w-full focus:border-teal-400 focus:border-2 outline-none";

const RenderStep = ({
  step,
  setStep,
  password,
  setPassword,
  email,
  setEmail,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  phone,
  setPhone,
  next,
  submitSignUp,
}) => {
  switch (step) {
    case 1:
      return (
        <div className="flex flex-col items-center justify-center w-full gap-3">
          <input
            type="text"
            placeholder="Email"
            value={email}
            className={inputClass}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className={inputClass}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            className={inputClass}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />

          <button
            className="rounded-lg font-bold py-3 w-full bg-blue-400 hover:bg-blue-500 text-white text-md cursor-pointer"
            onClick={next}
          >
            Next
          </button>
        </div>
      );

    case 2:
      return (
        <div className="flex flex-col items-center justify-center w-full gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            className={inputClass}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            className={inputClass}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
          <button
            className="py-3 w-full bg-blue-400 hover:bg-blue-500 text-white text-md cursor-pointer"
            onClick={submitSignUp}
          >
            Sign up
          </button>
        </div>
      );
  }
};

export default RenderStep;
