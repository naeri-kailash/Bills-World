import request from 'superagent'
import { getVotes } from './votes'
import AuthService from '../utils/AuthService'

export function checkUserVote (userId, billNumber) {
  return dispatch => {
    return request
      .get(`/votes/${billNumber}/${userId}`)
      .set('Authorization', `Bearer ${AuthService.getToken()}`)
      .end((err, res) => {
        if (err) {
          return console.error(err.message, 'Toggle Vote failed')
        }
        dispatch(showUserVote(res.body))
      })
  }
}

export function showUserVote (userVote) {
  return {
    type: 'SHOW_USER_VOTE',
    userVote
  }
}

export function clearUserVote () {
  return {
    type: 'CLEAR_USER_VOTE'
  }
}

export function toggleVote (voteType, userId, billNumber) {
  return dispatch => {
    return request
      .post('/votes')
      .set('Authorization', `Bearer ${AuthService.getToken()}`)
      .send({
        voteType: voteType,
        userId: userId,
        billNumber: billNumber
      })
      .end((err, res) => {
        if (err) {
          return console.error(err.message, 'Update Vote failed')
        }
        dispatch(showUserVote(res.body))
        dispatch(getVotes(billNumber))
      })
  }
}
