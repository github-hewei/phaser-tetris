import Phaser from 'phaser'
import { Brick } from './brick'
import { MainBox } from './mainBox'

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
    this.$state
    this.$step
    this.$score
    this.$brick
    this.$nextBrick
    this.$mainBox
    this.$nextBox
    this.$maskSize = 4
  }

  create() {
    this.$state = STATE.UNSTART
    this.$cursorKeys = this.input.keyboard.createCursorKeys()
    this.$mainBox = new MainBox(this, 10, 10)
    this.$mainBox.$display()
    this.add.existing(this.$mainBox)
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

  $gameStart() {
    this.$delay = 2000
    this.$score = 0
    this.$step = 0
    this.$state = STATE.RUNNING
    this.$touchTimer()
  }

  $gamePause() {
    this.$state = STATE.PAUSED
  }

  $gameResume() {
    this.$state = STATE.RUNNING
  }

  $gameLoop() {
    if (this.$state !== STATE.RUNNING) {
      return
    }

    this.$step++
    console.log('step', this.$step)

    if (!this.$brick) {
      console.log(111)
      this.$brickRefresh()
    } else {
      console.log(222)
      this.$brickFall()
    }

    this.$checkClear()

    // 下落
    // 触底
    // 消除
    // 结束
  }

  $checkClear() {
    for (let i = 0; i < this.$mainBox.$matrix.length; i++) {
      let result = this.$mainBox.$matrix[i].every(Boolean)

      if (result) {
        this.$mainBox.$clearRow(i)
        this.$score += 1
      }
    }
  }

  $brickRefresh() {
    if (this.$brick) {
      this.$mainBox.$mapping(this.$brick.$matrix, this.$brick.$mx, this.$brick.$my)
      // this.$mainBox.$display()
      // this.$brick.$destroy()
    }

    if (this.$nextBrick) {
      let { $shape, $index } = this.$nextBrick
      this.$nextBrick.destroy()
      this.$brick = new Brick(this, $shape, $index)
    } else {
      this.$brick = new Brick(this)
    }

    this.$nextBrick = new Brick(this)
    this.$nextBrick.$display()
    this.add.existing(this.$nextBrick)

    let x = Math.floor((this.$mainBox.$w - this.$brick.$ex - this.$brick.$sx) / 2)
    let y = this.$mainBox.$maskSize - this.$brick.$ey - 1

    // let result = this.$checkIntersect(
    //   this.$mainBox.$matrix,
    //   this.$brick.$matrix,
    //   x,
    //   y,
    //   this.$brick.$sx,
    //   this.$brick.$sy,
    //   this.$brick.$ex,
    //   this.$brick.$ey
    // )

    // if (result) {
    //   this.$gameOver()
    //   return
    // }

    // this.$mainBox.$add(this.$brick)
    this.$brick.$display()
    this.$brick.$setMXY(x, y)
    this.$mainBox.$addBrick(this.$brick)

  }

  $gameOver() {
    console.log('Game Over')
    this.$state = STATE.ENDED
  }

  $brickFall() {
    let result = this.$brickMove(DIRECTION.DOWN)

    if (result) {
      return
    }

    if (this.$brick.$my + this.$brick.$sy < this.$mainBox.$maskSize) {
      this.$gameOver()
      return
    }

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

      this.$brickFall()
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
}
