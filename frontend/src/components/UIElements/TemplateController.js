import React, { Component, } from 'react';
import { AppContext } from '../../contexts/appContext';
import TemplateViewPage from './TemplateViewPage';
/* global naver */

class TemplateController extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      contentsByDistance: [],
      contentsLatest: [],
      searchTerm: '',
      values: 0,
      categories: ['영어', '일본어', '중국어', '회화', '취업준비', '면접', '자기소개서', '프로젝트', '코딩 테스트', '전공', '인적성&NCS'],
      loadingCompleted: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.values === nextState.values || this.state.searchTerm === nextState.searchTerm;
  }

  async componentDidMount() {
    const { lat, lng } = this.context.state;
    const currentLatLng = new naver.maps.LatLng(lat, lng);
    const addresses = await this.context.actions.getAddressesByLatLng(currentLatLng);
    const currentAddress = addresses[0]
      .split(' ')
      .slice(0, 2)
      .join(' ');

    const contentsLatest = await this.context.actions.getContentsLatest();
    const contentsByDistance = contentsLatest.filter(
      content =>
        content.studyLocation
          .split(' ')
          .slice(0, 2)
          .join(' ') === currentAddress,
    );

    this.setState({
      contentsLatest: contentsLatest, // 최신순
      contentsByDistance: contentsByDistance, //거리순
      loadingCompleted: true,
    });
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      searchTerm: event.target.value,
    }, () => {
      console.log(this.state.searchTerm);
    },);
  };

  render() {
    const { contentsLatest, contentsByDistance, categories, loadingCompleted } = this.state;
    const {
      lat,
      lng,
      userInfo: { status: loginStatus },
    } = this.context.state;

    return (
      <>
        <TemplateViewPage
          contentsLatest={contentsLatest}
          contentsByDistance={contentsByDistance}
          categories={categories}
          loadingCompleted={loadingCompleted}
          lat={lat}
          lng={lng}
          loginStatus={loginStatus}
        />
      </>
    );
  }
}
export default TemplateController;
