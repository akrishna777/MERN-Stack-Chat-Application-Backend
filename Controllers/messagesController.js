const messageModel = require('../Models/messageModel')
const Users = require('../Models/userModel')

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    })

    return res.status(200).json({ msg: 'Message added successfully.', data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: 'Failed to add message to the database' })
  }
}

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 })

    const sender = await Users.findById(from)
    const receiver = await Users.findById(to)

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        from: sender.fullname,
        to: receiver.fullname,
        createdAt: msg.createdAt,
      }
    })
    return res.json(projectedMessages)
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.' })
  }
}
