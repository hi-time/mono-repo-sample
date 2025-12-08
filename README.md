# File Type Detection Demo

TypeScript + Turborepo を使用したモダンな monorepo プロジェクトです。Nuxt 4（SPA/SSR/SSG）と Fastify 5 バックエンドでファイルタイプ判定機能を実装した実践的なサンプルです。

## プロジェクト構成

```
mono-repo-sample/
├── apps/
│   ├── web/          # Nuxt 4 フロントエンドアプリケーション (SPA/SSR/SSG)
│   ├── api/          # Fastify 5 APIサーバー + OpenAPI/Swagger
│   └── batch/        # バッチワーカー (非同期ジョブ処理)
├── packages/
│   ├── types/        # 共有型定義
│   ├── shared/       # 共有ドメインロジック (Job, Repository)
│   └── typescript-config/  # 共有 TypeScript 設定
└── turbo.json        # Turborepo 設定
```

## 技術スタック

### フロントエンド (web)
- **Nuxt 4.2.1** - モダンな Vue.js フレームワーク
  - SPA モード (client-side only)
  - SSR モード (server-side rendering)
  - SSG モード (static site generation)
- **Vue 3.5.25** - プログレッシブフレームワーク
- **TypeScript 5.9.3** - 型安全性
- **Vue Router 4.5.0** - ルーティング
- **Vitest 4.0.15** - 高速なユニットテストフレームワーク
- **@nuxt/test-utils 3.21.0** - Nuxtコンポーネントテストユーティリティ

### バックエンド (apps/api)
- **Fastify 5.6.2** - 高性能な Node.js Web フレームワーク
- **Magika 1.0.0** - Google のファイルタイプ検出ライブラリ
- **@fastify/swagger 9.6.1** - OpenAPI仕様自動生成
- **@fastify/swagger-ui 5.2.3** - Swagger UI提供
- **fastify-type-provider-zod 6.1.0** - Zodスキーマによる型安全なAPI
- **Zod 4** - スキーマバリデーション
- **@fastify/multipart 9.3.0** - ファイルアップロード処理
- **TypeScript 5.9.3** - 型安全性
- **Vitest 4.0.15** - 高速なユニットテストフレームワーク
- **レイヤードアーキテクチャ** - Parameter/Result パターン

### バッチワーカー (apps/batch)
- **tsx** - TypeScript実行環境
- **Magika 1.0.0** - ファイルタイプ検出処理
- **Vitest 4.0.15** - 高速なユニットテストフレームワーク
- **非同期ジョブパターン** - ポーリング + ジョブキュー
- **@repo/shared** - バックエンドとの共有ドメインロジック

### 共通
- **Turborepo** - モノレポビルドシステム
- **pnpm** - 高速なパッケージマネージャー
- **Vitest 4.0.15** - 全パッケージ共通のテストフレームワーク
  - APIサーバー: 13テスト
  - バッチワーカー: 13テスト
  - 共有パッケージ: 12テスト
  - Webフロントエンド: 7テスト
  - **合計: 45テスト**

## 前提条件

- Node.js 20.x 以上
- pnpm 8.x 以上
- Docker & Docker Compose

## セットアップ

### 1. Dragonflyの起動（このプロジェクト専用）

```bash
# Docker Composeでドラゴンフライを起動（ポート6380）
sudo docker compose up -d

# 起動確認
sudo docker ps | grep dragonfly

# ログ確認
sudo docker logs mono-repo-dragonfly
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 2. 開発サーバーの起動

すべてのアプリケーションを同時に起動:

```bash
pnpm dev
```

個別に起動する場合:

```bash
# フロントエンド (Nuxt) - http://localhost:3001
cd apps/web
pnpm dev

# APIサーバー (Fastify) - http://localhost:3002
cd apps/api
pnpm dev

# バッチワーカー (非同期ジョブ処理)
cd apps/batch
pnpm dev
```

### 3. テストの実行

各パッケージのテスト:

```bash
# APIサーバーのテスト
cd apps/api
pnpm test:run        # テストを実行
pnpm test            # ウォッチモード
pnpm test:coverage   # カバレッジ付き
pnpm test:ui         # インタラクティブUI

# バッチワーカーのテスト
cd apps/batch
pnpm test:run        # テストを実行
pnpm test            # ウォッチモード

# Webフロントエンドのテスト
cd apps/web
pnpm test:run        # テストを実行
pnpm test            # ウォッチモード
pnpm test:ui         # インタラクティブUI

