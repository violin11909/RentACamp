import { createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import { getMe, login } from '../service/userService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const token = Cookies.get("token");
    const { data: user, isLoading: isUserLoading, } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const res = await getMe();
            return res.success ? res.data : null;
        },
        enabled: !!token,

        // (Optional แนะนำ) ป้องกันการยิง API รัวๆ
        refetchOnWindowFocus: false,
        retry: 1,
    });

    const Login = async (email, password) => {
        const res = await login(email, password);
        if (res.success) {
            Cookies.set('token', res.token, { expires: 7, secure: true, sameSite: 'strict' });
            const me = await getMe();
            queryClient.setQueryData(['user'], me.data);
            return true;
        }
        alert('Login Failed')
        return false;
    };

    const Logout = () => {
        Cookies.remove("token");
        queryClient.setQueryData(['user'], null);
    };
    const value = { user, Login, Logout, isUserLoading};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};