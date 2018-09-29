/*
 create by denglianglu
 2018.9.29
*/

import React, { Component } from 'react';
import Ellipsis from '../Ellipsis';

const weekArray = ['', '一', '二', '三', '四', '五', '六', '日'];

export default class CronToChinese extends Component {
  // cron时间转换为中文
  componentDidMount() {

  }
  cronToChinese = (txt) => {
    let regs = [];
    if (txt) {
      regs = txt.split(' '); // 字符串分割成数组
    }
    const second = this.initDesc(regs[0], 'second');
    let min = this.initDesc(regs[1], 'min');
    let hour = this.initDesc(regs[2], 'hour');
    let day = this.initDescDay(regs[3]);
    let month = this.initDescMonth(regs[4]);
    let week = this.initDescWeek(regs[5]);
    let year = '';
    if (regs.length > 6) {
      year = this.initDescYear(regs[6]);
    }
    if ((regs[1] === '*') && (regs[0] && (regs[0] !== '*'))) {
      min = '每分'; // （5 * @ @ @ @）
    }
    if ((regs[3] === '*' || regs[3] === '?') && (regs[2] && (regs[2] !== '*' && regs[2] !== '?')) && (regs[5] === '*' || regs[5] === '?')) {
      day = '每天'; // （@ @ 5 * @ *）
    }
    if ((regs[2] === '*' || regs[2] === '?') && (regs[1] && (regs[1] !== '*' && regs[1] !== '?'))) {
      hour = '每小时'; // （@ * 5 @ @ @）
    }
    if ((regs[5] && (regs[5] !== '*' && regs[5] !== '?' && regs[5].indexOf('/') !== -1))) {
      week = `每周 ${week}`; // （@ @ @ @ @ 5/1）
    }
    if ((regs[4] === '*' || regs[4] === '?') && (regs[5].indexOf('/') === -1) && ((regs[5] && (regs[5] !== '*' && regs[5] !== '?' && regs[5].indexOf('#') !== -1)) || (regs[3] && (regs[3] !== '*' && regs[3] !== '?')))) {
      month = '每月'; // (@ @ @ 5 * ) (@ @ @ 5 * 5#1)
    }
    if (!year && !month && !day && !hour && !min && !second && !week) {
      return '任意时刻';
    } else {
      return `${year}${month}${week}${day}${hour}${min}${second}时执行`;
    }
  }
  // 时、分、秒
  initDesc = (strVal, strid) => {
    let ary = [];
    let v = '';
    let s = '';
    let s1 = '';
    if (strid === 'second') {
      s = '秒';
      s1 = '秒';
    } else if (strid === 'min') {
      s = '分';
      s1 = '分钟';
    } else {
      s = '点';
      s1 = '小时';
    }
    if (strVal === '*') {
      v = '';
    } else if (strVal.indexOf('/') !== -1) {
      ary = strVal.split('/');
      // */4 : 每隔4
      if (ary[0] === '*') {
        v = `每隔${ary[1]}${s1}`;
      }
      v = `从${ary[0]}${s}开始,每隔${ary[1]}${s1} `;
    } else if (strVal.indexOf('-') !== -1) {
      ary = strVal.split('-');
      v = `${ary[0]}~${ary[1]}${s}期间,每${s1}`;
    } else {
      // strVal = 3 or 3,4
      v = `${strVal}${s}`;
    }
    return v;
  }
  // 日
  initDescDay = (strVal) => {
    let ary = [];
    let v = '';
    if (strVal === '*' || strVal === '?') {
      v = '';
    } else if (strVal.indexOf('/') !== -1) {
      ary = strVal.split('/');
      if (ary[0] === '*') {
        ary[0] = '1';
      }
      v = `从${ary[0]}日开始,每隔${ary[1]}天 `;
    } else if (strVal.indexOf('-') !== -1) {
      ary = strVal.split('-');
      v = `${ary[0]}~${ary[1]}日 每天`;
    } else if (strVal.indexOf('L') !== -1) {
      ary = strVal.split('L');
      // L
      if (ary[0] === '') {
        v = '最后一天 ';
      } else {
        // 5L
        v = `倒数第${ary[0]}天 `;
      }
    } else if (strVal.indexOf('W') !== -1) {
      ary = strVal.split('W');
      v = `${ary[0]}号最近的工作日 `; // 6L 和 L
    } else {
      v = `${strVal}日 `;
    }
    return v;
  }
  // 周
  initDescWeek = (strVal) => {
    let ary = [];
    let v = '';
    if (strVal === '*' || strVal === '?') {
      v = '';
    } else if (strVal.indexOf('/') !== -1) {
      ary = strVal.split('/');
      if (ary[0] === '*') {
        ary[0] = '1';
      }
      v = `周${weekArray[ary[0]]}~周${weekArray[ary[1]]} 每天`;
    } else if (strVal.indexOf('#') !== -1) {
      ary = strVal.split('#');
      v = `第${ary[0]}周的周${weekArray[ary[1]]} `;
    } else if (strVal.indexOf('L') !== -1) {
      if (strVal.length === 1) {
        v = '最后一个周 ';
      } else {
        ary = strVal.split('L');
        v = `最后一个周${weekArray[ary[0]]} `;
      }
    } else {
      ary = strVal.split(',');
      if (ary.length > 1) {
        let s = '';
        for (let i = 0; i < ary.length; i += 1) {
          s += `${weekArray[ary[i]]},`;
        }
        // （4，5）: 周四，五
        s = s.substring(0, s.length - 1);
        v = `周${s} `;
      } else {
        v = `周${weekArray[strVal]} `;
      }
    }
    return v;
  }
  // 月
  initDescMonth = (strVal) => {
    let ary = [];
    let v = '';
    if (strVal === '*' || strVal === '?') {
      v = '';
    } else if (strVal.indexOf('/') !== -1) {
      ary = strVal.split('/');
      if (ary[0] === '*') {
        ary[0] = '1';
      }
      v = `从${ary[0]}日开始,每隔${ary[1]}月 `;
    } else if (strVal.indexOf('-') !== -1) {
      ary = strVal.split('-');
      v = `${ary[0]}~${ary[1]}月 每月`;
    } else {
      v = `${strVal}月`;
    }
    return v;
  }
  initDescYear = (strVal) => {
    let ary = [];
    let v = '';
    if (strVal === '*') {
      v = '每年';
    } else if (strVal.indexOf('-') !== -1) {
      ary = strVal.split('-');
      v = `从${ary[0]}~${ary[1]}年,每年`;
    } else if (strVal.indexOf('/') !== -1) {
      ary = strVal.split('/');
      v = `从${ary[0]}年开始,每隔${ary[1]}年 `;
    } else {
      v = `${strVal}年 `;
    }
    return v;
  }
  render() {
    const { text } = this.props;
    return (
      <Ellipsis lines={1} tooltip={text} style={{ cursor: 'pointer' }}>
        {text ? this.cronToChinese(text) : '暂无'}
      </Ellipsis>
    );
  }
}

