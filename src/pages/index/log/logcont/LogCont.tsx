import Taro, { Component } from '@tarojs/taro'
import { AtButton, AtIcon } from 'taro-ui'
import { View, RichText } from '@tarojs/components'
import './LogCont.less'

interface IPropsType {
  activeLogId: string;
  onBackLogList: any;
}

export default class Content extends Component<IPropsType, {}> {
  static options = {
    addGlobalClass: true
  }

  state = {
    title: '',
    author: '',
    logcont: ''
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
      url: `https://www.xiaxiazheng.cn:444/back/logcont?id=${this.props.activeLogId}`,
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res) {
        this.setState({
          title: res.data.data.title,
          author: res.data.data.author,
          logcont: res.data.data.logcont
        });
      }
    });
  }

  render () {
    const { title, author, logcont } = this.state;
    return (
      <View className='log-cont'>
        { // 返回按钮
          <AtButton className="back-to-log-list-btn" type='primary' onClick={this.props.onBackLogList.bind(this)}>
            <AtIcon value='arrow-left' size='30' color='white'></AtIcon>
          </AtButton>
        }
        <View className="log-title">{title}</View>
        <View className="log-author">{author}</View>
        <RichText className="log-content" nodes={logcont} />
      </View>
    )
  }
}
