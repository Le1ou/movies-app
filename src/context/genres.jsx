import React, { useEffect, useState } from "react";

import MovieApi from "../services/api";

export const GenresContext = React.createContext();

export const GenresProvider = ({ children }) => {
  const films = new MovieApi();
  const [genres, setGenres] = useState();

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await films.getGenres();
      setGenres(res.genres);
      console.log(res.genres);
    };

    fetchGenres();
  }, []);

  return <GenresContext.Provider value={genres}>{children}</GenresContext.Provider>;
};
