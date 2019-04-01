import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import SignUpPage from './components/Signup/SignUpPage';
import SignInPage from './components/SignIn/SignInPage';
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
import CssBaseline from '@material-ui/core/CssBaseline';
import AppContextProvider from './contexts/appContext';


class App extends Component {
  render() {
    return (
      <>
        <AppContextProvider>
          <BrowserRouter>
            <div className="App">
              <TopAppBar />
              <CssBaseline />
              <CustomSnackbar/>
              <Route exact path="/" component={Template} />
              <Route path="/write" component={ContentsController} />
              <Route path="/contents" component={ContentsListView} />
              <Route path="/near" component={NearContentsListView} />
              <Route path="/signup" component = {SignUpPage}/>
              <Route path="/signin" component = {SignInPage}/>
              <Route path="/mypage" component = {MyPage}/>
              <Route path="/mymessagepage" component = {MyMessagePage}/>
              <Route path="/category/:id" component={CateGory} />
              <Route path="/category//" component={Error}/>
              <Route path="/detail/:id" component={DetailContentsController} />
              <Route path="/detail//" component={Error}/>
              <Route path="/AllContent/" component = {AllContent}/>
              <Footer />
            </div>
          </BrowserRouter>
        </AppContextProvider>
      </>
    );
  }
}

export default App;
