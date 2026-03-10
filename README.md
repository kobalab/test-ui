# test-ui
電脳麻将のUIをテストする

リファクタリングやUI部品のテスト・調整のためのリポジトリです。

## デモ

https://kobalab.net/test-ui/demo/

## 初期設定

Unix系OS(Linux, macOS)の場合:
```sh
$ npm ci
$ mkdir demo
$ cd demo
$ ln -s ../dist/img .
$ ln -s ../dist/audio .
$ ln -s ../css/audio .
$ ln -s ../js/audio .
```
Windowsの場合:
```
> npm ci
> mkdir demo
> cd demo
> mklink /J img ..\dist\img
> mklink /J audio ..\dist\audio
> mklink /J css ..\dist\css
> mklink /J js ..\dist\js
```

## npm-scripts
| コマンド        | 説明
|:----------------|:-------------------------------------------
| ``release``     | リリース用にビルドする。
| ``build``       | デバッグ用にビルドする。
| ``build:js``    | JavaScriptのみデバッグ用にビルドする。
| ``build:css``   | CSSのみビルドする。
| ``build:html``  | HTMLのみビルドする。
