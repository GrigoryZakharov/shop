import { ref, computed } from 'vue'

const items = ref([]) 

export function useCart() {
  function add(product) {
  const uniqueId = product.selectedOptions
    ? `${product.id}-${product.selectedOptions.color || 0}-${product.selectedOptions.size || 0}`
    : product.id

  const found = items.value.find(i => i.id === uniqueId)
  if (found) {
    found.qty += 1
  } else {
    items.value.push({
      ...product,
      id: uniqueId,
      qty: 1,
      
    })
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
