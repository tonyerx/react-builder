import Mock from 'mockjs'

const Random = Mock.Random

const userInfo = {
  data: {
    userId: '3412481209481',
    userName: '随便写的',
    avatar: 'http://cdn.xxx.com/xxx.jpg'
  },
  rCode: 0,
  msg: ''
}

const host = '/xxx'
Mock.mock(host + '/userInfo', 'get', userInfo)