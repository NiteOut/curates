angular.module('curates.singleCollection', [])

.config(function($stateProvider) {
  $stateProvider
    .state('collection', {
      url: '/:url',
      controller: 'singleCollectionController',
      templateUrl: 'modules/singleCollection/singleCollection.html'
    });
})

.controller('singleCollectionController', ['$scope', 'collectionFactory', 'userManagement',
  function($scope, collectionFactory, userManagement) {
    $scope.addShown = false;
    $scope.collection = collectionFactory.collection;
    $scope.addFav = function (collection) {
      collectionFactory.addFavorite(userManagement.user.username, collection);
    };

    // Allow the user to upvote and downvote links
    $scope.links = $scope.collection.links;
    // Allow the user to upvote and downvote collections
    $scope.voteLink = function(collection, link, val) {
      collectionFactory.voteLink(collection, link, val);
      if(val > 0){
        link.upVote++;
      } else {
        link.downVote++;
      }
    };

    $scope.addLink = function(link) {
      if(collectionFactory.collection.links === undefined){
        collectionFactory.collection.links = [];
      }
      collectionFactory.addLink($scope.collection.title, link);
      if(!collectionFactory.collection.links){
        collectionFactory.collection.links = [];
      }
      collectionFactory.collection.links.push(link);
    };

    // returns the vote value to 95% statistical confidence
    function _confidence(upVotes, downVotes){
      var totalVotes = upVotes + downVotes;
      var zValue;
      var confidenceScore;

      if(totalVotes === 0){
        return 0;
      }

      zValue = 1.6 // it's a stat thing. it determines confidence that a probability is 95% correct. fake math.

      pHat = upVotes/totalVotes;

      confidenceScore = Math.sqrt(pHat+zValue*zValue/(2*totalVotes)-zValue*((pHat*(1-pHat)+zValue*zValue/(4*totalVotes))/totalVotes))/(1+zValue*zValue/totalVotes);
      return confidenceScore;
    }
    // use for orderBy filter predicate
    $scope.confidence = function(link){
      var confidence = _confidence(link.upVote, link.downVote);
      link.confidence = confidence;
      console.log(link, confidence);
      return confidence;
    };
  }
]);
