import React, { useState, useContext, useEffect } from "react";
import { Flex, Rate } from "antd";

import ErrorMovies from "../error/error";
import "./card.css";
import { GenresContext } from "../../context/genres";
import MovieApi from "../../services/api";

export default function Card({
  id,
  poster,
  title,
  date,
  description,
  guestSessionId,
  initialRating,
  setRatedFilms,
  genreID,
  vote,
}) {
  const adress = poster ? `https://image.tmdb.org/t/p/w500${poster}` : "/no-image.jpg";
  const [value, setValue] = useState(initialRating);
  const [voteColor, setVoteColor] = useState(vote);
  const genres = useContext(GenresContext);

  const colorVote = (vote) => {
    if (0 < vote < 3) setVoteColor("#E90000");
    if (3 < vote < 5) setVoteColor("#E97E00");
    if (5 < vote < 7) setVoteColor("#E9D100");
    if (vote > 7) setVoteColor("#66E900");
    return "#E0E0E0";
  };

  useEffect(() => {
    colorVote(vote);
  }, [vote]);

  const films = new MovieApi();

  const onRateMovie = async (rating) => {
    try {
      await films.RateMovie(id, rating, guestSessionId);
      setValue(rating);
      setRatedFilms((prevState) => {
        const filmExists = prevState.some((film) => film.id === id);
        if (filmExists) {
          return prevState.map((film) => (film.id === id ? { ...film, rating } : film));
        } else {
          return [...prevState, { id, poster, title, date, description, rating }];
        }
      });
    } catch (error) {
      ErrorMovies();
    }
  };

  if (!genres || !genreID) {
    return null;
  }

  return (
    <div className="card">
      <img src={adress} alt="Cover" />
      <div className="card-content">
        <div className="card-header">
          <h1>{title}</h1>
          <div className="card-vote" style={{ borderColor: `${voteColor}` }}>
            {vote ? vote.toFixed(1) : "?"}
          </div>
        </div>
        <span className="card-date">{date}</span>
        <div className="card-genres">
          {genreID.map((el) => {
            const genre = genres.find((g) => g.id === el);
            return genre ? <div key={genre.id}>{genre.name}</div> : null;
          })}
        </div>
        <div className="card-description">{description}</div>
        <div className="card-rating">
          <Flex gap="middle" vertical>
            <Rate onChange={onRateMovie} value={value} count={10} />
          </Flex>
        </div>
      </div>
    </div>
  );
}
