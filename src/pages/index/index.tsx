import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'
import Tree from './tree/Tree'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '虾虾郑',
  }
  state = {
    currentTab: 0,
    showMain: true,  // 显示首页
    showTree: false,  // 显示抽屉
    activeNode: {  // 被点击的三级节点信息
      id: ''
    },
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  // 点击底部其中一个 tab
  handleClick (value) {
    this.setState({
      currentTab: value
    });
  }

  // 显示抽屉
  showShadow () {
    this.setState({
      showTree: true,
    });
  }

  // 点击回到首页
  backMain() {
    this.setState({
      showTree: false,
      showMain: true
    });
  }

  render () {
    return (
      <View className='index'>
        {/* 树 */}
        <Tree />
      </View>
    )
  }
}
