import React, { useEffect } from "react";
import SubmitButton from "../SubmitButton";
import { editProfile, clearRegisterData } from "../../redux/slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import * as path from "../../utils/router/Paths";
import "./NewAccountForm.css"; 

export default function EditProfileForm() {
  const dispatch = useDispatch();
  const { username, email, image, token, editProfileStatus } = useSelector(
    (store) => store.user
  );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleEditProfile = async (data) => {
    if (data.email) {
      data.email = data?.email.toLowerCase();
    }
    if (data.image) {
      data.image = data?.image.toLowerCase();
    }
    dispatch(editProfile({ data, token }));
  };

  useEffect(() => {
    if (editProfileStatus === "succeeded") {
      message.success("Successfully updated!");
      navigate(`/${path.articlesPath}`);
    }
  }, [editProfileStatus, navigate]);

  useEffect(() => {
    dispatch(clearRegisterData());
    setValue("username", username);
    setValue("email", email);
    setValue("image", image);
  }, [username, email, image, setValue, dispatch]);

  return (
    <div className="formContainer">
      <form className="editProfile"onSubmit={handleSubmit(handleEditProfile)}>
        <h4 className="title">Edit Profile</h4>
        <label>
          <span>Username</span>
          <input
            type="text"
            name="username"
            placeholder="Username"
            {...register("username", {
              required: "required",
              minLength: {
                message: "required",
                value: 3,
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "Latin only",
              },
              maxLength: {
                message: "Maximum-20",
                value: 20,
              },
            })}
          />
        </label>
        <label>
          <span>Email address</span>
          <input
            type="text"
            name="email"
            placeholder="Email address"
            {...register("email", {
              required: "required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter correct email",
              },
            })}
          />
          {errors?.email && (
            <div className="validation-warning">{errors.email.message}</div>
          )}
        </label>
        <label>
          <span>New password</span>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Password"
            {...register("password", {
              required: "New password",
              minLength: {
                value: 6,
                message: "Minimum-6",
              },
              maxLength: {
                value: 40,
                message: "Maximum-40",
              },
            })}
          />
          {errors?.password && (
            <div className="validation-warning">{errors.password.message}</div>
          )}
        </label>
        <label>
          <span>Avatar image (url)</span>
          <input
            type="url"
            placeholder="Avatar image"
            {...register("image", {
              pattern: {
                value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
                message: "Type correct url address",
              },
            })}
          />
        </label>
        {errors?.image && (
          <div className="validation-warning">{errors.image.message}</div>
        )}

        <SubmitButton value="Save" />
      </form>
    </div>
  );
}
