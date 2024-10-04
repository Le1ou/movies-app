import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import { Tabs, Layout } from "antd";

import CardList from "../cardList/cardList";
import MovieApi from "../../services/api";
import OnSpinner from "../spinner/spinner";
import ErrorMovies from "../error/error";
import SearchForm from "../searchForm/searchForm";
import Pages from "../pages/pages";
import { GenresProvider } from "../../context/genres";

const { Content } = Layout;

const App = () => {
  const [films, setFilms] = useState([]);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [label, setLabel] = useState("");
  const [tab, setTab] = useState("1");
  const [guestSessionId, setGuestSessionId] = useState(null);
  const [ratedFilms, setRatedFilms] = useState([]);

  const movies = new MovieApi();

  useEffect(() => {
    onCreateSession();
    onLoadMovies();
  }, []);

  useEffect(() => {
    if (label) {
      onSearchMovies();
    } else {
      onLoadMovies();
    }
  }, [page, label]);

  useEffect(() => {
    if (tab === "2") {
      onRatedMovies();
    }
  }, [tab]);

  const onCreateSession = async () => {
    try {
      const res = await movies.createGuestSession();
      setGuestSessionId(res.guest_session_id);
    } catch (error) {
      ErrorMovies();
    }
  };

  const onRatedMovies = async () => {
    const res = await movies.getRatedMovies(guestSessionId, page);
    setRatedFilms(res.results);
  };
  console.log(ratedFilms);

  const onLoadMovies = async () => {
    try {
      const res = await movies.getMovies(page);
      console.log(res);
      onLoadingMovies(res.results);
    } catch (error) {
      onErrorMovies();
    }
  };

  const onSearchMovies = async () => {
    try {
      const res = await movies.searchMovies(label, page);
      console.log(res);
      if (res.results.length === 0) {
        throw new Error("No movies found");
      }
      onLoadingMovies(res.results);
    } catch (error) {
      onErrorMovies();
    }
  };

  const onLoadingMovies = (films) => {
    setFilms(films);
    setLoad(false);
    setError(false);
  };

  const handleSearch = (evt) => {
    setLabel(evt.target.value);
    setPage(1);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleTab = (key) => {
    setTab(key);
  };

  const onErrorMovies = () => {
    setLoad(false);
    setError(true);
  };

  const debounceSearch = debounce(handleSearch, 2000);

  const loading = load ? <OnSpinner /> : null;
  const erroring = error ? <ErrorMovies /> : null;
  const content =
    !load && !error ? <CardList films={films} setRatedFilms={setRatedFilms} guestSessionId={guestSessionId} /> : null;
  const rate = !load && !error ? <CardList films={ratedFilms} /> : null;

  const items = [
    {
      key: "1",
      label: "Search",
      children: (
        <>
          <SearchForm debounceSearch={debounceSearch} />
          {loading}
          {erroring}
          {content}
          <Pages handlePage={handlePage} />
        </>
      ),
    },
    {
      key: "2",
      label: "Rated",
      children: (
        <>
          {loading}
          {rate}
          {erroring}
          <Pages handlePage={handlePage} />
        </>
      ),
    },
  ];

  return (
    <GenresProvider>
      <Layout style={{ width: "100%", minHeight: "100vh" }}>
        <Content style={{ width: "1220px", margin: "0 auto", height: "100%" }}>
          <Tabs onChange={handleTab} activeKey={tab} items={items} centered destroyInactiveTabPane />
        </Content>
      </Layout>
    </GenresProvider>
  );
};

export default App;
