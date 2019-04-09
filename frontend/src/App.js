import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { ContextHoc } from './contexts/appContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import SignUpPage from './components/UserPages/SignUpPage';
import SignInPage from './components/UserPages/SignInPage';
import MyMessagePage from './components/MyMessage/MyMessagePage';
import MyPage from './components/MyPage/MyPage';
import Template from './components/UIElements/Template';
import TopAppBar from './components/UIElements/TopAppBar/TopAppBar';
import ContentsController from './components/contents/ContentsController';
import ContentsListView from './components/contents/ContentsListView';
import NearContentsListView from './components/contents/NearContentsListView';
import Footer from './components/UIElements/Footer';
import CateGory from './components/category/CateGory';
import DetailContentsController from './components/contents/DetailContentsController';
import AllContent from './components/UIElements/AllContent';
import CustomSnackbar from './components/UIElements/CustomSnackbar';
import LoadingProgress from './components/UIElements/LoadingProgress';
import PrivateRoute from './helpers/RedirectRoute';

class App extends Component {

  componentDidMount(){
    this.props.actions.checkAuth();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location){
      this.props.actions.checkAuth();
    }
  }

  render() {
    return (
      <>
        <div className="App">
          <TopAppBar />
          <CssBaseline />
          <CustomSnackbar />
          <Route exact path="/" component={Template} />
          <PrivateRoute path="/write" component={ContentsController} />
          <Route path="/contents" component={ContentsListView} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/near" component={NearContentsListView} />
          <Route path="/loading" component={LoadingProgress} />
          <PrivateRoute path="/mypage" component = {MyPage}/>
          <PrivateRoute path="/mymessagepage" component = {MyMessagePage}/>
          <Route path="/category/:id" component={CateGory} />
          <Route path="/category//" component={Error} />
          <Route path="/detail/:id" component={DetailContentsController} />
          <Route path="/detail//" component={Error} />
          <Route path="/AllContent/" component={AllContent} />
          <Footer />
        </div>
      </>
    );
  }
}
export default ContextHoc(withRouter(App));
