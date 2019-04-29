import React, { Component } from "react";
import { VERIFY_USER } from "../Events";
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: "",
      error: ""
    };
  }
  setUser = ({ user, isUser }) => {
      console.log(user, isUser)
    if (isUser) {
      this.setError("Username taken");
    } else {
        this.setError("")
      this.props.setUser(user);
      
    }
  };
  handleSubmit = e => {
    e.preventDefault();

    const { socket } = this.props;
    const { nickname } = this.state;
    socket.emit(VERIFY_USER, nickname, this.setUser);
  };
  handleChange = e => {
    this.setState({ nickname: e.target.value });
  };
  setError=(error)=>{
    this.setState({error})
}
  render() {
    const { nickname, error } = this.state;
    return (
      <div className="login hero is-grey if-fullwidth">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="column is-4 is-offset-4">
              <h3 className="title has-text-primary">LOGIN</h3>
              <p className="subtitle has-text-grey">Please login to proceed</p>
              <div className="box">
                <form onSubmit={this.handleSubmit} className="login-form">
                  <label htmlFor="nickname">
                    <h2>Got a nickname?</h2>
                  </label>
                  <div className="field">
                    <input
                      ref={input => {
                        this.textInput = input;
                      }}
                      type="text"
                      id="nickname"
                      value={nickname}
                      onChange={this.handleChange}
                      placeholder={"My Cool Username"}
                    />
                  </div>
                  <div className="error">{error ? error : null}</div>
                  <button
                    onSubmit={this.handleSubmit}
                    className="button is-large is-primary"
                  >
                    LOGIN
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;
