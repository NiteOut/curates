var Collections = require('../../mongo.js').collection;
var Users = require('../../mongo.js').user;
var summary = require('../../../summary.js');

module.exports = {
  collectionCreate: function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var url = req.body.url;

    Collections.findOne({title: title})
      .exec(function(err, found) {
        if (found) {
          res.json(found);
        } else {
          var newCollection = new Collections({
            title: title,
            description: description,
            url: url
          });
          newCollection.save();
          res.json(newCollection);
        }
      })
  },

  collectionGet: function(req, res) {
    var title = req.query.title;

    Collections.findOne({title: title})
      .exec(function(err, found) {
        if (found) {
          res.json(found);
        } else {
          res.json({});
        }
      });
  },

  fetchAll: function(req, res) {
    Collections.find({})
      .exec(function(err, collections) {
        res.json({results: collections});
      });
  },

  addLink: function(req, res) {
    var title = req.body.title;
    var link = req.body.link;

    Collections.findOne({title: title})
      .exec(function(err, collection) {
        if (!collection) {
          res.send('Collection does not exist');
        } else {
          summary(link.url).then(function(data){
            link.description = data.summary;
            link.title = data.title;
            collection.links.push(link);
            collection.save();
            res.send('Link added');
          });
        }
      });
  },

  addFavorite: function(req, res) {
    var username = req.body.username;
    var collection = req.body.collection;

    Users.findOne({username: username})
      .exec(function(err, user) {
        if (!user) {
          res.send('User not found');
        } else {
          user.favorites.push(collection._id);
          user.save();
          res.send('Favorite added');
        }
      })
  },

  getUserCollections: function(req, res) {
    var username = req.query.username;
    Users.findOne({username: username})
      .exec(function(err, user) {
        var favorites = user.favorites;
        console.log(favorites);
        Collections.find({_id: {$in: favorites}})
          .exec(function(err, collections) {
            res.json(collections);
          });
      });
  },

  voteLink: function(req, res) {
    var value = req.body.value;
    var title = req.body.title;
    var link = req.body.linkTitle;

    Collections.findOne({title: title})
      .exec(function(err, collection) {
        if (!err && collection.links) {
          collection.links.forEach(function(item) {
            if (item.url === link) {
              if (value > 0) {
                item.upVote++;
              } else {
                item.downVote++;
              }
            }
          });
          collection.save();
          res.send('Links voted');
        } else {
          res.send('Collection does not exist');
        }

      }); 
  }

};