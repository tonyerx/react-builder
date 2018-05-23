module.exports = {
  // root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 7,
    sourceType: "module",
    ecmaFeatures : {
      "jsx": true
    }
  },
  env: {
    browser: true,
    commonjs: true
  },
  // 使用到的插件
  plugins: [
    "react",
    'standard',
    'import'
  ],
  // 设置全局变量，不再因'no-undef'报错
  globals: {
    "builder": false, // false表示只读
    "System": false
  },
  // 继承的规则
  extends: [
    'standard',
    'plugin:react/recommended'
  ],
  // 自定义的规则，0关闭，1警告，2报错
  rules: {
    "no-console": 2,
    "no-var": 1, //不可使用var关键字定义变量
    "semi": [1, 'never'],
    "react/no-did-mount-set-state": 1, //不可在componentDidMount中直接使用setState
    "react/no-did-update-set-state": 1, //不可在componentDidUpdate中直接使用setState
  }
}