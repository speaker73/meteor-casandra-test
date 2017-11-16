import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo'
import { Random } from 'meteor/random';
//const cassmask = require('cassmask');
import * as cassmask from 'cassmask';
import { Entity } from 'cassmask';
import {
    toTimeStamp,
    now,
    uuid
} from 'cassmask';

const cassandra = require('cassandra-driver');
const distance = cassandra.types.distance;

const ip = '35.192.70.53';

const cassClient = new cassandra.Client({
    contactPoints: [ip + ':9160', ip + ':9042'],
    keyspace: 'dev',

});

Meteor.startup(() => {
   /* cassClient.stream(select)
      .on('readable', function () {
        console.log("stream", this);
    });*/
    



});


const stremTest = (function(){
    const select = 'SELECT count(*) FROM clicks3';
    cassClient.stream(select)
        .on('readable', function () {
         console.log('readable:', this.read());
      }).on('error', err => {
                if(err) {
                    this.error = err;
                }
            })
})();

const simpleObserver = (function(){
    let data = [];
    return {
        subscribe:(script, ready)=>{
            script({message:"subscribe"});
            ready();
            data.push([script, ready]);
        },
        run:(msg)=>{
            //console.log(data.length);
            data.forEach((script)=>{
                script[0](msg);
                script[1]();
            });
        },
        isEmpty:()=>{
           return !data.length 
        }
    }
})();


Meteor.publish('cassandra', function() {
    let self = this;

    simpleObserver.subscribe((msg)=>{
         //console.log('notify', msg);
         const select = 'SELECT * FROM clicks3';
         if(msg.message == 'subscribe' || msg.message == 'pool'){
         cassClient.execute(select).then(result =>{
           // console.log("result",result.rows.length);
            if(msg.message == 'subscribe'){
                result.rows.forEach((row)=> self.added('cassandra', row.id+'', row) );
            }
            
         });
         }else{
            self.added('cassandra', msg.nextData.id+'', msg.nextData)
         }
    },()=>{
         self.ready();
    });

});


Meteor.methods({
    "add":async (obj)=>{
          self = this;
          const nextData = {id:Random.id(), clicks:obj.clicks, date:new Date()};
          const insert =`INSERT INTO clicks3 (id, clicks, date) VALUES ('${nextData.id}', ${nextData.clicks}, ${Date.parse(nextData.date) })`;
          let call = await cassClient.execute(insert);
          simpleObserver.run({message:"insert", nextData});

          return call     
    }
});

