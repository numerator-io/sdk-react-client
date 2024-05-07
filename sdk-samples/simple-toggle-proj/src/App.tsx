import { useEffect, useState } from 'react';
import Header from './components/Header';
import { useNumeratorContext } from '@numerator-io/sdk-react-client';
import PetGameUI from './components/PetGameUI';
import { useIntegratedNumeratorContext } from './providers/IntegratedNumeratorProvider';

function App() {
  const [isLandAnimal, setLandAnimal] = useState<boolean>(true); // true for land, false for sea
  const [loading, setLoading] = useState<boolean>(false); // true for land, false for sea
  const { handleFlagUpdated, getFeatureFlag, startPolling } = useNumeratorContext();
  const { checkEnabledFeatureFlag } = useIntegratedNumeratorContext();

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
    setLoading(true);
    try {
      const typeOfAnimal = await getFeatureFlag('enable_land_pet', false);
      setLandAnimal(typeOfAnimal);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  /******** Example of manually get updated flag value ********/
  const onGetFlagIntegrated = async () => {
    setLoading(true);
    try {
      const typeOfAnimal = await checkEnabledFeatureFlag('enable_land_pet', false);
      setLandAnimal(typeOfAnimal);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onStartPolling = () => {
    startPolling();
  };

  const ActionBar = () => {
    return (
      <div className="box mr-5">
        <button className="button button--pan" onClick={onStartPolling}>
          <span>Start polling</span>
        </button>
        <span>Polling status: running...</span>
        <div className="h-5"></div>
        <button className="button button--pan" onClick={onGetFlagIntegrated}>
          <span>Get</span>
        </button>
        <span>enable_land_pet: {loading ? 'loading...' : isLandAnimal ? 'True' : 'False'}</span>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-start h-fit">
        <ActionBar />
        <PetGameUI animalType={isLandAnimal} />
      </div>
    </div>
  );
}

export default App;
