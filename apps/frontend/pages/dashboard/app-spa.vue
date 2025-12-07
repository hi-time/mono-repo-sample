<template>
  <div class="app-container">
    <h1>ファイルタイプ判定 (SPA版)</h1>
    <p class="description">クライアントサイドでファイルのタイプを判定します。</p>
    
    <form @submit.prevent="handleSubmit" class="upload-form">
      <div class="upload-section">
        <input 
          type="file" 
          @change="handleFileChange" 
          ref="fileInput"
          class="file-input"
          required
        />
      </div>
      
      <button type="submit" :disabled="!selectedFile || loading" class="submit-button">
        {{ loading ? '分析中...' : 'ファイルを分析' }}
      </button>
    </form>
    
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
          <strong>グループ:</strong> {{ result.group }}
        </div>
        <div class="result-item">
          <strong>MIME Type:</strong> {{ result.mimeType }}
        </div>
        <div class="result-item">
          <strong>拡張子:</strong> {{ result.extension }}
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
    
    <NuxtLink to="/dashboard" class="back-link">
      ← ダッシュボードに戻る
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  // SPAモードで動作
  ssr: false
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
  group: string
  mimeType: string
  extension: string
} | null>(null)
const error = ref<string | null>(null)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
  result.value = null
  error.value = null
}

const handleSubmit = async () => {
  if (!selectedFile.value) return
  
  loading.value = true
  error.value = null
  result.value = null
  
  try {
    // ステップ1: ジョブを投入
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    const submitResponse = await fetch(`${apiBase}/api/jobs`, {
      method: 'POST',
      body: formData
    })
    
    if (!submitResponse.ok) {
      throw new Error(`ジョブ投入失敗: ${submitResponse.status}`)
    }
    
    const { jobId } = await submitResponse.json()
    
    // ステップ2: ポーリングでジョブステータスを確認
    const maxRetries = 60 // 最大60秒待機
    for (let i = 0; i < maxRetries; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1秒待機
      
      const statusResponse = await fetch(`${apiBase}/api/jobs/${jobId}/status`)
      if (!statusResponse.ok) {
        throw new Error(`ステータス確認失敗: ${statusResponse.status}`)
      }
      
      const { status } = await statusResponse.json()
      
      if (status === 'completed') {
        // ステップ3: 結果を取得
        const resultResponse = await fetch(`${apiBase}/api/jobs/${jobId}/result`)
        if (!resultResponse.ok) {
          throw new Error(`結果取得失敗: ${resultResponse.status}`)
        }
        
        result.value = await resultResponse.json()
        return
      } else if (status === 'failed') {
        const statusData = await statusResponse.json()
        throw new Error(statusData.error || 'ジョブが失敗しました')
      }
      // pending または processing の場合は続けてポーリング
    }
    
    throw new Error('タイムアウト: ジョブ処理に時間がかかりすぎています')
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

.upload-form {
  margin-bottom: 2rem;
}

.upload-section {
  margin-bottom: 1rem;
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

.submit-button {
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.submit-button:hover:not(:disabled) {
  background: #35a372;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
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
