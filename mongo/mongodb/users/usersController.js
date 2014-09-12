var Users = require('../../mongo.js').user;

module.exports = {
  signupUser: function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    Users.findOne({username: username})
      .success(function(found) {
        if (found) {
          res.send('User already exists');
        } else {
          var newUser = new User({
            username: username,
            password: password
          });
          newUser.save()
            .then(function() {
              console.log('User saved');
              res.json({token: 'token'});
            });
        }
      })
  },

  login: function(req, res) {
    var username = req.query.username;
    var password = req.query.password;

    Users.findOne({username: username})
      .success(function(found) {
        if (found) {
          if (found.password === password) {
            res.json({token: 'token'});
          } else {
            res.send('Bad password');
          }
        } else {
          res.send('User does not exist');
        }
      });
  }

};