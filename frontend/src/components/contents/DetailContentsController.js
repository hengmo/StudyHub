import React, { Component } from 'react';
import { AppContext } from '../../contexts/appContext';
import DetailContentsView from './DetailContentsView';

/* global naver */

class DetailContentsController extends Component {
  static contextType = AppContext;

  state = {
    detailTerm: this.props.match.params.id,
    signInInfo: {},
  };

  async componentDidMount() {
    const { detailTerm } = this.state;
    const content = await this.context.actions.getContentsDetail(detailTerm);
    const location = await this.context.actions.getLatLngByAddress(content.studyLocation);
    const participants = content.participants;

    this.setState({
      content,
      participants,
      signInInfo: this.context.state.signInInfo,
    });

    const map = new naver.maps.Map('naverMap', {
      center: new naver.maps.LatLng(location),
      zoom: 10,
    });
    new naver.maps.Marker({
      position: new naver.maps.LatLng(location),
      map: map,
    });
  }

  joinStudy = async () => {
    const { detailTerm } = this.state;
    await this.context.actions.joinStudy(detailTerm);
    window.location.reload();
  };

  leaveStudy = async () => {
    const { detailTerm } = this.state;
    await this.context.actions.leaveStudy(detailTerm);
    window.location.reload();
  };

  deleteStudy = async () => {
    const { detailTerm } = this.state;
    await this.context.actions.deleteStudy(detailTerm);
    this.props.history.push('/');
  };

  render() {
    const { content, participants, signInInfo, } = this.state;
    return (
      <div>
        {content ? (
          <DetailContentsView
            content={content}
            participants={participants}
            signInInfo={signInInfo}
            joinStudy={this.joinStudy}
            deleteStudy={this.deleteStudy}
            leaveStudy={this.leaveStudy}
          />
        ) : (
          <div style={{ height: 900 }} />
        )}
      </div>
    );
  }
}

export default DetailContentsController;
