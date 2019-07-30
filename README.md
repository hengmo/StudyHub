# 스터디 모집 웹 애플리케이션

![studyhub](https://user-images.githubusercontent.com/35620465/56643541-c6fb1180-66b4-11e9-9e29-e18fb10bdd6a.JPG)

## 사용 기술

### 프론트엔드

- HTML5
- CSS3
- Material-UI
- React.JS(with Context API)

### 백엔드

- Node.JS
- Express.JS
- MongoDB(mongoose)
- Amazon EC2
- Amazon S3
- Amazon Route 53

### 개발 툴

- Visual Studio Code
- MongoDB Compass
- Postman
- Putty
- WinSCP

## 맡은 기능

- [스터디 작성/상세 페이지(Naver Map API 활용, 스터디 참여/탈퇴 기능)](https://github.com/hengmo/StudyHub/tree/master/frontend/src/components/contents)
- [마이페이지(이메일/닉네임/회원가입일 확인, 스터디 상세보기/탈퇴/삭제 기능)](https://github.com/hengmo/StudyHub/tree/master/frontend/src/components/MyPage)
- [스터디 생성, 삭제, 참여, 탈퇴, 이미지 업로드 API](https://github.com/hengmo/StudyHub/blob/master/backend/routes/api/contents.js)
- [axios 비동기 요청 코드 모듈화](https://github.com/hengmo/StudyHub#%EB%8C%80%ED%91%9C%EC%A0%81%EC%9C%BC%EB%A1%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%97%90-%EA%B8%B0%EC%97%AC%ED%95%9C-%EC%BD%94%EB%93%9C)

## 대표적으로 프로젝트에 기여한 코드

```javascript
import axios from 'axios';

const apiUrl = 'https://api.studyhub.xyz';
const methods = ['get', 'post', 'put', 'delete'];

function formatUrl(path) {
  return `${apiUrl}${path}`;
}

class ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, data) => new Promise((resolve, reject) => {
          axios({
            method: method,
            url: formatUrl(path),
            data: data,
            withCredentials: true,
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            const response = err.response;
            reject({statusCode : response.status, message: response.data});
          });
      });
      return this[method];
    });
  }
}
```
프론트엔드에서 axios 라이브러리를 활용하여 http 비동기 요청을 하는 코드가 많았는데 요청 시마다 axios 라이브러리를 불러오고 데이터에 접근하려고 하니 코드의 가독성과 생산성이 떨어졌습니다. 이를 해결하기 위해 apiClient.js라는 모듈 파일을 만들어 파일 내에서만 비동기요청을 할 수 있도록 코드를 수정했습니다. 먼저 apiUrl 이라는 전역 변수를 정의하고 여러 http 메소드를 활용할 수 있도록 methods라는 전역 배열에 get, post, put, delete를 각각 문자열로 저장하면서 코드 길이를 줄였습니다. 그리고 path를 인자로 받는 formatUrl이라는 함수를 정의해 ExpressJS의 라우터를 이용할 수 있도록 작성했습니다. axios 라이브러리 활용 부분은 ApiClient라는 class 작성 후 constructor 생성자 함수를 이용해 구현했습니다. 생성자 함수 내에서 methods.forEach로 배열 요소 각각에 대해 비동기 요청을 할 수 있도록 했습니다. forEach문에서 실행할 함수인 this[method]를 Promise로 정의하면서 성공 시 응답 데이터를 전달하고 실패 시 상태 코드, 에러메시지, 데이터를 전달하도록 했습니다. 그리고 this[method]를 반환하여 반복문을 나오고 ApiClient의 method로 활용할 수 있도록 했습니다. 이 파일을 통해 프로젝트가 원활히 진행되어 각자가 맡은 기능을 빠르게 마무리할 수 있었고 이후 품질향상의 시간도 마련할 수 있었습니다. 향상된 코드 하나가 팀 전체에 좋은 영향을 줄 수 있다는 사실을 알게 된 경험이었습니다.

[활용 예](https://github.com/hengmo/StudyHub/blob/master/frontend/src/contexts/appContext.js#L128-L138/)

# 1차 개선 부분

## 로그인 페이지
- 로그인 실패시 홈 화면으로 리다이렉트 되는 문제 개선
- 회원가입 버튼 추가

## 메인페이지
- 스터디 시작하기 버튼 -> 스터디허브 가입하기 버튼으로 수정
- 카테고리 검색 삭제 -> 카테고리 버튼을 나열
- 스터디 카드 타이틀 word-break 사용
- 스터디 카드 클릭 영역 전체로 확대
- 스터디 카드 타이틀 1줄일 때 카드 height 줄어드는 문제 개선
- 스터디 리스트 Carousel 구현
- 스터디 카드 타이틀 ellipsis 구현 -> 카드 height 늘어나는 문제 개선
- 메인페이지에서 스크롤 하단에 위치했을 경우 스터디 상세 페이지로 이동하면 스크롤 하단에 와있는 문제 개선

## 스터디 작성 페이지
- 스터디 작성 버튼 클릭시 로딩 구현(스터디 작성 여러번 가능한 문제 개선)

## 스터디 상세 페이지
- 스터디 상세 페이지 UI 개선
- 스터디 작성 날짜 오류 개선
- 스터디 참여하기, 탈퇴하기, 삭제하기 버튼 클릭시 로딩 구현
- 스터디 장소, 분류 word-break 사용
- 참석자 카드의 아이디 글자수 제한
- 참석자한테 쪽지 보낼시 받는사람 이메일 오류 개선 
- 참석자한테 쪽지 보낼시 받는사람 텍스트필드 disabled 구현
- 쪽지 전송 버튼 클릭시 로딩 구현(쪽지 전송 여러번 가능한 문제 개선)
- 쪽지 닫기 버튼, X버튼 개선

## 쪽지함
- 쪽지함 이동시 로딩화면 구현
- 쪽지함 UI 수정(쪽지 작성 버튼, 쪽지 삭제 버튼)
- 쪽지와 Footer 겹치는 문제 개선
- 쪽지 페이지 숫자 두줄로 처리되는 문제 개선
- 쪽지 전송 버튼 클릭시 로딩 구현(쪽지 전송 여러번 가능한 문제 개선)

## 이후 개선해야 할 부분
- 불필요한 checkAuth api 콜 개선