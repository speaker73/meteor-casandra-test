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




const ip = '35.192.70.53';

// cassandra connect config
const config = {
    contactPoints: [ip + ':9160', ip + ':9042'],
    //protocolOptions: { port: 9042 },
    queryOptions: {
        //consistency: 1
    },
    keyspace: 'dev'
};
let holder = [];
//model (in es5)
var Model = cassmask.model('second_clicker', new cassmask.Schema({
  uid: {
    type: cassmask.UUID,
    default: uuid()
  },
  time_uid: {
    type: cassmask.TIMEUUID,
    default: now()
  },
  date: {
    type: cassmask.TIMESTAMP,
    default: toTimeStamp(now())
  },
  clicks: {
    type: cassmask.INT,
    default:0
  },
  message:{
    type: cassmask.TEXT,
    default:""
  },
  // Primary Keys (Partition & Clustering Column)
  keys: ['uid', 'time_uid']  
}
));



// Model.validate('increment', function(increment, next) {
//     if (increment >= 0) next();
//     else next('increment value not large enough!');
// });

Meteor.startup(() => {
    // Model.create([{
    //     increment: 1,
    // }]);
   
});
const store = (function(){
    let data = [];
    return {
        subscribe:(script, ready)=>{
            script(Random.id(), {message:"1111"});
            ready();
            data.push([script, ready]);
        },
        run:(id, nexData)=>{
            //console.log(data.length);
            data.forEach((script)=>{
                script[0](Random.id(), nexData);
                script[1]();

            });
        },
        get:()=>{
            return data
        }
    }
})();
Meteor.publish('cassandra', function() {
    let self = this;
   /* cassmask.connect(config, (err, result) => {

   Model.findOne().seam().subscribe( // Every next argument will be an Entity object for every query executed
        x => {
            holder.push(x);
            console.log("ss>", x.toJSON());
            self.added('cassandra', x.toJSON().id+'', {clicks:x.toJSON()})
        },
        err => {
            console.log("name:>>> " + err.name)
            console.log(err)
        },
        () => {
            self.ready();
        }
    );
    Model.findOne().find().seam().subscribe(
                tests => {
                     holder.push(tests);
                     console.log("find>", tests.length, holder);
                     let arr = tests;
                     arr.forEach((obj)=> {
                         self.added('cassandra', obj.toJSON().id+'', {
                             clicks:obj.toJSON().clicks,
                             message:obj.toJSON().message,
                             date:obj.toJSON().date
                         })
                     });
                    
                },
                err => console.log(err),
                () => {
                    self.ready();
                    done();
                }
         );
    });
*/
    store.subscribe((id, data)=>{
        self.added('cassandra', id+'', data);
    },()=>{
         self.ready();
    });
});

// ALTERNATIVE PACKAGE TO CHECK IF CASSANDRA IS UP AND RUNNING. DOES NOT SUPPORT REACTIVITY ONLY CQL QUERIES
// const cassandra = require('cassandra-driver');
// const client = new cassandra.Client({ contactPoints: [ip+':9042',ip+':9160'], keyspace: 'dev' });
// const query = 'CREATE TABLE dev.cassandra2 (id:uuid, uuid: uuid, increment:int)';
// client.connect()
//   .then(function () {
//     console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
//     console.log('Keyspaces: %j', Object.keys(client.metadata.keyspaces));
//     console.log('Shutting down');
//     client.query(query,function(){
//         console.log('query executed?')
//     })
//     return client.shutdown();
//   })
//   .catch(function (err) {
//     console.error('There was an error when connecting', err);
//     return client.shutdown();
// });

Meteor.methods({
    "add":function(obj){
       /*Model.create([obj]).findOne().find().seam().subscribe(
            model => {
                      holder.push(model);
                     console.log("add>", model.length, holder.length);
                    // console.log(holder[0]);    
                },
                err => console.log(err),
                () => {
                    done();
                }
           );*/
         /*  console.log('method add start');
             console.log("_________________________");
                console.log(this, next, err);
                console.log("_________________________");
            Model.post('create', function(next, err) {

                Model.Events.emit('create', this);
                next(this);
            });*/

             store.run( store.get().length+1+'', {message:"Hello Creature!"});
          return {succes:200}
    }
});



/*
import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo'

//const cassmask = require('cassmask');
import * as cassmask from 'cassmask';
import {
    toTimeStamp,
    now,
    uuid
} from 'cassmask';

const ip = '35.192.70.53';
const cass = require('cassandra-driver');
const cassClient = new cass.Client({
    contactPoints: [ip + ':9160', ip + ':9042'],
    keyspace: 'dev' }
);



const store = (function(){
    let data = { };
    const count = (sub)=>{
        const ct ='SELECT count(*) FROM clicks';
        cassClient.execute(ct).then(result =>{
         console.log('sc', result.rows);
         sub.changed('cassandra', '73', {count:result.rows[0].count.low});
         sub.ready(); 
     })
      return data.count;  
    }
    return {
        get:()=>{
            return data
        },
        set:(name,val)=>{
            data[name] = val;
        },
        count
    }
})();
// Model.validate('increment', function(increment, next) {
//     if (increment >= 0) next();
//     else next('increment value not large enough!');
// });

Meteor.startup(() => {
    // Model.create([{
    //     increment: 1,
    // }]);
   
})
Meteor.publish('cassandra', function() {
   let sub = this;

      sub.added('cassandra', '73', {count:0});

      store.count(sub); 
      //sub.ready();
});

// ALTERNATIVE PACKAGE TO CHECK IF CASSANDRA IS UP AND RUNNING. DOES NOT SUPPORT REACTIVITY ONLY CQL QUERIES
// const cassandra = require('cassandra-driver');
// const client = new cassandra.Client({ contactPoints: [ip+':9042',ip+':9160'], keyspace: 'dev' });
// const query = 'CREATE TABLE dev.cassandra2 (id:uuid, uuid: uuid, increment:int)';
// client.connect()
//   .then(function () {
//     console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
//     console.log('Keyspaces: %j', Object.keys(client.metadata.keyspaces));
//     console.log('Shutting down');
//     client.query(query,function(){
//         console.log('query executed?')
//     })
//     return client.shutdown();
//   })
//   .catch(function (err) {
//     console.error('There was an error when connecting', err);
//     return client.shutdown();
// });

Meteor.methods({
    "add":function(obj){
        const insert =`INSERT INTO clicks (id) VALUES (${obj.clicks})`;
        cassClient.execute(insert).then(result =>{
         //console.log('sc', result)
         store.set('table',result.rows);
         store.count();
     });
       return {succes:200, count:store.get().count}
    }
})


*/