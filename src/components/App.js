import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import ArticleList from "../components/ArticleList";
import NewAccountForm from "./form-items/NewAccountForm";
import EditProfileForm from "../components/form-items/EditProfileForm";
import LoginForm from "../components/form-items/LoginForm";
import ArticleForm from "../components/form-items/ArticleForm";
import ArticlePage from "../components/ArticlePage";
import PrivateRoutes from "../utils/router/PrivateRouter";
import * as path from "../utils/router/Paths";
import "./App.css";

export default function App() {
  return (
    <div className="appContainer">
      <Router>
        <div className="wrapper">
          <Header />
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path={path.articlesPath} element={<ArticleList />} />
            <Route path={path.registerPath} element={<NewAccountForm />} />
            <Route path={path.loginPath} element={<LoginForm />} />
            <Route element={<PrivateRoutes />}>
              <Route path={path.newArticlePath} element={<ArticleForm />} />
              <Route path={path.profilePath} element={<EditProfileForm />} />
              <Route path={path.editArticlePath} element={<ArticleForm />} />
            </Route>
            <Route path={path.articlePath} element={<ArticlePage />} />
            <Route
              path="*"
              element={<h3 className="spin">Nothing was found: 404!</h3>}
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
