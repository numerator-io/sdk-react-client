import { useEffect, useState } from 'react';
import Header from './components/Header';
import { useNumeratorContext } from '@numerator-io/sdk-react-client';
import PetGameUI from './components/PetGameUI';


function App() {
  const [isLandAnimal, setLandAnimal] = useState<boolean>(true); // true for land, false for sea
  const { handleFlagUpdated, getFeatureFlag } = useNumeratorContext();

  /******** Example of using an event listener to respond to periodic updates of a feature flag ********/
  // Subscribe to flag updates to adjust the displayed animal type based on the 'enable_land_pet' flag.
  useEffect(() => {
    const unregister = handleFlagUpdated((flags) => {
      console.log('Updated flags:', flags);
      const typeOfAnimal = flags['enable_land_pet'].value.booleanValue ?? false;
      setLandAnimal(typeOfAnimal);
    });

    // Clean up by unregistering the callback when the component unmounts or dependencies change.
    return unregister;
  }, [handleFlagUpdated]);

  /******** Example of manually get updated flag value ********/
  const onGetFlag = async () => {
    const typeOfAnimal = await getFeatureFlag('enable_land_pet', false);
    setLandAnimal(typeOfAnimal);
  };

  return (
    <div>
      <Header />
      <div>
        <button className="button button--pan" onClick={onGetFlag}>
          <span>Get</span>
        </button>
        {/* <button className="button button--pan" onClick={onReset}>
          <span>Reset</span>
        </button> */}
        <PetGameUI animalType={isLandAnimal} />
      </div>
    </div>
  );
}

export default App;
