import { useEffect, useState } from 'react';
import { useNumeratorContext } from '@numerator-io/sdk-react-client';

import Header from './components/Header';
import PetGameUI from './components/PetGameUI';
import { useIntegratedNumeratorContext } from './providers/IntegratedNumeratorProvider';
import { AnimalInfo } from './types';
import { getNewAnimalInfo } from './utils/common';

const default_off_img_size = 300;

function App() {
  const [imgSize, setImgSize] = useState<number>(default_off_img_size); // true for land, false for sea
  const [loading, setLoading] = useState<boolean>(false);
  const { getFeatureFlag } = useNumeratorContext();

  const { checkEnabledFeatureFlag, checkAsyncEnabledFeatureFlag } = useIntegratedNumeratorContext();
  const isLandAnimal = checkEnabledFeatureFlag('enable_land_pet', false); // use Polling
  const [animalInfo, setAnimalInfo] = useState<AnimalInfo>({});

  useEffect(() => {
    onQuestionChange();
  }, [isLandAnimal]);

  /******** Example of manually get updated flag value ********/
  const onGetFlagImgSize = async () => {
    setLoading(true);
    try {
      const gotImgSize = await getFeatureFlag('image_size', default_off_img_size);
      setImgSize(gotImgSize);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onQuestionChange = () => {
    const newAnimal = getNewAnimalInfo(animalInfo, isLandAnimal);
    setAnimalInfo(newAnimal);
  };

  const ActionBar = () => {
    return (
      <div className="box mr-5">
        <button className="button button--pan" onClick={onGetFlagImgSize}>
          <span>Get flag img_size</span>
        </button>
        <span>flag img_size: {loading ? 'loading...' : imgSize}</span>
        <div className="h-5"></div>
        <button className="button button--pan" onClick={onQuestionChange}>
          <span>Next question</span>
        </button>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-start h-fit">
        <ActionBar />
        <PetGameUI animalInfo={animalInfo} imgSize={imgSize} />
      </div>
    </div>
  );
}

export default App;
