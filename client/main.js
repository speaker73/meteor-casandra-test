import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
const cassandra = new Meteor.Collection('cassandra');


import './main.html';

Template.hello.onCreated(function helloOnCreated() {
        template = this;
      template.counter = new ReactiveVar(0);
        
  Tracker.autorun(() => {
             Meteor.subscribe('cassandra', function(){
         console.log("sss", cassandra.find().fetch());
         let counter = cassandra.find().fetch()[0].clicks;
         template.counter.set(counter);
     });
    })
    //console.log(this.counter);
    // console.log(Messages.find().fetch())
});

Template.hello.helpers({
  
    counter() {
        //return Template.instance().counter.get();
        //console.log(cassandra.find().fetch());
        let counter = cassandra.find().fetch();
            counter = counter.sort((a,b)=> { 
            return new Date(a.date).getTime() - new Date(b.date).getTime() 
        });
            console.log(counter);
        return counter.length
    }
});

Template.hello.events({
    'click button'(event, instance) {
        //const t = Template.instance();
        const counter = Template.instance().counter.get()+1;
       
        //cassandra.insert({increment: counter})

        //instance.counter.set(instance.counter.get() + 1);
        console.log(cassandra.find().fetch(), counter);
        Meteor.call("add", {clicks:counter, message:"fin"}, (e,r)=>{
            console.log("er",cassandra.find().fetch(),r);
            if(r.succes == 200){
               instance.counter.set(counter); 
            }
        });
    },
});
