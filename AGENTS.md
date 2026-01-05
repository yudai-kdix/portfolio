# Repository Guidelines

## Project Structure & Module Organization
- 本リポジトリは Astro + Vue の構成です。主要な実装は `src/` に集約されています。
- `src/pages/` はページ (Astro ルーティング) を管理し、`src/components/` 特に `src/components/os/` に UI 部品が置かれています。
- `src/composables/` は再利用ロジック、`src/stores/` は Pinia の状態管理、`src/styles/` はスタイル定義です。
- `src/assets/` はビルドに同梱する素材、`public/` はそのまま配信される静的ファイルです。`dist/` はビルド成果物です。
- `application.md` と `design.md` は設計メモです。`grateful-wind/` に同名の別セットがあるため、通常はルート配下を対象に作業してください。

## Build, Test, and Development Commands
- `npm install` 依存関係をインストールします。
- `npm run dev` ローカル開発サーバを起動します (Astro dev)。
- `npm run build` 本番ビルドを `dist/` に生成します。
- `npm run preview` ビルド結果をローカルで確認します。
- `npm run astro` Astro CLI を直接実行します。

## Coding Style & Naming Conventions
- インデントは 2 スペース、文字列はシングルクォート、行末セミコロンの既存スタイルに合わせます。
- Vue コンポーネントは `PascalCase` で命名されています (例: `AppContainer.vue`)。同様の命名規則で追加してください。
- ESLint/Prettier 等の設定は見当たりません。自動整形がないため、変更範囲の見た目を崩さないようにしてください。

## Testing Guidelines
- テストフレームワークやテストファイルは現在確認できません。
- 変更後は `npm run dev` で動作確認し、必要に応じて `npm run build` と `npm run preview` でビルド確認してください。
- もしテストを導入する場合は、配置先と実行コマンドを README に追記してください。

## Commit & Pull Request Guidelines
- 直近のコミットは短い日本語要約が中心です (例: 「レイアウト修正」「拡大の禁止」)。形式は固定されていないため、1 行で具体的に書いてください。
- PR には概要、検証手順、UI 変更のスクリーンショットを含め、関連 Issue があればリンクしてください。
