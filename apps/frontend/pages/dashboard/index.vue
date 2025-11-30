<template>
  <div class="dashboard-container">
    <h1>ダッシュボード</h1>
    <p>ファイルのMIMEタイプ判定アプリケーションのデモです。</p>
    
    <div class="app-links">
      <div class="app-card">
        <h2>SPA版</h2>
        <p>クライアントサイドでファイルを処理します。</p>
        <NuxtLink to="/dashboard/app-spa" class="link-button">
          SPA版を開く
        </NuxtLink>
      </div>
      
      <div class="app-card">
        <h2>SSR版</h2>
        <p>サーバーサイドでファイルを処理します。</p>
        <NuxtLink to="/dashboard/app-ssr" class="link-button">
          SSR版を開く
        </NuxtLink>
      </div>
      
      <div class="app-card">
        <h2>SSG版</h2>
        <p>静的生成されたページでファイルを処理します。</p>
        <NuxtLink to="/dashboard/app-ssg" class="link-button">
          SSG版を開く
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.app-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.app-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background: #f9f9f9;
  transition: transform 0.2s, box-shadow 0.2s;
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.app-card h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.app-card p {
  color: #666;
  margin-bottom: 1rem;
}

.link-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
}

.link-button:hover {
  background: #35a372;
}
</style>
