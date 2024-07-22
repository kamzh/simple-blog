import React, { useEffect, useState } from "react";
import SubmitButton from "../SubmitButton";
import Tag from "./Tag";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  articleCreator,
  articleEditor,
} from "../../redux/slices/ArticleControlSlice";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import * as path from "../../utils/router/Paths";
import "./ArticleForm.css";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

export default function ArticleForm() {
  const { slug } = useParams();
  const isEditing = !!slug;
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((store) => store.user);
  const { status } = useSelector((store) => store.articleControl);
  const { article } = useSelector((store) => store.article);

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm();

  const handleCreateArticle = (data) => {
    if (isEditing) {
      dispatch(articleEditor({ token, data, tags, slug }));
    } else {
      dispatch(articleCreator({ token, data, tags }));
    }
  };

  useEffect(() => {
    if (isEditing && article) {
      setValue("title", article.title);
      setValue("description", article.description);
      setValue("body", article.body);

      if (article.tagList) {
        setTags(article.tagList);
      }
    }
  }, [isEditing, article, setValue]);

  useEffect(() => {
    if (status === "succeeded") {
      message.success(`You ${isEditing ? "updated" : "posted"} an article!`);
      navigate(`/${path.articlesPath}`);
    }
  }, [status, navigate, isEditing]);

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setTags((prevTags) => [...prevTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  return (
    <div className="container-form">
      <form className="article-form" title="article" onSubmit={handleSubmit(handleCreateArticle)}>
        <h4 className="title">
          {isEditing ? "Edit an article" : "Create new article"}
        </h4>
        <label>
          <span>Title</span>
          <input
            className="articleTitle"
            type="text"
            placeholder="Title"
            {...register("title", {
              required: "Title is required",
              maxLength: {
                message: "Title cannot be longer than 5000 characters",
                value: 5000,
              },
            })}
          />
        </label>
        {errors?.title && (
          <div className="validation-warning">{errors.title.message}</div>
        )}
        <label>
          <span>Short description</span>
          <input
            className="desc"
            type="text"
            placeholder="Short description"
            {...register("description", {
              required: "Description is required",
              maxLength: {
                message: "Description cannot be longer than 200 characters",
                value: 200,
              },
            })}
          />
        </label>
        {errors?.description && (
          <div className="validation-warning">{errors.description.message}</div>
        )}

        <span style={{ padding: "4px 0", display: "block" }}>Text</span>
        <SimpleMDE
          type="text"
          onChange={(value) => setValue("body", value)}
          name="body"
          options={{
            spellChecker: false,
            placeholder: "Text",
            maxLength: 5000,
          }}
        />

        {errors?.body && (
          <div className="validation-warning">{errors.body.message}</div>
        )}
        <span className="tagTitle">Tags</span>
        {tags.map((tag, index) => (
          <Tag key={index} tag={tag} onDelete={() => handleDeleteTag(index)} />
        ))}
        <div className="tagInputContainer">
          <input
            className="tagInput"
            type="text"
            placeholder="Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button
            className="addTag"
            type="button"
            onClick={handleAddTag}
          >
            Add tag
          </button>
        </div>
        <div className="submitContainer">
          <SubmitButton
            value={!isEditing ? "Send" : "Save"}
            className="sendBtn"
          />
        </div>
      </form>
    </div>
  );
}
