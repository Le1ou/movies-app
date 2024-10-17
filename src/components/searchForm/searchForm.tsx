import React from "react";
import { Input } from "antd";

interface SearchFormProps {
  debounceSearch: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ debounceSearch }) => {
  return <Input onChange={debounceSearch} size="small" placeholder="The movie you're looking for" />;
}

export default SearchForm;
