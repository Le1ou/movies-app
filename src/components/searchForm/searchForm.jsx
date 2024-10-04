import React from "react";
import { Input } from "antd";

function SearchForm({ debounceSearch }) {
  return <Input onChange={debounceSearch} size="small" placeholder="The movie you're looking for" />;
}

export default SearchForm;
