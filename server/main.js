import { Meteor } from 'meteor/meteor';

Post = new Mongo.Collection('post');

Accounts.onCreateUser(function(options,user){
  // make sure that the user has a profile object
  user.profile = user.profile || {};

  //initiate follow to keep track to who they follow

  user.profile.follow = [];

  return user;
});

Meteor.methods({
    addPost : function(content){

      if(!Meteor.userId()){
          throw new Meteor.Error('not-authorized' , 'you are not signed in');
      }

        var username = Meteor.user().username;
        Post.insert({
            content :content,
            created : new Date(),
            username : username
          });
    },
    follow : function(post){
      //console.log(post);
      //get current user
      var user = Meteor.user();
      if(!user){
        throw new Meteor.Error('not-authorized' , 'you are not signed in');
      }
    // u can't just follow urself
    // u can't someone twice
    if(user.username != post.username && user.profile.follow.indexOf(post.username) == -1){                
      Meteor.users.update(
        {_id : user._id},
        {$push :{'profile.follow' : post.username}
      });
    }
     
    }
});

Meteor.startup(() => {

});
  