# AWS-SAM-sample

<details open="open">
<summary>目次</summary>


- [samのセットアップ、ローカル確認](#samのセットアップ、ローカル確認)
- [コマンドラインからDeploy＆UPDATE](#コマンドラインからDeploy＆UPDATE)
- [作成したリソースの削除](#作成したリソースの削除)
- [githubActionsからのdeploy(これだけで十分)](#githubActionsからのdeploy(これだけで十分))
- [備考](#備考)
- [参考](#参考)
</details>


# samのセットアップ、ローカル確認

<details>
<summary> 0. sam-cliのインストール</summary>

- 下記コマンドでインストール

```zh
   brew tap aws/tap
   brew install aws-sam-cli
```

</details>


<details>
<summary> 1.samのディレクトリのセットアップ</summary>

- 下記コマンドで好きなランタイムでセットアップ
- Which template source would you like to use? -> 1
- Choose an AWS Quick Start application template -> 1
- Select your starter template -> 2
- 後はNoでOK

```zh
sam init --runtime nodejs18.x
```

</details>

<details>
<summary> 2.必要な変更を加える</summary>

- 好きにラムダ関数をかく
- デフォルトでルート直下にapp.tsが配置されて、使いづらいので、「controller」などのフォルダに切り分けた場合は、template.yamlの参照先も変更が必要


</details>

<details>
<summary> 3.ローカルでの確認</summary>

- 下記コマンドでlocalhost:3000で起動する。dynamoDBローカルなど、別のdocker-composeで起動しているコンテナと連携するためには --networkの設定が必須
- 今回は make sam-localでビルドとスタートの両方を実施するMakefileを準備した

```zh
sam build
sam local start-api
```

</details>

# コマンドラインからDeploy＆UPDATE

<details>
<summary> 0. 認証情報を登録</summary>

- ToroHandsOnのtemporaryのアクセスキーをターミナルの環境変数に設定
- リージョンを東京に設定
- samconfig.tomlを設定すること。

```zh
export AWS_DEFAULT_REGION=ap-northeast-1
```

```
# More information about the configuration file can be found here:
# https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-config.html
version = 0.1

[default]
[default.global.parameters]
stack_name = "temp-ogata-sam"

[default.build.parameters]
cached = true
parallel = true

[default.validate.parameters]
lint = true

[default.deploy.parameters]
capabilities = "CAPABILITY_IAM"
confirm_changeset = true
resolve_s3 = true
stack_name = "temp-ogata-sam"
s3_prefix = "temp-ogata-sam"
region = "ap-northeast-1"
disable_rollback = true
image_repositories = []
force_upload = true

[default.package.parameters]
resolve_s3 = true

[default.sync.parameters]
watch = true

[default.local_start_api.parameters]
warm_containers = "EAGER"

[default.local_start_lambda.parameters]
warm_containers = "EAGER"

```

</details>

<details>
<summary> 1. 下記コマンドを実行</summary>


```zh
sam build
sam deploy --no-confirm-changeset --no-fail-on-empty-changeset
```

</details>

<details>
<summary> 2. make sam-deployでデプロイ</summary>

- 下記を実施しても、APIGatewayのエンドポイントは変わらないので、実質Updateできる
- 最初に、samconfig.tomlの「stack_name, s3_prefix, region」など対話中に聞かれる値を設定しておく
- 後は下記のデプロイコマンドを実行。今回は make sam-deployでまとめて実行できるようにしている


```zh
sam build
sam deploy --no-confirm-changeset --no-fail-on-empty-changeset
```

</details>

# 作成したリソースの削除

<details>
<summary> 1. 下記コマンドで削除</summary>


```zh
sam delete --stack-name <スタックネーム>
```

</details>

# githubActionsからのdeploy(これだけで十分)


<details>
<summary> 1. ルートディレクトリーで必要なIAMロールの作成</summary>

- GithubActionsで認可後に渡すAssumeロール、ラムダ関数にアタッチするロールを事前に作成
- 「1.AWS_DEFAULT_REGION, 2.GITHUB_ACCOUNT, 3.GITHUB_REPOSITORY」と、IAMアクセスキーをexportして環境変数に設定
- make iac-role-deployでデプロイする

```zh
make iac-role-deploy
```

</details>

<details>
<summary> 2. githubActionsに必要な環境変数を設定</summary>

- 添付の３つの環境変数を設定する

![](./assets/images/githubactions1.png)

</details>

<details>
<summary> 3. githubへPush</summary>

- github-ci.ymlに必要事項がかけたらPush
- 今回はS3バケット名は環境変数で指定＆毎回クリーンナップするようにした（無限にUPDATE毎に増えていくので）

</details>




# 備考
[samの記事1](https://zenn.dev/toccasystems/articles/aws-sam-setup?redirected=1)

# 参考


