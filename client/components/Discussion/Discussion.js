import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ReportAbuse from '../ReportAbuse/ReportAbuse'
import EditDeleteComment from '../EditDeleteComment/EditDeleteComment'
import './discussion.css'
import Reply from '../Reply/Reply'

import { updateCommentForm, saveComment, clearInputBox } from '../../actions/comments.js'
import { createReply, clearReplyBox } from '../../actions/replies.js'
import moment from 'moment'

class Discussion extends Component {
  render () {
    return (
      <div>
        <h3 className='comments-title'>Comments</h3>
        {
          this.props.isAuthenticated &&
          <span>
            <div className='form-group row'>
              <textarea
                type='text'
                className='input-box form-control'
                name='comment'
                placeholder='Share your views here'
                value={this.props.activeComment}
                onChange={(e) => this.props.updateCommentForm(e.target.name, e.target.value)} />
              {
                this.props.activeComment
                ? <button className='submit-button btn' onClick={(event) => this.handleSubmit(event)}>Submit</button>
                : <button disabled className='submit-button btn' onClick={(event) => this.handleSubmit(event)}>Submit</button>
              }
            </div>
          </span>
        }
        {
          !this.props.isAuthenticated &&
          <span>
            <p className='login-prompt'>Please login or register to comment on this thread</p>
          </span>
        }
        <div>
          {
            this.props.comments.map((comment) => {
              return (
                <div key={comment.id} className='comment-container'>
                  <div>
                    <p className='comment-text'>{comment.comment}</p>
                  </div>
                  <div className='row'>
                    <div className='metadata col-md-offset-2'>
                      <p className='username'>{comment.username}</p>
                      <p>{comment.date}</p>
                      {
                        this.props.isAuthenticated &&
                        (this.props.user_id === comment.user_id) &&
                        <EditDeleteComment
                          comment_id={comment.id}
                          bill_number={this.props.billNumber}
                          getBillInfo={this.props.getBillInfo} />
                      }
                      {
                        this.props.isAuthenticated &&
                        <button name={comment.id} className='reply-button btn' onClick={(e) => this.handleReplyClick(e.target.name)}><i className='fa fa-reply fa-lg' aria-hidden='true'></i></button>
                      }
                    </div>
                  </div>
                  <Reply
                    parentId={comment.id}
                    isAuthenticated={this.props.isAuthenticated}
                    billNumber={this.props.billNumber}
                    getBillInfo={this.props.getBillInfo}
                    />
                  {
                    this.props.replies.map((reply) => {
                      if (comment.id === reply.parent_id) {
                        return (
                          <div key={reply.id}>
                            <div>
                              <p className='comment-text'>{reply.reply}</p>
                            </div>
                            <div className='row'>
                              <div className='metadata col-md-offset-2'>
                                <p className='username'>{reply.username}</p>
                                <p>{reply.date}</p>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    })
                  }
              </div>
            )
          })
        }
        </div>
        <ReportAbuse />
      </div>
    )
  }
  handleSubmit () {
    const date = moment(new Date()).format('DD-MM-YYYY h:mm a')
    const username = this.props.username
    const user_id = this.props.user_id
    const billNumber = this.props.billNumber
    const activeComment = this.props.activeComment
    const commentDetails = { date: date, username: username, user_id: user_id, billNumber: billNumber, comment: activeComment }
    this.props.saveComment(commentDetails)
    .then(this.props.getBillInfo.bind(null, billNumber))
    .then(this.props.clearInputBox)
    .catch((err) => {
      if (err) {
        console.error(err.message)
      }
    })
  }
  handleReplyClick (parentId) {
    this.props.createReply(parentId)
  }
}

Discussion.propTypes = {
  billNumber: PropTypes.string.isRequired
}

const mapStateToProps = (state) => {
  return {
    user_id: state.auth.profile.user_id,
    username: state.auth.profile.username,
    activeComment: state.activeComment.comment,
    replying: state.activeReply.replying,
    activeParentId: state.activeReply.parentId,
    isAuthenticated: state.auth.isAuthenticated
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
    },
    createReply: (parentId) => {
      return dispatch(createReply(parentId))
    },
    clearReplyBox: () => {
      return dispatch(clearReplyBox())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Discussion)
