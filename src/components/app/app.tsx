import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { Tabs, Layout } from "antd";
import { onGetMovies, onSearchMovies, onCreateSession, onGetRatedMovie } from "../../store/movieSlice";
import { useAppSelector, useAppDispatch } from "../../hooks";
import CardList from "../cardList/cardList";
import SearchForm from "../searchForm/searchForm";
import Pages from "../pages/pages";
import { GenresProvider } from "../../context/genres";
import OnSpinner from "../spinner/spinner";
import ErrorMovies from "../error/error";

const { Content } = Layout;

const App = () => {
  const dispatch = useAppDispatch();
  const {guestSessionId, load, error, movies, rateMovies} = useAppSelector(state => state.movies);
  const [page, setPage] = useState(1);
  const [label, setLabel] = useState("");
  const [tab, setTab] = useState("1");

  useEffect(() => {
    dispatch(onCreateSession());
  }, [dispatch])

  useEffect(() => {
    if (!guestSessionId) return;

    if (tab === "1") {
      if (label) {
        dispatch(onSearchMovies({ label, page }));
      } else {
        dispatch(onGetMovies({ page }));
      }
    }
    if (tab === "2") {
      dispatch(onGetRatedMovie({guestSessionId, page}))
    }
  }, [dispatch, tab, label, page, guestSessionId]);

  const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(evt.target.value);
    setPage(1);
  };

  const handlePage = (page: number) => {
    setPage(page);
  };

  const handleTab = (key: string) => {
    setTab(key);
  };

  const debounceSearch = debounce(handleSearch, 2000);

  const items = [
    {
      key: "1",
      label: "Search",
      children: (
        <>
          <SearchForm debounceSearch={debounceSearch} />
          {load ? <OnSpinner /> : <CardList films={movies} guestSessionId={guestSessionId}/>}
          {error ? <ErrorMovies /> : null}
          {(!movies || movies.length === 0) ? null : <Pages 
          handlePage={handlePage}
           />}
        </>
      ),
    },
    {
      key: "2",
      label: "Rated",
      children: (
        <>

          {load ? <OnSpinner /> : <CardList films={rateMovies} guestSessionId={guestSessionId}/>}
          {error ? <ErrorMovies /> : null}
          {(!rateMovies || rateMovies.length === 0) ? null : <Pages 
          handlePage={handlePage}
           />}
        </>
      ),
    },
  ];

  return (
    <GenresProvider>
      <Layout style={{ width: "100%", minHeight: "100vh" }}>
        <Content style={{ width: "1220px", margin: "0 auto", height: "100%" }}>
          <Tabs 
          onChange={handleTab} 
          activeKey={tab} items={items} centered destroyInactiveTabPane />
        </Content>
      </Layout>
    </GenresProvider>
  );
};

export default App;
