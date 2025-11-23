# Spotify Playlist Player - 実装計画書

## 実装フェーズ

### Phase 1: 環境設定とSpotify API統合

#### 1.1 Spotify Developer設定
- [ ] Spotify Developer Dashboardでアプリケーションを作成
- [ ] Client IDとClient Secretを取得
- [ ] `.env.local`ファイルを作成し、環境変数を設定

#### 1.2 環境変数設定
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

#### 1.3 型定義作成
ファイル: `src/types/spotify.ts`
- SpotifyPlaylist型
- SpotifyTrack型
- SpotifyImage型
- SpotifyArtist型
- SpotifyAlbum型

### Phase 2: バックエンドAPI実装

#### 2.1 Spotify認証APIルート
ファイル: `src/app/api/spotify/token/route.ts`
- Client Credentials Flowでアクセストークンを取得
- トークンをキャッシュ（有効期限管理）

#### 2.2 プレイリスト取得APIルート
ファイル: `src/app/api/spotify/playlist/[id]/route.ts`
- プレイリストIDからプレイリスト情報を取得
- トラック情報を含むレスポンスを返す
- エラーハンドリング

#### 2.3 ユーティリティ関数
ファイル: `src/lib/spotify.ts`
- `getSpotifyAccessToken()`: アクセストークン取得
- `getPlaylistById(id)`: プレイリスト情報取得
- `extractPlaylistId(url)`: URLからプレイリストIDを抽出

### Phase 3: フロントエンド - コンポーネント設計

#### 3.1 フォルダ構造
```
src/
├── features/
│   └── playlist-player/
│       ├── components/
│       │   ├── PlaylistInput.tsx          # URL入力フォーム
│       │   ├── PlayerControls.tsx         # 再生コントロール
│       │   ├── CurrentTrack.tsx           # 現在再生中のトラック表示
│       │   ├── TrackList.tsx              # トラックリスト
│       │   ├── TrackItem.tsx              # トラックアイテム
│       │   ├── ProgressBar.tsx            # プログレスバー
│       │   └── PlaybackSettings.tsx       # 再生時間設定
│       ├── hooks/
│       │   ├── useSpotifyPlaylist.ts      # プレイリスト取得hook
│       │   ├── useAudioPlayer.ts          # オーディオ再生hook
│       │   └── useAutoPlayNext.ts         # 自動再生hook
│       └── index.tsx                      # メインページ
├── types/
│   └── spotify.ts                         # 型定義
└── lib/
    └── spotify.ts                          # ユーティリティ関数
```

#### 3.2 Hooks実装詳細

##### useSpotifyPlaylist
```typescript
const useSpotifyPlaylist = (playlistUrl: string) => {
  // プレイリスト情報の取得
  // ローディング状態
  // エラーハンドリング
  return { playlist, loading, error }
}
```

##### useAudioPlayer
```typescript
const useAudioPlayer = (tracks: Track[]) => {
  // Audio APIの管理
  // 再生/一時停止
  // 次/前のトラック
  // プログレスバー更新
  return {
    currentTrack,
    isPlaying,
    progress,
    play,
    pause,
    next,
    previous,
    seek
  }
}
```

##### useAutoPlayNext
```typescript
const useAutoPlayNext = (duration: number, onNext: () => void) => {
  // 設定時間経過後に自動的に次の曲へ
  // タイマー管理
}
```

### Phase 4: UI/UXデザイン実装

#### 4.1 カラーパレット
```css
/* Tailwind CSS設定 */
- Primary: sky-400, sky-500
- Background: slate-950, slate-900
- Text: slate-100, slate-200, slate-300
- Border: slate-800, slate-700
- Accent: green-400 (Spotify風)
```

#### 4.2 レイアウト
- **デスクトップ**: 左側にプレイヤー、右側にトラックリスト
- **モバイル**: 縦長レイアウト、スクロール可能なトラックリスト

#### 4.3 アニメーション
- Tailwind CSSのtransitionクラス
- アルバムアートの回転: `animate-spin-slow`
- フェード効果: opacity transition

### Phase 5: コア機能実装

#### 5.1 PlaylistInput コンポーネント
- URL入力フォーム
- バリデーション
- ロード中のインジケーター
- エラーメッセージ表示

#### 5.2 PlayerControls コンポーネント
- 再生/一時停止ボタン
- 次へ/前へボタン
- シャッフルボタン（オプション）
- ボリュームコントロール（オプション）

#### 5.3 CurrentTrack コンポーネント
- アルバムアート（大きく表示）
- 曲名
- アーティスト名
- プログレスバー
- 現在時刻/総時間

