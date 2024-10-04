import React from "react";
import "./cardList.css";
import { format } from "date-fns";

import ErrorMovies from "../error/error";
import Card from "../card/card";

function CardList({ films, guestSessionId, setRatedFilms }) {
  if (!films || films.length === 0) {
    return <ErrorMovies />;
  }

  return (
    <div className="card-list">
      {films.map((film) => {
        const relDate = film.release_date ? format(new Date(film.release_date), "PP") : "Unknown Date";
        return (
          <Card
            key={film.id}
            id={film.id}
            poster={film.poster_path}
            title={film.title}
            date={relDate}
            genreID={film.genre_ids}
            description={film.overview}
            initialRating={film.rating || null}
            guestSessionId={guestSessionId}
            setRatedFilms={setRatedFilms}
            vote={film.vote_average}
          />
        );
      })}
    </div>
  );
}

export default CardList;
