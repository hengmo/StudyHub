import React, { Component } from 'react';
import SignInForm from './SignInForm';

class SignInPage extends Component {
    
    constructor(props){
      super(props);
      this.state ={
        loading: true
      };
    }
    componentDidMount() {
      this.setState({...this.state,loading: false});
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