# 共有パッケージのテスト
cd packages/shared
pnpm test:run        # テストを実行
pnpm test            # ウォッチモード
```

> **重要**: 
> - ファイルタイプ検出機能を使用する場合、**Redis/Dragonfly**、**API**、**Batch Worker** の3つが必要です
> - Redis/Dragonflyが起動していない場合、ジョブの保存・取得ができません
> - デフォルトで `localhost:6379` に接続します（環境変数 `REDIS_HOST`, `REDIS_PORT` で変更可能）

## アクセス URL

- **Dragonfly (このプロジェクト専用)**: localhost:6380
  - ジョブデータの共有ストレージ（プロセス間通信）
  - API と Batch Worker 間でジョブ情報を共有
  - 他のプロジェクトのRedis(6379)とは独立
- **フロントエンド**: http://localhost:3001
  - ダッシュボード: http://localhost:3001/dashboard
  - SPA モード: http://localhost:3001/dashboard/app-spa
  - SSR モード: http://localhost:3001/dashboard/app-ssr
  - SSG モード: http://localhost:3001/dashboard/app-ssg
  - **外部アクセス**: `0.0.0.0:3001` でリッスン（同一ネットワーク内のIPアドレスでアクセス可能）
- **バックエンド**: http://localhost:3002
  - ヘルスチェック: http://localhost:3002/health
  - API Root: http://localhost:3002/
  - **API Documentation (Swagger UI)**: http://localhost:3002/documentation
  - **OpenAPI JSON**: http://localhost:3002/documentation/json
  - **OpenAPI YAML**: http://localhost:3002/documentation/yaml
  - **外部アクセス**: `0.0.0.0:3002` でリッスン（同一ネットワーク内のIPアドレスでアクセス可能）

## API エンドポイント

### バックエンド (port 3002)

#### API Documentation
- **Swagger UI**: http://localhost:3002/documentation
  - インタラクティブなAPI仕様書
  - 全エンドポイントの試行が可能
- **OpenAPI JSON**: http://localhost:3002/documentation/json
- **OpenAPI YAML**: http://localhost:3002/documentation/yaml

#### 非同期ジョブ管理 API
- `POST /api/jobs` - ファイルタイプ判定ジョブの投入
  - Content-Type: `multipart/form-data`
  - フィールド: `file` (バイナリファイル)
  - レスポンス:
    ```json
    {
      "jobId": "550e8400-e29b-41d4-a716-446655440000",
      "message": "ジョブを投入しました"
    }
    ```

- `GET /api/jobs/:jobId/status` - ジョブステータスの確認
  - レスポンス:
    ```json
    {
      "jobId": "550e8400-e29b-41d4-a716-446655440000",
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:05.000Z"
    }
    ```
  - ステータス: `pending` | `processing` | `completed` | `failed`

- `GET /api/jobs/:jobId/result` - ジョブ結果の取得
  - レスポンス:
    ```json
    {
      "fileName": "example.pdf",
      "fileType": "pdf",
      "isText": false,
      "score": 0.99,
      "scorePercent": "99%",
      "description": "PDF document",
      "group": "document",
      "mimeType": "application/pdf",
      "extension": "pdf"
    }
    ```

#### File Type Detection - 同期API
- `POST /api/detect-file-type` - ファイルタイプ判定（同期版・デバッグ用）
  - Content-Type: `multipart/form-data`
  - フィールド: `file` (バイナリファイル)
  - レスポンス:
    ```json
    {
      "fileName": "example.pdf",
      "fileType": "pdf",
      "isText": false,
      "score": 0.99,
      "scorePercent": "99%",
      "description": "Detected as pdf file",
      "group": "document",
      "mimeType": "application/pdf",
      "extension": "pdf"
    }
    ```

#### レスポンスプロパティ

| プロパティ | 型 | 説明 |
|----------|-----|------|
| `fileName` | string | アップロードされたファイル名 |
| `fileType` | string | 検出されたファイルタイプ（例: pdf, png, javascript） |
| `isText` | boolean | テキストファイルかどうか |
| `score` | number | 信頼度スコア（0-1の範囲） |
| `scorePercent` | string | 信頼度スコアのパーセンテージ表示 |
| `description` | string | ファイルタイプの説明文 |
| `group` | string | ファイルグループ（例: document, code, image） |
| `mimeType` | string | MIMEタイプ（例: application/pdf, image/png） |
| `extension` | string | 推奨される拡張子 |

## 非同期ジョブアーキテクチャ

このプロジェクトは**非同期ジョブ + ポーリングパターン**を採用し、ファイルタイプ検出処理をバックグラウンドで実行します。

### アーキテクチャ図

```mermaid
sequenceDiagram
    participant F as Web
    participant B as API<br/>(Fastify)
    participant S as Job Storage<br/>(Shared)
    participant W as Batch Worker<br/>(Magika)

    Note over F,W: 非同期ジョブ + ポーリングパターン
    
    F->>B: POST /api/jobs<br/>(file upload)
    B->>S: createJob(parameter)
    S-->>B: jobId
    B-->>F: { jobId, status: "pending" }
    
    Note over F: ポーリング開始<br/>(1秒間隔)
    
    loop Every 1 second
        W->>S: getPendingJob()
        S-->>W: job data
        W->>W: Magika.identifyBytes()
        W->>S: completeJob(result)
    end
    
    loop Until completed (max 60s)
        F->>B: GET /api/jobs/:jobId/status
        B->>S: getJobStatus(jobId)
        S-->>B: status
        B-->>F: { status: "completed" }
    end
    
    F->>B: GET /api/jobs/:jobId/result
    B->>S: getJobResult(jobId)
    S-->>B: result
    B-->>F: { fileName, fileType, ... }
    
    Note over F: 結果を表示
