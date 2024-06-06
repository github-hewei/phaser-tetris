import Phaser from 'phaser'
import { MAIN_SIZE_X, MAIN_SIZE_Y, UNIT_SIZE, MASK_SIZE } from './constant'

export class MainBox extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y)

    this.$size = UNIT_SIZE
    this.$w = MAIN_SIZE_X
    this.$h = MAIN_SIZE_Y
    this.$matrix = this.$getMatrix(this.$w, this.$h)
    this.$maskSize = MASK_SIZE
    this.$index = 0
    this.$brickList = []
  }

  $getMatrix(w, h) {
    let data = []

    for (let i = 0; i < h; i++) {
      let arr = []

      for (let j = 0; j < w; j++) {
        arr.push(0)
      }

      data.push(arr)
    }

    return data
  }

  $mapping(matrix, x, y) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]) {
          this.$matrix[i + y][j + x] = matrix[i][j]
        }
      }
    }
  }

  $display() {
    // console.log(this.$getAll('BG', 1))
    // let list = this.$getAll('BG', 1)
    // let list2 = this.$getAll('BR', 1)
    // console.log("count", list.length, list2.length)
    // this.$remove(list, true)

    for (let i = 0; i < this.$matrix.length; i++) {
      for (let j = 0; j < this.$matrix[i].length; j++) {
        // this.$add(this.$draw(j, i, this.$matrix[i][j]))
        this.add(this.$draw(j, i, 0))
      }
    }
  }

  $draw(x, y, n) {
    const graphics = this.scene.add.graphics({ x: x * this.$size, y: y * this.$size })
    graphics.fillStyle(0x666666, 1)
    graphics.fillRect(1, 1, this.$size, this.$size)

    let color = n ? 0xff0000 : 0xebebeb
    graphics.fillStyle(color, 1)
    graphics.fillRect(0, 0, this.$size - 1, this.$size - 1)

    graphics.BG = 1
    graphics.setDepth(1)

    return graphics
  }

  $addBrick(brick) {
    this.$index++
    let name = `brick_${this.$index}`
    this.$brickList.push(name)
    brick.setName(name)
    brick.setDepth(2)
    brick.BR = 1
    this.add(brick)
  }

  $clearRow(index) {
    this.$matrix.splice(index, 1)
    this.$matrix.unshift(new Array(this.$w).fill(0))

    let bricks = this.getAll('BR', 1)
    for (let brick of bricks) {
      brick.$checkClear(index)
    }
  }
}
