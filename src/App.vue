<script setup>
import { useCart } from './store/cart.js'

const {count} = useCart
</script>

<template>
  <div>

    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
header a { text-decoration: none; color: inherit }
</style>
