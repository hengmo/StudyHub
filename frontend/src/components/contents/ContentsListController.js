import React, { Component } from 'react';
import { AppContext } from '../../contexts/appContext';
import ContentsListViewPage from './ContentsListViewPage';

class ContentsController extends Component {
  static contextType = AppContext;

  state = {}

  async componentDidMount() {
    const contents = await this.context.actions.getContentsLatest();
    this.setState({
      contents,
    });
  }

  render() {
    const { contents } = this.state;
    return (
      <div>
        {contents ? (
          <ContentsListViewPage contents={contents} />
        ) : (
          <div style={{ height: 900 }} />
        )}
      </div>
    );
  }
}

export default ContentsController;
