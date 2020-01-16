import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './Tree.less'
import TreeCont from './treecont/TreeCont'

export default class Tree extends Component {
  static options = {
    addGlobalClass: true
  }

  state = {
    showMain: false,
    activeNode: '',
    treelist: [],  // 树的列表
    activeId: '',  // 被点击节点的 id，用来高亮的
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
      url: 'https://www.xiaxiazheng.cn:444/back/tree?type=home',
      header: {
        'content-type': 'application/json',
        'accept': 'application/json'
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

  // 显示第一层节点
  showFirstNode(index, e): void {
    e.stopPropagation();  // 阻止点击事件冒泡
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
  showSecondNode(index, jndex, e): void {
    e.stopPropagation();
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

  // 点击了第三层节点
  clickNode(ktem, e): void {
    e.stopPropagation();
    if (this.state.activeId !== ktem.id) {
      this.setState({
        activeId: ktem.id,
        activeNode: ktem,
        showMain: true
      });
    }
  }

  backTree() {
    this.setState({
      showMain: false
    });
  }

  render () {
    const { showMain, activeNode } = this.state;
    return (
      <View className='tree'>
        { /* 第一层 */
          !showMain &&
          this.state.treelist.map((item: any, index: number) => {
            return (
              <View
                className="first-node"
                key={String(index)}
                onClick={this.showFirstNode.bind(this, index)}
              >
                <View className="first-label">
                  { !item.show && <AtIcon value="chevron-right" size='20' color='#c4c4cc'></AtIcon> }
                  { item.show && <AtIcon value="chevron-down" size='20' color='#409eff'></AtIcon> }
                  <Text className={ item.show ? 'first-label-text active' : 'first-label-text' }>
                    {item.label}
                  </Text>
                </View>
                { /* 第二层 */
                  item.show &&
                  item.children.map((jtem: any, jndex: any) => {
                    return (
                      <View
                        className="second-node"
                        key={String(jndex)}
                        onClick={this.showSecondNode.bind(this, index, jndex)}
                      >
                        <View className="second-label">
                          { !jtem.show && <AtIcon value="chevron-right" size='17' color='#c4c4cc'></AtIcon> }
                          { jtem.show && <AtIcon value="chevron-down" size='17' color='#409eff'></AtIcon> }
                          <Text className={ jtem.show ? 'second-label-text active' : 'second-label-text' }>
                            {jtem.label}
                          </Text>
                        </View>
                        { /* 第三层 */
                        jtem.show &&
                          jtem.children.map((ktem: any, kndex) => {
                            return (
                              <View
                                key={String(kndex)}
                                className="thirt-node"
                                onClick={this.clickNode.bind(this, ktem)}
                              >
                                <Text className={ this.state.activeId === ktem.id ? "thirt-label-text active" : "thirt-label-text"}>
                                  {ktem.label}
                                </Text>
                              </View>
                            )
                          })
                        }
                      </View>
                    )
                  })
                }
              </View>
            )
          })
        }
        {/* 展示具体内容 */
          showMain &&
          <TreeCont activeNode={activeNode} onBackTree={this.backTree.bind(this)}/>
        }
      </View>
    )
  }
}
