import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtDrawer, AtAccordion } from 'taro-ui'
import './Tree.less'

interface IProps {
  showTree: boolean;
  onClickNode: Function;
  onBackMain: Function;
}

export default class Tree extends Component<IProps, {}> {

  state = {
    treelist: [],  // 树的列表
    activeId: '',  // 被点击节点的 id
  }

  componentWillMount () { }

  componentDidMount () {
    this.init();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  init() {
    // 获取树的列表的数据
    Taro.request({
      url: 'https://www.xiaxiazheng.cn:443/back/tree?type=home',
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
    });
  }

  // 点击回到首页
  backMain() {
    this.props.onBackMain();
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

  // 点击了节点
  clickNode(ktem) {
    if (this.state.activeId !== ktem.id) {
      this.setState({
        activeId: ktem.id
      });
    }
    this.props.onClickNode(ktem);
  }

  render () {
    return (
      <View className='tree'>
        {/* 抽屉遮罩层，展示树 */}
        <AtDrawer
          className="mask-layer"
          show={this.props.showTree}
          width="270px"
          mask
          right
        >
          <View className="backMain" onClick={this.backMain.bind(this)}>回到首页</View>
          { /* 第一层 */
            this.state.treelist.map((item: any, index: number) => {
              return (
                <AtAccordion
                  className="firstnode"
                  key={String(index)}
                  open={item.show}
                  onClick={this.showFirstNode.bind(this, index)}
                  title={item.label}
                >
                  { /* 第二层 */
                    item.children.map((jtem: any, jndex: any) => {
                      return (
                        <AtAccordion
                          className="second-node"
                          key={String(jndex)}
                          open={jtem.show}
                          onClick={this.showSecondNode.bind(this, index, jndex)}
                          title={jtem.label}
                        >
                          { /* 第三层 */
                            jtem.children.map((ktem: any, kndex) => {
                              return (
                                <View
                                  key={String(kndex)}
                                  className={ this.state.activeId === ktem.id ? "thirt-node active" : "thirt-node"}
                                  onClick={this.clickNode.bind(this, ktem)}
                                >{ktem.label}</View>
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
