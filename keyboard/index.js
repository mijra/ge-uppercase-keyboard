'use strict'

require('./style.css')
require('./themes/mac.css')
require('./grid.css')

const buttons = document.querySelectorAll('button')
const textarea = document.querySelector('.textarea')
const eventName = 'letterReceiver'
const event = new CustomEvent(eventName)

textarea.addEventListener('keydown', (e) => {
  if (isPrintable(e)) {
    e.preventDefault()
  } else {
    e.target.focus()
  }
})

// send event
buttons.forEach((b) => b.addEventListener('click', clickEmitter))

function clickEmitter (e) {
  const button = buttonDOMChecker(e)
  const code = checkButtonCode(button)
  e.code = code
  letterSender(e)
}



function buttonDOMChecker (e) {
  const target = e.target
  const button = target.nodeName === 'BUTTON'
    ? target
    : target.parentNode.nodeName === 'BUTTON'
      ? target.parentNode
      : new Error ('we cant find button in', target)
  return button
}

function checkButtonCode (target) {
  return target.dataset && target.dataset.code
}

document.addEventListener('keydown', letterSender)
document.addEventListener('keyup', buttonDisactivator)

function letterSender (e) {
  buttonActivator(e)

  const code = e.code
  setMode(code)

  if (isPrintable(e)) {
    e.preventDefault()
    event.code = code
    textarea.dispatchEvent(event)
  } else {
    textarea.focus()
  }
}

function buttonQuerySelector (e) {
  const code = e.code
  return document.querySelector(`[data-code=${code}]`)
}

function buttonActivator (e) {
  const button = buttonQuerySelector(e)
  button.classList.add('active')
}

function buttonDisactivator (e) {
  const button = buttonQuerySelector(e)
  button.classList.remove('active')
  clearMode(e.code)
}

// receive event
textarea.addEventListener(eventName, letterListener)

function letterListener (e) {
  if (false) // if selection is at the bottom
    window.scroll(0, 10e3)

  if (isPrintable(e)) {
    e.target.innerHTML += getCodeInMode(e.code, getMode())
  } else {
    e.target.focus()
  }
}

// data
const codes = require('../data')

function isPrintable (e) {
  const code = getCodeProperty(e.code)
  return code.printable === true
}

function getCodeProperty (property) {
  return codes[property]
}

function getCodeInMode (code, mode = 'Default') {
  if (!getCodeProperty(code))
    new Error('code is undefined')
  return getCodeProperty(code)[mode] || ''
}

let mode
let modes = {
  Alt: false,
  Shift: false,
  CapsLock: false
}

function setMode (code) {
  if (code === 'AltLeft' || code === 'AltRight')
    modes['Alt'] = true
  if (code === 'ShiftLeft' || code === 'ShiftRight')
     modes['Shift'] = true
  if (code === 'CapsLock')
    modes['CapsLock'] = true
  if (code === 'OSLeft' || code === 'OSRight')
    modes['CMD'] = true
}

function clearMode (code) {
  if (code === 'AltLeft' || code === 'AltRight')
    modes['Alt'] = false
  if (code === 'ShiftLeft' || code === 'ShiftRight')
    modes['Shift'] = false
  if (code === 'CapsLock')
    modes['CapsLock'] = false
  if (code === 'OSLeft' || code === 'OSRight')
    modes['CMD'] = false
}

function getMode () {
  let arr = []
  for (let i in modes) {
    modes[i] && arr.push(i)
  }
  return arr.length > 0 ? arr.join('_') : 'Default'
}

function isActive () {
  return false
}