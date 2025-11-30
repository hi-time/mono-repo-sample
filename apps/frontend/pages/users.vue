<template>
  <div class="page">
    <h1>👥 ユーザー一覧</h1>
    <div v-if="pending" class="loading">読み込み中...</div>
    <div v-else-if="error" class="error">
      エラーが発生しました: {{ error.message }}
    </div>
    <div v-else class="user-list">
      <div v-for="user in users" :key="user.id" class="user-card">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <p class="date">登録日: {{ formatDate(user.createdAt) }}</p>
      </div>
    </div>
    <NuxtLink to="/" class="back-link">← トップへ戻る</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@repo/types'

const config = useRuntimeConfig()
const { data: users, pending, error } = await useFetch<User[]>(`${config.public.apiBase}/api/users`)

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('ja-JP')
}
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

.user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.user-card {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-card h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.user-card p {
  margin: 0.25rem 0;
  color: #7f8c8d;
}

.date {
  font-size: 0.875rem;
  margin-top: 0.5rem !important;
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
