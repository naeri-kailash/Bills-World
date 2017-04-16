import React from 'react'
import moment from 'moment'

import './billInfo.css'

const BillInfo = (props) => {
  return (
    <div>
      <h3>Title: {props.title}</h3>
      <p>Introduction date: {moment(props.introductionDate).format('D MMM YYYY')}</p>
      <p>Member in charge: {props.memberInCharge}</p>
      <p>Type: {props.type}</p>
      <p>Bill number: {props.billNumber}</p>
      <p>Summary: {props.summary}</p>
      <a href='https://www.parliament.nz/en/pb/bills-and-laws/proposed-members-bills/'>View on Parliament Website</a>
    </div>
  )
}

export default BillInfo
