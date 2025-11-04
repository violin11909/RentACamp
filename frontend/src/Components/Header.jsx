import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import {useSelector, useDispatch} from "react-redux";
import { useAuth } from "../contexts/AuthContext";

function Header() {
    const { user,Logout } = useAuth();
    const location = useLocation();
    const path = location.pathname; 

    if(path=="/") return;

    return (       
        <header className="bg-white shadow-md py-4">
            <div className="containter mx-auto flex justify-between items-center px-6">
                <Link
                    to={user ? '/homepage' : '/'}
                    className="text-2xl font-bold text-blue-700 hover:text-blue-900 transition duration-200"
                >
                    Booking Camp
                </Link>

                <ul className="flex items-center space-x-6">
                    {user ? (
                        <li>
                            <button
                                onClick={Logout}
                                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition duration-200 cursor-pointer"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to='/login'
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200"
                                >
                                    <FaSignInAlt />Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/signin'
                                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    <FaUser />Sign in
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