```

### フロー説明

1. **ジョブ投入**: フロントエンドがファイルを`POST /api/jobs`で送信
2. **即時レスポンス**: バックエンドが`jobId`を返却し、ジョブを`pending`状態で保存
3. **ポーリング開始**: フロントエンドが1秒間隔で`GET /api/jobs/:jobId/status`を実行
4. **バッチ処理**: バッチワーカーが1秒間隔でペンディングジョブをチェック
5. **ファイル解析**: ワーカーがMagikaでファイルタイプを判定
6. **結果保存**: ジョブステータスを`completed`に更新し、結果を保存
7. **結果取得**: フロントエンドがステータス`completed`を検出し、`GET /api/jobs/:jobId/result`で結果を取得

### 共有パッケージ構成

```mermaid
graph TB
    subgraph "packages/shared"
        direction TB
        ROOT["src/index.ts<br/>(共通エクスポート)"]
        
        subgraph "job/ (ジョブドメイン)"
            JP["JobParameter.ts<br/>入力パラメータ"]
            JR["JobResult.ts<br/>実行結果"]
            JS["JobStatus.ts<br/>ステータス情報"]
            JIDX["index.ts"]
        end
        
        subgraph "repository/ (リポジトリ層)"
            REPO["InMemoryJobRepository.ts<br/>ジョブストレージ"]
            RIDX["index.ts"]
        end
        
        ROOT --> JIDX
        ROOT --> RIDX
        JIDX --> JP
        JIDX --> JR
        JIDX --> JS
        RIDX --> REPO
    end
    
    subgraph "使用箇所"
        BACKEND["apps/api<br/>(API)"] 
        BATCH["apps/batch<br/>(Worker)"]
    end
    
    ROOT -.->|import| BACKEND
    ROOT -.->|import| BATCH
    
    style ROOT fill:#e1f5ff
    style BACKEND fill:#ffe1e1
    style BATCH fill:#e1ffe1
```

## アーキテクチャ (API)

バックエンドはシンプルなレイヤードアーキテクチャで、Parameter/Resultクラスによる明確なデータフローを実現しています:

```mermaid
graph LR
    subgraph "apps/api/src"
        direction TB
        
        subgraph "API層"
            F["fastify/<br/>file-type.ts<br/>health.ts<br/>jobs.ts"]
        end
        
        subgraph "Application層"
            S["services/<br/>FileTypeDetectionService"]
        end
        
        subgraph "Domain層"
            D["file-type/<br/>Parameter/Result"]
        end
        
        subgraph "Repository層"
            R["(将来用)"] 
        end
        
        subgraph "External層"
            E["(外部API連携<br/>将来用)"]
        end
        
        F --> S
        S --> D
        S -.->|将来| R
        S -.->|将来| E
    end
    
    SHARED["@repo/shared<br/>(Job管理)"] -.->|import| F
    
    style F fill:#e1f5ff
    style S fill:#ffe1e1
    style D fill:#e1ffe1
    style SHARED fill:#fff4e1
