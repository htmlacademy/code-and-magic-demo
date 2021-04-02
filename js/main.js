import startGame from './game.js';

const FIREBALL_SIZE = 22;
const WIZARD_WIDTH = 70;
const WIZARD_SPEED = 3;

function getFireballSpeed(isMovingLeft) {
  return isMovingLeft ? 2 : 5;
}

function getWizardHeight() {
  return 1.337 * WIZARD_WIDTH;
}

function getWizardX(gameFieldWidth) {
  return (gameFieldWidth - WIZARD_WIDTH) / 2;
}

function getWizardY(gameFieldHeight) {
  return gameFieldHeight / 3;
}

startGame(
  FIREBALL_SIZE,
  getFireballSpeed,
  WIZARD_WIDTH,
  WIZARD_SPEED,
  getWizardHeight,
  getWizardX,
  getWizardY
);
