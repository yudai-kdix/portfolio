# スマホOS風ポートフォリオ 仕様書（Astro + Vue 3）
Version: 1.0  
Target: GitHub Pages（Static Hosting）  
Architecture: Single Page OS-like UI  

---

## 1. 目的 / コンセプト
- 縦スクロール型ポートフォリオではなく「スマホOSを操作している体験」を提供する
- URL遷移によるフルリロードは行わず、SPA的な状態遷移のみで完結させる
- 見た目・操作感・設計力をエンジニアとしての強みとして示す

---

## 2. 技術スタック
### 2.1 基盤
- Astro（SSG）
  - HTML生成・ビルド・GitHub Pagesへのデプロイ
  - ルートは実質1ページ（`/`）

### 2.2 UI / クライアント
- Vue 3（Composition API / TypeScript）
- Pinia（状態管理）
- CSS: Tailwind CSS + CSS Variables

### 2.3 アニメーション
- GSAP（メイン）
- Vue `<Transition>` / `<TransitionGroup>`（補助）
- prefers-reduced-motion 対応

### 2.4 3D / リッチ演出
- Three.js（必要箇所のみ、遅延ロード）
- 背景・デモ用途に限定（常時描画は禁止）

---

## 3. 配信 / ルーティング方針
- GitHub Pages（Static）
- ルーティング:
  - パス遷移は行わない
  - URL hash による状態同期
    - `/#home`
    - `/#app=profile`
    - `/#app=works&modal=work-1`
- ブラウザ Back / Forward と UI 状態を同期

---

## 4. 全体構造（画面）
### 4.1 レイヤ構成
1. Background（壁紙 / Three.js Canvas）
2. Device Frame（スマホ外枠）
3. Home Screen（アイコングリッド）
4. App Windows（起動中アプリ）
5. Multitask View（アプリ一覧）

---

## 5. Home Screen 仕様
- アイコン配置: 4 × N グリッド
- Dock: 固定アイコン（3〜5）
- 操作:
  - click / tap: アプリ起動
  - Esc / Home Button: ホームへ戻る
- アニメーション:
  - アイコン位置から拡大 → アプリ起動
  - アプリ縮小 → 元のアイコン位置へ戻る

---

## 6. アプリ仕様
### 6.1 標準アプリ
1. Profile
   - 基本情報、自己紹介、連絡先、経歴など
   - 雑多に書く
2. Works
   - 実績カード一覧
   - 詳細モーダル表示
3. Experience
   - 技術スタック・使用経験
4. Playground
   - 3D / デモ / 実験置き場
5. Gallery
   - 写真がすきなので乗せる場所
6. External Link（X / GitHub）
   - 内部UI → 外部遷移

### 6.2 App Container 共通仕様
- ヘッダ（タイトル / Close / Minimize）
- 内部スクロール
- Safe Area 対応（iOS）

---

## 7. 状態設計（Pinia）
### 7.1 App 定義
```ts
type AppId =
  | 'profile'
  | 'works'
  | 'experience'
  | 'playground'
  | 'external-x'

interface AppMeta {
  id: AppId
  title: string
  icon: string
}

7.2 Window 定義

interface WindowInstance {
  instanceId: string
  appId: AppId
  state: 'opening' | 'open' | 'minimized' | 'closing'
  zIndex: number
  params?: Record<string, string>
}

7.3 Store 構造

interface OSState {
  windows: WindowInstance[]
  activeWindowId: string | null
  isMultitaskOpen: boolean
}

7.4 Actions

openApp(appId, params?)
closeApp(instanceId)
focusApp(instanceId)
minimizeApp(instanceId)
openMultitask()
closeMultitask()
syncFromHash()
syncToHash()


⸻

8. URL hash 同期仕様
	•	起動時: syncFromHash() を実行
	•	状態変更時: syncToHash() を実行
	•	例:

/#home
/#app=profile
/#app=works&modal=project-2
/#multitask


⸻

9. コンポーネント設計

9.1 Astro
	•	src/pages/index.astro
	•	<OSApp client:load /> のみ配置

9.2 Vue
	•	OSApp.vue（エントリ）
	•	AppShell.vue
	•	HomeScreen.vue
	•	Icon.vue
	•	Dock.vue
	•	WindowManager.vue
	•	AppContainer.vue
	•	MultitaskView.vue
	•	apps/
	•	ProfileApp.vue
	•	WorksApp.vue
	•	ExperienceApp.vue
	•	PlaygroundApp.vue
	•	ExternalLinkApp.vue

⸻

10. データ管理
	•	Astro Content Collections（推奨）
	•	src/content/works/*.md
	•	Vue側にはビルド時に props で受け渡し
	•	MVP段階では JSON 直置きも可

⸻

11. ディレクトリ構成（例）

src/
├─ pages/
│  └─ index.astro
├─ components/
│  └─ os/
│     ├─ OSApp.vue
│     ├─ AppShell.vue
│     ├─ HomeScreen.vue
│     ├─ Icon.vue
│     ├─ Dock.vue
│     ├─ WindowManager.vue
│     ├─ AppContainer.vue
│     ├─ MultitaskView.vue
│     └─ apps/
│        ├─ ProfileApp.vue
│        ├─ WorksApp.vue
│        ├─ ExperienceApp.vue
│        ├─ PlaygroundApp.vue
│        └─ ExternalLinkApp.vue
├─ stores/
│  └─ osStore.ts
├─ content/
│  └─ works/
├─ styles/
│  └─ globals.css


⸻

12. パフォーマンス要件
	•	初期ロード:
	•	Vue OS部分のみ
	•	Three.jsは遅延ロード
	•	フレームレート:
	•	通常操作 60fps 目標
	•	非アクティブ時:
	•	requestAnimationFrame 停止

⸻

13. アクセシビリティ
	•	キーボード操作対応
	•	prefers-reduced-motion 対応
	•	ARIA: App Window を dialog として扱う

⸻

14. 実装マイルストーン

MVP
	1.	Home Screen + Icon
	2.	open / close アニメ
	3.	Profile / Works / Experience
	4.	hash 同期

v1
	5.	Multitask View
	6.	Window Stack 管理
	7.	Works 詳細モーダル

v2
	8.	Three.js 背景
	9.	並び替え / 長押し
	10.	設定 / テーマ切替

⸻

15. 完成条件（Done）
	•	フルリロードなしで操作可能
	•	戻る/進むが破綻しない
	•	情報が読める + 操作して楽しい
	•	モバイル Safari で破綻しない

⸻


