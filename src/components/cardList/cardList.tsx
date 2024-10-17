import { Movie } from "../../store/movieSlice";
import "./cardList.css";
import { format } from "date-fns";
import ErrorMovies from "../error/error";
import Card from "../card/card";

interface CardListProps {
  guestSessionId: null | string;
  films: Movie[];
}

const CardList: React.FC<CardListProps> = ({guestSessionId, films}) => {

  if ((!films || films.length === 0) && guestSessionId) {
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
            initialRating={film.rating || undefined}
            vote={film.vote_average}
            guestSessionId={guestSessionId}
          />
        );
      })}
    </div>
  );
}

export default CardList;
