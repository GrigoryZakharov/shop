<script setup>
import { defineProps, reactive } from 'vue'
const props = defineProps({ product: Object, onAdd: Function })

const selectedColor = reactive({});
const selectedSize = reactive({});

function selectColor(productId, valueIndex) {
  if (selectedColor[productId] === valueIndex) {
    selectedColor[productId] = null;
    return;
  }
  
  selectedColor[productId] = valueIndex;
  if (selectedSize[productId] && !isVariantAvailable(props.product, valueIndex, selectedSize[productId])) {
    selectedSize[productId] = null; 
  }
}

function selectSize(productId, valueIndex) {
  if (selectedSize[productId] === valueIndex) {
    selectedSize[productId] = null;
    return;
  }
  
  selectedSize[productId] = valueIndex;
  if (selectedColor[productId] && !isVariantAvailable(props.product, selectedColor[productId], valueIndex)) {
    selectedColor[productId] = null; 
  }
}

function isVariantAvailable(product, colorIndex, sizeIndex) {
  if (!product.variants) return true 
  if (colorIndex == null && sizeIndex == null) return true

  return product.variants.some(variant => {
    const variantColorAttr = variant.attributes.find(a => a.code === 'color')
    const variantSizeAttr = variant.attributes.find(a => a.code === 'size')
    if (colorIndex != null && sizeIndex != null) {
      return variantColorAttr?.value_index === colorIndex && 
             variantSizeAttr?.value_index === sizeIndex
    }
    if (colorIndex != null) {
      return variantColorAttr?.value_index === colorIndex
    }
    if (sizeIndex != null) {
      return variantSizeAttr?.value_index === sizeIndex
    }
    return false
  })
}

function getImg(selectedColor, selectedSize) {
  const variant = props.product.variants?.find(variant => {
    const variantColorAttr = variant.attributes.find(a => a.code === 'color')
    const variantSizeAttr = variant.attributes.find(a => a.code === 'size')
    return (selectedColor == null || variantColorAttr?.value_index === selectedColor) &&
           (selectedSize == null || variantSizeAttr?.value_index === selectedSize)
  })
    const variantImage = variant?.product?.image
    if (variantImage) {
      return variantImage.replace('/image', '/shop/images')
    }
    return props.product.image
}

</script>

<template>
  <div class = "Card">
    <div v-if="product.type === 'simple'">
      <img :src = "(product.image)" />
    </div>
    <div v-else>
      <img :src="getImg(selectedColor[product.id], selectedSize[product.id])" />
    </div>
    <h3>{{ product.title }}</h3>
    <div>{{ product.brandTitle }}</div>
    <div>$ {{ product.regular_price.value }}</div>
    <div v-if = "product.configurable_options">
    <div v-for = "option in product.configurable_options" :key="option.attribute_id">
      <template v-if = "option.label === 'Color'">
        <button
          class="option-buttons"
          v-for = "value in option.values"
          :key = "value.value_index"
          :style = "{
            backgroundColor: value.value,
            color: 'white',
            border: selectedColor[product.id] === value.value_index ? '1px solid black' : '1px solid white'
          }"
          :disabled = "!isVariantAvailable(product, value.value_index, selectedSize[product.id])"
          @click="selectColor(product.id, value.value_index)"
        >
          {{ value.label }}
        </button>
      </template>

      <template v-else-if = "option.label === 'Size'">
        <button
          class="option-buttons"
          v-for = "value in option.values"
          :key = "value.value_index"
          @click = "selectSize(product.id, value.value_index)"
          :disabled = "!isVariantAvailable(product, selectedColor[product.id], value.value_index)"
          :style = "{
            border: selectedSize[product.id] === value.value_index ? '1px solid black' : '1px solid white'
          }"
        >
          {{ value.label }}
        </button>
      </template>
    </div>
    </div>
    <button @click="() => {
      console.log('Add:', selectedColor[product.id], selectedSize[product.id]);
      onAdd(product, selectedColor[product.id], selectedSize[product.id])}">
      Add
    </button>
  </div>
</template>

<style></style>