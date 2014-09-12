var Users = require('../../mongo.js').user;
var jwt = require('jwt-simple');
var Q = require('q');


module.exports = {
  signupUser: function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    Users.findOne({username: username})
      .exec(function(err, found) {
        if (found) {
          res.status(500).send('User already exists');
        } else {
          var newUser = new Users({
            username: username,
            password: password
          });
          newUser.save();
          var token = jwt.encode(found, 'secret');
          res.json({token: token});
        }
      })

  },

  login: function(req, res) {
    var username = req.query.username;
    var password = req.query.password;

    var findUser = Q.nbind(Users.findOne, Users);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          console.log('User does not exist');
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              console.log('got here')
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                res.json({token: token});
              } else {
                console.log('No user');
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  }

};