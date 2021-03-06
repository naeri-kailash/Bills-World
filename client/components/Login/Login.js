import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { checkLogin, createLoginRequest, registerLogoutSuccess } from '../../actions/auth.js'
import { clearUserVote } from '../../actions/userVote'

import './login.css'

class Login extends Component {
  constructor (props) {
    super(props)
    this.props.checkLogin(this.props.history)
  }

  handleClick (e) {
    e.preventDefault()
    this.props.clearUserVote()
    this.props.onLogoutClick(this.props.history)
  }

  render () {
    return (
      <div className='login'>
        {
          !this.props.isAuthenticated
          ? (
            <button className='btn btn-default login-buttons' onClick={() => this.props.onLoginClick()}>Log In or Sign Up</button>
          )
          : (
            <div className='login-components'>
              <span id='login-welcome'>Logged in as <strong>{this.props.profile.nickname}</strong></span>
              <div className='dropdown'>
                <img className='img-responsive profile-pic dropdown-toggle' id='dropdownMenu1' data-toggle='dropdown' src={this.props.profile.picture} />
                <ul className='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1'>
                  <li role='presentation'>
                    <Link role='menuitem' tabIndex='-1' to='#' onClick={(e) => this.handleClick(e)}>Logout</Link>
                  </li>
                </ul>
              </div>
            </div>
          )
        }
        {
          this.props.error && <p>{JSON.stringify(this.props.error)}</p>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    profile: state.auth.profile,
    error: state.auth.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkLogin: (history) => {
      return dispatch(checkLogin(history))
    },
    onLoginClick: () => {
      return dispatch(createLoginRequest())
    },
    onLogoutClick: (history) => {
      return dispatch(registerLogoutSuccess(history))
    },
    clearUserVote: () => {
      return dispatch(clearUserVote())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login))
