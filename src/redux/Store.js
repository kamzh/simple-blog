import { configureStore } from "@reduxjs/toolkit";
import ArticleSlice from "./slices/ArticleSlice";
import UserSlice from "./slices/UserSlice";
import ArticleControlSlice from "./slices/ArticleControlSlice";

const store = configureStore({
  reducer: {
    article: ArticleSlice,
    user: UserSlice,
    articleControl: ArticleControlSlice,
  },
});

export default store;
