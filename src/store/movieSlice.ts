import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import MovieApi from "../services/api";

export type Movie = {
    id: number;
    poster_path: string | null;
    title: string;
    release_date: string;
    overview: string;
    genre_ids: number[];
    vote_average: number;
    rating?: number;
}

const films = new MovieApi();

export const onGetMovies = createAsyncThunk<Movie[], {page: number}>(
    'movies/fetch',
    async function({page}) {
        const res = await films.getMovies(page);
        return res.results;
    }
)

export const onSearchMovies = createAsyncThunk<Movie[], {label: string, page: number}>(
    'movies/search',
    async function({label, page}) {
        const res = await films.searchMovies(label, page);
        return res.results;
    }
)

export const onCreateSession = createAsyncThunk<{guestSessionId: string}, void>(
    'movies/session',
    async function() {
        const res = await films.createGuestSession()
        return {guestSessionId: res.guest_session_id};
    }
)

export const onGetRatedMovie = createAsyncThunk<Movie[], {guestSessionId: string, page: number}>(
    'movies/rating',
    async function({guestSessionId, page}) {
        const res = await films.getRatedMovies(guestSessionId, page)
        return res.results;
    }
)

const movieSlice = createSlice({
    name: 'movies',
    initialState: {
        guestSessionId: null as string | null,
        movies: [] as Movie[],
        rateMovies: [] as Movie[],
        rating: null as number | null,
        load: false,
        error: false,
    },
    reducers: {
        updateMovieRating(state, action: PayloadAction<{movieId: number; rating: number}>) {
            const {movieId, rating} = action.payload;
            const film = state.movies.find(el => el.id === movieId)
            if (film) {
                film.rating = rating
            };
    }
    },
    extraReducers: (builder) => {
        builder
            .addCase(onGetMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
                const newMovie = action.payload;
                const updateMoives = newMovie.map(el => {
                    const existingMovies = state.movies.find(movie => movie.id === el.id)
                    return existingMovies ? {...el, rating: existingMovies.rating} : el;
                })
                state.movies = updateMoives;
                state.load = false;
                state.error = false;
            })
            .addCase(onGetMovies.pending, state => {
                state.load = true;
            })
            .addCase(onGetMovies.rejected, state => {
                state.error = true;
            })
            .addCase(onSearchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
                const newMovie = action.payload;
                const updateMoives = newMovie.map(el => {
                    const existingMovies = state.movies.find(movie => movie.id === el.id)
                    return existingMovies ? {...el, rating: existingMovies.rating} : el;
                })
                state.movies = updateMoives;
                state.load = false;
                state.error = false;
            })
            .addCase(onSearchMovies.pending, state => {
                state.load = true;
            })
            .addCase(onSearchMovies.rejected, state => {
                state.error = true;
            })
            .addCase(onCreateSession.fulfilled, (state, action: PayloadAction<{guestSessionId: string}>) => {
                state.guestSessionId = action.payload.guestSessionId
            })
            .addCase(onGetRatedMovie.pending, state => {
                state.load = true;
                state.error = false;
            })
            .addCase(onGetRatedMovie.rejected, state => {
                state.load = false;
            })
            .addCase(onGetRatedMovie.fulfilled, (state, action: PayloadAction<Movie[]>) => {
                state.rateMovies = action.payload;
                state.load = false;
                state.error = false;
            })
    }
});

export const { updateMovieRating } = movieSlice.actions;
export default movieSlice.reducer;