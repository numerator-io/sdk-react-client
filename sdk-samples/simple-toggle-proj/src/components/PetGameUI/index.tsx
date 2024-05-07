import React, { useState } from 'react';
import { AnimalInfo } from '../../types';
import { landAnimals, seaAnimals } from '../../constants';
import '../../styles.css';

interface PetGameUIProps {
  animalType: boolean;
}

const PetGameUI: React.FC<PetGameUIProps> = ({ animalType }) => {
  const animals = animalType ? landAnimals : seaAnimals;
  const randomIndex = Math.floor(Math.random() * animals.length);
  const animalInfo: AnimalInfo = animals[randomIndex];

  const [guess, setGuess] = useState('');

  const onCheck = (answer: string) => {
    if (answer === animalInfo.name) {
      alert('Correct answer');
    } else {
      alert('Wrong answer');
    }
  };

  return (
    <>
      <div className="card">
        <img
          className="card__img"
          src={
            animalInfo.img ??
            'https://png.pngtree.com/png-vector/20200224/ourmid/pngtree-colorful-loading-icon-png-image_2152960.jpg'
          }
          alt="animal to guess"
        />
        <span className="card__footer">
          <span>What kind of {animalInfo.type} animal is this?</span>
          <div className="field">
            <input
              type="text"
              placeholder="Enter your guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
            />
            <div className="line"></div>
          </div>
        </span>
        <span className="card__action">
          <button className="button button--pan" onClick={() => onCheck(guess)}>
            <span>Submit</span>
          </button>
        </span>
      </div>
    </>
  );
};

export default PetGameUI;
