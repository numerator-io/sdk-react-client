import React, { useState } from 'react';

import { AnimalInfo } from '../../types';
import '../../styles.css';

interface PetGameUIProps {
  animalInfo: AnimalInfo;
  imgSize: number;
}

const PetGameUI: React.FC<PetGameUIProps> = ({ animalInfo, imgSize }) => {
  const [guess, setGuess] = useState('');

  const onCheck = (answer: string) => {
    if (answer.toLowerCase() === animalInfo.name?.toLowerCase()) {
      alert('Correct answer');
    } else {
      alert('Wrong answer');
    }
  };

  return (
    <>
      <div className="card" style={{ width: imgSize }}>
        <img
          className="card__img"
          src={
            animalInfo.img ??
            'https://png.pngtree.com/png-vector/20200224/ourmid/pngtree-colorful-loading-icon-png-image_2152960.jpg'
          }
          alt="animal to guess"
        />
        <span className="card__footer">
          <span>What {animalInfo.type} animal is this?</span>
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
