import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instanceArticleService from "../../api/ArticleService";

const initialState = {
  currentPage: 1,
  loading: true,
  status: null,
  articles: [],
  article: {},
  error: null,
  articlesCount: 0,
  openFullstatus: "idle",
  slug: "",
};

export const fetchArticles = createAsyncThunk(
  "article/fetchArticles",
  async function ({ page, token }, { rejectWithValue }) {
    try {
      return await instanceArticleService.getArticles(page, token);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const fetchFullArticle = createAsyncThunk(
  "article/fetchFullArticle",
  async function ({ slug, token }, { rejectWithValue }) {
    try {
      return await instanceArticleService.getArticlePage(slug, token);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    changePage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.articles = [];
        state.loading = true;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.articles = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFullArticle.fulfilled, (state, action) => {
        state.openFullstatus = "succeeded";
        state.loading = false;
        state.article = action.payload.article;
      })
      .addCase(fetchFullArticle.pending, (state) => {
        state.openFullstatus = null;
        state.loading = true;
        state.article = {};
      })
      .addCase(fetchFullArticle.rejected, (state, action) => {
        state.openFullstatus = "rejected";
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default articleSlice.reducer;

export const { renderList, create, remove, changePage } = articleSlice.actions;
