import PropTypes from "prop-types";
import "./ArticleForm.css";

export default function Tag({ tag, onDelete }) {
  return (
    <div className="divTag">
      <div className="tag">{tag}</div>
      <button className="deleteTag" onClick={onDelete} type="button">
        Delete
      </button>
    </div>
  );
}

Tag.propTypes = {
  tag: PropTypes.string,
  onDelete: PropTypes.func,
};
