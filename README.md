# AWS-SAM-sample

<details open="open">
<summary>目次</summary>


- [samのセットアップ、ローカル確認](#samのセットアップ、ローカル確認)
- [コマンドラインからDeploy＆UPDATE](#コマンドラインからDeploy＆UPDATE)
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
make sam-local
```

</details>

# コマンドラインからDeploy＆UPDATE

<details>
<summary> 0. template.yamlでAPIGatewayのIP制限を設定</summary>

- defaultではIP制限が入っていないため、必ずIP制限をしてからデプロイすること
- 下記の設定が、defaultのtemplate.yamlに対して追加が必要
- 環境変数に指定のIPが必要

```zh
DIG_IP=
```

```template.yaml
Parameters:
  DIGIp:
    Type: String
    Default: ''


Globals:
  Function:
    Timeout: 3
  Api:
    Cors:
      AllowMethods: "'GET'"
      AllowHeaders: "'Content-Type'"
      AllowOrigin: "'*'"

Resources:
  ApiGatewayApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: DEV
      Auth:
        ResourcePolicy:
          CustomStatements:
            - Effect: Allow
              Principal: '*'
              Action: execute-api:Invoke
              Resource: execute-api:/*
              Condition:
                IpAddress:
                  aws:SourceIp: !Ref DIGIp
            - Effect: Deny
              Principal: '*'
              Action: execute-api:Invoke
              Resource: execute-api:/*
              Condition:
                NotIpAddress:
                  aws:SourceIp: !Ref DIGIp

  HelloWorldFunction:
    ......(そのまま)
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /hello
            Method: get
            RestApiId: !Ref ApiGatewayApi
    Metadata:
      BuildMethod: esbuild
      ......(あとはそのまま)
```
</details>

<details>
<summary> 1. AWSConfigの設定</summary>

- ToroHandsOnのtemporaryのアクセスキーをターミナルの環境変数に設定
- リージョンを東京に設定
- samconfig.tomlを設定すること。

```zh
export AWS_DEFAULT_REGION=ap-northeast-1
```
</details>

<details>
<summary> 2. make sam-deployでデプロイ</summary>

- 下記を実施しても、APIGatewayのエンドポイントは変わらないので、Updateとしても使える（差分検知してリソース変更）


```zh
make sam-deploy
```

</details>

# 備考
[samの記事1](https://zenn.dev/toccasystems/articles/aws-sam-setup?redirected=1)
</br>
[samの記事2](https://qiita.com/hf7777hi/items/6d2b093d6ed7271cf81b)



