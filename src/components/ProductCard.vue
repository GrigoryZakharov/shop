<script setup>
import { defineProps } from 'vue'
const props = defineProps({ product: Object, onAdd: Function })


</script>

<template>
  <div class="Card">
    <img :src="(product.image)" />
    <h3>{{ product.title }}</h3>
    <div>{{ product.brandTitle }}</div>
    <div>$ {{ product.regular_price.value }}</div>
    <button @click="onAdd(product)" >Add</button>
  </div>
</template>

<style scoped>

</style>
