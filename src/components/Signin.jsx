import React, { Component } from 'react';
import { isUserSignedIn } from 'blockstack';

export default class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div>
        <img src = "src/images/icon-192x192.png" width = '10%'/>
        <h1 className="landing-heading">Welcome to BlockBoard</h1>
        <h2 className="landing-heading">We've Got the Best Boards on the Block</h2>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            onClick={ handleSignIn.bind(this) }
          >
            Sign In with Blockstack
          </button>
        </p>
      </div>
    );
  }
}