```

### アーキテクチャパターンの詳細

ドメイン駆動設計ではありませんが、将来的にDDDを考慮してレイヤードアーキテクチャを採用しています。

#### 拡張のガイドライン

##### 新しい機能の追加

1. `domain/<feature>/` に Parameter/Result クラスを作成
2. `application/services/` に Service クラスを作成
3. `api/fastify/` にルート定義を追加
4. Service を index.ts で登録

##### データベースへの移行

1. `repository/` に Repository 実装を作成
2. Service に Repository を注入
3. Domain層とApplication層は変更不要

##### 外部API連携の追加

1. `external/` にクライアント実装を作成
2. Service から外部クライアントを呼び出し
3. エラーハンドリングとリトライロジックを実装

---

## 実装ガイド

### アーキテクチャ概要

このプロジェクトは **Turborepo** によるモノレポ構成で、以下の原則に基づいて設計されています:

1. **疎結合**: 各アプリケーションは独立して動作可能
2. **単一責任**: 各層は明確な責任を持つ
3. **DRY原則**: 共有ロジックは `packages/shared` に配置
4. **型安全性**: TypeScript の厳格な型チェックを活用
5. **シンプルさ**: Interface を排除し、Parameter/Result クラスのみで構成

### 非同期ジョブパターンの詳細

#### ジョブのライフサイクル

ジョブは以下のステータスを持ちます:

```typescript
type JobStatusType = 'pending' | 'processing' | 'completed' | 'failed'
```

- **pending**: ジョブが投入され、処理待ち
- **processing**: バッチワーカーが処理中
- **completed**: 処理が正常に完了
- **failed**: 処理が失敗

#### ポーリング間隔

- **フロントエンド → API**: 1秒間隔でステータスポーリング（最大60秒）
- **Batch Worker → Job Storage**: 1秒間隔でペンディングジョブをチェック

#### データの保持期間

- ジョブは作成から **24時間** 保持
- バッチワーカーが **1時間ごと** に古いジョブをクリーンアップ

### 共有パッケージの設計詳細

#### packages/shared の役割

API と Batch Worker 間でドメインロジックを共有するための専用パッケージです。

#### クラス設計

##### 1. JobParameter (入力)

```typescript
export class JobParameter {
  constructor(
    public readonly fileData: Uint8Array,
    public readonly fileName: string
  ) {}
}
```

**責任**: ジョブ実行に必要な入力パラメータを保持

##### 2. JobResult (出力)

```typescript
export class JobResult {
  constructor(
    public readonly fileName: string,
    public readonly fileType: string,
    public readonly isText: boolean,
    public readonly score: number,
    public readonly scorePercent: string,
    public readonly description: string,
    public readonly group: string,
    public readonly mimeType: string,
    public readonly extension: string
  ) {}
}
```

**責任**: ジョブ実行結果を保持（Magika の解析結果）

##### 3. JobStatus (状態管理)

```typescript
export type JobStatusType = 'pending' | 'processing' | 'completed' | 'failed'

export class JobStatus {
  constructor(
    public readonly jobId: string,
    public readonly status: JobStatusType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly error?: string
  ) {}
}
```

**責任**: ジョブのステータス情報を保持

##### 4. InMemoryJobRepository (ストレージ)

```typescript
class InMemoryJobRepository {
  private jobs: Map<string, JobData> = new Map()

  createJob(parameter: JobParameter): string
  getJobStatus(jobId: string): JobStatus | null
  getJobResult(jobId: string): JobResult | null
  getPendingJob(): JobData | null
  completeJob(jobId: string, result: JobResult): void
  failJob(jobId: string, error: string): void
  cleanupOldJobs(): void
}

