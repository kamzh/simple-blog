import { useState } from "react";
import { format, parseISO } from "date-fns";
import { NavLink } from "react-router-dom";
import * as Utils from "../utils/Utils";
import { useDispatch, useSelector } from "react-redux";
import { articleLike, articleDislike } from "../redux/slices/ArticleControlSlice";
import PropTypes from "prop-types";
import { enUS } from "date-fns/locale";

const truncateText = (text, limit) => Utils.truncateTextAtWord(text, limit);

export default function ArticleItem({
  title,
  favoritesCount,
  tagList,
  description,
  username,
  createdAt,
  image,
  liked,
  slug,
}) {
  const [isLiked, setIsLiked] = useState(liked);
  const [likes, setLikesCount] = useState(favoritesCount);

  const { token } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const handleLike = async () => {
    if (!token) return;

    try {
      const updatedLikes = isLiked ? likes - 1 : likes + 1;
      setLikesCount(updatedLikes);

      if (isLiked) {
        await dispatch(articleDislike({ token, slug }));
      } else {
        await dispatch(articleLike({ token, slug }));
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Like/Dislike Error:", error);
    }
  };

  const parsedDate = parseISO(createdAt);
  const formattedDate = format(parsedDate, "d MMMM yyyy, p", { locale: enUS });

  const likeClassName = isLiked ? "likeCount liked" : "likeCount";

  return (
    <li className="ArticleItem">
      <div>
        <div className="firstLine">
          <NavLink to={`/articles/${slug}`}>
            <h5 className="title">{truncateText(title, 100)}</h5>
          </NavLink>
          {token && (
            <button disabled={!token} className={likeClassName} onClick={handleLike}>
              {likes}
            </button>
          )}
        </div>
        <div className="tags">
          {tagList.slice(0, 10).map((tag, index) => (
            <span key={index} className="tag">
              {truncateText(tag, 40)}
            </span>
          ))}
          {tagList.length > 10 && <span>...</span>}
        </div>
        <p className="desc">{truncateText(description, 240)}</p>
      </div>
      <div className="authorBlock">
        <div className="authorInfo">
          <h6 className="author">{username}</h6>
          <span className="date">{formattedDate}</span>
        </div>
        <div className="avatar">
          {Utils.renderProfileImage(image, "avatarImg")}
        </div>
      </div>
    </li>
  );
}

ArticleItem.propTypes = {
  title: PropTypes.string,
  favoritesCount: PropTypes.number,
  tagList: PropTypes.array,
  description: PropTypes.string,
  username: PropTypes.string,
  createdAt: PropTypes.any,
  image: PropTypes.string,
  bookmarked: PropTypes.bool,
  slug: PropTypes.string,
};
