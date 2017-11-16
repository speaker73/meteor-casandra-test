import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
const cassandra = new Meteor.Collection('cassandra');


import './main.html';

Template.hello.onCreated(function helloOnCreated() {
        template = this;
        
  Tracker.autorun(() => {
          
  })
   Meteor.subscribe('cassandra', function(){
     });
});

Template.hello.helpers({
  
    counter() {
        const counter = cassandra.find().fetch(); 
        console.log(counter);
        return counter.length
    }
});

Template.hello.events({
    'click button'(event, instance) {
        //console.log("before.add",cassandra.find().fetch());
        Meteor.call("add", {clicks:cassandra.find().fetch().length, message:"fin"}, (e,r)=>{
            //console.log("after.add",cassandra.find().fetch());
            console.log(r,e)
        });
    },
});
