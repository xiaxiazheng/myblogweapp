import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtPagination } from 'taro-ui'
import './Log.less'
import LogCont from './logcont/LogCont'

export default class Log extends Component {
  static options = {
    addGlobalClass: true
  }

  state = {
    showCont: false,
    activeLogId: '',
    logList: [],
    pageNo: 1,
    pageSize: 12,
    total: 0
  }

  componentWillMount () { }

  componentDidMount () {
    this.init();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  init = () => {
    // 获取树的列表的数据
    Taro.request({
      method: "POST",
      data: {
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize,
        orderBy: 'modify',
        keyword: ''
      },
      url: 'https://www.xiaxiazheng.cn:443/back/loglistall',
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res) {
        this.setState({
          logList: res.data.data.list,
          total: res.data.data.totalNumber
        });
      }
    });
  }

  backLog = () => {
    this.setState({
      showCont: false
    });
  }

  choiceLog = (id: string) => {
    this.setState({
      activeLogId: id,
      showCont: true
    });
  }

  pageChange = (data) => {
    this.setState({
      pageNo: data.current
    }, () => {
      this.init();
    });
  }

  render () {
    const { logList, showCont, pageSize, pageNo, activeLogId, total } = this.state;
    return (
      <View className="log">
        {/* 日志列表 */
          <View className={showCont ? 'log-hidden' : ''}>
            {logList.map((item: any, index: number) => {
              return (
                <View className="list-item" key={index} onClick={this.choiceLog.bind(null, item.log_id)}>
                  {item.title}
                </View>
              )
            })}
            <View className="pagination">
              <AtPagination
                total={total} 
                pageSize={pageSize}
                current={pageNo}
                onPageChange={this.pageChange}
              />
            </View>
          </View>
        }
        {/* 展示具体内容 */
          showCont &&
          <LogCont activeLogId={activeLogId} onBackLogList={this.backLog}/>
        }
      </View>
    )
  }
}
