import { useRef, useState, useEffect } from 'react';
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';

// import axios from '../api/axios';
import axios from 'axios';
const LOGIN_URL = 'http://localhost:3500/auth';

const Login = ({rideApp}) => {
    // console.log("rideApp", rideApp)
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/rides/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser, /*userAttribs*/] = useInput('user', '')
    const [email, resetEmail, emailAttribs] = useInput('email', '')
    let trimmedEmail = email.trim().toLowerCase();
    const [pwd, setPwd] = useState('Password1!');
    const [errMsg, setErrMsg] = useState('');
    const [check, toggleCheck] = useToggle('persist', false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // console.log("handleSubmit in Login")
            // console.log(user, pwd, trimmedEmail)
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd, trimmedEmail }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // console.log("response", response)
            //  console.log("response data", response.data)
            const accessToken = response?.data?.accessToken;
            const userId = response?.data?.userId;
            const roles = response?.data?.roles;
            
// console.log("Login js user id", userId)

            // setAuth({ userId, user, email, roles, accessToken });
            loginUser(response.data)
            resetUser();
            resetEmail();
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Username or password are wrong or missing');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (

        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <div className="level-title">Sign In</div>
            <form onSubmit={handleSubmit}>
                {/* <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    {...userAttribs}
                    required
                /> */}

<label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    ref={userRef}
                    autoComplete="off"
                    {...emailAttribs}
                    // required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
                <div className="persistCheck">
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={toggleCheck}
                        checked={check}
                    />
                    <label htmlFor="persist">Trust This Device</label>
                </div>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
            <p>
                Forgot password?<br />
                <span className="line">
                    <Link to="/resetpassword">Reset</Link>
                </span>
            </p>
        </section>

    )
}

export default Login
