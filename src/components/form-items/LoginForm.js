import { login, clearRegisterData } from "../../redux/slices/UserSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { useEffect } from "react";
import * as path from "../../utils/router/Paths";
import SubmitButton from "../SubmitButton";
import "./NewAccountForm.css";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { token, loginStatus } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const handleLogin = (data) => {
    data.email = data.email.toLowerCase();
    dispatch(login(data));
  };

  useEffect(() => {
    if (token) {
      message.success("You have logged in successfully!");
      navigate(`/${path.articlesPath}`);
    } else {
      if (loginStatus === "failed") {
        message.error("Invalid authorization data");
      }
    }
  }, [token, navigate, loginStatus, dispatch]);

  useEffect(() => {
    dispatch(clearRegisterData());
  }, [dispatch]);

  return (
    <div className="formContainer">
      <form
        className="loginForm"
        title="sign-in"
        onSubmit={handleSubmit(handleLogin)}
      >
        <h4 className="title">Log In</h4>
        <label>
          <span>Email</span>
          <input
            type="text"
            name="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required!",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email!",
              },
            })}
          />
          {errors?.email && (
            <div className="validation-warning">{errors.email.message}</div>
          )}
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Password"
            {...register("password", {
              required: "Please enter your password!",
            })}
          />
        </label>
        {errors?.password && (
          <div className="validation-warning">{errors.password.message}</div>
        )}
        <SubmitButton value="Sign In" className="sendBtn" />
        <span className="createProfileText">
        Don't have an account?    
          <NavLink to={`/${path.registerPath}`}>
            <span> Sign Up</span>
          </NavLink>
        </span>
      </form>
    </div>
  );
}
