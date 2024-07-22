import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import avatar from "../assets/images/avatar.png";
import { remove } from "../redux/slices/UserSlice";
import { message } from "antd";
import { renderProfileImage } from "../utils/Utils";
import SuccessButton from "./SuccessButton";
import * as path from "../utils/router/Paths";
import "./Header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { username, image, token } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(remove());
    localStorage.removeItem("user");
    message.info("You have been logged out");
    navigate(path.articlesPath);
  };

  useEffect(() => {
    return () => setIsMenuOpen(false);
  }, []);

  return (
    <header>
      <NavLink to="/">
        <h6 className="logo">Realworld Blog</h6>
      </NavLink>

      {token ? (
        <nav className={`loggedInner ${isMenuOpen ? "showMenu" : ""}`}>
          <NavLink className="create" to={path.newArticlePath} tabIndex={-1}>
            <SuccessButton>Create article</SuccessButton>
          </NavLink>
          <NavLink className="profile" to={path.profilePath}>
            <span>{username}</span>
            {renderProfileImage(image, "avatar") || (
              <img src={avatar} className="avatar" alt="User Avatar" />
            )}
          </NavLink>
          <button
            onClick={handleLogout}
            className="logout"
          >
            Log Out
          </button>
        </nav>
      ) : (
        <nav className={`inLoggedInner ${isMenuOpen ? "showMenu" : ""}`}>
          <NavLink className="login" tabIndex={-1} to={path.loginPath}>
            <button>Sign In</button>
          </NavLink>
          <NavLink className="signup" tabIndex={-1} to={path.registerPath}>
            <SuccessButton>Sign Up</SuccessButton>
          </NavLink>
        </nav>
      )}
    </header>
  );
}
