<script setup>
import { ref, computed } from 'vue'
import products from '../assets/level3/products.json'
import brands from '../assets/brands.json'
import ProductCard from '../components/ProductCard.vue'
import { useCart } from '../store/cart.js'
import logo from '/images/logo.png'

const selectedBrand = ref(null)

const brandList = ref(brands)
function getBrandTitle(brandId) {
  const found = brands.find(b => b.id === brandId)
  return found ? found.title : brandId
}

const baseUrl = import.meta.env.BASE_URL || '/'
const productList = ref(products.map(p => ({
  id: p.id,
  title: p.title,
  brand: p.brand,
  brandTitle: getBrandTitle(p.brand),
  regular_price: p.regular_price,
  image: p.image ? `${baseUrl.replace(/\/$/, '')}/${p.image.replace(/^\//, '')}` : null,
  configurable_options: p.configurable_options,
  variants: p.variants,
  type: p.type 
})))

const filtered = computed(() => {
  if (!selectedBrand.value) return productList.value
  return productList.value.filter(p => p.brand === selectedBrand.value)
})

const { add, count } = useCart()

function addToCart(product, colorIndex, sizeIndex) {
  if (product.type === 'simple') {
    add({
      id: product.sku,
      title: product.title,
      brand: product.brand,
      regular_price: product.regular_price,
      qty: 1,
      image: product.image
    })
    return
  }
  const variant = product.variants.find(v =>
    v.attributes.some(a => a.code === 'color' && a.value_index === colorIndex) &&
    v.attributes.some(a => a.code === 'size' && a.value_index === sizeIndex)
  )

  if (!variant) {
    alert('Please select a valid combination of color and size')
    return
  }

  const colorLabel = colorIndex != null
    ? product.configurable_options.find(o => o.attribute_code === 'color')
        ?.values.find(v => v.value_index === colorIndex)?.label
    : null

  const sizeLabel = sizeIndex != null
    ? product.configurable_options.find(o => o.attribute_code === 'size')
        ?.values.find(v => v.value_index === sizeIndex)?.label
    : null

  const varImg = variant.product.image.replace('/image', '/shop/images')


  console.log('Add:', colorIndex, sizeIndex)
  add({
    id: variant.product.sku,       
    title: product.title,
    brand: product.brand,
    regular_price: product.regular_price,
    qty: 1,
    image: varImg,
    selectedOptions: {
       color: colorIndex,
      colorLabel,
      size: sizeIndex,
      sizeLabel 
    }
  })
}

</script>

<template>
    <header>
      <nav>
        <div>
            <router-link to="/"><img :src=(logo)></img></router-link>
        </div>
        <div >
            <router-link class="nav-cart" to="/cart">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <span>({{ count }})</span>
            </router-link>
        </div>
      </nav>
    </header>
    <div class="Catalog">
        <aside>
        <ul class="Brands">
            <li><button @click="selectedBrand = null" :class="{ active: selectedBrand === null }">All Brands</button></li>
            <li v-for="b in brandList" :key="b.id">
            <button @click="selectedBrand = b.id" :class="{ active: selectedBrand === b.id }">{{ b.title }}</button>
            </li>
        </ul>
        </aside>

        <section>
        <ProductCard v-for="p in filtered" :key="p.id" :product="p" :onAdd="addToCart" />
        </section>
    </div>
</template>