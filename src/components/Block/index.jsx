import React from 'react'

import style from './style.m'

class Block extends React.Component {
  render () {
    return (
      <div className={style.w}>
        <label>当前环境：</label>{builder.ENV}<br />
        <label>样式模式：</label>[local]
        <p className={style.blue}>blue</p>
      </div>
    )
  }
}

export default Block
