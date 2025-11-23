# Claude Code 使用ガイド

このドキュメントは、Claude Code（Claude AI）がこのプロジェクトで作業する際の特別なガイドラインと推奨事項をまとめたものです。

## 📚 ドキュメント構成

このプロジェクトには複数のドキュメントがあります。優先順位と役割を理解してください：

### 1. Claude Code専用コンテキスト（`.claude/context/`）

- **[conventions.md](./context/conventions.md)** - コーディング規約のクイックリファレンス
- **[architecture.md](./context/architecture.md)** - アーキテクチャ概要と設計パターン
- **[common-tasks.md](./context/common-tasks.md)** - 頻繁に実行するタスクのガイド

### 2. プロジェクト開発規約（`rule/`）

- **[rule/rule.md](../rule/rule.md)** - メインの開発規約（最も詳細）
- **[rule/api-design.md](../rule/api-design.md)** - API設計ガイドライン

### 3. AI Agents向けドキュメント

- **[AGENTS.md](../AGENTS.md)** - 全AI coding agents向けの標準コンテキスト（英語）

### 優先順位

矛盾がある場合は以下の順で優先してください：

1. `rule/rule.md` - プロジェクト固有の詳細規約
2. `.claude/context/` ドキュメント群 - Claude Code向けの補足
3. `AGENTS.md` - 一般的なAI agents向けガイドライン

## 🎯 Claude Code使用時の特別ルール

### タスク開始前の必須チェック

#### 1. ファイルを必ず読む

```typescript
❌ 悪い例：ファイルを読まずに変更提案
✅ 良い例：
1. Read toolでファイルを読む
2. 既存のコード構造を理解
3. 適切な変更を提案・実装
```

#### 2. 複数の関連ファイルを並行読み込み

```typescript
// 効率的：複数のRead toolを1つのメッセージで実行
✅ Read tool: src/app/page.tsx
✅ Read tool: src/features/home/components/Hero.tsx
✅ Read tool: src/lib/site-config.ts

// 非効率：1つずつ順番に読む
❌ Read tool: src/app/page.tsx → 待機 → Read tool: ...
```

#### 3. プロジェクト構造の理解

新しい機能を追加する前に、既存のディレクトリ構造を確認：

```bash
# Glob toolで既存の構造を確認
src/features/**/
src/components/**/
```

### コード生成時の必須事項

#### TypeScript型安全性

```typescript
// ❌ 絶対禁止
const user: any = { ... };

// ✅ 推奨
interface User {
  id: string;
  name: string;
  email: string;
}
const user: User = { ... };

// ⚠️ やむを得ない場合のみ
const data: unknown = await fetchData();
if (isUser(data)) {
  // 型ガードで安全に使用
}
```

#### インポートパス

```typescript
// ✅ DO: @/エイリアスを使用
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

// ❌ DON'T: 相対パスの乱用
import { Button } from "../../../../components/ui/Button";
```

#### Server Component vs Client Component

```typescript
// ✅ Server Component（デフォルト）- データフェッチ、SEO重視
export default async function Page() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}

// ✅ Client Component - インタラクション必要時のみ
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### ファイル配置ルール

#### コンポーネント

```
✅ 正しい配置：
src/components/ui/Button.tsx          # 汎用UIコンポーネント
src/features/todo/components/TodoList.tsx  # 機能固有コンポーネント

❌ 間違った配置：
src/app/Button.tsx                    # appディレクトリに直接配置
src/Button.tsx                        # srcルートに直接配置
```

#### フック

```
✅ 正しい配置：
src/hooks/useLocalStorage.ts          # 汎用フック
src/features/todo/hooks/useTodos.ts   # 機能固有フック

❌ 間違った配置：
src/app/useLocalStorage.ts            # appディレクトリに配置
```

#### ユーティリティ関数

```
✅ 正しい配置：
src/utils/formatDate.ts               # 汎用ユーティリティ
src/features/todo/utils/sortTodos.ts  # 機能固有ユーティリティ
```

## 🔧 よくあるタスクのベストプラクティス

### 新規ページ追加

```typescript
// 1. src/app/ 配下に作成（kebab-case）
src / app / user - profile / page.tsx;

// 2. Metadataを必ず設定
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View and edit user profile",
};

