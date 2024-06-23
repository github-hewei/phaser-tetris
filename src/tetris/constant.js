// 窗口宽度
export const WINDOW_WIDTH = 1024

// 窗口高度
export const WINDOW_HEIGHT = 768

// 方块大小
export const UNIT_SIZE = 30

// 游戏区域横向格数
export const MAIN_SIZE_X = 10

// 游戏区域纵向格数
export const MAIN_SIZE_Y = 24

// 遮罩区域格数
export const MASK_SIZE = 4

// 键盘连续触发间隔
export const KEYBOARD_DURATION = 100

// 俄罗斯方块名字
export const TETRIS_SIGN = ['I', 'O', 'T', 'L', 'J', 'S', 'Z']

// 调试模式
export const DEBUG = true;

// 俄罗斯方块颜色
export const TETRIS_COLOR = {
  1: 0xff0000, // 红I
  2: 0x44d657, // 绿O
  3: 0xfdee21, // 黄T
  4: 0x33c1ff, // 蓝L
  5: 0xd8b3e7, // 紫J
  6: 0x97a2e4, // 兰S
  7: 0x73e3ee, // 青Z
}

// 俄罗斯方块矩阵
export const TETRIS_MATRIX = {
  I: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ]
  ],
  O: [
    [
      [2, 2],
      [2, 2]
    ]
  ],
  T: [
    [
      [0, 0, 0],
      [0, 3, 0],
      [3, 3, 3]
    ],
    [
      [0, 3, 0],
      [0, 3, 3],
      [0, 3, 0]
    ],
    [
      [0, 0, 0],
      [3, 3, 3],
      [0, 3, 0]
    ],
    [
      [0, 3, 0],
      [3, 3, 0],
      [0, 3, 0]
    ]
  ],
  L: [
    [
      [4, 0, 0],
      [4, 0, 0],
      [4, 4, 0]
    ],
    [
      [0, 0, 0],
      [4, 4, 4],
      [4, 0, 0]
    ],
    [
      [0, 4, 4],
      [0, 0, 4],
      [0, 0, 4]
    ],
    [
      [0, 0, 0],
      [0, 0, 4],
      [4, 4, 4]
    ]
  ],
  J: [
    [
      [0, 0, 5],
      [0, 0, 5],
      [0, 5, 5]
    ],
    [
      [0, 0, 0],
      [5, 0, 0],
      [5, 5, 5]
    ],
    [
      [5, 5, 0],
      [5, 0, 0],
      [5, 0, 0]
    ],
    [
      [0, 0, 0],
      [5, 5, 5],
      [0, 0, 5]
    ]
  ],
  S: [
    [
      [6, 0, 0],
      [6, 6, 0],
      [0, 6, 0]
    ],
    [
      [0, 0, 0],
      [0, 6, 6],
      [6, 6, 0]
    ]
  ],
  Z: [
    [
      [0, 7, 0],
      [7, 7, 0],
      [7, 0, 0]
    ],
    [
      [0, 0, 0],
      [7, 7, 0],
      [0, 7, 7]
    ]
  ]
}
