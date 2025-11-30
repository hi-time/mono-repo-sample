<template>
  <div class="app-container">
    <h1>ファイルMIMEタイプ判定 (SSG版)</h1>
    <p class="description">静的生成されたページでファイルのMIMEタイプを判定します。</p>
    
    <div class="upload-section">
      <input 
        type="file" 
        @change="handleFileChange" 
        ref="fileInput"
        class="file-input"
      />
    </div>
    
    <div v-if="loading" class="loading">
      ファイルを分析中...
    </div>
    
    <div v-if="result" class="result-section">
      <h2>判定結果</h2>
      <div class="result-card">
        <div class="result-item">
          <strong>ファイル名:</strong> {{ result.fileName }}
        </div>
        <div class="result-item">
          <strong>ファイルタイプ:</strong> {{ result.fileType }}
        </div>
        <div class="result-item">
          <strong>テキストファイル:</strong> {{ result.isText ? 'はい' : 'いいえ' }}
        </div>
        <div class="result-item">
          <strong>信頼度:</strong> {{ result.scorePercent }}
        </div>
        <div class="result-item">
          <strong>説明:</strong> {{ result.description }}
        </div>
      </div>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
    
    <div class="info-box">
      <p><strong>注:</strong> このページは静的生成（SSG）されていますが、クライアントサイドでファイル判定を行います。</p>
    </div>
    
    <NuxtLink to="/dashboard" class="back-link">
      ← ダッシュボードに戻る
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  // このページは静的生成されるが、クライアントサイドでインタラクティブに動作
})

const runtimeConfig = useRuntimeConfig()
const apiBase = runtimeConfig.public.apiBase

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const loading = ref(false)
const result = ref<{
  fileName: string
  fileType: string
  isText: boolean
  score: number
  scorePercent: string
  description: string
} | null>(null)
const error = ref<string | null>(null)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
  result.value = null
  error.value = null
  
  // SSGでもファイル選択後に自動で分析
  if (selectedFile.value) {
    handleAnalyze()
  }
}

const handleAnalyze = async () => {
  if (!selectedFile.value) return
  
  loading.value = true
  error.value = null
  result.value = null
  
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    const response = await fetch(`${apiBase}/api/detect-mime`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    result.value = await response.json()
  } catch (err: any) {
    error.value = `エラーが発生しました: ${err.message || String(err)}`
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.description {
  color: #666;
  margin-bottom: 2rem;
}

.upload-section {
  margin-bottom: 2rem;
}

.file-input {
  padding: 0.75rem;
  border: 2px dashed #42b983;
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
}

.file-input:hover {
  border-color: #35a372;
}

.loading {
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 4px;
  color: #1976d2;
  text-align: center;
  margin-bottom: 1rem;
}

.result-section {
  margin-bottom: 2rem;
}

.result-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.result-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
}

.result-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item strong {
  color: #2c3e50;
  margin-right: 0.5rem;
}

.error {
  padding: 1rem;
  background: #ffebee;
  border: 1px solid #f44336;
  border-radius: 4px;
  color: #c62828;
  margin-bottom: 1rem;
}

.info-box {
  padding: 1rem;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.info-box p {
  margin: 0;
  color: #856404;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: #42b983;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
