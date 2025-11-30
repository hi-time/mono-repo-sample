<template>
  <div class="page">
    <h1>🛍️ 商品一覧</h1>
    <div v-if="pending" class="loading">読み込み中...</div>
    <div v-else-if="error" class="error">
      エラーが発生しました: {{ error.message }}
    </div>
    <div v-else class="product-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p class="description">{{ product.description }}</p>
        <div class="product-info">
          <span class="price">¥{{ product.price.toLocaleString() }}</span>
          <span class="stock">在庫: {{ product.stock }}</span>
        </div>
      </div>
    </div>
    <NuxtLink to="/" class="back-link">← トップへ戻る</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@repo/types'

const config = useRuntimeConfig()
const { data: products, pending, error } = await useFetch<Product[]>(`${config.public.apiBase}/api/products`)
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.loading,
.error {
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error {
  color: #e74c3c;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-card {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-card h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.description {
  color: #7f8c8d;
  margin: 0.5rem 0;
  min-height: 3rem;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #27ae60;
}

.stock {
  color: #7f8c8d;
  font-size: 0.875rem;
}

.back-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
}

.back-link:hover {
  background: #2980b9;
}
</style>
