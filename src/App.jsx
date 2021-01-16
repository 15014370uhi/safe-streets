import React from 'react';
import './App.css';
import Nav from './components/Nav';
import FavouritesList from './components/FavouritesList';
import { FavouritesProvider } from './context/FavouritesContext'; //Supply favourites data to child components
import MapSection from './components/MapSection';

// Create component App
const App = () => {
  return (
    <FavouritesProvider>
      <div className="App">
        <Nav />        
        <FavouritesList />   
        <MapSection />   
      </div>
    </FavouritesProvider>
  );
};

export default App;
