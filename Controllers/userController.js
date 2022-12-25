const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports.register = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser)
      return res.status(400).json({ message: 'User Already Exists.' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await User.create({
      fullname: fullname,
      email: email,
      password: hashedPassword,
    })

    const token = jwt.sign({ email: result.email, id: result._id }, 'test', {
      expiresIn: '1h',
    })

    res.status(200).json({ result, token })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.log(error)
  }
}

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (!existingUser)
      return res.status(400).json({ message: 'Incorrect Email.' })

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    )

    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Incorrect Password.' })

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      'test',
      { expiresIn: '1h' },
    )

    res.status(200).json({ result: existingUser, token })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.log(error)
  }
}

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id
    const avatarImage = req.body.image
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true },
    )

    res.status(200).json(userData)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.log(error)
  }
}

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      'email',
      'fullname',
      'avatarImage',
      '_id',
    ])
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.log(error)
  }
}

module.exports.getUserByEmail = async (req, res, next) => {
  const { userEmail } = req.body
  console.log(req.body)
  console.log(userEmail)

  try {
    const user = await User.find({ email: userEmail })

    if (user) {
      res.status(200).json(user)
    } else {
      res.status(500).json({ message: 'User Not Found.' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.log(error)
  }
}

module.exports.addToFriendList = async (req, res, next) => {
  const friend = req.body.contact
  const userId = req.params.id
  console.log(friend._id)
  console.log(userId)

  try {
    const existingFriend = await User.findById(userId)

    const friendId = existingFriend.friends.includes(friend._id)

    if (friendId === true) {
      res.status(404).json({ message: 'User already in friend list.' })
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { friends: friend._id },
      })
      res.status(200).json({ message: 'User added successfully' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

module.exports.getUserContacts = async (req, res, next) => {
  const userId = req.params.id
  console.log(userId)
  try {
    const contacts = await User.findOne({ _id: userId }).populate('friends')

    res.status(200).json(contacts)
  } catch (error) {
    res.status(500).json(error)
  }
}
