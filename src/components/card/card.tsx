import { useState, useContext, useEffect } from "react";
import { Flex, Rate } from "antd";
import { updateMovieRating } from "../../store/movieSlice";
import { useAppDispatch } from "../../hooks";
import { GenresContext } from "../../context/genres";
import MovieApi from "../../services/api";
import "./card.css";

interface CardProps {
  id: number;
  poster: string | null;
  title: string;
  date: string;
  description: string;
  guestSessionId: null | string;
  initialRating: undefined| number;
  genreID: number[];
  vote: number | string;
}

const Card: React.FC<CardProps > = ({
  id,
  poster,
  title,
  date,
  description,
  guestSessionId,
  initialRating,
  genreID,
  vote,
}) => {
  const adress = poster ? `https://image.tmdb.org/t/p/w500${poster}` : "/no-image.jpg";
  const [value, setValue] = useState(initialRating);
  const [voteColor, setVoteColor] = useState("#E0E0E0");
  const genres = useContext(GenresContext);
  const dispatch = useAppDispatch();

  const colorVote = (vote: number) => {
    const voteNumber = typeof vote === "string" ? Number(vote) : vote;
    if (voteNumber >= 0 && voteNumber < 3) setVoteColor("#E90000");
    else if (voteNumber >= 3 && voteNumber < 5) setVoteColor("#E97E00");
    else if (voteNumber >= 5 && voteNumber < 7) setVoteColor("#E9D100");
    else if (voteNumber >= 7) setVoteColor("#66E900");
    else setVoteColor("#E0E0E0");
  };

  useEffect(() => {
    const voteNumber = typeof vote === 'string' ? Number(vote) : vote;
    colorVote(voteNumber);
  }, [vote]);

  const films = new MovieApi();

  const onRateMovie = async (rating: number) => {
    try {
      await films.RateMovie(id, rating, guestSessionId);
      setValue(rating);
      dispatch(updateMovieRating({ movieId: id, rating }));
    } catch (error) {
      console.error("Error rating movie:", error);
    }
  };

  if (!genres || !genreID) {
    return null;
  }

  const maxGenresToShow = 4;
  const visibleGenres = genreID.slice(0, maxGenresToShow);

  return (
    <div className="card">
      <img src={adress} alt="Cover" />
      <div className="card-content">
        <div className="card-header">
          <h1>{title}</h1>
          <div className="card-vote" style={{ borderColor: `${voteColor}` }}>
            {typeof vote === "number" ? vote.toFixed(1) : "?"}
          </div>
        </div>
        <span className="card-date">{date}</span>
        <div className="card-genres">
          {visibleGenres.map((el) => {
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

export default Card;