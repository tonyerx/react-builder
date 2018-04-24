import React from 'react'

import style from './style.m'

console.log(builder.ENV)
class Block extends React.Component {
  render() {
    return (
      <div className={style.w}>
        <label>当前环境：</label>{builder.ENV}<br />
        <label>样式模式：</label>[local]
      </div>
    )
  }
}

export default Block