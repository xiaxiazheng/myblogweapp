import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'; 
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
    currentTab: 0
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

  choiceTab = (value) => {
    this.setState({
      currentTab: value
    });
  }

  render () {
    const { currentTab } = this.state;
    return (
      <View className='index'>
        <View className="main">
          {/* 树 */}
          {currentTab === 0 &&
            <Tree />
          }
          {/* 日志 */}
          {currentTab === 1 &&
            <Log />
          }
        </View>
        <AtTabBar
          className="tab-bar"
          fixed
          tabList={[
            { title: '知识树' },
            { title: '日志' },
          ]}
          onClick={this.choiceTab}
          current={currentTab}
        />
      </View>
    )
  }
}
