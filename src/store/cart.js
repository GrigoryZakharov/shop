import { ref, computed } from 'vue'

const items = ref([]) 

export function useCart() {
  function add(product) {
    const found = items.value.find(i => i.id === product.id)
    if (found) {
      found.qty += 1
    } else {
      items.value.push({ id: product.id, title: product.title, brand: product.brand, qty: 1, regular_price: product.regular_price, image: product.image })
    }
  }

  function remove(productId) {
    const idx = items.value.findIndex(i => i.id === productId)
    if (idx !== -1) items.value.splice(idx, 1)
  }

  function setQty(productId, qty) {
    const found = items.value.find(i => i.id === productId)
    if (found) found.qty = Math.max(0, Math.floor(qty))
  }

  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const all = computed(() => items.value)

  return { items, add, remove, setQty, count, all }
}

export const cartCount = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
