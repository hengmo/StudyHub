# 스터디 모집 웹 애플리케이션

![studyhub](https://user-images.githubusercontent.com/35620465/56643541-c6fb1180-66b4-11e9-9e29-e18fb10bdd6a.JPG)

## 사용 기술

### 프론트엔드

- HTML
- CSS
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

- 스터디 작성 페이지(Naver Map API활용)
- 스터디 상세보기 페이지(스터디 참여/탈퇴 가능)
- 마이페이지(이메일/닉네임/회원가입일 확인, 스터디 상세보기/탈퇴/삭제 가능)
- axios 비동기 요청 코드 모듈화

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

## 개발 후기

이전까지는 프론트엔드만의, 또는 백엔드만의 프로젝트를 진행했었다면 이 프로젝트는 처음으로 완전한 하나의 웹 페이지를 프론트엔드 부터 백엔드까지 만들어 본 프로젝트였습니다. 역할을 분담할 때도 어느 한 사람은 프론트엔드, 또 어느 한 사람은 백엔드로 나누어 진행하지 않고 일부러 기능별로 분담해 그 기능을 맡은 사람이 UI 설계, API 설계, DB 설계 등 전체를 다 개발하도록 진행했습니다. 그만큼 웹 페이지가 세상에 나오기까지 어떻게 만들어지는지를 몸소 느낄 수 있었던 프로젝트였습니다. 개발자 커뮤니티에서 팀원들을 구해 진행했는데 팀 협업을 하기 위해서 개발 전 어떻게 시작해야 하는지, 개발 도중 어떻게 Merge 해야 하는지, 어떻게 코드 리뷰를 해야 하는지 등을 배웠으며 제 개인적으로 Notion이라는 웹 노트에 개발 일지를 작성하면서 어떤 경우에 에러가 생기고 어떤 경우에 해결할 수 있는지를 적었고 기능별로, 그 기능에 대한 또 세부기능별로 Todo List를 정리해 팀원들과의 스터디 모임 전까지 다 구현해보려 했습니다. HTML, CSS를 잘하지 못해 UI 설계 하는 데에 어려움을 겪고, 처음 React.JS를 사용하면서 에러 하나 해결 하는 데에도 짧으면 하루, 길면 3~4일까지 그 에러 하나에 시간을 쏟아 부었지만, 그만큼 제게 남는 것도 많고 가장 뿌듯했던 경험이었습니다. 현재 반응형으로는 개발하진 못했지만, 5월 이후 꾸준히 스터디원들과 다시 모여 실제 서비스가 가능하도록 추가 개발을 진행하려 합니다. 감사합니다.