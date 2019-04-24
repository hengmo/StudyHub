import React, { Component, createContext } from 'react';
import apiClient from '../helpers/apiClient';
import socketIOClient from 'socket.io-client';
/* global naver */

const AppContext = createContext();
const { Provider } = AppContext;

export default class AppContextProvider extends Component {
  state = {
    //서울시청 초기화
    lat: 37.5666035,
    lng: 126.9783868,

    // 현재 Login 상태에 대한 state
    // status : false -> 로그인 x
    // status : true -> 로그인 o
    signInInfo: {
      status: false,
      id: '',
      email: '',
      image: '',
      name: '',
      date: '',
    },

    unseenMessage: 0,
    // 소켓 Obj state
    // io : null -> 소켓 연결 x
    socketConnection: {
      io: null,
    },

    Snackbar: {
      open: false,
      variant: 'success',
      message: null,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
    },
  };

  //Naver Map Api 사용 func
  makeAddress = (item) => {
    if (!item) {
      return;
    }

    let name = item.name,
        region = item.region,
        land = item.land,
        isRoadAddress = name === 'roadaddr';

    let sido = '', sigugun = '', dongmyun = '', ri = '', rest = '';

    if (this.hasArea(region.area1)) {
      sido = region.area1.name;
    }

    if (this.hasArea(region.area2)) {
      sigugun = region.area2.name;
    }

    if (this.hasArea(region.area3)) {
      dongmyun = region.area3.name;
    }

    if (this.hasArea(region.area4)) {
      ri = region.area4.name;
    }

    if (land) {
      if (this.hasData(land.number1)) {
        if (this.hasData(land.type) && land.type === '2') {
          rest += '산';
        }

        rest += land.number1;

        if (this.hasData(land.number2)) {
          rest += ('-' + land.number2);
        }
      }

      if (isRoadAddress === true) {
        if (this.checkLastString(dongmyun, '면')) {
          ri = land.name;
        } else {
          dongmyun = land.name;
          ri = '';
        }

        if (this.hasAddition(land.addition0)) {
          rest += ' ' + land.addition0.value;
        }
      }
    }
    return [sido, sigugun, dongmyun, ri, rest].join(' ');
  };

  hasArea = (area) => {
    return !!(area && area.name && area.name !== '');
  };
  
  hasData = (data) => {
    return !!(data && data !== '');
  };
  
  checkLastString = (word, lastString) => {
    return new RegExp(lastString + '$').test(word);
  };
  
  hasAddition = (addition) => {
    return !!(addition && addition.value);
  };

  actions = {
    setValue: obj => {
      this.setState({
        ...this.state,
        ...obj,
      });
    },
    addContents: formData => apiClient.post('/contents', formData),
    joinStudy: detailTerm => apiClient.put(`/contents/join/${detailTerm}`),
    leaveStudy: detailTerm => apiClient.put(`/contents/leave/${detailTerm}`),
    deleteStudy: detailTerm => apiClient.delete(`/contents/delete/${detailTerm}`),
    getUserInfomations: () => apiClient.get('/users'),
    getContentsList: () => apiClient.get('/contents'),
    getContentsByViews: () => apiClient.get('/contents/views'),
    getContentsLatest: () => apiClient.get('/contents/latest'),
    getContentsByCategory: searchTerm => apiClient.get(`/contents/context/${searchTerm}`), //메인 검색창에서 카테고리 검색 시 데이터 보여줌
    getContentsDetail: detailTerm => apiClient.get(`/contents/detail/${detailTerm}`), //상세내용 보여줌
    removeUser: () => apiClient.post('/users/delete'),
    getCurrentPosition: () => {
      navigator.geolocation.getCurrentPosition(position => {
        return this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    },
    getAddressesByLatLng: latlng => {
      return new Promise((resolve, reject) => {
        naver.maps.Service.reverseGeocode({
            coords: latlng,
            orders: [
                naver.maps.Service.OrderType.ADDR,
                naver.maps.Service.OrderType.ROAD_ADDR
            ].join(',')
          },
          (status, response) => {
            if (status === naver.maps.Service.Status.ERROR) {
              return reject(alert('지도 API 오류입니다.'));
            }
  
            let items = response.v2.results,
                address = '',
                htmlAddresses = [];
  
            for (let i = 0, ii = items.length, item; i < ii; i++) {
              item = items[i];
              address = this.makeAddress(item) || '';
              htmlAddresses.push(address);
            }
            return resolve(htmlAddresses);
          },
        );
      });
    },

    getLatLngByAddress: address => {
      return new Promise((resolve, reject) => {
        naver.maps.Service.geocode(
          {
            address: address,
          },
          (status, response) => {
            if (status === naver.maps.Service.Status.ERROR) {
              reject(alert('지도 API 오류입니다.'));
            }
            let item = response.result.items[0];
            resolve(item.point);
          },
        );
      });
    },
    
    checkAuth: async () => {
      return apiClient
        .post('/users/checkAuth')
        .then(res => ({ status: res.status, id: res.id, email: res.email, image: res.image, name: res.name, date: res.date }))
        .then(user => {
          let io = this.state.socketConnection.io;
          const signInStatus = user.status;

          if (!signInStatus) {
            localStorage.setItem('loginState', JSON.stringify(false));
            this.setState({
              ...this.state,
              socketConnection: {
                io: null,
              },
              signInInfo: {
                status: user.status,
                id: user.id,
                email: user.email,
                image: user.image,
                name: user.name,
                date: user.date,
              },
            });
          } else {
            // 새로 로그인을 하는 경우
            if (!this.state.signInInfo.status) {
              io = socketIOClient('http://3.14.91.180');
              io.on('unseenMessage', data => {
                if (data.recipient !== this.state.signInInfo.id) return;
                console.log('only for' + this.state.signInInfo.email);
                this.actions.getUnseenMessage();
                this.actions.snackbarOpenHandler('메시지가 도착했습니다.', 'info');
              });

              localStorage.setItem('loginState', JSON.stringify(true));

              this.setState({
                ...this.state,
                socketConnection: { io: io },
                signInInfo: {
                  status: user.status,
                  id: user.id,
                  email: user.email,
                  image: user.image,
                  name: user.name,
                  date: user.date,
                },
              });
            }
          }
        })
        .catch(err => console.log(err));
    },
    getUnseenMessage: () => {
      return apiClient.post('/messages/unseenmessages').then(unseenInfo => {
        this.setState({
          ...this.state,
          unseenMessage: unseenInfo.unseenNumber,
        });
      });
    },
    snackbarOpenHandler: (
      message,
      variantName = 'success',
      position = {
        vertical: 'top',
        horizontal: 'center',
      },
    ) => {
      this.setState({
        ...this.state,
        Snackbar: {
          message,
          open: true,
          variant: variantName,
          anchorOrigin: position,
        },
      });
    },
    snackbarCloseHandler: () => {
      this.setState({
        ...this.state,
        Snackbar: {
          ...this.state.Snackbar,
          open: false,
        },
      });
    },
  };
  render() {
    const { children } = this.props;
    return <Provider value={{ state: this.state, actions: this.actions }}>{children}</Provider>;
  }
}

function ContextHoc(WrappedComponent) {
  return function ContextHoc(props) {
    return <AppContext.Consumer>{({ state, actions }) => <WrappedComponent state={state} actions={actions} />}</AppContext.Consumer>;
  };
}

export { AppContext, ContextHoc };
