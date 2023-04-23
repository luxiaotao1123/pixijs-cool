<template>
    <Player :title="name"></Player>
</template>

<script setup>
import Player from './components/Player.vue'

const name = "zoneyung rcs - v1.0.0"
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
}

body {
  height: 100%;
}

#app {
    padding: 0;
}
</style>
