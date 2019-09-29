import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import Tree from './tree/Tree'
import Log from './log/Log'

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
    currentTab: 'log'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

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

  choiceTab = (type: 'tree' | 'log') => {
    this.setState({
      currentTab: type
    });
  }

  render () {
    const { currentTab } = this.state;
    return (
      <View className='index'>
        <View className="main">
          {/* 树 */}
          {currentTab === 'tree' &&
            <Tree />
          }
          {/* 日志 */}
          {currentTab === 'log' &&
            <Log />
          }
        </View>
        {/* 底部的 tab */}
        <View className="footer">
          <Text className="footer-tab" onClick={this.choiceTab.bind(null, 'tree')}>知识树</Text>
          <Text className="footer-tab" onClick={this.choiceTab.bind(null, 'log')}>日志</Text>
        </View>
      </View>
    )
  }
}
