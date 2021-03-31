# password_manager
## 概要
- [@aoikato](https://github.com/aoikato/genPw) との共同開発プロジェクト（2017.12〜2018.1）
- パスワードの生成・保管・利用の機能を持ちローカルホストで動作する

## 登録時
パスワードを生成し、ユーザー名、サービスのドメインと紐付けて登録する。
## ログイン時
マスターパスワードを入力すると、登録されたパスワードが自動入力される。

## 技術面
- Webブラウザ上での動作をブックマークレットで実現
- Flaskで簡易的なローカルサーバを立て、CGIでWebブラウザからの要求を処理させる。
- ブックマークレットはJS、サーバはPython（パスワード生成プログラムとの連携はC）、パスワードの生成に関してはCで実装。

## 貢献
パスワード生成（以下２つ）以外を担当。
・genpw/genPw.c
・genpw/consDict.c
