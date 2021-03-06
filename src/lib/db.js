import { axios } from './axios';

/**
 *   @database: { 微信开发 }
 *   @desc:     { 班级列表 }
 */
export const getXinchengClasslist = () =>
  axios({
    url: '/124/23c9ef69a6.json'
  });

/**
*   @database: { 微信开发 }
*   @desc:     { xc_用户登录 } 
    const { username, id_card } = params;
*/
export const getXinchengUserlist = (params) =>
  axios({
    url: '/119/e3f98a0a39.json',
    params
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 年级课程列表 }
 */
export const getXinchengTeacherlist = (grade_name) =>
  axios({
    url: '/125/ce956857a5.json',
    params: {
      grade_name
    }
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 社团课程列表 }
 */
export const getXinchengClublist = () =>
  axios({
    url: '/122/31390164b9/14400.json'
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 批量批量提交结果 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{uid,course_id,club_id,score,remark }]，数组的每一项表示一条数据*/
export const addXinchengVotelist = (values) =>
  axios({
    method: 'post',
    data: {
      values,
      id: 120,
      nonce: '28a15fa97c'
    }
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 更新个人登录信息 } 
    const { class_id, start_time, rec_time, uid } = params;
*/
export const setXinchengUserlist = (params) =>
  axios({
    url: '/121/ff92a413a4.json',
    params
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 班级列表-多级选择 }
 */
export const getXinchengClasslistCascade = () =>
  axios({
    url: '/126/f697a432b5.json'
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 年级课程列表_无社团课 }
 */
export const getXinchengTeacherlistNoGroup = (grade_name) =>
  axios({
    url: '/131/9f5ea1ef9d.json',
    params: {
      grade_name
    }
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 教师登录 } 
    const { username, id_card } = params;
*/
export const getXinchengUserlistTeacher = (params) =>
  axios({
    url: '/133/f968523a63.json',
    params
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 教师列表 }
 */
export const getXinchengTeachers = () =>
  axios({
    url: '/139/046207a028/300.json'
  });
/**
*   @database: { 微信开发 }
*   @desc:     { 批量教师投票 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{uid,course_id,score,remark }]，数组的每一项表示一条数据*/
export const addXinchengTeacherVotelist = (values) =>
  axios({
    method: 'post',
    data: {
      values,
      id: 140,
      nonce: '8121cdcbb2'
    }
  });