export const jobRepository = new InMemoryJobRepository()
```

**責任**: 
- ジョブの CRUD 操作
- ペンディングジョブの取得（バッチ用）
- 古いジョブのクリーンアップ

---

## 実装ルール

### 1. パッケージ管理

#### ワークスペース設定

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

#### 依存関係の追加

共有パッケージを使用するアプリケーションの `package.json`:

```json
{
  "dependencies": {
    "@repo/shared": "workspace:*"
  }
}
```

### 2. TypeScript 設定

#### packages/shared/tsconfig.json

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true,
    "lib": ["ES2015"],
    "types": ["node"],
    "module": "ESNext",
    "moduleResolution": "bundler"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**重要ポイント**:
- `lib: ["ES2015"]` - Map, Promise などの ES2015 機能を有効化
- `types: ["node"]` - Node.js 型定義（crypto, process など）
- `moduleResolution: "bundler"` - tsx/tsup などのバンドラーに対応

#### apps/batch/tsconfig.json

```json
{
  "extends": "@repo/typescript-config/node.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**重要**: `moduleResolution: "bundler"` により `@repo/shared` のサブパスエクスポートが正しく解決されます。

### 3. エクスポート設計

#### packages/shared/package.json

```json
{
  "name": "@repo/shared",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./job": "./src/job/index.ts",
    "./repository": "./src/repository/index.ts"
  }
}
```

**推奨**: メインエクスポート (`.`) を使用:

```typescript
// Good
import { jobRepository, JobResult } from '@repo/shared'

// Avoid (サブパスは型解決の問題が発生しやすい)
import { jobRepository } from '@repo/shared/repository'
```

### 4. API サーバー実装

#### POST /api/jobs (ジョブ投入)

```typescript
import multipart from '@fastify/multipart'
import { jobRepository, JobParameter } from '@repo/shared'

export const jobRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(multipart)

  fastify.post('/jobs', async (request, reply) => {
    const data = await request.file()
    if (!data) {
      return reply.status(400).send({ error: 'No file uploaded' })
    }

    const fileData = await data.toBuffer()
    const parameter = new JobParameter(new Uint8Array(fileData), data.filename)
    const jobId = jobRepository.createJob(parameter)

    return reply.status(202).send({ jobId, status: 'pending' })
  })
}
```

#### GET /api/jobs/:jobId/status (ステータス確認)

```typescript
fastify.get('/jobs/:jobId/status', async (request, reply) => {
  const { jobId } = request.params as { jobId: string }
  const status = jobRepository.getJobStatus(jobId)

  if (!status) {
    return reply.status(404).send({ error: 'Job not found' })
  }

  return reply.send(status)
})
```

#### GET /api/jobs/:jobId/result (結果取得)

```typescript
fastify.get('/jobs/:jobId/result', async (request, reply) => {
  const { jobId } = request.params as { jobId: string }
  
  const status = jobRepository.getJobStatus(jobId)
  if (!status) {
    return reply.status(404).send({ error: 'Job not found' })
  }

  if (status.status !== 'completed') {
    return reply.status(400).send({ 
      error: 'Job not completed',
      status: status.status 
    })
  }

  const result = jobRepository.getJobResult(jobId)
  return reply.send(result)
})
```

### 5. Batch Worker 実装

#### apps/batch/src/worker.ts

```typescript
import { jobRepository, JobResult } from '@repo/shared'
import { Magika } from 'magika'

let magikaInstance: Magika | null = null

async function initializeMagika(): Promise<void> {
  if (!magikaInstance) {
    console.log('Initializing Magika...')
    magikaInstance = await Magika.create()
    console.log('Magika initialized successfully')
  }
}

async function processJobs() {
  const job = jobRepository.getPendingJob()
  if (!job) return

  console.log(`🔄 Processing job ${job.jobId}...`)

  try {
    if (!magikaInstance) {
      throw new Error('Magika not initialized')
    }

    const identifyResult = await magikaInstance.identifyBytes(job.parameter.fileData) as any
    const output = identifyResult.prediction?.output
    const scoreMap = identifyResult.prediction?.score || {}

    if (!output) {
      throw new Error('Failed to detect file type')
    }

    const score = scoreMap[output.label] ?? 0
    const scorePercent = `${Math.round(score * 100)}%`

    const jobResult = new JobResult(
      job.parameter.fileName,
      output.label || 'unknown',
      output.is_text || false,
      score,
      scorePercent,
      output.description || '',
      output.group || 'unknown',
      output.mime_type || 'application/octet-stream',
      Array.isArray(output.extensions) ? output.extensions.join(', ') : output.extension || ''
    )

    jobRepository.completeJob(job.jobId, jobResult)
    console.log(`✅ Job ${job.jobId} completed successfully`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`❌ Job ${job.jobId} failed:`, errorMessage)
    jobRepository.failJob(job.jobId, errorMessage)
  }
}

async function startWorker() {
  console.log('🚀 Batch worker started')
  await initializeMagika()

  // ジョブポーリング (1秒間隔)
  setInterval(async () => {
    try {
      await processJobs()
    } catch (error) {
      console.error('Worker error:', error)
    }
  }, 1000)

  // 古いジョブのクリーンアップ (1時間間隔)
  setInterval(() => {
    console.log('🧹 Cleaning up old jobs...')
    jobRepository.cleanupOldJobs()
  }, 60 * 60 * 1000)

  console.log(`⏱️  Polling interval: 1000ms`)
}

startWorker().catch((error) => {
  console.error('Failed to start worker:', error)
  process.exit(1)
})
```

**重要ポイント**:
- Magika の型定義が不完全なため、`as any` でキャスト
- `output.is_text` (スネークケース) と `output.extensions` (配列) に注意
- エラーハンドリングで `failJob()` を呼び出し

### 6. Web フロントエンド実装

#### ジョブ投入 → ポーリング → 結果取得

```typescript
const handleSubmit = async () => {
  if (!selectedFile.value) return
  
  loading.value = true
  error.value = null
  result.value = null
  
  try {
    // Step 1: ジョブ投入
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
    
    // Step 2: ポーリング (最大60秒)
    const maxRetries = 60
    for (let i = 0; i < maxRetries; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const statusResponse = await fetch(`${apiBase}/api/jobs/${jobId}/status`)
      if (!statusResponse.ok) {
        throw new Error(`ステータス確認失敗: ${statusResponse.status}`)
      }
      
      const { status } = await statusResponse.json()
      
      if (status === 'completed') {
        // Step 3: 結果取得
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
    }
    
    throw new Error('タイムアウト: ジョブ処理に時間がかかりすぎています')
  } catch (err: any) {
    error.value = `エラーが発生しました: ${err.message || String(err)}`
  } finally {
    loading.value = false
  }
}
```

### 7. Turborepo 設定

#### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", ".nuxt/**", ".output/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "api#dev": {
      "cache": false,
      "persistent": true
    },
    "batch#dev": {
      "cache": false,
      "persistent": true
    },
    "web#dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**重要**: 
