# rigatoni
제1회 국회도서관 해커톤 대회


## 작업 파일
- routes/page/page_processing.js
- views/main.ejs

두 파일만 작업하면 됨


## 로컬에서 실행방법
```
npm install # 처음 종속된 패키지 설치
```
```
npm start   # 로컬에서 프로그램 실행
```

## 원격 푸시
```
cf login -a https://api.paas-ta.co.kr --skip-ssl-validation   # 처음 설정 (받은 이메일, 비밀번호로 로그인)
```
```
cf push   # 소스 업로드 (menifest.yml, public, views 등 있는 루트 폴더에서 실행 해야됨)
```
