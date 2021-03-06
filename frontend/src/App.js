import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { ContextHoc } from './contexts/appContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import PrivateRoute from './helpers/RedirectRoute';
import SignUpPage from './components/UserPages/SignUpPage';
import SignInPage from './components/UserPages/SignInPage';
import MyMessagePage from './components/MyMessage/MyMessagePage';
import MyPageController from './components/MyPage/MyPageController';
import TemplateController from './components/UIElements/TemplateController';
import TopAppBar from './components/UIElements/TopAppBar/TopAppBar';
import ContentsWritePage from './components/Contents/ContentsWritePage';
import ContentsListController from './components/Contents/ContentsListController';
import CategoryListController from './components/Contents/CategoryListController';
import DetailContentsController from './components/Contents/DetailContentsController';
import CustomSnackbar from './components/UIElements/CustomSnackbar';
import LoadingProgress from './components/UIElements/LoadingProgress';
import Footer from './components/UIElements/Footer';

class App extends Component {

  componentDidMount() {
    this.props.actions.checkAuth();
    this.props.actions.getCurrentPosition();
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.props.actions.checkAuth();
    };
  };
  
  render() {
    const loginStatus = this.props.state.userInfo.status;
    return (
      <>
        {this.props.state.loadingStatus ? (
          <div className="App">
            <TopAppBar loginStatus={loginStatus} />
            <CssBaseline />
            <CustomSnackbar />
            <Route exact path="/" component={TemplateController} />
            <PrivateRoute path="/write" loginStatus={loginStatus} component={ContentsWritePage} />
            <Route path="/contents" component={ContentsListController} />
            <Route path="/category/:id" component={CategoryListController} />
            <Route path="/category//" component={Error} />
            <Route path="/detail/:id" component={DetailContentsController} />
            <Route path="/detail//" component={Error} />
            <Route path="/signup" component={SignUpPage} />
            <Route path="/signin" component={SignInPage} />
            <PrivateRoute path="/mypage" loginStatus={loginStatus} component={MyPageController} />
            <PrivateRoute path="/mymessagepage" loginStatus={loginStatus} component={MyMessagePage} />
            <Footer />
          </div>
        ) : (
          <LoadingProgress />
        )}
      </>
    );
  }
}
export default ContextHoc(withRouter(App));
