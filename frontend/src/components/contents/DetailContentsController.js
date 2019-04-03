import React, { Component } from 'react';
import { AppContext } from '../../contexts/appContext';
import DetailContentsView from './DetailContentsView';
import LoadingProgress from '../UIElements/LoadingProgress';

/* global naver */

class DetailContentsController extends Component {
  static contextType = AppContext;
  
  state = {
    participants: [],
    content: {
      title: 'title',
      description: 'description',
      studyLocation: 'studyLocation',
      leader: {
        name: 'name',
        profileImg: 'coverimg/defaultAvartar.png',
      },
      createdAt: 'createdAt',
      categories: 'categories',
      imageUrl: 'coverimg/study-basic.jpg'
    },
    detailTerm: this.props.match.params.id,
    loginStatus: false,
  };

  async componentDidMount() {
    const { detailTerm, } = this.state;
    const content = await this.context.actions.getContentsDetail(detailTerm);
    const location = await this.getLatLngByAddress(content.studyLocation);
    const participants = content.participants;
  
    const map = new naver.maps.Map('naverMap', {
      center: new naver.maps.LatLng(location),
      zoom: 10
    });
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(location),
      map: map,
    });

    this.setState({
      content: content,
      participants: participants,
      loginStatus: this.context.state.signInInfo.status,
    });
  };

  componentDidUpdate() {
    
  }

  getLatLngByAddress = (address) => {
    return new Promise((resolve, reject) => {
      naver.maps.Service.geocode({
        address: address
    }, (status, response) => {
        if (status === naver.maps.Service.Status.ERROR) {
          reject(alert('지도 API 오류입니다.'));
        }
        let item = response.result.items[0]
        resolve(item.point);
      });
    });
  };

  joinStudy = async () => {
    const { detailTerm } = this.state;
    await this.context.actions.joinStudy(detailTerm);
    window.location.reload();
  };

  render() {
    const { content, participants, loginStatus, } = this.state;
    return (
      <div>
        <LoadingProgress />
        <DetailContentsView 
          content={content}
          participants={participants}
          loginStatus={loginStatus}
          joinStudy={this.joinStudy}
        />
      </div>
    );
  }
}

export default DetailContentsController;