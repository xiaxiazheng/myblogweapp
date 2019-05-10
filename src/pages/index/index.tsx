import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtDrawer, AtButton } from 'taro-ui'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页',
  }
  state = {
    show: false
  }

  componentWillMount () { }

  componentDidMount () {
    this.init();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  init() {
    // let res = await TreeHelper.getTree();
    // console.log(res);
    Taro.request({
      url: 'http://www.xiaxiazheng.cn:3000/back/tree?type=home',
      header: {
        'content-type': 'application/json'
      }
    }).then(res => console.log(res.data))
  }

  showShadow () {
    this.setState({
      show: true
    });
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <AtButton className="showBtn" type='primary' onClick={this.showShadow}>点开抽屉</AtButton>
        <AtDrawer
          show={this.state.show}
          mask
        >
          <View className='drawer-item'>优先展示items里的数据</View>
          <View className='drawer-item'>如果items没有数据就会展示children</View>
          <View className='drawer-item'>这是自定义内容</View>
          <View className='drawer-item'>这是自定义内容</View>
        </AtDrawer>
      </View>
    )
  }
}
