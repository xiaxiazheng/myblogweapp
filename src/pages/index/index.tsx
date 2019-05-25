import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtDrawer, AtButton, AtAccordion, AtList, AtListItem } from 'taro-ui'

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
    show: false,  // 显示抽屉
    activeNode: {  // 被点击的三级节点信息
      id: ''
    },
    treelist: [],  // 树的列表
  }

  componentWillMount () { }

  componentDidMount () {
    this.init();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  init() {
    Taro.request({
      url: 'http://www.xiaxiazheng.cn:3000/back/tree?type=home',
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res) {
        let data = res.data.data;
        data.forEach((item) => {
          item.show = false;
          item.children.map((jtem) => {
            jtem.show = false;
          });
        });
        this.setState({
          treelist: data,
        });
      }
    })
  }

  // 显示抽屉
  showShadow () {
    this.setState({
      show: true
    });
  }

  // 显示第一层节点
  showFirstNode(index): any {
    let list: any = this.state.treelist;
    let isShow = list[index].show;
    list.map((item) => {
      item.show = false;
    });
    list[index].show = !isShow;
    this.setState({
      treelist: list
    });
  }

  // 显示第二层节点
  showSecondNode(index, jndex): any {
    let list: any = this.state.treelist;
    let isShow = list[index].children[jndex].show;
    list.map((item) => {
      item.children.map((jtem) => {
        jtem.show = false
      });
    });
    list[index].children[jndex].show = !isShow;
    this.setState({
      treelist: list
    });
  }

  clickNode(ktem) {
    console.log('点击子节点', ktem);
    this.setState({
      show: false,
      activeNode: ktem
    });
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <AtButton className="showBtn" type='primary' onClick={this.showShadow}>点开抽屉</AtButton>
        {/* 抽屉遮罩层，展示树 */}
        <AtDrawer
          className="maskLayer"
          show={this.state.show}
          mask
        >
          { /* 第一层 */
            this.state.treelist.map((item: any, index: number) => {
              return (
                <AtAccordion
                  className="firstNode"
                  open={item.show}
                  onClick={this.showFirstNode.bind(this, index)}
                  title={item.label}
                >
                  { /* 第二层 */
                    item.children.map((jtem: any, jndex: any) => {
                      return (
                        <AtAccordion
                          className="secondNode"
                          open={jtem.show}
                          onClick={this.showSecondNode.bind(this, index, jndex)}
                          title={jtem.label}
                        >
                          { /* 第三层 */
                            jtem.children.map((ktem: any) => {
                              return (
                                <Text className={ this.state.activeNode.id === ktem.id ? "thirtNode active" : "thirtNode"} onClick={this.clickNode.bind(this, ktem)}>{ktem.label}</Text>
                              )
                            })
                          }
                        </AtAccordion>
                      )
                    })
                  }
                </AtAccordion>
              )
            })
          }
        </AtDrawer>
      </View>
    )
  }
}
