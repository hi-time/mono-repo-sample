<template>
  <div class="container">
    <header class="header">
      <h1>🚀 Turborepo DDD Sample</h1>
      <p>Nuxt + Hono + Fastify with TypeScript</p>
    </header>

    <main class="main">
      <section class="section">
        <h2>📦 プロジェクト構成</h2>
        <ul class="feature-list">
          <li>
            <strong>apps/frontend</strong> - Nuxt 3 フロントエンドアプリケーション
          </li>
          <li>
            <strong>apps/backend</strong> - Fastify + Hono API サーバー (OpenAPI対応 + DDD構成)
          </li>
          <li>
            <strong>packages/types</strong> - 共有型定義
          </li>
        </ul>
      </section>

      <section class="section">
        <h2>🔗 リンク</h2>
        <div class="links">
          <NuxtLink to="/users" class="link-card">
            <h3>👥 ユーザー一覧</h3>
            <p>ユーザー管理画面へ</p>
          </NuxtLink>
          <NuxtLink to="/products" class="link-card">
            <h3>🛍️ 商品一覧</h3>
            <p>商品管理画面へ</p>
          </NuxtLink>
        </div>
      </section>

      <section class="section">
        <h2>🎯 技術スタック</h2>
        <div class="tech-stack">
          <span class="badge">TypeScript</span>
          <span class="badge">Nuxt 3</span>
          <span class="badge">Hono</span>
          <span class="badge">Fastify</span>
          <span class="badge">OpenAPI</span>
          <span class="badge">Zod</span>
          <span class="badge">Turborepo</span>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.header p {
  font-size: 1.25rem;
  color: #7f8c8d;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #ecf0f1;
}

.feature-list li:last-child {
  border-bottom: none;
}

.links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.link-card {
  display: block;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.link-card h3 {
  margin-bottom: 0.5rem;
  color: #3498db;
}

.link-card p {
  color: #7f8c8d;
  margin: 0;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
