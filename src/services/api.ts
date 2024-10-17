class MovieApi {
  async getResponse(url: string) {
    const res = await fetch(url);
    const body = await res.json();
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return body;
  }

  async createGuestSession() {
    const api = "b95b8dc8fcb69d0f3bce2a2d9c53bb21";
    const res = await this.getResponse(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${api}`);
    return res;
  }

  async RateMovie(movieId: number, rating: number, guestSessionId: string | null) {
    const api = "b95b8dc8fcb69d0f3bce2a2d9c53bb21";
    const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${api}&guest_session_id=${guestSessionId}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ value: rating }),
    };

    const res = await fetch(url, options);
    const body = await res.json();
    if (!res.ok) {
      throw new Error(`Could not rate movie, status: ${res.status}`);
    }
    return body;
  }

  async getRatedMovies(guestSessionId: string, page = 1) {
    const api = "b95b8dc8fcb69d0f3bce2a2d9c53bb21";
    const res = await this.getResponse(
      `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${api}&page=${page}`
    );
    return res;
  }

  async getMovies(page: number) {
    const api = "b95b8dc8fcb69d0f3bce2a2d9c53bb21";
    const res = await this.getResponse(
      `https://api.themoviedb.org/3/search/movie?api_key=${api}&query=deadpool&page=${page}`
    );
    return res;
  }

  async searchMovies(label: string, page: number) {
    const api = "b95b8dc8fcb69d0f3bce2a2d9c53bb21";
    const res = await this.getResponse(
      `https://api.themoviedb.org/3/search/movie?api_key=${api}&query=${label}&page=${page}`
    );
    return res;
  }

  async getGenres() {
    const api = "b95b8dc8fcb69d0f3bce2a2d9c53bb21";
    const res = await this.getResponse(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api}&language=en-US`);
    return res;
  }
}

export default MovieApi;
