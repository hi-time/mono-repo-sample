# File Type Detection Demo

TypeScript + Turborepo を使用したモダンな monorepo プロジェクトです。Nuxt 3（SPA/SSR/SSG）と Fastify + Hono バックエンドでファイルタイプ判定機能を実装した実践的なサンプルです。

## 🎯 プロジェクト構成

```
mono-repo-sample/
├── apps/
│   ├── frontend/     # Nuxt 3 フロントエンドアプリケーション (SPA/SSR/SSG)
│   └── backend/      # Fastify + Hono APIサーバー + ライトDDD風アーキテクチャ
├── packages/
│   ├── types/        # 共有型定義
│   └── typescript-config/  # 共有 TypeScript 設定
└── turbo.json        # Turborepo 設定
```

## 🚀 技術スタック

### フロントエンド (apps/frontend)
- **Nuxt 3** - モダンな Vue.js フレームワーク
  - SPA モード (client-side only)
  - SSR モード (server-side rendering)
  - SSG モード (static site generation)
- **TypeScript** - 型安全性
- **Vue Router** - ルーティング

### バックエンド (apps/backend)
- **Fastify** - 高性能な Node.js Web フレームワーク
- **Hono + OpenAPI** - 軽量なAPI定義とドキュメント自動生成
- **Magika 1.0.0** - Google のファイルタイプ検出ライブラリ
- **@fastify/multipart** - ファイルアップロード処理
- **Zod** - スキーマバリデーション
- **TypeScript** - 型安全性
- **ライトDDD風アーキテクチャ** - Parameter/Result パターン

### 共通
- **Turborepo** - モノレポビルドシステム
- **pnpm** - 高速なパッケージマネージャー

## 📋 前提条件

- Node.js 20.x 以上
- pnpm 8.x 以上

## 🛠️ セットアップ

### 1. 依存関係のインストール

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
# フロントエンド (Nuxt) - http://localhost:3000
cd apps/frontend
pnpm dev

# 統合APIサーバー (Fastify + Hono) - http://localhost:3002
cd apps/backend
pnpm dev
```

## 🌐 アクセス URL

- **フロントエンド**: http://localhost:3000
  - ダッシュボード: http://localhost:3000/dashboard
  - SPA モード: http://localhost:3000/dashboard/app-spa
  - SSR モード: http://localhost:3000/dashboard/app-ssr
  - SSG モード: http://localhost:3000/dashboard/app-ssg
- **バックエンド**: http://localhost:3002
  - API ドキュメント (Swagger): http://localhost:3002/docs
  - OpenAPI Spec: http://localhost:3002/openapi.json
  - ヘルスチェック: http://localhost:3002/health
  - API Root: http://localhost:3002/

## 📚 API エンドポイント

### バックエンド (port 3002)

#### File Type Detection - Fastify版
- `POST /api/detect-file-type` - ファイルタイプ判定（Fastify実装）
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

#### File Type Detection - Hono版 (OpenAPI)
- `POST /api/file-type/detect-file-type` - ファイルタイプ判定（Hono + OpenAPI実装）
  - 同じファイルタイプ検出サービスを呼び出し
  - OpenAPI仕様でドキュメント化
  - Swagger UIで対話的にテスト可能

## 🏗️ ライトDDD風 アーキテクチャ (Backend)

バックエンドはシンプルなライトDDD風の構成で、Parameter/Resultクラスによる明確なデータフローを実現しています:

```
apps/backend/src/
├── domain/               # ドメイン層 (Parameter/Result)
│   └── file-type/
│       ├── DetectFileTypeParameter.ts  # ファイルタイプ判定パラメータ
│       └── FileTypeResult.ts           # ファイルタイプ判定結果
├── application/          # アプリケーション層 (ビジネスロジック)
│   └── services/
│       └── FileTypeDetectionService.ts # ファイルタイプ判定ユースケース
├── repository/           # リポジトリ層 (データ永続化・将来用)
├── api/                  # API層 (ルーティング)
│   ├── fastify/          # Fastify ルート
│   │   ├── file-type.ts  # ファイルタイプ検出
│   │   └── health.ts     # ヘルスチェック
│   └── hono/             # Hono ルート (OpenAPI)
│       └── file-type.ts  # ファイルタイプ検出 (OpenAPI版)
└── external/             # 外部サービス連携層 (将来用)
```

### アーキテクチャの特徴

- **シンプルさ重視**: interfaceを排除し、Parameter/Resultクラスのみで構成
- **domain層**: 各機能のParameter（入力）とResult（出力）クラスを格納
- **application層**: ビジネスロジックとデータ操作を含むServiceクラス
  - FastifyとHonoの両方から同じServiceを呼び出し
- **repository層**: データストア実装用ディレクトリ（将来の拡張用）
- **api層**: FastifyとHonoのルート定義を分離
  - Fastify: 高性能なルーティング
  - Hono: OpenAPIドキュメント自動生成
- **external層**: 外部API連携用ディレクトリ（将来の拡張用）

## 🔧 ビルド

すべてのアプリケーションをビルド:

```bash
pnpm build
```

個別にビルド:

```bash
# フロントエンド
cd apps/frontend
pnpm build

