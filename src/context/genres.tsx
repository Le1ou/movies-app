import React, { useEffect, useMemo, useState, ReactNode } from "react";
import MovieApi from "../services/api";

interface Genre {
  id: number;
  name: string;
}

export const GenresContext = React.createContext<Genre[] | null>(null);

interface GenresProviderProps {
  children: ReactNode;
}

export const GenresProvider: React.FC<GenresProviderProps> = ({ children }) => {
  const films = useMemo(() => new MovieApi(), []);
  const [genres, setGenres] = useState<Genre[] | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await films.getGenres();
      setGenres(res.genres);
    };

    fetchGenres();
  }, [films]);

  return (
    <GenresContext.Provider value={genres}>
      {children}
    </GenresContext.Provider>
  );
};