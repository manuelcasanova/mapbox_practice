import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';
import '../../styles/Login.css'

// import axios from '../api/axios';
import axios from 'axios';
const BACKEND = process.env.REACT_APP_API_URL;

const LOGIN_URL = `${BACKEND}/auth`;

const Login = ({ rideApp }) => {
    const BACKEND = process.env.REACT_APP_API_URL;
    // console.log("rideApp", rideApp)
    const { setAuth } = useAuth();
    
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/rides/public";

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
                    ,
                     timeout: 7000 // Timeout after 7 seconds
                }
            );
            //  console.log("response in Login", response)
            //    console.log("response data in Login", response.data)
            const accessToken = response?.data?.accessToken;
            const userId = response?.data?.id;
            const username = response?.data?.username
            const isAdmin = response?.data?.isAdmin
            const isSuperAdmin = response?.data?.isSuperAdmin
            const profilePicture = response?.data?.profile_picture
      
            // const roles = response?.data?.roles;

            // console.log("Login js user id", userId)

            setAuth({
                userId,
                username,
                email,
                // roles, 
                accessToken,
                isAdmin,
                isSuperAdmin,
                profilePicture
            });
            resetUser();
            // resetEmail();
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
                      // No response received, reload the component
            //to reload if no response
                    //   window.location.reload(); 
                      //to navigate to / if no response
                      navigate('/');
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
<div className='section-classname'>
        <section >
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

{/* <div>
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
</div> */}


                <label htmlFor="email">Email:</label>
                <input
                className='login-input'
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
                     className='login-input'
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button className='login-button'>Sign In</button>
                <div className="persistCheck">
                    <input
                         className='login-input'
                        type="checkbox"
                        id="persist"
                        onChange={toggleCheck}
                        checked={check}
                    />
                    <label className="login-trust" htmlFor="persist">Trust This Device</label>
                </div>
            </form>
            <div className='login-questions'>
                Need an Account?<br />
               
                    <Link to="/register">Sign Up</Link>
               
            </div>
            <div className='login-questions'>
                Forgot password?<br />
               
                    <Link to="/resetpassword">Reset</Link>
               
            </div>
        </section>
        </div>

    )
}

export default Login
