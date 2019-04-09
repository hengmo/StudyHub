import React, { Component } from 'react';
import SignInForm from './SignInForm';
import { AppContext } from '../../contexts/appContext';

class SignInPage extends Component {
    static contextType = AppContext;
    
    constructor(props){
      super(props);
      this.state ={
        loading: true
      };
    }
    componentDidMount() {
      this.context.actions.checkAuth()
      .then(this.setState({...this.state,loading: false}));
    }

    render () {
      const {loading} = this.state;

        return (
            <div>
              {loading ? null :( 
                <div>
                  <SignInForm history = {this.props.history}/>
                </div>)
              }
            </div>
        );
    }
}

export default SignInPage;