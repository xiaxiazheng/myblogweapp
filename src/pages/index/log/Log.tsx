import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtPagination, AtFloatLayout, AtButton, AtIcon } from 'taro-ui'
import './Log.less'
import LogCont from './logcont/LogCont'

export default class Log extends Component {
  static options = {
    addGlobalClass: true
  }

  state = {
    allClass: [],
    activeClass: '所有日志',
    showCont: false,
    activeLogId: '',
    logList: [],
    pageNo: 1,
    pageSize: 12,
    total: 0,
    showLayout: false,
  }

  componentWillMount () { }

  componentDidMount () {
    this.initAllClass();
    this.initLogList();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  initAllClass = () => {
    // 获取树的列表的数据
    Taro.request({
      url: 'https://www.xiaxiazheng.cn:444/back/logallclass',
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res) {
        let list = ['所有日志', ...res.data.data];
        this.setState({
          allClass: list
        });
      }
    });
  }

  initLogList = () => {
    let params: any = {
      pageNo: this.state.pageNo,
      pageSize: this.state.pageSize,
      orderBy: 'modify',
      keyword: ''
    };
    this.state.activeClass !== '所有日志' && (params.classification = this.state.activeClass);
    // 获取日志列表的数据
    Taro.request({
      method: "POST",
      data: params,
      url: 'https://www.xiaxiazheng.cn:444/back/loglistall',
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
      this.initLogList();
    });
  }

  // 选择了分类
  choiceClass = (className) => {
    this.setState({
      activeClass: className,
      showLayout: false,
      pageNo: 1
    }, () => {
      this.initLogList();
    });
  }

  render () {
    const { allClass, activeClass, logList, showCont, pageSize, pageNo, activeLogId, total, showLayout } = this.state;
    return (
      <View className="log">
        {/* 浮动弹层，日志分类 */}
        <AtFloatLayout
          className="layout-box"
          isOpened={showLayout}
          title="日志分类" 
          onClose={() => this.setState({ showLayout: false })}>
          {allClass.map(item => {
            return (
              <View
                className={`class-item ${activeClass === item ? 'active-class' : ''}`}
                key={item}
                onClick={this.choiceClass.bind(this, item)}
              >
                {item}
              </View>
            )
          })}
        </AtFloatLayout>
        {/* 日志列表 */
          <View className={showCont ? 'log-hidden' : ''}>
            {// 开抽屉按钮
              <AtButton
                className="show-log-class-layout-btn"
                type='primary'
                onClick={() => this.setState({ showLayout: true })}>
                <AtIcon value={showLayout ? 'chevron-down' : 'chevron-up'} size='20' color='white'></AtIcon>
              </AtButton>
            }
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
