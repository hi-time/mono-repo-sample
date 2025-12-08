<template>
  <div class="container">
    <header class="header">
      <h1>🚀 Turborepo Sample</h1>
      <p>Nuxt 4 + Fastify 5 + Magika + OpenAPI</p>
    </header>

    <main class="main">
      <section class="section">
        <h2>📦 プロジェクト構成</h2>
        <ul class="feature-list">
          <li>
            <strong>apps/web</strong> - Nuxt 4 フロントエンドアプリケーション
          </li>
          <li>
            <strong>apps/api</strong> - Fastify 5 API サーバー + Magika + OpenAPI/Swagger
          </li>
          <li>
            <strong>apps/batch</strong> - バッチワーカー (非同期ジョブ処理)
          </li>
          <li>
            <strong>packages/shared</strong> - 共有ドメインロジック (Job, Repository)
          </li>
          <li>
            <strong>packages/types</strong> - 共有型定義
          </li>
        </ul>
      </section>

      <section class="section">
        <h2>🔗 リンク</h2>
        <div class="links">
          <NuxtLink to="/dashboard" class="link-card">
            <h3>📊 ダッシュボード</h3>
            <p>ファイルタイプ判定デモ</p>
          </NuxtLink>

          <a href="http://localhost:3002/documentation" target="_blank" class="link-card external">
            <h3>📚 API仕様書 (Swagger UI)</h3>
            <p>インタラクティブなAPI仕様書</p>
          </a>

          <a href="http://localhost:3002/documentation/json" target="_blank" class="link-card external">
            <h3>📄 OpenAPI 3.1 JSON</h3>
            <p>OpenAPI 3.1.0仕様 (JSON形式)</p>
          </a>

          <a href="http://localhost:3002/documentation/yaml" target="_blank" class="link-card external">
            <h3>📄 OpenAPI 3.1 YAML</h3>
            <p>OpenAPI 3.1.0仕様 (YAML形式)</p>
          </a>

          <a href="http://localhost:3002/health" target="_blank" class="link-card external">
            <h3>💚 ヘルスチェック</h3>
            <p>APIサーバーの状態確認</p>
          </a>
        </div>
      </section>

      <section class="section">
        <h2>🚀 技術スタック</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <h4>フロントエンド</h4>
            <ul>
              <li>Nuxt 4.2.1</li>
              <li>Vue 3.5.25</li>
              <li>TypeScript 5.9.3</li>
            </ul>
          </div>
          <div class="tech-item">
            <h4>バックエンド</h4>
            <ul>
              <li>Fastify 5.6.2</li>
              <li>Magika 1.0.0 (Google)</li>
              <li>@fastify/swagger 9.6.1</li>
              <li>Zod 4 + fastify-type-provider-zod</li>
            </ul>
          </div>
          <div class="tech-item">
            <h4>インフラ</h4>
            <ul>
              <li>Dragonfly (Redis互換)</li>
              <li>Turborepo</li>
              <li>pnpm workspace</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>⚙️ アーキテクチャ</h2>
        <ul class="feature-list">
          <li>
            <strong>非同期ジョブパターン</strong> - API + バッチワーカー + ポーリング
          </li>
          <li>
            <strong>型安全なAPI</strong> - Zod + fastify-type-provider-zod (OpenAPI 3.1自動生成)
          </li>
          <li>
            <strong>レイヤードアーキテクチャ</strong> - Parameter/Result パターン
          </li>
          <li>
            <strong>モノレポ構成</strong> - Turborepo + pnpm workspace
          </li>
        </ul>
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

.link-card.external {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.link-card.external h3 {
  color: white;
}

.link-card.external p {
  color: rgba(255, 255, 255, 0.9);
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

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.tech-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.tech-item h4 {
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.tech-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tech-item li {
  padding: 0.25rem 0;
  color: #555;
  font-size: 0.95rem;
}

.tech-item li::before {
  content: "▸ ";
  color: #3498db;
  font-weight: bold;
}
</style>
