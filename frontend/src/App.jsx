import { Outlet, useNavigate } from "react-router-dom";
import Header from './Components/Header';
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";

function App() {
  const { user, isUserLoading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (isUserLoading) return; 
    if (!user) nav('/');

  }, [user, isUserLoading]);

  return (
    <>
      {/* <MyGoogleMap></MyGoogleMap> */}
      <Outlet />
    </>
  )
}

export default App
