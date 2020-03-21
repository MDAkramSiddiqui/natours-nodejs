const path = require('path');
const fs = require('fs');

class userController {
  constructor() {
    this.usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../dev-data/data/users.json'))
    );
  }

  getAllUsers(req, res) {
    return res.status(200).json({
      success: {
        data: "Router not build yet"
      }
    });
  }

  createUser(req, res) {
    return res.status(200).json({
      success: {
        data: "Router not build yet"
      }
    });
  }

  getUser(req, res) {
    return res.status(200).json({
      success: {
        data: "Router not build yet"
      }
    });
  }

  updateUser(req, res) {
    return res.status(200).json({
      success: {
        data: "Router not build yet"
      }
    });
  }

  deleteUser(req, res) {
    return res.status(200).json({
      success: {
        data: "Router not build yet"
      }
    });
  }

}

module.exports = new userController();