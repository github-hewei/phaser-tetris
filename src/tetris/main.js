import Phaser from 'phaser'
import { Boot } from './boot'
import { Over } from './over'
import { Game } from './game'
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './constant'

const config = {
  type: Phaser.AUTO,
  width: WINDOW_WIDTH,
  height: WINDOW_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#ffffff',
  scene: [Boot, Over, Game],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  }
}

const StartGame = (parent) => {
  return new Phaser.Game({ ...config, parent })
}

export { StartGame }
