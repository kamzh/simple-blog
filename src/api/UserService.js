class userService {
  BASE_URL = "https://api.realworld.io/api/";

  async performRequest(method, endpoint, credentials, token) {
    const url = this.BASE_URL + endpoint;

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify({ user: credentials }),
    });

    if (!response.ok) {
      throw new Error("Username or email is already taken by someone!");
    }

    const data = await response.json();
    return data;
  }

  async registerAccount(credentials) {
    const data = await this.performRequest("POST", "users", credentials);
    return data;
  }

  async login(credentials) {
    const data = await this.performRequest("POST", "users/login", credentials);
    if (JSON.stringify(data.user)) {
      localStorage.setItem("user", JSON.stringify(data));
    }
    return data;
  }

  async editProfile(credentials, token) {
    return this.performRequest("PUT", "user", credentials, token);
  }
}

const instanceUserService = new userService();

export default instanceUserService;
