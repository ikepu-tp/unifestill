<p align="center">
<img src="./public/assets/img/logo.png" width="400" alt="UniFesTill Logo">
</p>

UniFesTill（ユニフェスティル）は，大学祭の模擬店で使用するためのPOS（Point of Sale）システムです。
システム名は「Uni（大学）」と「Festi（祭り）」，「Till（レジスター）」を組み合わせたもので，大学祭の模擬店での効率的な取引と運営をサポートします。

## 特徴

- プロジェクトごとに商品や会計の管理が可能
- タブレットの利用を想定し，タッチパネルにも対応
- 商品の登録，会計，レポート出力の機能を提供

## 利用想定者

- 大学祭に出店する大学生

## 利用端末

- パソコン（Google Chrome推奨）
- iPad（Google Chrome推奨）

## 技術スタック

- バックエンド：Laravel
- データベース：MySQL（MariaDB）
- フロントエンド：React.js

## 貢献方法

プロジェクトへの貢献を歓迎します！以下の方法で参加できます。

- [Issue](https://github.com/ikepu-tp/unifestill/issues)：バグ報告や新機能の提案などを行う際にご利用ください。
- [Discussion](https://github.com/ikepu-tp/unifestill/discussions)：議論や質問，アイデアの共有に利用します。
- [Pull Requests](https://github.com/ikepu-tp/unifestill/pulls)：新機能の追加やバグ修正のためのコード提供をお待ちしています。

## ライセンス

Copyright (c) 2023 [ikepu-tp](https://github.com/ikepu-tp).

このプロジェクトは MIT ライセンスの下で公開されています。詳細については  [MIT license](https://opensource.org/licenses/MIT) をご覧ください。

## インストール

UniFesTillは`php81`，`MySQL` (`MariaDB`も可)が必要です。

```bash
git clone https://github.com/ikepu-tp/pos
```

1. `.env`を作成する。
2. データベースを作成する。
3. `composer install --no-dev`を実行する。
4. `php artisan key:generate`を実行する。
5. `php artisan migrate`を実行する。
