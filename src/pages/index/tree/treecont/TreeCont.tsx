import Taro, { Component } from '@tarojs/taro'
import { AtCurtain, AtButton, AtIcon } from 'taro-ui'
import { View, Text, RichText, Image } from '@tarojs/components'
import './TreeCont.less'

interface IProps {
  activeNode: any;
  onBackTree: Function;
}

const imgBackUrl = 'https://www.xiaxiazheng.cn:443/treecont/';

export default class TreeCont extends Component<IProps, {}> {
  static options = {
    addGlobalClass: true
  }

  state = {
    activeId: '',
    activeNodeList: [],
    isOpen: false,
    imgSrc: '',
  }

  componentWillMount () { }

  componentDidMount () {
    this.getList(this.props.activeNode.id);
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeNode.id !== this.props.activeNode.id) {
      this.getList(nextProps.activeNode.id);
    }
  }

  // 获取详细内容列表
  getList = (id: string) => {
    // 获取树具体节点的数据
    Taro.request({
      url: `https://www.xiaxiazheng.cn:443/back/cont?id=${id}`,
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res) {
        console.log(res)
        let list = res.data.data;
        list.forEach((item) => {
          item.cont = item.cont.replace(/</g, "&lt;"); // html 标签的 < 转成实体字符,让所有的 html 标签失效
          item.cont = item.cont.replace(/pre>\n/g, "pre>"); // 把 pre 开始标签后面的空格去掉
          item.cont = item.cont.replace(
            /&lt;pre/g,
            `<div style='background-color: #282c34;border-radius: 5px;color: #abb2bf;padding: 0.2rem 0.4rem;'`
          ); // 把 pre 开始标签的字符实体转回来顺便加样式
          item.cont = item.cont.replace(/&lt;\/pre>/g, "</div>"); // 把 pre 结束标签转回来
          item.cont = item.cont.replace(/  /g, "&nbsp;&nbsp;"); // 把空格转成实体字符，以防多空格被合并
          item.cont = item.cont.replace(/\n|\r\n/g, "<br/>"); // 把换行转成 br 标签
        });
        this.setState({
          activeNodeList: list
        });
      }
    });
  }

  // 点击图片看大图
  clickImg(src) {
    this.setState({
      isOpen: true,
      imgSrc: src,
    });
  }

  // 关闭弹出的图片
  closeImg() {
    this.setState({
      isOpen: false
    });
  }

  // 回到树的页面
  backTree() {
    this.props.onBackTree();
  }

  render () {
    const { activeNodeList, isOpen, imgSrc } = this.state;
    return (
      <View className='tree-cont'>
        { // 返回按钮
          <AtButton className="show-btn" type='primary' onClick={this.backTree.bind(this)}>
            <AtIcon value='arrow-left' size='30' color='white'></AtIcon>
          </AtButton>
        }
        { // 顶部导航
          <Text className="cont-nav">{this.props.activeNode.label}</Text>
        }
        { // 内容详情
          activeNodeList.map((item: any, index: number) => {
            return (
              <View className="cont-item" key={index}>
                <View className="cont-title">{item.title}</View>
                <RichText className="cont-cont" nodes={item.cont} />
                {
                  item.imgList.map((jtem: any, jndex: number) => {
                    return (
                      <Image
                        key={jndex}
                        style="width:100%;height:100%"
                        lazyLoad
                        mode="widthFix"
                        onClick={this.clickImg.bind(this, jtem.imgfilename)}
                        src={`${imgBackUrl}${jtem.imgfilename}`}>
                      </Image>
                    )
                  })
                }
              </View>
            )
          })
        }
        { // 图片弹出框
          imgSrc !== '' && 
          <AtCurtain
            isOpened={isOpen}
            onClose={this.closeImg.bind(this)}
          >
            <Image
              style="width:calc(100% + 63px);height:100%;margin-left:-32px;"
              mode="widthFix"
              src={`${imgBackUrl}${imgSrc}`}
            />
          </AtCurtain>
        }
      </View>
    )
  }
}