# 統合APIサーバー
cd apps/backend
pnpm build
```

## 📝 型チェック

すべてのパッケージで型チェックを実行:

```bash
pnpm type-check
```

## 🎨 プロジェクトの特徴

### 1. Nuxt 3 レンダリングモード比較
- **SPA (Single Page Application)**: クライアント側のみでレンダリング、高速な画面遷移
- **SSR (Server-Side Rendering)**: サーバー側でレンダリング、SEO最適化とパフォーマンス向上
- **SSG (Static Site Generation)**: ビルド時に静的HTML生成、CDN配信に最適

### 2. ハイブリッドAPI構成
- **Fastify**: 高性能なルーティングとDDD実装
- **Hono + OpenAPI**: 軽量で柔軟なAPI定義とドキュメント自動生成
- 両方のフレームワークが同じアプリケーションサービスを呼び出す設計

### 3. Monorepo 構成
- Turborepo による高速なビルドとキャッシング
- ワークスペース間での型定義の共有
- 並列実行による効率的な開発体験

### 4. ライトDDD風アーキテクチャ
- Parameter/Resultクラスによる明確なデータフロー
- 層ごとの責務分離
- テスタブルで保守性の高い設計
- interfaceを使わないシンプルな実装

### 5. 型安全性
- TypeScript による厳格な型チェック
- Zod によるランタイムバリデーション（Hono版）
- 共有型定義によるフロントエンド・バックエンド間の一貫性

### 6. ファイルタイプ検出
- Google Magika ライブラリによる高精度な検出
- バイナリレベルでのファイル形式判定
- テキスト/バイナリ判定と信頼度スコア

### 7. API ドキュメント自動生成
- OpenAPI 3.1.0 による API 仕様の定義
- Swagger UI による対話的な API テスト
- Zod スキーマによる型安全なバリデーション

## 📦 パッケージ管理

このプロジェクトは pnpm ワークスペースを使用しています。

依存関係の追加:

```bash
# ルートに追加
pnpm add -w <package>

# 特定のワークスペースに追加
pnpm add <package> --filter frontend
pnpm add <package> --filter backend
```

## 🤝 開発のヒント

### 新しいページの追加 (Nuxt)
`apps/frontend/pages/` に `.vue` ファイルを作成するだけで自動的にルーティングが設定されます。

### レンダリングモードの指定
- **SPA**: `definePageMeta({ ssr: false })` を追加
- **SSR**: デフォルト設定（何も指定しない）
- **SSG**: `nuxt.config.ts` の `routeRules` で `prerender: true` を設定

### 新しい API エンドポイントの追加

#### ライトDDD風アーキテクチャ
1. `apps/backend/src/domain/<feature>/` にParameter/Resultクラスを作成
2. `apps/backend/src/application/services/` にServiceクラスを作成

#### Fastify版エンドポイント
3. `apps/backend/src/api/fastify/` に Fastify ルートを作成
4. `apps/backend/src/index.ts` でルートを登録

#### Hono版エンドポイント（OpenAPI対応）
3. `apps/backend/src/api/hono/` に Hono + OpenAPI ルートを作成
4. `apps/backend/src/index.ts` でルートを登録

**ポイント**: FastifyとHonoの両方が同じServiceクラスを呼び出すため、ビジネスロジックは一箇所に集約されます。

### デバッグ設定

VS Codeでのデバッグ設定は `.vscode/launch.json` に記載されています。

#### 利用可能なデバッグ設定

1. **Backend: Debug**
   - バックエンドをデバッグモードで起動
   - pnpm経由でbackendフィルターを使用して実行

2. **Backend: Attach**
   - 既に起動しているバックエンドプロセスにアタッチ
   - ポート9229で接続

3. **Frontend: Debug**
   - フロントエンドをChromeブラウザでデバッグ
   - `http://localhost:3000` に接続

4. **Backend: Debug (tsx watch)**
   - tsx watchモードでバックエンドをデバッグ
   - ファイル変更時に自動再起動

5. **All: Debug (Compound)**
   - Turborepoの全アプリを同時起動

6. **Full Stack Debug (Compound)**
   - バックエンドとフロントエンドを同時にデバッグ
   - フルスタック開発に最適

#### デバッグの開始方法

1. VS Codeのデバッグパネルを開く（`Ctrl+Shift+D` / `Cmd+Shift+D`）
2. ドロップダウンから使用する設定を選択
3. F5キーまたは再生ボタンをクリック
4. ブレークポイントを設定してコードをステップ実行

## 📄 ライセンス

MIT

## 🙏 参考資料

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Nuxt 3 Documentation](https://nuxt.com/)
- [Fastify Documentation](https://www.fastify.io/)
- [Hono Documentation](https://hono.dev/)
- [Google Magika](https://github.com/google/magika)
