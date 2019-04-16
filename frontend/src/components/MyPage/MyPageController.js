import React, { Component } from 'react';
import { AppContext } from '../../contexts/appContext';
import MyPageView from './MyPageView';

class MyPageController extends Component {
  static contextType = AppContext;

  state = {
    myStudy: [],
    joinedStudy: [],
  };

  async componentDidMount() {
    const { signInInfo: { email: loginedUserEmail, } } = this.context.state;
    const contents = await this.context.actions.getContentsList();
    const myStudy = contents.filter(content => content.leader.email === loginedUserEmail);
    const joinedStudy = [];
    contents.map(content => {
      return content.participants.forEach(user => {
        if(user.email === loginedUserEmail) joinedStudy.push(content);
      });
    });
    this.setState({
      contents,
      myStudy,
      joinedStudy,
    });
  };

  leaveStudy = async contentId => {
    await this.context.actions.leaveStudy(contentId);
    window.location.reload();
  };

  deleteStudy = async contentId => {
    await this.context.actions.deleteStudy(contentId);
    window.location.reload();
  };

  render() {
    const { contents, myStudy, joinedStudy, } = this.state;
    const { signInInfo, } = this.context.state;
    return (
      <div>
        {contents ? (
          <MyPageView myStudy={myStudy} joinedStudy={joinedStudy} signInInfo={signInInfo} leaveStudy={this.leaveStudy} deleteStudy={this.deleteStudy} />
        ) : (
          <div style={{ height: 900 }} />
        )}
      </div>
    );
  }
}

export default MyPageController;
