import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ReportAbuse from '../ReportAbuse/ReportAbuse'
import EditDeleteComment from '../EditDeleteComment/EditDeleteComment'
import './discussion.css'

import { updateCommentForm, saveComment, clearInputBox } from '../../actions/comments.js'

class Discussion extends Component {
  render () {
    return (
      <div>
        <h3 className='comments-title'>Comments</h3>
        {
          this.props.auth.isAuthenticated &&
          <span>
            <div className='form-group row'>
              <textarea
                type='text'
                className='input-box form-control'
                name='comment'
                placeholder='Share your views here'
                value={this.props.activeComment}
                onChange={(e) => this.props.updateCommentForm(e.target.name, e.target.value)}>
              </textarea>
              {
                this.props.activeComment
                ? <button className='submit-button btn' onClick={(event) => this.handleSubmit(event)}>Submit</button>
                : <button disabled className='submit-button btn' onClick={(event) => this.handleSubmit(event)}>Submit</button>
              }
            </div>
          </span>
        }
        {
          !this.props.auth.isAuthenticated &&
          <span>
            <p className='login-prompt'>Please login or register to comment on this thread</p>
          </span>
        }
        <div>
          {
          this.props.comments.map((comment, i) => {
            return (
              <div key={i} className='comment'>
                <div>
                  <p className='comment-text'>{comment.comment}</p>
                </div>
                <div className='row'>
                  <div className='metadata col-md-offset-2'>
                    <p className='username'>{comment.username}</p>
                    <p>{comment.date}</p>
                    {
                      this.props.auth.isAuthenticated
                      && (this.props.user_id === comment.user_id)
                      && <EditDeleteComment
                        comment_id={comment.id}
                        bill_number={this.props.billNumber}
                        getBillInfo={this.props.getBillInfo}/>
                    }
                  </div>
                </div>
                <hr />
              </div>
            )
          })
        }
        </div>
        <ReportAbuse />
      </div>
    )
  }
  handleSubmit (event) {
    const today = new Date()
    const dd = today.getDate()
    const mm = today.getMonth() + 1
    const yyyy = today.getFullYear()
    const date = dd + '/' + mm + '/' + yyyy
    const username = this.props.username
    const userId = this.props.userId
    const billNumber = this.props.billNumber
    const activeComment = this.props.activeComment
    const commentDetails = { date: date, username: username, user_id: userId, billNumber: billNumber, comment: activeComment }
    this.props.saveComment(commentDetails)
    .then(this.props.getBillInfo.bind(null, billNumber))
    .then(this.props.clearInputBox)
    .catch((err) => {
      if (err) {
        console.error(err.message)
      }
    })
  }
}

Discussion.propTypes = {
  billNumber: PropTypes.string.isRequired
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.profile.user_id,
    username: state.auth.profile.username,
    activeComment: state.activeComment.comment,
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCommentForm: (name, value) => {
      return dispatch(updateCommentForm(name, value))
    },
    saveComment: (commentDetails) => {
      return dispatch(saveComment(commentDetails))
    },
    clearInputBox: () => {
      return dispatch(clearInputBox())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Discussion)
