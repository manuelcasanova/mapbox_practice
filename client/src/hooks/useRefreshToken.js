import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            // console.log("prev en useRefreshToken", JSON.stringify(prev));
            //   console.log("response.data in useRefreshToken", response.data)
            //  console.log(response.data.accessToken);
            const { accessToken, user } = response.data;
            return {
                ...prev,
                // roles: response.data.roles,
                accessToken: response.data.accessToken,
                email: response.data.user.email,
                isactive: response.data.user.isactive,
                isadmin: response.data.user.isadmin,
                issuperadmin: response.data.user.issuperadmin,
                isselected: response.data.user.isselected,
                profilePicture: response.data.user.profile_picture,
                username: response.data.user.username
            }
        });
        // return response.data.accessToken;
        return response.data
    }
    return refresh;
};

export default useRefreshToken;
