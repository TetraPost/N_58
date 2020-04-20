const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const tempSign = require('../config/tempSign');

// const CookieModel = require('../models/cookie.js');

module.exports.index = async function (req, res) {
  res.render('index', { title: 'Auth N_58'});
};

/* Проверяем логин/пароль */
function checkCretential(data) {
  if (data.email === 'breaking_Bad@aol.com' && data.password === 'AaronPaul') {
    return true;
  }
  return false;
}

/* Подписываем AccessToken */
const setToken = async (data) => {
  // const tokenList = {};
  // const tokenAcces = jwt.sign({ id: data.email, name: 'Paul', exp: tempSign.tokenLife }, tempSign.secret);
  // const tokenRefresh = jwt.sign({ id: data.email, name: 'Paul', exp: tempSign.refreshTokenLife }, tempSign.refreshTokenSecret);
  const tokenList = jwt.sign({ id: data.email, name: 'Paul' }, tempSign.secret);
  /* const response = {
    accesToken: tokenAcces,
    refreshToken: tokenRefresh,
    exp: tempSign.refreshTokenLife,
  }; */
  // tokenList[tokenRefresh] = response;
  //console.log(`ttt ${JSON.stringify(response)}`);
  return tokenList;
};

/* Проверяем куки */
const checkCookies = async (req, res, data) => {
  try {
    /* если в куках нет токена - присваиваем токен и возвращаем куки */
    if (!req.cookies.accessToken) {
      /* присваиваем токен */
      const valid = await setToken(data);
      return valid;
    }
    /* иначе возвращаем текущий куки */
    return req.cookies.accessToken;
  } catch (error) {
    console.log(error);
  }
};


const sendDataToController = async (req, res, data) => {
  try {
    /* Проверяем данные для авторизации */
    const check = await checkCretential(data);
    if (check) {
      /* нужно проверить наличие кук у нынешнего пользователя и наличие AccessToken */
      const payload = await checkCookies(req, res, data);
      res.cookie('accessToken', payload, { httpOnly: true });
      return { auth: true, accessToken: payload };
    }
    /* Данные для авторизации не верны */
    return { auth: false, message: 'There was a problem with credential data.' };
  } catch (error) {
    console.log(error);
  }
};

/* Проверяем куки для отправки на другой сервер */
const getCookies = async (req, res) => {
  try {
    const cookiesCheck = req.cookies.accessToken;
    /* Если нет кук с accessToken - предлагаем пользователю авторизироваться */
    if (!cookiesCheck) {
      return { cookies: false, message: 'You must be a loging first' };
    }
    /* иначе - возвращаем текущие куки с accessToken для отправки на другой сервер */
    // return req.cookies.accessToken;
    return { cookies: true, message: cookiesCheck };
  } catch (error) {
    console.log(error);
  }
};

module.exports.getCookies = getCookies;
module.exports.sendDataToController = sendDataToController;
