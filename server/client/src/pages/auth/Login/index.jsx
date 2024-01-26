import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBar from "../../../components/Other/ProgressBar";
import { toast } from "react-toastify";
import { Collections, HEADER_API, URL_ADMIN_LOGIN, URL_FORGOT_PASSWORD, URL_GET_LIST, routes } from "../../../utils/Constant";
import AppIndicator from "../../../components/Other/AppIndicator";
import axios from "axios";
import { SetTitle } from './../../../utils/SetTitle';
import GetRandomToken from "../../../utils/GetRandomToken";
import GetIp from "../../../utils/GetIp";

function LoginIndex({ setToken }) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    login: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  SetTitle('Login');


  const login = async () => {
    setLoading(true);
    GetIp().then(async (ip) => {
      const genrateToken = GetRandomToken();
      try {
        const response = await axios.post(URL_ADMIN_LOGIN, {
          ...admin,
          authToken: genrateToken + ip
        }, HEADER_API);

        if (response.status === 200) {
          console.log(response.data);
          setLoading(false);
          const { status, message } = response.data;
          if (status) {
            // toast.success(`${message}`);
            setToken(true);
            localStorage.setItem('authToken', genrateToken);
            navigate(routes.DASHBOARD);
            
            localStorage.setItem('authToken', genrateToken);
          }else{
            toast.error('Login or password is Invalid');
          }
        } else {
          console.error(`Error login`, response.statusText);
        }
      } catch (error) {
        setLoading(false);
        toast.error(error.toString());
        console.error(`Error crud: login`, error);
      }

    })
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    if (admin?.login.trim() === "") {
      setError({
        ...error,
        login: 'Please Enter the email or username'
      })
    } else if(admin?.password.trim() === "") {
      setError({
        ...error,
        password: 'Please Enter the password'
      })
    }else{
      login();
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL_FORGOT_PASSWORD, HEADER_API);

      if (response.status === 200) {
        setLoading(false);
        const { status, message } = response.data;
        if (status) {
          toast.success(message);
        }
      } else {
        console.error('Error forgot password:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error forgot password:', error);
    }
  };

  const handleChangeValue = (name, value) => {
    setError({
      ...error,
      [name]: ''
    })
    setAdmin({
      ...admin,
      [name]: value
    })
  }

  if (admin == null) {
    return <AppIndicator />
  }

  const LoginImage = "https://edp.raincode.my.id/static/media/login.cc0578413db10119a7ff.png";
  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex w-full flex-col md:flex-row">
          {/* Image */}
          <div className="md:bg-emerald-500 md:min-h-screen flex flex-wrap md:w-1/2">
            <div className="items-center text-center flex flex-col relative justify-center mx-auto">
              <img
                src={LoginImage}
                alt="Logo Login"
                className="md:w-72 w-48 mx-auto"
              />
              <div className="md:block hidden text-slate-100">
                <h1 className="font-semibold text-2xl pb-2">
                  Login to Your Account
                </h1>
                <span className="text-sm">

                </span>
              </div>
            </div>
          </div>
          {/* Login Section */}
          <div className="flex flex-col md:flex-1 items-center justify-center">
            <div className="loginWrapper flex flex-col w-full lg:px-36 md:px-8 px-8 md:py-8">
              {/* Login Header Text */}
              <div className="hidden md:block font-medium self-center text-xl sm:text-3xl text-gray-800">
                Welcome Back!
              </div>

              {/* Sparator */}
              <div className="hidden md:block relative mt-10 h-px bg-gray-300">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                    Login using email, username and password
                  </span>
                </div>
              </div>

              <div className="md:hidden block my-4">
                <h1 className="text-2xl font-semibold">Login</h1>
              </div>

              {/* Login Form */}
              <div className="md:mt-10 mt-4">
                <form onSubmit={handleSubmit}>
                  {/* Username */}
                  <div className="flex flex-col mb-3">
                    <div className="relative">
                      <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>

                      <input
                        id="email"
                        type="text"
                        name="email"
                        onChange={(e) => handleChangeValue('login', e.target.value)}
                        className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        placeholder="Email or Username"
                      />
                    </div>
                    {error?.login && (
                      <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {error.login}
                      </span>
                    )}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col mb-6">
                    <div className="relative">
                      <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <FontAwesomeIcon icon={faLock} />
                      </div>

                      <input
                        id="password"
                        type="password"
                        name="password"
                        onChange={(e) => handleChangeValue('password', e.target.value)}
                        className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        placeholder="Password"
                      />
                    </div>
                    {error?.password && (
                      <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {error.password}
                      </span>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex items-center mb-6 -mt-2 md:-mt-4">
                    <div className="flex ml-auto">
                      <Link
                        to=""
                        onClick={(e) => {
                          e.preventDefault();
                          handleForgotPassword();
                        }}
                        className="inline-flex font-semibold text-xs sm:text-sm text-emerald-500 hover:text-emerald-700"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  {/* Button Login */}
                  <div className="flex w-full">
                    <button
                      disabled={loading}
                      type="submit"
                      className="flex items-center justify-center focus:outline-none text-white text-sm bg-emerald-500 hover:bg-emerald-700 rounded-lg md:rounded md:py-2 py-3 w-full transition duration-150 ease-in"
                    >
                      <span className="mr-2 md:uppercase">
                        {loading ? <ProgressBar /> : "Login"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Sparator */}
              {/* <div className="relative mt-6 h-px bg-gray-300">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                    OR
                  </span>
                </div>
              </div> */}

              {/* Social Button */}
              {/* <div className="flex justify-between w-full mt-6">
                <button
                  disabled={loading}
                  type="submit"
                  className="flex items-center justify-center focus:outline-none text-slate-500 text-sm bg-slate-200 rounded-lg md:rounded md:py-2 px-3 py-3 w-full transition duration-150 ease-in"
                >
                  <FontAwesomeIcon icon={faGoogle} />
                  <span className="mr-2 flex-1">Login with Google</span>
                </button>
              </div>
              <div className="flex justify-between w-full mt-2">
                <button
                  disabled={loading}
                  type="submit"
                  className="flex items-center justify-center focus:outline-none text-slate-500 text-sm bg-slate-200 rounded-lg md:rounded md:py-2 px-3 py-3 w-full transition duration-150 ease-in"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                  <span className="mr-2 flex-1">Login with Facebook</span>
                </button>
              </div> */}
              {/* End Social Button */}

              {/* Register Link */}
              {/* <div className="flex justify-center items-center  my-6 md:mb-0">
                <Link
                  to="/auth/register"
                  className="inline-flex items-center font-bold text-emerald-500 hover:text-emerald-700 text-xs text-center"
                >
                  <span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                  </span>
                  <span className="ml-2">Belum punya akun?</span>
                </Link>
              </div> */}
              {/* End Register Link */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginIndex;
