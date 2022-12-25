const {
  register,
  login,
  setAvatar,
  getAllUsers,
  getUserByEmail,
  addToFriendList,
  getUserContacts,
} = require('../Controllers/userController')

const router = require('express').Router()

router.post('/register', register)
router.post('/login', login)
router.post('/setAvatar/:id', setAvatar)
router.get('/allusers/:id', getAllUsers)
router.post('/user', getUserByEmail)
router.post('/user/:id', addToFriendList)
router.get('/user/contacts/:id', getUserContacts)

module.exports = router
