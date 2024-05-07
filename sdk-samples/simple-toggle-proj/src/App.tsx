import { useEffect, useState } from "react";
import Header from "./components/Header";
import { useNumeratorContext } from "@numerator-io/sdk-react-client";
import PetGameUI from "./components/PetGameUI";
import { AnimalInfo } from "./types";
import { landAnimals, seaAnimals } from "./constants";

function App() {
  const { handleFlagUpdated } = useNumeratorContext();
  const [animal, setAnimal] = useState<AnimalInfo>({});

  // Subscribe to flag updates to adjust the displayed animal type based on the 'enable_land_pet' flag.
  useEffect(() => {
    const unregister = handleFlagUpdated((flags) => {
      console.log("Updated flags:", flags);
      const typeOfAnimal = flags["enable_land_pet"].value.booleanValue ?? false; // true for land, false for sea
      const animals = typeOfAnimal ? landAnimals : seaAnimals;
      const randomIndex = Math.floor(Math.random() * animals.length);
      setAnimal(animals[randomIndex]);
    });

    // Clean up by unregistering the callback when the component unmounts or dependencies change.
    return unregister;
  }, [handleFlagUpdated]);

  return (
    <div>
      <Header />
      <PetGameUI animalInfo={animal} />
    </div>
  );
}

export default App;