- `persistent: true` - サーバーなど長時間実行されるタスク
- `cache: false` - dev モードはキャッシュを無効化

---

## 🔄 再現手順

このセクションでは、プロジェクトをゼロから再現するための詳細な手順を記載しています。

### ステップ1: プロジェクトセットアップ

```bash
# Turborepo プロジェクト作成
npx create-turbo@latest

# 必要なディレクトリ作成
mkdir -p apps/batch/src
mkdir -p packages/shared/src/job
mkdir -p packages/shared/src/repository
```

### ステップ2: 共有パッケージ作成

```bash
cd packages/shared
```

#### package.json

```json
{
  "name": "@repo/shared",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./job": "./src/job/index.ts",
    "./repository": "./src/repository/index.ts"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/node": "^20.10.0",
    "typescript": "^5.9.3"
  }
}
```

#### 各ファイルの作成

`src/job/JobParameter.ts`, `src/job/JobResult.ts`, `src/job/JobStatus.ts`, `src/job/index.ts`, `src/repository/InMemoryJobRepository.ts`, `src/repository/index.ts`, `src/index.ts` を上記のクラス設計に従って作成します。

### ステップ3: バッチワーカー作成

```bash
cd apps/batch
```

`package.json`, `tsconfig.json`, `src/worker.ts` を上記の実装例に従って作成します。

### ステップ4: API に Job API 追加

```bash
cd apps/api
```

`package.json` に `@repo/shared` を追加し、`src/api/fastify/jobs.ts` を作成、`src/index.ts` にルート登録します。

### ステップ5: Web フロントエンド更新

3つのページ（SPA/SSR/SSG）を上記の実装例に従って更新します。

### ステップ6: 依存関係インストールと起動

```bash
# ルートディレクトリで
pnpm install

# 全体起動
pnpm dev
```

---

## ビルド

すべてのアプリケーションをビルド:

```bash
pnpm build
```

個別にビルド:

```bash
# フロントエンド
cd apps/web
pnpm build

# 統合APIサーバー
cd apps/api
pnpm build
```

## 型チェック

すべてのパッケージで型チェックを実行:

```bash
pnpm type-check
```

## パッケージ管理

このプロジェクトは pnpm ワークスペースを使用しています。

依存関係の追加:

```bash
# ルートに追加
pnpm add -w <package>

# 特定のワークスペースに追加
pnpm add <package> --filter web
pnpm add <package> --filter api
```
