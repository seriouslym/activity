import _ from 'lodash'
import moment from 'moment'


const convertRule = (rule) => {
  if ('logic' in rule) {
    for (let r of rule.rule) {
      convertRule(r)
    }
  }
  if (rule.key === 'user.wasVip') {
    rule.value = !!+rule.value
  }
  if (rule.key === 'user.createdTime') {
    rule.value = () => {
      return moment().subtract(rule.value, 'days')
    }
  }
  if (rule.key === 'user.userId') {
    let arr = rule.value.split(';')
    let idx = arr[0]
    let value = arr.slice(1)
    rule.key = `${rule.key}[${24 - idx}]`
    rule.value = value
  }
}

const convertActivityLabels = (activities, preset) => {
  let res = {}
  let description = [], text, title
  for (let activity of activities) {
    if (activity.key === 'gift') {
      let m = {
        '天': 'days',
        '年': 'years',
        '月': 'months'
      }
      let re = /(\d+)(年|月|天)/
      let unit = re.exec(activity.value)[2]
      let value = re.exec(activity.value)[1]
      res[activity.key] = {
        [m[unit]]: +value,
        stringify: activity.value
      }
      continue
    }
    if (activity.key === 'team-gift') {
      let [buyPersonCount, sendCount, sendLimit] = _.map(activity.value.split(';'), item => +item)
      res['buyPersonCount'] = buyPersonCount
      res['sendCount'] = sendCount
      res['sendLimit'] = sendLimit
      res['gift'] = { packageCount: formatTeamVip(buyPersonCount, sendCount, sendLimit) }
      continue
    }
    if (['text', 'title'].includes(activity.key)) {
      if (activity.key === 'title') {
        title = {
          type: 'title',
          buttonText: '赠',
          buttonColor: '#FFFFFF',
          buttonBgc: '',
          title: activity.value
        }
      } else {
        text = {
          type: 'text',
          text: activity.value
        }
      }

      continue
    }
    res[activity.key] = activity.value
  }
  if (!preset) {
    if (!_.isEmpty(title)) description.push(title)
    if (!_.isEmpty(text)) description.push(text)
    description.forEach((item, idx) => item.id = idx + 1)
    res['description'] = description
  } else {
    if (!_.isEmpty(text) && preset ) {
      if (preset.description.length === 2) res['description[1].text'] = text.text
      if (preset.description.length === 1) res['description[0].text'] = text.text
    }
  }
  return res
}

const convertDefaultSelection = (select) => {
  return {
    rule: select.rule,
    get value() {
      return select.selectProduct || []
    },
    values: select.selectProduct || []
  }
}

const convertProductSort = (productSort) => {
  return {
    rule: {},
    get preset() {
      return productSort.defaultSort || []
    },
    presets: productSort.defaultSort || [],
    conditions: _.map(productSort.extraSort, extra => {
      return {
        rule: extra.extraRule,
        get value() {
          return extra.extraSort || []
        },
        values: extra.extraSort || []
      }
    })
  }
}

const formatTeamVip = (buyPersonCount, sendCount, sendLimit) => {
  let res = []
  let left = buyPersonCount
  let send = sendCount
  for (let i = 0; i < sendLimit / sendCount; i++) {
    res.push([[left, left + buyPersonCount], send])
    send += sendCount
    left += buyPersonCount
  }
  res[res.length - 1][0][1] = Number.MAX_SAFE_INTEGER
  return res
}

const convertConfig = (config) => {
  const appConfig = {}
  // 人员划分
  if (!_.isEmpty(config.peopleDivision)) {
    appConfig.context = _.map(config.peopleDivision, division => {
      convertRule(division.rule)
      // console.log(division.rule)
      return {
        rule: division.rule,
        get value() {
          return {
            'user.type': division.type
          }
        },
        values: {
          'user.type': division.type
        }
      }
    })
  }
  // 基本活动
  if (!_.isEmpty(config.activityItems)) {
    appConfig.configs = _.map(config.activityItems, activity => {
      convertRule(activity.baseRule)
      return {
        rule: activity.baseRule,
        get preset() {
          return convertActivityLabels(activity.baseActItem)
        },
        presets: convertActivityLabels(activity.baseActItem),
        conditions: _.map(activity.extraConfigs, extra => {
          convertRule(extra.extraRule)
          return {
            rule: extra.extraRule,
            get value() {
              return convertActivityLabels(extra.extraActItem, convertActivityLabels(activity.baseActItem))
            },
            values: convertActivityLabels(extra.extraActItem, convertActivityLabels(activity.baseActItem))
          }
        })
      }
    })
  }

  if (!_.isEmpty(config.productSort)) {
    appConfig.sort = convertProductSort(config.productSort)
  }
  if (!_.isEmpty(config.defaultSelect)) {
    appConfig.defaultSelection = _.map(config.defaultSelect, select => convertDefaultSelection(select))
  }
  return appConfig
}
export default convertConfig


