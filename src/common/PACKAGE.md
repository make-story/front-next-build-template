# 사내저장소 NPM 배포 모듈 예시

## Meta Data

'치크' 이 빌드는 매개변수가 있습니다

- Choice Parameter
  Name

```
NPM_PACKAGE_NAME
```

Choices

```
common-react
```

Description

```
NPM 패키지 선택
```

## Build

- Execute shell

```
# 배포환경
export PHASE="stg"

# 필수값
echo NPM_PACKAGE_PATH
if [ -z $NPM_PACKAGE_NAME ];
    then
        exit -
fi

# 경로
NPM_PACKAGE_PATH="."

# NPM 빌드
if [ "N" == $NPM_PACKAGE_MANUAL ];
    then
    # 패키지 설치
    npm install
    # 빌드
    npm run build-jenkins
fi

# NPM 배포
case $NPM_PACKAGE_NAME in
    "common-react")
        # 패키지 경로로 이동
        NPM_PACKAGE_PATH="./src/common"
        cd NPM_PACKAGE_PATH
        # 패키지 배포
        if [ -n "$NPM_PACKAGE_TAG" ];
            then
            npm publish --tag ${NPM_PACKAGE_TAG}
        else
            npm publish
        fi
        # 젠킨스 작업폴더 경로로 다시 이동 $WORKSPACE
        cd ../../
        ;;
    *)
        # exit 0 값을 성공으로 인식, 그외 값은 에러로 인식
        exit 1
        ;;
esac

# 버전 정보 (Jenkins EnvInject plugin 사용할 경우)
echo NPM_PACKAGE_VERSION=`node -p "require('$NPM_PACKAGE_PATH/package.json').version"`> version.properties

```

- Inject environment variables
  Properties File Path

```
./version.properties
```

- Execute shell

```
# 환경변수 정상로드 여부
echo $NPM_PACKAGE_VERSION
```

## 빌드 후 조치

- Git Publisher
  '체크' Push Only If Build Successds

Tag to push

```
${NPM_PACKAGE_NAME}-${NPM_PACKAGE_VERSION}
```

Tag message

```
NPM 패키지 이름-NPM 패키지 버전
```

'체크' Create new tag
'체크' Update new tag
