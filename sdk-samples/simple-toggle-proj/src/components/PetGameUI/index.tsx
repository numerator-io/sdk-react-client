import React, { useState } from "react";
import { AnimalInfo } from "../../types";
import "./styles.css";

interface PetGameUIProps {
  animalInfo: AnimalInfo;
}

const PetGameUI: React.FC<PetGameUIProps> = ({ animalInfo }) => {
  const [guess, setGuess] = useState("");

  const onCheck = (answer: string) => {
    if (answer === animalInfo.name) {
      alert("Correct answer");
    } else {
      alert("Wrong answer");
    }
  };

  const onReset = () => {
    setGuess(""); // Clear the input field
  };

  return (
    <div>
      <button className="button button--pan" onClick={onReset}>
        <span>Reset</span>
      </button>
      <div className="card">
        <img
          className="card__img"
          src={
            animalInfo.img ??
            "https://png.pngtree.com/png-vector/20200224/ourmid/pngtree-colorful-loading-icon-png-image_2152960.jpg"
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
    </div>
  );
};

export default PetGameUI;
