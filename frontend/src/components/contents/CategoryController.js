import React, { Component } from 'react';
import { AppContext } from '../../contexts/appContext';
import ContentsListViewPage from './ContentsListViewPage';

class CategoryController extends Component {
  static contextType = AppContext;

  state = {
    searchTerm: this.props.match.params.id,
  };

  async componentDidMount() {
    const { searchTerm } = this.state;
    const contents = await this.context.actions.getContentsByCategory(searchTerm);
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

export default CategoryController;
