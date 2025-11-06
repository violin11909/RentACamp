import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaList } from "react-icons/fa6";


function Header() {
    const { user, Logout } = useAuth();
    const nav = useNavigate();
    const buttonClass = "flex items-center space-x-2 text-gray-700 hover:text-red-600 transition duration-200 cursor-pointer"

    return (
        <header className="bg-white shadow-md py-4 ">
            <div className="mx-auto flex justify-between items-center px-6">
                <Link to={user ? '/homepage' : '/'} className="text-2xl font-bold text-blue-700 hover:text-blue-900 transition duration-200">
                    RentACamp
                </Link>

                <ul className="flex items-center space-x-6">

                    {user ? (
                        <>
                            <li>
                                <button onClick={() => nav('/booklistpage')} className={buttonClass}                          >
                                    <FaList />
                                    <span>{user.role == "admin" ? "Booking List" : "My Booking"}</span>
                                </button>
                            </li>
                            
                            <li>
                                <button onClick={()=>{Logout(), nav('/')}} className={buttonClass}                              >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </li>

                        </>

                    ) : (
                        <>
                            <li>
                                <Link to='/login' className={buttonClass}                                  >
                                    <FaSignInAlt />
                                    <span>Login</span>
                                </Link>
                            </li>
                            <li>
                                <Link to='/signin' className={buttonClass}                                  >
                                    <FaUser />
                                    <span>Sign in</span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
}

export default Header;