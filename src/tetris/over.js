import Phaser from 'phaser'

export class Over extends Phaser.Scene {
  constructor() {
    super('Over')
  }

  preload() {}

  create(data) {
    this.$score = data ? data.score : 0

    let width = this.cameras.main.width
    let height = this.cameras.main.height
    this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(width, height)

    this.add
      .text(Math.ceil(width / 2), 200, 'Game Over', {
        fontFamily: 'Arial Black',
        fontSize: 80,
        color: '#0f1b35',
        stroke: '#ffffff',
        strokeThickness: 8,
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(100)

    this.add
      .text(Math.ceil(width / 2), 400, `得分: ${this.$score}`, {
        fontFamily: 'Arial Black',
        fontSize: 40,
        color: '#0f1b35',
        stroke: '#ffffff',
        strokeThickness: 8,
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(100)

    // 添加开始按钮
    let startText = this.add
      .text(Math.ceil(width / 2), 700, '再来一次', {
        fontFamily: 'Arial Black',
        fontSize: 35,
        color: '#ffffff',
        stroke: '#333333',
        strokeThickness: 10,
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(100)

    // 添加点击事件
    startText.setInteractive({ useHandCursor: true })
    startText.on('pointerdown', this.$startGame, this)

    // 添加呼吸效果
    this.tweens.add({
      targets: startText,
      scale: {
        getStart: () => 0.9,
        getEnd: () => 1
      },
      ease: 'Sine.easeInOut',
      duration: 400,
      repeat: -1,
      yoyo: true
    })
  }

  $startGame() {
    this.scene.start('Game', { start: true })
  }
}
