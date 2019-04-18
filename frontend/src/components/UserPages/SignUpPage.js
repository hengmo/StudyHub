import React, {Component} from 'react';
import SignUpForm from './SignUpForm';

class SignUpPage extends Component {
  
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
              <SignUpForm history ={this.props.history}/>
            </div>)
          }
        </div>
      );
  }
}

export default SignUpPage;