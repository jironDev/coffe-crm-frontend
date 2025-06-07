// src/components/SearchBar.tsx
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex mb-3">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <button type="submit" className="btn btn-primary"><SearchIcon/></button>
    </form>
  );
};

export default SearchBar;
