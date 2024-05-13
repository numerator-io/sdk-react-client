import { landAnimals, seaAnimals } from '../constants';
import { AnimalInfo } from '../types';

export const getNewAnimalInfo = (currentAnimalInfo: AnimalInfo, isLandAnimal: boolean) => {
  const animals = isLandAnimal ? landAnimals : seaAnimals;
  let randomIndex = Math.floor(Math.random() * animals.length);

  // Ensure the new randomIndex is different from the current one
  while (animals[randomIndex].name === currentAnimalInfo.name) {
    randomIndex = Math.floor(Math.random() * animals.length);
  }

  return animals[randomIndex];
};
