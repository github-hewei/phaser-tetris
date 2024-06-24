import Phaser from 'phaser'
import { Brick } from './brick'
import { MainBox } from './mainBox'
import { DEBUG, WINDOW_WIDTH } from './constant'

const STATE = {
  UNSTART: 0,
  RUNNING: 1,
  PAUSED: 2,
  ENDED: 3
}

const DIRECTION = {
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })

    this.$cursorKeys
    this.$delay
    this.$timer
    this.$cleanTimer
    this.$state
    this.$score
    this.$brick
    this.$nextBrick
    this.$mainBox
    this.$nextBox
    this.$maskSize = 4
    this.$audioBgm
    this.$audioDing
    this.$keys
    this.$nextShape
    this.$scoreText
    this.$level
  }

  preload() {
    this.load.image('background', 'assets/background.jpg')
    this.load.audio('bgm', 'assets/bgm.mp3')
    this.load.audio('ding', 'assets/down.mp3')
  }

  create() {
    let width = this.cameras.main.width
    let height = this.cameras.main.height
    this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(width, height)

    this.$state = STATE.UNSTART
    this.$mainBox = new MainBox(this, 50, 10)
    this.$mainBox.$display()
    this.$mainBox.$debugDisplayText()
    this.add.existing(this.$mainBox)

    this.$audioBgm = this.sound.add('bgm', { loop: true, volume: 0.3 })
    this.$audioDing = this.sound.add('ding', { volume: 0.3 })

    this.$cursorKeys = this.input.keyboard.createCursorKeys()
    this.$keys = this.input.keyboard.addKeys('I,O,T,L,J,S,Z')

    this.add
      .text(Math.ceil(WINDOW_WIDTH / 2), 80, 'TETRIS', {
        fontFamily: 'Arial Black',
        fontSize: 80,
        color: '#0f1b35',
        stroke: '#ffffff',
        strokeThickness: 8,
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(100)

    this.$scoreText = this.add
      .text(WINDOW_WIDTH - 200, 500, `得分: 0`, {
        fontFamily: 'Arial Black',
        fontSize: 30,
        color: '#0f1b35',
        stroke: '#ffffff',
        strokeThickness: 8,
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(100)
  }

  update() {
    this.$checkKeyboardInput()
  }

  $touchTimer() {
    let eventConfig = {
      delay: this.$delay,
      loop: true,
      startAt: this.$delay,
      callback: () => {
        this.$gameLoop()
      }
    }

    if (!this.$timer) {
      this.$timer = this.time.addEvent(eventConfig)
    } else {
      this.$timer.reset(eventConfig)
    }
  }

  $touchCleanTimer() {
    let eventConfig = {
      delay: 100,
      loop: true,
      startAt: 100,
      callback: () => {
        this.$checkClear()
      }
    }

    if (!this.$cleanTimer) {
      this.$cleanTimer = this.time.addEvent(eventConfig)
    } else {
      this.$cleanTimer.reset(eventConfig)
    }
  }

  $gameStart() {
    this.$delay = 1000
    this.$score = 0
    this.$level = 1
    this.$state = STATE.RUNNING
    this.$touchTimer()
    this.$touchCleanTimer()

    if (this.$audioBgm) {
      this.$audioBgm.play()
    }
  }

  $gamePause() {
    this.$state = STATE.PAUSED

    if (this.$audioBgm) {
      this.$audioBgm.pause()
    }
  }

  $gameResume() {
    this.$state = STATE.RUNNING

    if (this.$audioBgm) {
      this.$audioBgm.resume()
    }
  }

  $gameLoop() {
    if (this.$state !== STATE.RUNNING) {
      return
    }

    console.log('step', this.$score)

    if (!this.$brick) {
      this.$brickRefresh()
    } else {
      this.$brickDown()
    }
  }

  $checkClear() {
    for (let i = 0; i < this.$mainBox.$matrix.length; i++) {
      let result = this.$mainBox.$matrix[i].every(Boolean)

      if (result) {
        this.$mainBox.$clearRow(i)

        let score = this.$score + 1
        this.$setScore(score)

        if (score % 10 === 0) {
          this.$setLevel(this.$level + 1)
        }
      }
    }
  }

  $brickRefresh() {
    if (this.$brick) {
      this.$mainBox.$mapping(this.$brick.$matrix, this.$brick.$mx, this.$brick.$my)
      this.$brick.$fixed = 1
    }

    if (this.$nextBrick) {
      let { $shape, $index } = this.$nextBrick

      if (this.$nextShape) {
        $shape = this.$nextShape
        $index = null
        this.$nextShape = null
      }

      this.$nextBrick.destroy()
      this.$brick = new Brick(this, $shape, $index)
    } else {
      this.$brick = new Brick(this)
    }

    this.$nextBrick = new Brick(this)
    this.$nextBrick.$display()
    this.$nextBrick.$debugDisplayText()
    this.$nextBrick.setX(550)
    this.$nextBrick.setY(200)
    this.add.existing(this.$nextBrick)

    let x = Math.floor((this.$mainBox.$w - this.$brick.$ex - this.$brick.$sx) / 2)
    let y = this.$mainBox.$maskSize - this.$brick.$ey - 1

    this.$brick.$display()
    this.$brick.$debugDisplayText()
    this.$brick.$setMXY(x, y)
    this.$mainBox.add(this.$brick)
  }

  $gameOver() {
    console.log('Game Over')
    this.$state = STATE.ENDED

    if (this.$audioBgm) {
      this.$audioBgm.stop()
    }
  }

  $brickDown() {
    let result = this.$brickMove(DIRECTION.DOWN)

    if (result) {
      return
    }

    if (this.$brick.$my + this.$brick.$sy < this.$mainBox.$maskSize) {
      this.$gameOver()
      return
    }

    this.$audioDing.play()
    this.$brickRefresh()
  }

  $checkKeyboardInput() {
    let { left, right, up, down, space } = this.$cursorKeys

    if (this.input.keyboard.checkDown(space, Number.MAX_SAFE_INTEGER)) {
      switch (this.$state) {
        case STATE.UNSTART:
        case STATE.ENDED:
          this.$gameStart()
          break
        case STATE.RUNNING:
          this.$gamePause()
          break
        case STATE.PAUSED:
          this.$gameResume()
          break
      }
    }

    let durationX = Math.min(this.$delay, 150)
    let durationY = Math.min(this.$delay, 40)

    if (this.input.keyboard.checkDown(up, Number.MAX_SAFE_INTEGER)) {
      if (this.$state !== STATE.RUNNING) {
        return
      }

      this.$brickChange()
    }

    if (this.input.keyboard.checkDown(down, durationY)) {
      if (this.$state !== STATE.RUNNING) {
        return
      }

      this.$brickDown()
    }

    if (this.input.keyboard.checkDown(left, durationX)) {
      if (this.$state !== STATE.RUNNING) {
        return
      }

      this.$brickMove(DIRECTION.LEFT)
    }

    if (this.input.keyboard.checkDown(right, durationX)) {
      if (this.$state !== STATE.RUNNING) {
        return
      }

      this.$brickMove(DIRECTION.RIGHT)
    }

    // 监听字母按键
    if (DEBUG) {
      for (let key in this.$keys) {
        if (this.input.keyboard.checkDown(this.$keys[key], Number.MAX_SAFE_INTEGER)) {
          if (this.$state !== STATE.RUNNING) {
            return
          }

          this.$nextShape = key
        }
      }
    }
  }

  $brickMove(direction) {
    if (!this.$brick) {
      return false
    }

    let offsetX = 0
    let offsetY = 0

    switch (direction) {
      case DIRECTION.DOWN:
        offsetY = 1
        break
      case DIRECTION.LEFT:
        offsetX = -1
        break
      case DIRECTION.RIGHT:
        offsetX = 1
    }

    let result = this.$checkIntersect(
      this.$mainBox.$matrix,
      this.$brick.$matrix,
      this.$brick.$mx + offsetX,
      this.$brick.$my + offsetY,
      this.$brick.$sx,
      this.$brick.$sy,
      this.$brick.$ex,
      this.$brick.$ey
    )

    if (result) {
      return false
    }

    this.$brick.$setMXY(this.$brick.$mx + offsetX, this.$brick.$my + offsetY)
    return true
  }

  $brickChange() {
    if (!this.$brick) {
      return false
    }

    let { matrix, index, sx, sy, ex, ey } = this.$brick.$getNextMatrix()
    let result = this.$checkIntersect(
      this.$mainBox.$matrix,
      matrix,
      this.$brick.$mx,
      this.$brick.$my,
      sx,
      sy,
      ex,
      ey
    )

    if (result) {
      return false
    }

    this.$brick.$setIndex(index)
    this.$brick.$display()
    this.$brick.$debugDisplayText()
    return true
  }

  /**
   * 检测两个矩形是否相交
   */
  $checkIntersect(container, matrix, x, y, sx, sy, ex, ey) {
    let w = container[0].length
    let h = container.length

    // top
    if (y + sy < 0) {
      return 1
    }

    // bottom
    if (y + ey > h - 1) {
      return 2
    }

    // left
    if (x + sx < 0) {
      return 3
    }

    // right
    if (x + ex > w - 1) {
      return 4
    }

    for (let i = sy; i <= ey; i++) {
      for (let j = sx; j <= ex; j++) {
        if (matrix[i][j] && container[i + y][j + x]) {
          return 5
        }
      }
    }

    return 0
  }

  $setScore(score) {
    this.$score = score
    this.$scoreText.setText(`得分: ${this.$score}`)
  }

  $setLevel(level) {
    this.$level = level
    let delay = Math.max(1000 - (this.$level - 1) * 100, 80)
    this.$delay = delay
    this.$touchTimer()
  }
}
