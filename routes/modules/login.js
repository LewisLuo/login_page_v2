const express = require('express')
const router = express.Router()

const users = require('../../models/user')

let logStatus

router.get('/', (req, res) => {
  const cookieInfo = req.signedCookies
  if (logStatus) {
    res.render('index', { firstName: cookieInfo.firstName })
  } else {
    res.render('login')
  }
})

router.post('/', (req, res) => {
  let input = { email: '', password: '' }
  input = Object.assign(input, req.body)

  const user = users.find((user) => user.email === input.email && user.password === input.password)

  if (user) {
    logStatus = true
    res.cookie('firstName', user.firstName, { path: '/', signed: true, maxAge: 60000 })
    res.cookie('email', user.email, { path: '/', signed: true, maxAge: 600000 })

    res.redirect('/success')
  } else {
    const loginFail = 'foo'
    res.render('login', { loginFail })
  }
})

router.get('/success', (req, res) => {
  const cookieInfo = req.signedCookies

  res.render('success', { firstName: cookieInfo.firstName })
})

router.get('/logout', (req, res) => {
  logStatus = false
  res.clearCookie('firstName', { path: '/' })
  res.clearCookie('email', { path: '/' })
  res.redirect('/')
})

module.exports = router