import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Post = new Mongo.Collection('post');

Template.postsList.helpers({
    posts : function(){
      var result;
      if(Session.get('username')){
        result = Post.find({username : Session.get('username') }, {sort : {created:-1}});
      }
      else{
      result = Post.find({}, {sort : {created:-1}});
      }
      return result;
    }
  });

  Template.profileArea.helpers({
    following : function(){
      var user = Meteor.user();
      return user.profile.follow;
    },
    followers : function(){
      var user = Meteor.user();
      var followers = Meteor.users.find({'profile.follow' : {$in : [user.username]}});
   return followers;

    }
  });



Template.postForm.events({
    'submit form' : function(event){
      event.preventDefault();
      var content = document.getElementById('content').value;
      var username = Meteor.user().username;

      //call method
     Meteor.call('addPost' , content);

      event.target.reset();
    }
  });
  Template.postsList.events({
    'click .follow-link' : function(event){
      event.preventDefault();

      Meteor.call('follow',this);
    }
});

Template.profileArea.events({
  'click .filter-user'  : function(event){
    event.preventDefault();
   var selectedUser  = event.target.text;
  
    Session.set('username' ,selectedUser);
    

  },
  'click .community' : function(events){
    event.preventDefault();
    Session.set('username' ,null);
  }
});


  Accounts.ui.config({
    passwordSignupFields : 'USERNAME_ONLY'
  });
  
 
 