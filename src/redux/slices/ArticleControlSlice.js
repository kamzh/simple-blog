import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instanceArticleService from "../../api/ArticleService";

const initialState = {
  status: "idle",
  article: {},
  error: null,
  slug: "",
};

export const articleCreator = createAsyncThunk(
  "articleControl/articleCreator",
  async function ({ data, token, tags }, { rejectWithValue }) {
    try {
      return await instanceArticleService.createArticle(data, token, tags);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const articleEditor = createAsyncThunk(
  "articleControl/articleEditor",
  async function ({ data, token, tags, slug }, { rejectWithValue }) {
    try {
      return await instanceArticleService.editArticle(data, token, tags, slug);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const articleDeleter = createAsyncThunk(
  "articleControl/articleDeleter",
  async function ({ token, slug }, { rejectWithValue }) {
    try {
      return await instanceArticleService.deleteArticle(token, slug);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const articleLike = createAsyncThunk(
  "articleControl/like",
  async function ({ token, slug }, { rejectWithValue }) {
    try {
      return await instanceArticleService.likeArticle(token, slug);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);
export const articleDislike = createAsyncThunk(
  "articleControl/dislike",
  async function ({ token, slug }, { rejectWithValue }) {
    try {
      return await instanceArticleService.unlikeArticle(token, slug);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const articleControlSlice = createSlice({
  name: "articleControl",
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(articleCreator.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.loading = true;
      })
      .addCase(articleCreator.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.articlesCount = action.payload.articlesCount;
        state.article = action.payload;
      })
      .addCase(articleCreator.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(articleEditor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.article = action.payload;
      })
      .addCase(articleEditor.pending, (state) => {
        state.status = null;
        state.loading = true;
      })
      .addCase(articleEditor.rejected, (state, action) => {
        state.status = "rejected";
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(articleDeleter.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default articleControlSlice.reducer;

export const { resetStatus } = articleControlSlice.actions;
