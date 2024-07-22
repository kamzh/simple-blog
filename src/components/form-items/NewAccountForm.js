import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  createUser,
  clearRegisterData,
} from "../../redux/slices/UserSlice"; 
import { handleRegister as handleRegisterUtil } from "../../utils/HandleSubmission";  
import { useForm } from "react-hook-form";
import { message } from "antd";
import SubmitButton from "../SubmitButton";  
import * as path from "../../utils/router/Paths";  
import "./NewAccountForm.css";

export default function NewAccountForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { error, registerStatus, token } = useSelector(
    (store) => store.user
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toLogin = useCallback(() => {
    if (registerStatus === "succeeded") {
      message.success(`Your profile has been successfully created! Welcome!`);
      navigate(`/${path.loginPath}`);
    }
  }, [registerStatus, navigate]);

  const handleRegister = (data) => {
    handleRegisterUtil(
      data,
      dispatch,
      createUser,
      setIsSubmitting,
      isSubmitting,
      error
    );
  };

  useEffect(() => {
    if (token) {
      navigate(`/${path.articlesPath}`);
    }
    if (error) {
      message.error(error);
    }
    dispatch(clearRegisterData());
    toLogin();
  }, [toLogin, token, dispatch, error, navigate]);

  return (
    <div className="formContainer">
      <form
        className="registerForm"
        title="register"
        onSubmit={handleSubmit(handleRegister)}
      >
        <h4 className="title">Create Profile</h4>
        <label>
          <span>Username</span>
          <input
            type="text"
            name="username"
            placeholder="Username"
            {...register("username", {
              required: "Username is required!",
              minLength: {
                message: "Username must be at least 3 characters long",
                value: 3,
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message:
                  "Username must contain only letters and numbers without spaces!",
              },
              maxLength: {
                message: "Username can be up to 20 characters long",
                value: 20,
              },
            })}
          />
          {errors?.username && (
            <div className="validation-warning">{errors.username.message}</div>
          )}
        </label>
        <label>
          <span>Email</span>
          <input
            type="text"
            name="email"
            placeholder="Email"
            {...register("email", {
              required: "Email address is required!",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message:
                  "Please enter a valid email address!",
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
            name="password"
            placeholder="Password"
            {...register("password", {
              required: "Please enter a password!",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
              maxLength: {
                value: 40,
                message: "Password can be up to 40 characters long",
              },
            })}
          />
          {errors?.password && (
            <div className="validation-warning">{errors.password.message}</div>
          )}
        </label>
        <label>
          <span>Confirm Password</span>
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("repeatPassword", {
              required: "Please confirm your password!",
            })}
          />
          {errors?.repeatPassword && (
            <div className="validation-warning">
              {errors.repeatPassword.message}
            </div>
          )}
        </label>
        <label className="checkboxLine">
          <input
            type="checkbox"
            {...register("agree", {
              required: "Consent to process personal data is required",
            })}
          />
          I agree to the processing of my personal data
        </label>
        {errors?.agree && (
          <div className="validation-warning">{errors.agree.message}</div>
        )}
        <SubmitButton value="Create" className="submitBtn" />
      </form>
    </div>
  );
}
