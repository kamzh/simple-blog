class ArticleService {
  BASE_URL = "https://api.realworld.io/api/";

  async performRequest(url, method, token, content) {
    const fullUrl = new URL(this.BASE_URL + url);

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (content) {
      options.body = JSON.stringify(content);
    }

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      throw new Error("Server Error occurred!");
    }

    const data = await response.json();
    return data;
  }

  async getArticles(page, token) {
    const limit = 10;
    const url = `articles?limit=${limit}&offset=${page * limit - limit}`;

    if (token) {
      return this.performRequest(url, "GET", token);
    }

    return this.performRequest(url, "GET");
  }

  async getArticlePage(slug, token) {
    const url = `articles/${slug}`;

    if (token) {
      return this.performRequest(url, "GET", token);
    }

    return this.performRequest(url, "GET");
  }

  async createArticle(content, token, tags) {
    const data = this.performRequest("articles/", "POST", token, {
      article: {
        ...content,
        tagList: tags,
      },
    });
    return data;
  }

  async editArticle(content, token, tags, slug) {
    const url = `articles/${slug}`;
    const data = this.performRequest(url, "PUT", token, {
      article: {
        ...content,
        tagList: tags,
      },
    });
    return data;
  }

  async deleteArticle(token, slug) {
    const url = `articles/${slug}`;
    return this.performRequest(url, "DELETE", token);
  }

  async likeArticle(token, slug) {
    const url = `articles/${slug}/favorite`;
    return this.performRequest(url, "POST", token);
  }

  async unlikeArticle(token, slug) {
    const url = `articles/${slug}/favorite`;
    return this.performRequest(url, "DELETE", token);
  }
}

const instanceArticleService = new ArticleService();

export default instanceArticleService;
