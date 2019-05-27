import Taro, { Component } from '@tarojs/taro'
import { AtCurtain } from 'taro-ui'
import { View, RichText, Image } from '@tarojs/components'
import './Content.less'

interface IProps {
  activeNode: any
}

export default class Content extends Component<IProps, {}> {

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

  getList(id) {
    // 获取树具体节点的数据
    Taro.request({
      url: `https://www.xiaxiazheng.cn:443/back/cont?id=${id}`,
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res) {
        let list = res.data.data.list;
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
          item.filename && (item.filename = `https://www.xiaxiazheng.cn:443/treecont/${item.filename}`)
        });
        this.setState({
          activeNodeList: list
        });
      }
    });
  }

  clickImg(src) {
    this.setState({
      isOpen: true,
      imgSrc: src,
    });
  }

  closeImg() {
    this.setState({
      isOpen: false
    });
  }

  render () {
    const { activeNodeList, isOpen, imgSrc } = this.state;
    return (
      <View className='content'>
        <View className="cont-label">{this.props.activeNode.label}</View>
        {
          activeNodeList.map((item: any, index: number) => {
            return (
              <View className="cont-item" key={index}>
                <View className="cont-title">{item.title}</View>
                <RichText className="cont-cont" nodes={item.cont} />
                {
                  item.filename && 
                  <Image style="width:100%;height:100%" lazyLoad mode="widthFix" onClick={this.clickImg.bind(this, item.filename)} src={item.filename}></Image>
                }
              </View>
            )
          })
        }
        <AtCurtain
          isOpened={isOpen}
          onClose={this.closeImg.bind(this)}
        >
          <Image
            style="width:calc(100% + 63px);height:100%;margin-left:-32px;"
            mode="widthFix"
            src={imgSrc}
          />
        </AtCurtain>
      </View>
    )
  }
}
