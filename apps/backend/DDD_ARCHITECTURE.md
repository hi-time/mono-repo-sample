# DDD Architecture Documentation

## 概要

このバックエンドアプリケーション (`apps/backend`) は、ドメイン駆動設計 (Domain-Driven Design, DDD) の原則に従って構成されています。

## アーキテクチャ構成

### レイヤー構造

```
src/
├── domain/              # ドメイン層 - ビジネスロジックの中核
│   ├── entities/       # エンティティ
│   ├── value-objects/  # 値オブジェクト
│   └── repositories/   # リポジトリインターフェース
│
├── application/        # アプリケーション層 - ユースケース
│   └── services/       # アプリケーションサービス
│
└── infrastructure/     # インフラストラクチャ層 - 技術的実装
    ├── persistence/    # データ永続化
    └── http/          # HTTP インターフェース
```

## 各レイヤーの役割

### 1. Domain Layer (ドメイン層)

ビジネスロジックとビジネスルールを含む中核レイヤー。

#### Entities (エンティティ)
- **Order** (`domain/entities/Order.ts`)
  - 注文のライフサイクルとビジネスルールを表現
  - メソッド:
    - `calculateTotal()`: 注文合計金額の計算
    - `confirm()`: 注文確定
    - `ship()`: 注文発送
    - `cancel()`: 注文キャンセル

#### Value Objects (値オブジェクト)
- **OrderId**: 注文ID（不変）
- **UserId**: ユーザーID（不変）
- **Money**: 金額（不変、演算メソッド付き）

特徴:
- イミュータブル（不変）
- 等価性は値で判断
- バリデーションロジックを含む

#### Repository Interfaces (リポジトリインターフェース)
- **IOrderRepository** (`domain/repositories/IOrderRepository.ts`)
  - データアクセスの抽象化
  - ドメイン層は実装の詳細を知らない

### 2. Application Layer (アプリケーション層)

ユースケースとビジネスフローを調整します。

#### Application Services
- **OrderService** (`application/services/OrderService.ts`)
  - 注文に関するユースケースを実装
  - ドメインオブジェクトを組み合わせてビジネスフローを実現
  - トランザクション境界を管理

メソッド:
- `getOrderById()`: 注文取得
- `getAllOrders()`: 全注文取得
- `createOrder()`: 注文作成
- `confirmOrder()`: 注文確定
- `shipOrder()`: 注文発送
- `cancelOrder()`: 注文キャンセル

### 3. Infrastructure Layer (インフラストラクチャ層)

技術的な実装の詳細を含みます。

#### Persistence (永続化)
- **InMemoryOrderRepository** (`infrastructure/persistence/InMemoryOrderRepository.ts`)
  - IOrderRepository の実装
  - 現在はメモリ内データストア
  - 将来的にはデータベース実装に置き換え可能

#### HTTP Routes (HTTP ルーティング)
- **ordersRoutes** (`infrastructure/http/routes/orders.ts`)
  - REST API エンドポイント
  - リクエスト/レスポンスの変換
  - アプリケーションサービスの呼び出し

## DDD の主要パターン

### 1. Entity Pattern
```typescript
class Order {
  constructor(
    public readonly id: OrderId,
    public readonly userId: UserId,
    public readonly items: OrderItem[],
    public status: OrderStatus,
    // ...
  ) {}

  // ビジネスロジック
  confirm(): void {
    if (this.status !== 'PENDING') {
      throw new Error('Only pending orders can be confirmed')
    }
    this.status = 'CONFIRMED'
  }
}
```

### 2. Value Object Pattern
```typescript
class Money {
  constructor(public readonly amount: number) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative')
    }
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount)
  }
}
```

### 3. Repository Pattern
```typescript
interface IOrderRepository {
  findById(id: OrderId): Promise<Order | null>
  save(order: Order): Promise<void>
}
```

## 依存関係のルール

```
Infrastructure → Application → Domain
     ↓              ↓             ↓
   実装詳細      ユースケース    ビジネスロジック
```

- **Domain層**: 他の層に依存しない
- **Application層**: Domain層にのみ依存
- **Infrastructure層**: すべての層に依存可能

## ビジネスルールの例

### 注文のライフサイクル

```
PENDING → CONFIRMED → SHIPPED → DELIVERED
    ↓
CANCELLED (DELIVEREDからはキャンセル不可)
```

実装:
```typescript
// 注文確定
confirm(): void {
  if (this.status !== 'PENDING') {
    throw new Error('Only pending orders can be confirmed')
  }
  this.status = 'CONFIRMED'
}

// 注文キャンセル
cancel(): void {
  if (this.status === 'DELIVERED') {
    throw new Error('Delivered orders cannot be cancelled')
  }
  this.status = 'CANCELLED'
}
```

## テストの考え方

### Domain Layer のテスト
- ビジネスロジックの単体テスト
- 外部依存なしでテスト可能
- 高速で信頼性の高いテスト

```typescript
test('should confirm pending order', () => {
  const order = new Order(...)
  order.status = 'PENDING'
  
  order.confirm()
  
  expect(order.status).toBe('CONFIRMED')
})
```

### Application Layer のテスト
- ユースケースのテスト
- モックリポジトリを使用

```typescript
test('should confirm order via service', async () => {
  const mockRepo = new MockOrderRepository()
  const service = new OrderService(mockRepo)
  
  await service.confirmOrder(new OrderId('order-1'))
  
  // assertions...
})
```

## 拡張のガイドライン

### 新しいエンティティの追加
1. `domain/entities/` にエンティティクラスを作成
2. 値オブジェクトを定義
3. リポジトリインターフェースを定義
4. アプリケーションサービスを実装
5. インフラストラクチャ実装を追加

### データベースへの移行
1. `infrastructure/persistence/` に新しいリポジトリ実装を作成
   - 例: `PostgresOrderRepository`
2. ORM/クエリビルダーを使用
3. ドメイン層・アプリケーション層は変更不要

## ベストプラクティス

1. **ドメインロジックはドメイン層に集中**
   - アプリケーション層やインフラ層にビジネスロジックを漏らさない

2. **不変性を保つ**
   - 値オブジェクトは常に不変
   - エンティティも可能な限り不変性を保つ

3. **明示的な型を使用**
   - プリミティブ型の代わりに値オブジェクトを使用
   - 例: `string` → `OrderId`

4. **ユビキタス言語**
   - ビジネス用語をコードに反映
   - ドメインエキスパートと同じ用語を使用

5. **小さく始める**
   - 過度に複雑にしない
   - 必要に応じてリファクタリング

## 参考資料

- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Implementing Domain-Driven Design by Vaughn Vernon](https://vaughnvernon.com/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
