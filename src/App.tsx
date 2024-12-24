import { useState } from "react";
import Header from "./components/Header";
import PokeCard from "./components/PokeCard";
import SideNav from "./components/SideNav";

const App = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(0);
  const [showSideMenu, setShowSideMenu] = useState<boolean>(false);

  const handleToggleMenu = () => {
    setShowSideMenu(!showSideMenu);
  };

  const handleCloseMenu = () => {
    setShowSideMenu(false);
  };

  return (
    <>
      <Header handleToggleMenu={handleToggleMenu} />
      <SideNav
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
        handleCloseMenu={handleCloseMenu}
        showSideMenu={showSideMenu}
      />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  );
};
export default App;
