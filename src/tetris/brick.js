import Phaser from 'phaser'
import { UNIT_SIZE, TETRIS_MATRIX, TETRIS_SIGN, TETRIS_COLOR, DEBUG } from './constant'

export class Brick extends Phaser.GameObjects.Container {
  constructor(scene, shape, index) {
    super(scene, 0, 0)

    this.$name = 'brick'
    this.$size = UNIT_SIZE
    this.$color = TETRIS_COLOR
    this.$shape
    this.$index
    this.$matrices
    this.$matrix
    this.$sx
    this.$sy
    this.$ex
    this.$ey
    this.$fixed = 0

    this.$mx = 0
    this.$my = 0

    this.$setShape(shape || this.$getRandomShape())
    this.$setIndex(index || this.$getRandomIndex())
  }

  $setShape(shape) {
    this.$shape = shape
    this.$matrices = TETRIS_MATRIX[this.$shape]
  }

  $setIndex(index) {
    this.$index = index
    this.$matrix = [...this.$matrices[this.$index]]
    this.$initRXY()
  }

  $getNextIndex() {
    return (this.$index + 1) % this.$matrices.length
  }

  $getNextMatrix() {
    let index = this.$getNextIndex()
    let matrix = [...this.$matrices[index]]

    let [sx, sy] = this.$getSXY(matrix)
    let [ex, ey] = this.$getEXY(matrix)
    return { matrix, index, sx, sy, ex, ey }
  }

  $setMXY(x, y) {
    this.$mx = x
    this.$my = y
    this.setPosition(this.$mx * this.$size, this.$my * this.$size)

    // 补间动画
    // let tween = this.scene.tweens.add({
    //   targets: this,
    //   x: this.$mx * this.$size,
    //   y: this.$my * this.$size,
    //   duration: 120,
    //   ease: Phaser.Math.Easing.Bounce.Out
    // })
  }

  $getRandomShape() {
    return TETRIS_SIGN[this.$randomInt(0, TETRIS_SIGN.length - 1)]
  }

  $getRandomIndex() {
    return this.$randomInt(0, this.$matrices.length - 1)
  }

  $randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  $initRXY() {
    {
      let [x, y] = this.$getSXY(this.$matrix)
      this.$sx = x
      this.$sy = y
    }
    {
      let [x, y] = this.$getEXY(this.$matrix)
      this.$ex = x
      this.$ey = y
    }
  }

  $getSXY(matrix) {
    let x = -1
    let y = -1

    for (let i = 0; i < matrix.length; i++) {
      let sum = matrix[i].reduce((a, b) => a + b, 0)

      if (sum > 0) {
        y = i

        for (let j = 0; j < matrix[i].length; j++) {
          let sum = 0

          for (let y = i; y < matrix.length; y++) {
            sum += matrix[y][j]
          }

          if (sum > 0) {
            x = j
            break
          }
        }

        break
      }
    }

    return [x, y]
  }

  $getEXY(matrix) {
    let x = -1
    let y = -1

    for (let i = matrix.length - 1; i >= 0; i--) {
      let sum = matrix[i].reduce((a, b) => a + b, 0)

      if (sum > 0) {
        y = i

        for (let j = matrix[i].length - 1; j >= 0; j--) {
          let sum = 0

          for (let y = i; y >= 0; y--) {
            sum += matrix[y][j]
          }

          if (sum > 0) {
            x = j
            break
          }
        }

        break
      }
    }

    return [x, y]
  }

  $display() {
    let name = 'brick_item'
    this.remove(this.getAll('$name', name), true)

    for (let y = 0; y < this.$matrix.length; y++) {
      for (let x = 0; x < this.$matrix[y].length; x++) {
        if (!this.$matrix[y][x]) {
          continue
        }

        const n = this.$matrix[y][x]
        const graphics = this.scene.add.graphics({ x: x * this.$size, y: y * this.$size })

        graphics.fillStyle(0x666666, 1)
        graphics.fillRect(1, 1, this.$size, this.$size)

        graphics.fillStyle(this.$color[n], 1)
        graphics.fillRect(0, 0, this.$size - 1, this.$size - 1)
        graphics.$name = name

        this.add(graphics)
      }
    }
  }

  $debugDisplayText() {
    if (!DEBUG) return
    let name = 'debug_brick_text'
    this.remove(this.getAll('$name', name), true)

    for (let y = 0; y < this.$matrix.length; y++) {
      for (let x = 0; x < this.$matrix[y].length; x++) {
        if (!this.$matrix[y][x]) {
          continue
        }

        let n = this.$matrix[y][x]
        const text = this.scene.add.text(x * this.$size, y * this.$size, n, {
          fontSize: '10px',
          fill: '#ffffff',
          fontFamily: 'Arial',
          align: 'center'
        })
        text.$name = name
        this.add(text)
      }
    }
  }
}
