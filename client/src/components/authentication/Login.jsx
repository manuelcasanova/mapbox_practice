import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';

// import axios from '../api/axios';
import axios from 'axios';
const LOGIN_URL = 'http://localhost:3500/auth';

const Login = ({ rideApp }) => {
    // console.log("rideApp", rideApp)
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/rides/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser, /*userAttribs*/] = useInput('user', '')
    // const [email, resetEmail, emailAttribs] = useInput('email', '')
    const [email, setEmail] = useState('manucasanova@hotmail.com');
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
            //  console.log("response in Login", response)
               console.log("response data in Login", response.data)
            const accessToken = response?.data?.accessToken;
            const userId = response?.data?.id;
            const username = response?.data?.username
            const isAdmin = response?.data?.isAdmin
            const isSuperAdmin = response?.data?.isSuperAdmin
            // const roles = response?.data?.roles;

            // console.log("Login js user id", userId)

            setAuth({
                userId,
                username,
                email,
                // roles, 
                accessToken,
                isAdmin,
                isSuperAdmin
            });
            resetUser();
            // resetEmail();
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

<div>
    <input
        type="checkbox"
        id="manuCheckbox"
        onChange={() => setEmail('manucasanova@hotmail.com')}
        checked={email === 'manucasanova@hotmail.com'}
    />
    <label htmlFor="manuCheckbox">Manuel Superadmin</label>
</div>

<div>
    <input
        type="checkbox"
        id="lauraCheckbox"
        onChange={() => setEmail('laura@example.com')}
        checked={email === 'laura@example.com'}
    />
    <label htmlFor="lauraCheckbox">Laura Admin</label>
</div>

<div>
    <input
        type="checkbox"
        id="aliceCheckbox"
        onChange={() => setEmail('alice@example.com')}
        checked={email === 'alice@example.com'}
    />
    <label htmlFor="aliceCheckbox">Alice Wonder</label>
</div>

<div>
    <input
        type="checkbox"
        id="bobCheckbox"
        onChange={() => setEmail('bob@example.com')}
        checked={email === 'bob@example.com'}
    />
    <label htmlFor="bobCheckbox">Bob Robinson</label>
</div>

<div>
    <input
        type="checkbox"
        id="emmaCheckbox"
        onChange={() => setEmail('emma@example.com')}
        checked={email === 'emma@example.com'}
    />
    <label htmlFor="emmaCheckbox">Emma Jones</label>
</div>


                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    ref={userRef}
                    autoComplete="off"
                    // {...emailAttribs}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
