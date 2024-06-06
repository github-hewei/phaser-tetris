import Phaser from 'phaser'
import { UNIT_SIZE, TETRIS_MATRIX, TETRIS_SIGN } from './constant'

export class Brick extends Phaser.GameObjects.Container {
  constructor(scene, shape, index) {
    super(scene, 0, 0)

    this.$size = UNIT_SIZE
    this.$shape
    this.$index
    this.$matrices
    this.$matrix
    this.$sx
    this.$sy
    this.$ex
    this.$ey

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
    this.$matrix = this.$matrices[this.$index]
    this.$initRXY()
  }

  $getNextIndex() {
    return (this.$index + 1) % this.$matrices.length
  }

  $getNextMatrix() {
    let index = this.$getNextIndex()
    let matrix = this.$matrices[index]

    let [sx, sy] = this.$getSXY(matrix)
    let [ex, ey] = this.$getEXY(matrix)
    return { matrix, index, sx, sy, ex, ey }
  }

  $setMXY(x, y) {
    this.$mx = x
    this.$my = y
    this.setPosition(this.$mx * this.$size, this.$my * this.$size)
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
    this.removeAll(true)

    for (let i = 0; i < this.$matrix.length; i++) {
      for (let j = 0; j < this.$matrix[i].length; j++) {
        if (!this.$matrix[i][j]) {
          continue
        }

        this.add(this.$draw(j, i))
      }
    }
  }

  $draw(x, y) {
    const graphics = this.scene.add.graphics({ x: x * this.$size, y: y * this.$size })
    graphics.fillStyle(0x666666, 1)
    graphics.fillRect(1, 1, this.$size, this.$size)

    graphics.fillStyle(0xff0000, 1)
    graphics.fillRect(0, 0, this.$size - 1, this.$size - 1)
    return graphics
  }

  $checkClear(y) {
    // index > brick.my + brick.sy && index < brick.my + ey + 1
    // console.log("checkClear", index, this.$my, this.$sy, this.$ey);
    // my sy ey y
    // if (y < this.$my + this.$sy + 1 || y > this.$my + this.$ey) {
    //   return
    // }
    // let row = y - this.$my + this.$sy
    // console.log("row", row)
    // this.$matrix.splice(row, 1)
    // this.$my += 1
  }
}
