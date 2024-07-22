import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { message, Popconfirm } from "antd";
import Markdown from "markdown-to-jsx";

import { fetchFullArticle } from "../redux/slices/ArticleSlice"; 
import { articleDeleter, articleLike, articleDislike } from "../redux/slices/ArticleControlSlice"; 
import Loading from "./Loading"; 
import * as utils from "../utils/Utils"; 
import * as path from "../utils/router/Paths"; 
import './ArticleItem.css'; 

export default function ArticlePage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { article } = useSelector((store) => store.article);
  const { token, username = "" } = useSelector((store) => store.user);
  const navigate = useNavigate();

  const [isMyArticle, setIsMyArticle] = useState(false);
  const [like, setLike] = useState(article.bookmarked);
  const [likes, setLikeCount] = useState(article.favoritesCount);

  useEffect(() => {
    return () => {
      setIsMyArticle(false);
    };
  }, []);

  useEffect(() => {
    if (slug) {
      dispatch(fetchFullArticle({ slug, token }));
    }
  }, [dispatch, slug, token]);

  useEffect(() => {
    setLike(article.bookmarked);
    setLikeCount(article.favoritesCount);
  }, [article]);

  useEffect(() => {
    if (article?.author?.username === username) {
      setIsMyArticle(true);
    } else {
      setIsMyArticle(false);
    }
  }, [setIsMyArticle, username, article]);

  const handleLike = () => {
    if (!token) {
      return;
    }

    try {
      if (!like) {
        dispatch(articleLike({ token, slug }));
        setLikeCount((prevLikes) => prevLikes + 1);
      } else {
        dispatch(articleDislike({ token, slug }));
        setLikeCount((prevLikes) => prevLikes - 1);
      }

      setLike(!like);
    } catch (error) {
      throw new Error(error);
    }
  };

  if (!article || !article.title || !article.createdAt || !article.author || !article.tagList) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const parsedDate = parseISO(article.createdAt);
  const formattedDate = format(parsedDate, "d MMMM yyyy, p", { locale: enUS });

  const confirmConfig = {
    title: "Are you sure you want to delete this article?",
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onConfirm() {
      dispatch(articleDeleter({ token, slug }));
      message.loading("Article deleted", [1]);
      setTimeout(() => navigate("/" + path.articlesPath), 500);
      setIsMyArticle(false);
    },
    onCancel() {
      message.info("Deletion canceled");
    },
  };

  const likeClassName = like ? "likeCount liked" : "likeCount";

  return (
    <div className="container">
      <section className="articleItem">
        <div>
          <div className="firstLine">
            <h5 className="title">{article.title}</h5>
            <button disabled={!token} className={likeClassName} onClick={handleLike}>
              {likes}
            </button>
          </div>
          <div className="tags">
            {article.tagList.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <p className="desc descFull">{article.description}</p>
          {article.body ? <Markdown className="markdownBody">{article.body}</Markdown> : null}
        </div>
        <div className="authorBlock">
          <div className="authorInfo">
            <h6 className="author">{article.author.username}</h6>
            <span className="date">{formattedDate}</span>
          </div>
          <div className="avatar">
            {utils.renderProfileImage(article.author.image, "avatarImg")}
            {isMyArticle && (
              <div className="buttonBlock">
                <Popconfirm placement="bottom" {...confirmConfig}>
                  <button className="delete">Delete</button>
                </Popconfirm>
                <NavLink to={`/articles/${slug}/edit`} tabIndex={-1}>
                  <button className="edit">Edit</button>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
