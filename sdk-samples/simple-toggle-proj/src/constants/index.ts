import { AnimalInfo } from "../types";

// Define land animals
const landAnimals: AnimalInfo[] = [
  {
    type: 'land',
    img: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Elephant.jpg',
    name: 'Elephant',
  },
  {
    type: 'land',
    img: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Lion_%28Unsplash%29.jpg',
    name: 'Lion',
  },
  {
    type: 'land',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Leopard.jpg/800px-Leopard.jpg',
    name: 'Leopard',
  },
  // Add more land animals as needed
];

// Define sea animals
const seaAnimals: AnimalInfo[] = [
  {
    type: 'sea',
    img: 'https://t3.ftcdn.net/jpg/03/71/76/64/360_F_371766448_2M5arF5MIev80GIA8b6wSecGPQgoYeRQ.jpg',
    name: 'Dolphin',
  },
  {
    type: 'sea',
    img: 'https://a-z-animals.com/media/2020/01/shutterstock_383911420-768x576.jpg',
    name: 'Shark',
  },
  {
    type: 'sea',
    img: 'https://t4.ftcdn.net/jpg/04/30/86/41/360_F_430864194_8Nf34P9NeVZzVHRabIq89BOWe9JAUfjT.jpg',
    name: 'Starfish',
  },
  // Add more sea animals as needed
];

export { landAnimals, seaAnimals };
