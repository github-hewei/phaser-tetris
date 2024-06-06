<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { StartGame } from './main'

const game = ref()
const scene = ref()

onMounted(() => {
  game.value = StartGame('game-container')
})

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true)
    game.value = null
  }
})

defineExpose({ game, scene })
</script>

<template>
  <div id="game-container"></div>
</template>