#### 5.4 TrackList コンポーネント
- スクロール可能なリスト
- 各トラックの情報表示
- 現在再生中のトラックをハイライト
- クリックで該当トラックへジャンプ

#### 5.5 PlaybackSettings コンポーネント
- 再生時間選択（10秒、15秒、20秒、30秒）
- ラジオボタンまたはドロップダウン

### Phase 6: オーディオ再生ロジック

#### 6.1 Audio API実装
```typescript
// Audio要素の作成と管理
const audio = new Audio(previewUrl)

// イベントリスナー
audio.addEventListener('loadedmetadata', ...)
audio.addEventListener('timeupdate', ...)
audio.addEventListener('ended', ...)
audio.addEventListener('error', ...)
```

#### 6.2 自動再生ロジック
```typescript
// 設定時間経過後に次の曲へ
useEffect(() => {
  if (isPlaying && currentTime >= playbackDuration) {
    playNext()
  }
}, [currentTime, playbackDuration])
```

#### 6.3 プレビューURLがない曲の処理
- プレビューURLがnullの場合は自動的にスキップ
- ユーザーに通知（トーストメッセージなど）

### Phase 7: エラーハンドリングとバリデーション

#### 7.1 URL検証
```typescript
const isValidSpotifyPlaylistUrl = (url: string): boolean => {
  const regex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+/
  return regex.test(url)
}
```

#### 7.2 エラー表示
- トースト通知（react-hot-toastなど）
- インラインエラーメッセージ

### Phase 8: テストとデバッグ

#### 8.1 テストケース
- [ ] 有効なプレイリストURLの入力
- [ ] 無効なURLの入力
- [ ] 存在しないプレイリストID
- [ ] プレビューURLがないトラック
- [ ] 空のプレイリスト
- [ ] 大量のトラックがあるプレイリスト（100+）

#### 8.2 ブラウザテスト
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] モバイルブラウザ（iOS Safari, Chrome Mobile）

#### 8.3 レスポンシブテスト
- [ ] デスクトップ（1920x1080, 1366x768）
- [ ] タブレット（768x1024）
- [ ] モバイル（375x667, 414x896）

### Phase 9: 最適化とパフォーマンス

#### 9.1 パフォーマンス最適化
- [ ] 画像の最適化（Next.js Image component）
- [ ] トラックリストの仮想化（react-window）
- [ ] APIレスポンスのキャッシング

#### 9.2 UX改善
- [ ] ローディング状態の視覚化
- [ ] スムーズなトランジション
- [ ] キーボードショートカット（スペースで再生/一時停止など）

### Phase 10: ドキュメント作成とデプロイ

#### 10.1 README更新
- [ ] アプリの説明
- [ ] セットアップ手順
- [ ] Spotify Developer設定方法
- [ ] 使用方法

#### 10.2 環境変数設定ガイド
- [ ] `.env.example`の更新
- [ ] 環境変数の説明

## 実装スケジュール（推奨順序）

1. **Phase 1**: 環境設定 → Spotify APIキー取得、型定義
2. **Phase 2**: バックエンドAPI → トークン取得、プレイリスト取得
3. **Phase 3**: 基本コンポーネント → PlaylistInput, TrackList
4. **Phase 5**: コア機能 → プレイリスト表示
5. **Phase 6**: オーディオ再生 → 基本的な再生機能
6. **Phase 4**: デザイン → UI/UXの洗練
7. **Phase 7**: エラーハンドリング
8. **Phase 8**: テスト
9. **Phase 9**: 最適化
10. **Phase 10**: ドキュメント

## 必要な依存関係（追加が必要な場合）

現在のプロジェクトには以下が既にインストール済み:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

追加が必要な可能性のあるパッケージ:
- なし（標準のHTTP fetchとAudio APIを使用）

## 注意事項

1. **Spotify APIの制限**:
   - Rate limitに注意
   - Client Credentials Flowは公開データのみアクセス可能

2. **プレビューURL**:
   - すべてのトラックにプレビューがあるわけではない
   - 地域制限がある場合がある

3. **セキュリティ**:
   - Client SecretはサーバーサイドAPI Routeでのみ使用
   - フロントエンドには絶対に露出させない

4. **パフォーマンス**:
   - 大きなプレイリスト（1000+トラック）の場合は仮想化を検討
   - 画像の遅延読み込み

5. **ブラウザ互換性**:
   - Audio APIのブラウザサポート確認
   - Autoplay policyに注意（ユーザーインタラクション後のみ再生可能）
