<script setup>
import { computed } from 'vue'
import { useCart } from '../store/cart.js'
import brands from '../assets/brands.json'
import logo from '/images/logo.png'
import getImg from '../components/ProductCard.vue'

const { all, count, remove, setQty } = useCart()

function getBrandTitle(brandId) {
  const found = brands.find(b => b.id === brandId)
  return found ? found.title : brandId
}

const items = all
const total = computed(() => {
  return items.value.reduce((sum, items) => {
    const price = items.regular_price && items.regular_price.value ? Number(items.regular_price.value) : 0
    return sum + (items.qty * price)
  }, 0)
})
console.log(all.value)
</script>

<template>
    <header class="Header-Cart">
        <router-link to="/"><img :src=(logo)></img></router-link>
    </header>
    <div class="cart-container">
    <h3>Shopping Cart ({{ count }})</h3>
    <table class="cart-table">
      <thead>
        <tr>
          <th class="item-header">Item</th>
          <th class="price-header">Price</th>
          <th class="qty-header">Qty</th>
          <th class="total-header">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="it in items" :key="it.id" class="cart-item">
          <td class="item-cell">
            <div class="item-info">
              <img :src="it.image" class="item-image" />
              <div class="item-details">
                <div class="item-title">{{ getBrandTitle(it.brand) }} / {{ it.title }}</div>
                <template v-if="it.selectedOptions">
                  <span>
                    (Color: {{ it.selectedOptions.colorLabel }}, Size: {{ it.selectedOptions.sizeLabel }})
                  </span>
                </template>
                <button @click="remove(it.id)" class="remove-btn">Remove</button>
              </div>
            </div>
          </td>
          
          <td class="price-cell">
            ${{ (it.regular_price?.value || 0).toFixed(2) }}
          </td>
          
          <td class="qty-cell">
            <input 
              type="number" 
              :value="it.qty" 
              @input="e => setQty(it.id, parseInt(e.target.value) || 1)"
              min="1"
              class="qty-input"
            />
          </td>
          
          <td class="total-cell">
            ${{ ((it.qty * (it.regular_price?.value || 0))).toFixed(2) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="cart-footer">
      <div class="subtotal">
        Subtotal: ${{ total.toFixed(2) }}
      </div>
      <button class="checkout-btn">
        Checkout
      </button>
    </div>
  </div>
</template>

<style ></style>