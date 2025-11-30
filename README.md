# Turborepo DDD Sample

TypeScript + Turborepo を使用したモダンな monorepo プロジェクトです。フロントエンド（Nuxt）、API（Hono + OpenAPI）、バックエンド（Fastify + DDD構成）を含む実践的なサンプル実装です。

## 🎯 プロジェクト構成

```
ts-ddd-sample/
├── apps/
│   ├── frontend/     # Nuxt 3 フロントエンドアプリケーション
│   └── backend/      # 統合APIサーバー (Fastify + Hono + OpenAPI + DDD)
├── packages/
│   ├── types/        # 共有型定義
│   └── typescript-config/  # 共有 TypeScript 設定
└── turbo.json        # Turborepo 設定
```

## 🚀 技術スタック

### フロントエンド (apps/frontend)
- **Nuxt 3** - モダンな Vue.js フレームワーク
- **TypeScript** - 型安全性
- **Vue Router** - ルーティング

### 統合APIサーバー (apps/backend)
- **Fastify** - 高性能な Node.js Web フレームワーク
- **Hono + OpenAPI** - API ドキュメント自動生成
- **Zod** - スキーマバリデーション
- **TypeScript** - 型安全性
- **DDD (Domain-Driven Design)** - ドメイン駆動設計

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
- **統合APIサーバー**: http://localhost:3002
  - API ドキュメント (Swagger): http://localhost:3002/docs
  - OpenAPI Spec: http://localhost:3002/openapi.json
  - ヘルスチェック: http://localhost:3002/health

## 📚 API エンドポイント

### 統合APIサーバー (port 3002)

#### Users (Hono + OpenAPI)
- `GET /api/users` - ユーザー一覧取得
- `GET /api/users/:id` - ユーザー詳細取得

#### Products (Hono + OpenAPI)
- `GET /api/products` - 商品一覧取得
- `GET /api/products/:id` - 商品詳細取得

#### Orders (Fastify + DDD)
- `GET /api/orders` - 注文一覧取得
- `GET /api/orders/:id` - 注文詳細取得
- `POST /api/orders/:id/confirm` - 注文確定
- `POST /api/orders/:id/ship` - 注文発送
- `POST /api/orders/:id/cancel` - 注文キャンセル

## 🏗️ DDD風 アーキテクチャ (Backend)

バックエンドはシンプルなDDD風の構成で、各層にParameter/Resultクラスを配置しています:

```
apps/backend/src/
├── domain/               # ドメイン層 (Parameter/Result)
│   └── order/
│       ├── CreateOrderParameter.ts  # 作成用パラメータ
│       └── OrderResult.ts           # 注文結果データ
├── application/          # アプリケーション層 (ビジネスロジック)
│   └── services/
│       └── OrderService.ts          # 注文ユースケース
├── repository/           # リポジトリ層 (データ永続化)
│   └── InMemoryOrderRepository.ts   # インメモリ実装
├── api/                  # API層 (ルーティング)
│   ├── fastify/          # Fastify ルート (DDD + Orders)
│   │   ├── orders.ts
│   │   └── health.ts
│   └── hono/             # Hono ルート (OpenAPI + Users/Products)
│       ├── users.ts
│       └── products.ts
└── external/             # 外部サービス連携層 (将来用)
```

### アーキテクチャの特徴

- **シンプルさ重視**: interfaceを排除し、Parameter/Resultクラスのみで構成
- **domain層**: 各機能のParameter（入力）とResult（出力）クラスを格納
- **application層**: ビジネスロジックとデータ操作を含むServiceクラス
- **repository層**: データストア実装（interfaceなし）
- **api層**: FastifyとHonoのルート定義を分離
- **external層**: 外部API連携用（拡張性のため）

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

### 1. Monorepo 構成
- Turborepo による高速なビルドとキャッシング
- ワークスペース間での型定義の共有
- 並列実行による効率的な開発体験

### 2. ハイブリッドAPI構成
- **Fastify**: 高性能なルーティングとDDD実装
- **Hono + OpenAPI**: 軽量で柔軟なAPI定義とドキュメント自動生成
- 両方の長所を活かした統合アーキテクチャ

### 3. 型安全性
- TypeScript による厳格な型チェック
- Zod によるランタイムバリデーション
- 共有型定義によるフロントエンド・バックエンド間の一貫性

### 4. API ファースト
- OpenAPI 3.1.0 による API ドキュメント自動生成
- Swagger UI による対話的な API テスト
- Zod スキーマによる型安全なバリデーション

### 5. シンプルなDDD風アーキテクチャ
- Parameter/Resultクラスによる明確なデータフロー
- 層ごとの責務分離
- テスタブルで保守性の高い設計

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

### 新しい API エンドポイントの追加

#### Hono + OpenAPI エンドポイント
1. `apps/backend/src/api/hono/` に新しいルートファイルを作成
2. OpenAPI スキーマを定義
3. `apps/backend/src/index.ts` で Hono ルートとして登録

#### Fastify + DDD風 エンドポイント
1. `apps/backend/src/domain/<feature>/` にParameter/Resultクラスを作成
2. `apps/backend/src/application/services/` にアプリケーションサービスを作成
3. `apps/backend/src/repository/` にリポジトリ実装を作成
4. `apps/backend/src/api/fastify/` に Fastify ルートを作成

## 📄 ライセンス

MIT

## 🙏 参考資料

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Nuxt 3 Documentation](https://nuxt.com/)
- [Hono Documentation](https://hono.dev/)
- [Fastify Documentation](https://www.fastify.io/)
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)
