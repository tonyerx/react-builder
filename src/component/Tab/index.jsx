import React from 'react'
import { Tabs } from 'antd-mobile'

import style from './style.m'

const tabs2 = [
  { title: 'First Tab', sub: '1' },
  { title: 'Second Tab', sub: '2' },
  { title: 'Third Tab', sub: '3' },
];

class Tab extends React.Component {
  render() {
    return (
      <Tabs tabs={tabs2}
      initialPage={1}
      tabBarPosition="bottom"
      renderTab={tab => <span>{tab.title}</span>}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
          Content of first tab
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
          Content of second tab
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
          Content of third tab
        </div>
      </Tabs>
    )
  }
}

export default Tab
