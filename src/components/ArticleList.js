import { useEffect } from "react";
import { Pagination, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles, changePage } from "../redux/slices/ArticleSlice";
import { resetStatus } from "../redux/slices/ArticleControlSlice";
import { clearRegisterData } from "../redux/slices/UserSlice";
import ArticleItem from "./ArticleItem";
import Loading from "./Loading";
import defaultAvatar from "../assets/images/avatar.png";
import "./ArticleList.css";

export default function ArticleList() {
  const dispatch = useDispatch();

  const { articles, articlesCount, error, currentPage, loading } = useSelector(
    (state) => state.article
  );
  const { token } = useSelector((store) => store.user);

  useEffect(() => {
    dispatch(clearRegisterData());
    dispatch(resetStatus());
    dispatch(fetchArticles({ page: currentPage, token }));
  }, [dispatch, currentPage, token]);

  const handlePageChange = (pageNumber) => {
    dispatch(changePage(pageNumber));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert message={`Error: ${error}`} type="error" />;
  }

  return (
    <section>
      <div className="container">
        <ul>
          {articles.map((article) => (
            <ArticleItem
              key={article.slug}
              username={article.author.username}
              image={article.author.image || defaultAvatar}
              createdAt={article.createdAt}
              title={article.title}
              favoritesCount={article.favoritesCount}
              tagList={article.tagList}
              description={article.description}
              text={article.text}
              slug={article.slug}
              bookmarked={article.bookmarked} 
            />
          ))}
        </ul>
        <Pagination
          pageSize={10}
          style={{ textAlign: "center", marginBottom: 30 }}
          current={currentPage}
          total={articlesCount}
          showSizeChanger={false}
          onChange={handlePageChange}
        />
      </div>
    </section>
  );
}
