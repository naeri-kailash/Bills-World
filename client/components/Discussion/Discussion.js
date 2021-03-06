import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ReportAbuse from '../ReportAbuse/ReportAbuse'
import './discussion.css'
import CommentWithReplies from '../CommentWithReplies/CommentWithReplies'

import { updateCommentForm, saveComment, clearInputBox } from '../../actions/comments.js'
import { saveReply } from '../../actions/replies.js'
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
                onChange={(e) => this.props.updateCommentForm(e.target.value)} />
              {
                this.props.activeComment
                ? <button className='submit-button btn' onClick={(event) => this.handleNewCommentSubmit(this.props.activeComment)}>Submit</button>
                : <button disabled className='submit-button btn'>Submit</button>
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
              const replies = this.props.replies.filter(reply => reply.parent_id === comment.id)
              return (
                <CommentWithReplies
                  key={comment.id}
                  comment={comment}
                  replies={replies}
                  user_id={this.props.user_id}
                  billNumber={this.props.billNumber}
                  isAuthenticated={this.props.isAuthenticated}
                  getBillInfo={this.props.getBillInfo}
                  handleReplySubmit={(id, val) => this.handleSubmit(val, id)}
                />
              )
            })
          }
        </div>
        <ReportAbuse />
      </div>
    )
  }

  handleNewCommentSubmit(activeComment) {
    const date = moment(new Date()).format('DD-MM-YYYY h:mm a')
    const username = this.props.username
    const user_id = this.props.user_id
    const billNumber = this.props.billNumber
    let commentDetails = {
      date: date,
      username: username,
      user_id: user_id,
      billNumber: billNumber,
      comment: activeComment
    }
    this.props.saveComment(commentDetails)
      .then(() => this.props.getBillInfo(billNumber))
      .then(() => this.props.clearInputBox())
  }

  handleSubmit (value, parentId) {
    const date = moment(new Date()).format('DD-MM-YYYY h:mm a')
    const username = this.props.username
    const user_id = this.props.user_id
    const billNumber = this.props.billNumber
    const activeComment = this.props.activeComment
    let commentDetails = {
      date: date,
      username: username,
      user_id: user_id,
      billNumber: billNumber
    }

    if (parentId) {
      commentDetails.parentId = parentId,
      commentDetails.reply = value
    } else {
      commentDetails.comment = value
    }

    return parentId
      ? this.props.saveReply(commentDetails)
      : this.props.saveComment(commentDetails)
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
    updateCommentForm: (value) => {
      return dispatch(updateCommentForm(value))
    },
    saveComment: (commentDetails) => {
      return dispatch(saveComment(commentDetails))
    },
    clearInputBox: () => {
      return dispatch(clearInputBox())
    },
    saveReply: (replyDetails) => {
      return dispatch(saveReply(replyDetails))
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
