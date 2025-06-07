import React from 'react';
import SearchBar from '../components/SearchBar'; // ajusta la ruta si es necesario



const Home: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Buscando desde Home:', query);
    // Aquí podrías aplicar un filtro, buscar en la API, etc.
  };


  

  return (
    <div className="container mt-5">
      <h1 className="h1 text-center mb-5 american-typewriter">Welcome to Coffee CRM</h1>
      <SearchBar onSearch={handleSearch} />
      
      {/* Aquí puedes mostrar resultados o la lista filtrada */}
    </div>
  );
};

export default Home;
