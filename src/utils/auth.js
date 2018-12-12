// import Cookies from 'js-cookie'

// 将token存储方式从 Cookies 改为 sessionStorage
// 即关闭页面清除登录状态
// token
const TokenKey = 'Admin-Token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return sessionStorage.clear(TokenKey)
}

// menu
const MenuKey = 'menuKey'

export async function getMenu() {
  return JSON.parse(sessionStorage.getItem(MenuKey))
}

export function setMenu(menu) {
  const menuJson = JSON.stringify(menu)
  return sessionStorage.setItem(MenuKey, menuJson)
}

export function clearMenu() {
  return sessionStorage.clear(MenuKey)
}

// button
const ButtonKey = 'buttonKey'

export function getButton() {
  return JSON.parse(sessionStorage.getItem(ButtonKey))
}

export function setButton(button) {
  const buttonJson = JSON.stringify(button)
  return sessionStorage.setItem(ButtonKey, buttonJson)
}

export function clearbutton() {
  return sessionStorage.clear(ButtonKey)
}

// userId
const userIdKey = 'userId'

export function getUserId() {
  return sessionStorage.getItem(userIdKey)
}

export function setUserId(userId) {
  return sessionStorage.setItem(userIdKey, userId)
}

export function clearUserId() {
  return sessionStorage.clear(userIdKey)
}

// userNo
const userNoKey = 'userNo'

export function getUserNo() {
  return sessionStorage.getItem(userNoKey)
}

export function setUserNo(userNo) {
  return sessionStorage.setItem(userNoKey, userNo)
}

export function clearUserNo() {
  return sessionStorage.clear(userNoKey)
}

// userName
const userNameKey = 'userName'

export function getUserName() {
  return sessionStorage.getItem(userNameKey)
}

export function setUserName(userName) {
  return sessionStorage.setItem(userNameKey, userName)
}

export function clearUserName() {
  return sessionStorage.clear(userNameKey)
}

// branchId
const branchIdKey = 'branchId'

export function getBranchId() {
  return sessionStorage.getItem(branchIdKey)
}

export function setBranchId(BranchId) {
  return sessionStorage.setItem(branchIdKey, BranchId)
}

export function clearBranchId() {
  return sessionStorage.clear(branchIdKey)
}

// branchNo
const branchNoKey = 'branchNo'

export function getBranchNo() {
  return sessionStorage.getItem(branchNoKey)
}

export function setBranchNo(branchNo) {
  return sessionStorage.setItem(branchNoKey, branchNo)
}

export function clearBranchNo() {
  return sessionStorage.clear(branchNoKey)
}

// branchName
const branchNameKey = 'branchName'

export function getBranchName() {
  return sessionStorage.getItem(branchNameKey)
}

export function setBranchName(branchName) {
  return sessionStorage.setItem(branchNameKey, branchName)
}

export function clearBranchName() {
  return sessionStorage.clear(branchIdKey)
}
// isFirstLoginFLag
const isFirstLoginFLagKey = 'isFirstLoginFLag'

export function getIsFirstLoginFLag() {
  return sessionStorage.getItem(isFirstLoginFLagKey)
}

export function setIsFirstLoginFLag(isFirstLoginFLag) {
  return sessionStorage.setItem(isFirstLoginFLagKey, isFirstLoginFLag)
}

export function clearIsFirstLoginFLag() {
  return sessionStorage.clear(isFirstLoginFLagKey)
}
