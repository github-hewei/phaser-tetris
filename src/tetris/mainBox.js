import Phaser from 'phaser'
import { MAIN_SIZE_X, MAIN_SIZE_Y, UNIT_SIZE, MASK_SIZE, DEBUG } from './constant'

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

    this.$debugDisplayText()
  }

  $display() {
    let name = 'mainbox_item'
    this.remove(this.getAll('$name', name), true)

    for (let y = 0; y < this.$matrix.length; y++) {
      for (let x = 0; x < this.$matrix[y].length; x++) {
        // let n = this.$matrix[i][j]
        const graphics = this.scene.add.graphics({ x: x * this.$size, y: y * this.$size })
        graphics.fillStyle(0x666666, 1)
        graphics.fillRect(1, 1, this.$size, this.$size)

        graphics.fillStyle(0xebebeb, 1)
        graphics.fillRect(0, 0, this.$size - 1, this.$size - 1)
        graphics.setDepth(1)
        graphics.$name = name
        this.add(graphics)
      }
    }

    this.$setMask()
  }

  $setMask() {
    let maskGraphics = this.scene.make.graphics({
      x: 0,
      y: 0
    })
    maskGraphics.fillStyle(0xffffff)
    maskGraphics.fillRect(
      this.x + 1,
      this.y + this.$maskSize * this.$size + 1,
      this.$w * this.$size,
      this.$h * this.$size - this.$maskSize * this.$size
    )

    this.setMask(maskGraphics.createGeometryMask())
  }

  $debugDisplayText() {
    if (!DEBUG) return
    let name = 'debug_text_mainbox'
    this.remove(this.getAll('$name', name), true)

    for (let i = 0; i < this.$matrix.length; i++) {
      for (let j = 0; j < this.$matrix[i].length; j++) {
        let n = this.$matrix[i][j]
        let x = j * this.$size + this.$size - 10
        let y = i * this.$size + this.$size - 14
        const text = this.scene.add.text(x, y, n, {
          fontSize: '10px',
          fill: '#333333',
          fontFamily: 'Arial',
          align: 'center'
        })
        text.$name = name
        this.add(text)
      }
    }
  }

  $clearRow(row) {
    this.$matrix.splice(row, 1)
    this.$matrix.unshift(new Array(this.$w).fill(0))
    this.$debugDisplayText()

    let bricks = this.getAll('$name', 'brick')

    for (let brick of bricks) {
      if (!brick.$fixed) continue
      if (row >= brick.$my + brick.$sy && row <= brick.$my + brick.$ey) {
        let k = row - brick.$my
        let len = brick.$matrix[k].length
        brick.$matrix.splice(k, 1)
        brick.$matrix.unshift(new Array(len).fill(0))
        brick.$display()
        brick.$debugDisplayText()

        // 如果矩阵为空则删除此对象
        let result = brick.$matrix.every((item) => item.every((item) => item == 0))

        if (result) {
          this.remove(brick, true)
        }
      }

      if (brick.$my + brick.$ey < row) {
        brick.$setMXY(brick.$mx, brick.$my + 1)
      }
    }
  }
}
