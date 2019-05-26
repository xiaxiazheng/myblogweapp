import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'
import { AtButton } from 'taro-ui'
import Tree from '../tree/Tree'
import Content from '../content/Content'

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
    showMain: true,  // 显示首页
    showTree: false,  // 显示抽屉
    showContent: false,  // 显示具体内容
    activeNode: {  // 被点击的三级节点信息
      id: ''
    },
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
      showContent: false,
    });
  }

  // 点击回到首页
  backMain() {
    this.setState({
      showTree: false,
      showMain: true
    });
  }

  // 点击了树的子节点
  clickNode(ktem) {
    // 先把树关上
    this.setState({
      showTree: false,
      showMain: false,
    });
    // 然后判断如果有变化就更新状态
    if (ktem.id !== this.state.activeNode.id) {
      this.setState({
        activeNode: ktem,
        showContent: true,
      });
    }
  }

  render () {
    const { showMain, showTree, showContent, activeNode } = this.state;
    return (
      <View className='index'>
        {/* 显示树的按钮，一直都在 */}
        <AtButton className="show-btn" type='primary' onClick={this.showShadow.bind(this)}>点开抽屉</AtButton>
        {/* 首页 */
          showMain &&
          <View>
            <View>Hello world!</View>
            <View>1. 未解决问题：使用这个 taro-ui 的破树，样式打不进去，估计要自己写一棵树了</View>
            <View>2. 如果在 Content 组件挂载在页面的情况下，传值给子组件然后重新请求再渲染无法实现，目前的做法是点开树的时候就让该 Content 组件消失</View>
            <View>3. 不单是无法动态渲染的问题，就连如何在函数中返回 TSX 然后跟 render() 那些拼在一起渲染都不知道怎么搞</View>
            <View>4. 更别说还有获取数据的请求如何跟函数配合的问题了</View>
          </View>
        }
        {/* 抽屉遮罩层，展示树 */}
        <Tree showTree={showTree} onClickNode={this.clickNode.bind(this)} onBackMain={this.backMain.bind(this)} />
        {/* 展示具体内容 */
          !showMain && showContent &&
          <Content activeNode={activeNode} />
        }
      </View>
    )
  }
}
