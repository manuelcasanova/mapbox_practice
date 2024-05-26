import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import '../../styles/UserEditPassword.css'

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function UserEditPassword(props) {
  const BACKEND = process.env.REACT_APP_API_URL;

  const logOut = useLogout();
  const navigate = useNavigate();
  const { user } = props;

  const passwordRef = useRef(null);
  const [showPwdNote, setShowPwdNote] = useState(false);

  useEffect(() => {
    passwordRef.current.focus();
  }, []);

  const axiosPrivate = useAxiosPrivate();

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);

  const editUser = async (e) => {
    e.preventDefault();

    try {
      const body = { id: user.userId, pwd };
      await axiosPrivate.put(`${BACKEND}/users/edit/password`, body);
      clearInput();
      logOut();
      navigate('/login');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Operation Failed');
      }
    }
  }

  const clearInput = () => {
    setPwd("");
    setMatchPwd("");
    setShowPwdNote(false)
  }

  return (
    <div className="edit-password-container">
      <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

      <div className="edit-password-input-div">
        <label htmlFor="password" className="edit-item">
          New Password:
          <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
          <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
        </label>
        <input
          className="edit-password-input"
          type="password"
          id={user.userId}
          value={pwd}
          ref={passwordRef} 
          aria-invalid={validPwd ? "false" : "true"}
          aria-describedby="pwdnote"
          onChange={(e) => {
            setPwd(e.target.value)
            setShowPwdNote(!!e.target.value); 
          }}

          
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
        />
        <p id="pwdnote" className={pwdFocus && !validPwd && showPwdNote ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle} className="fa-info"/>
          8 to 24 characters.
          Must include uppercase and lowercase letters, a number and a special character.<br />
          Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
        </p>
      </div>

      <div className="edit-password-input-div ">
        <label htmlFor="confirm_pwd" className="">
          Confirm New Password:
          <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
          <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
        </label>
        <input
        className="edit-password-input"
          type="password"
          id={`uniqueid${user.userId}`}
          onChange={(e) => setMatchPwd(e.target.value)}
          value={matchPwd}
          required
          aria-invalid={validMatch ? "false" : "true"}
          aria-describedby="confirmnote"
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />
        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle} className="fa-info"/>
          Must match the first password input field.
        </p>
      </div>

      <button
        disabled={!validPwd || !validMatch}
        type="button"
        className="user-profile-edit-button"
        onClick={e => editUser(e)}
      >Edit</button>
    </div>
  )
}