export default function UserProfilePage() {
  // ...
}
```

### 新規API追加

```typescript
// src/app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await fetchUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
```

### 新規機能モジュール追加

```bash
# ディレクトリ構造
src/features/new-feature/
├── components/       # 機能固有のコンポーネント
├── hooks/           # 機能固有のフック
├── utils/           # 機能固有のユーティリティ
├── types/           # 機能固有の型定義
└── index.ts         # エクスポート
```

## 🚫 絶対に避けるべきこと

### セキュリティ

```typescript
// ❌ APIキーのハードコーディング
const API_KEY = "sk-1234567890abcdef";

// ✅ 環境変数を使用
const API_KEY = process.env.API_SECRET_KEY;

// ✅ クライアント公開する場合のみNEXT_PUBLIC_プレフィックス
const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL;
```

### パフォーマンス

```typescript
// ❌ 通常の<img>タグ
<img src="/image.jpg" alt="..." />

// ✅ Next.js Imageコンポーネント
import Image from 'next/image';
<Image src="/image.jpg" alt="..." width={500} height={300} />
```

### コード品質

```typescript
// ❌ console.logを残す
console.log("debug info");

// ❌ 未使用のimport
import { useState, useEffect, useMemo } from "react"; // useMemo未使用

// ❌ 200行を超える巨大コンポーネント
export function GiantComponent() {
  // 500行のコード...
}
```

## 📝 コミット時のルール

### コミットメッセージ形式

```
<type>: <description>

例：
feat: add user authentication feature
fix: resolve hydration error in header component
docs: update architecture documentation
```

### Pre-commit自動実行

Huskyが自動的に以下を実行します：

- ESLint（コード品質チェック）
- Prettier（コードフォーマット）

エラーが出た場合は修正してから再度コミットしてください。

## 🎨 スタイリング

### Tailwind CSS 4使用

```tsx
// ✅ ユーティリティクラスの使用
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Click me
</button>

// ✅ 条件付きクラス
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === 'primary' && "primary-variant-class"
)}>
```

### グローバルスタイル

`src/app/globals.css` で定義されています。必要に応じて追加可能ですが、最小限に抑えてください。

## 🔍 デバッグとトラブルシューティング

### 開発サーバーの起動

```bash
npm run dev
```

→ http://localhost:3000 でアクセス

### ビルドエラーの確認

```bash
npm run build
```

→ 本番ビルドが通るか確認

### Lintエラーの確認

```bash
npm run lint
```

→ コード品質の問題を確認

### フォーマット実行

```bash
npm run format
```

→ コード全体をフォーマット

## 📚 追加リソース

### 内部ドキュメント

- [よくあるタスク](./context/common-tasks.md) - 具体的な実装例
- [アーキテクチャ](./context/architecture.md) - 設計パターン
- [コーディング規約](./context/conventions.md) - クイックリファレンス
- [詳細規約](../rule/rule.md) - 最も詳細な開発規約
- [API設計](../rule/api-design.md) - API設計ガイドライン

### 外部ドキュメント

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [React 公式ドキュメント](https://react.dev)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)

## 💡 Claude Codeへの期待事項

### 積極的に実行すべきこと

- ✅ タスク開始前に関連ファイルを読む
- ✅ 既存のコーディングスタイルに合わせる
- ✅ 型安全性を最優先する
- ✅ セキュリティを意識する
- ✅ パフォーマンスに配慮する
- ✅ 適切なエラーハンドリングを実装する
- ✅ わからないことは質問する

### 避けるべきこと

- ❌ ファイルを読まずに変更する
- ❌ any型を使用する
- ❌ 環境変数をハードコーディングする
- ❌ 過度に複雑な実装をする
- ❌ 不要なリファクタリングを行う
- ❌ console.logを残す
- ❌ テストされていないコードを提供する

## 🎯 成功のための心構え

1. **既存コードを尊重する** - 新しいパターンを無理に導入しない
2. **シンプルに保つ** - 必要最小限の変更で目的を達成する
3. **一貫性を保つ** - 既存のスタイルと規約に従う
4. **安全第一** - セキュリティとパフォーマンスを常に意識する
5. **質問を恐れない** - 不明点は実装前に確認する

---

**最終更新**: 2025-11-22
**ドキュメントバージョン**: 1.0.0

このガイドラインに従うことで、高品質で保守性の高いコードを生成できます。
