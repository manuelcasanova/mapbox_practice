import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../styles/UserEditPassword.css'

import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import useLogout from "../../hooks/useLogout";
import { Navigate, useNavigate } from "react-router-dom";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function UserEditPassword(props) {
  const BACKEND = process.env.REACT_APP_API_URL;

  const logOut = useLogout()
  const navigate = useNavigate()
  const { user, users, setUsers } = props;

  // useEffect(() => {
  //   console.log("user", user, "users", users)
  // }, [users])


  const axiosPrivate = useAxiosPrivate()


  //URLS

  const EDIT_URL = `${BACKEND}/users/edit/password`;
  const USERS_URL = `${BACKEND}/users`;


  //States


  const id = user.userId

  const pwdRef = useRef();
  const errRef = useRef();

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  

  useEffect(() => {
    pwdRef.current.focus();
  }, [])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
}, [user, pwd, matchPwd])

  //console.log(roles)

  //Edit function

  const editUser = async (e) => {
    e.preventDefault()

    try {
      const body = {
        id, pwd
      };
      //console.log("body front", body)

      await axiosPrivate.put(
        EDIT_URL, body
      )
      // axiosPrivate.get(USERS_URL).then(function (res) {
      //   setUsers([...res.data]);

         clearInput()
         logOut()
         navigate('/login')

      // });
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
      errRef.current.focus();
  }
  }

  const clearInput = () => {
    setPwd("");
    setMatchPwd("");
  }


  return (
    
    <>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      {/* <!-- Button to Open the Modal --> */}
      <button
        title="Click to edit password"
        type="button"
        className="btn-no-btn min-padding-side"
        data-toggle="modal"
        data-target={`#editpasswordmodal${user.userId}`}
        // data-backdrop="static"
      >
        <i className="fa-solid fa-asterisk"></i>
      </button>

      {/* <!-- The Modal --> */}
      <div className="modal" 
      id={`editpasswordmodal${user.userId}`}
      >
        <div className="modal-dialog">
          <div className="modal-content">

            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <h4 className="modal-title">Edit Password</h4>
              <button type="button" className="close" data-dismiss="modal" onClick={()=>clearInput()}>&times;</button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body ">

              <div className="level_input --fl-dir-col">
                <label htmlFor="password"
                className="edit-item">
                  New Password:
                  <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                </label>
                <input
                  className="form-control-add --less-margin-top"
                  type="password"
                  id={id}
                  // name="title"
                  value={pwd}
                  ref={pwdRef}
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onChange={(e) => setPwd(e.target.value)}
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.<br />
                  Must include uppercase and lowercase letters, a number and a special character.<br />
                  Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                </p>
              </div>

              <div className="level_input --fl-dir-col">

                <label htmlFor="confirm_pwd"
                className="edit-item">
                  Confirm New Password:
                  <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                </label>
                <input
                  type="password"
                  id={`uniqueid${id}`}
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
                </p>

              </div>


            </div>

            {/* <!-- Modal footer --> */}
            <div className="modal-footer">
              <button 
              type="button" 
              className="btn btn-danger" data-dismiss="modal"
              onClick={() => {clearInput()}}
              >Close</button>
              <button
                disabled={ !validPwd || !validMatch ? true : false}
                type="button"
                className="btn button-black"
                data-dismiss="modal"
                onClick={e => editUser(e)}
              >Edit</button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
