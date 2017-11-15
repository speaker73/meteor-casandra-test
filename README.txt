Readme file for 'cassandra-reactivity':

It is unfinished PoC folder to use Cassandra with MeteorJS reactivly.

1) Get and install MeteorJS (https://www.meteor.com/)
2) Run npm install
3) Check if 'cassmask' package was installed.
3.1) In server file(s). Create config object (example in /server/main.js) to connect to cassandra base.
Depending on the version of cassandra it can be accessed through ports 9042 or 9160
3.2) Alternativly, to check if cassandra is up and running you can use 'cassandra-driver'
4) Package page: https://www.npmjs.com/package/cassmask
5) When calling cassmask rows in Meteor publish avoid using return statement.
Better way:
//at the start of the publish 
let self = this;

//when got a row from cassmask in subcribe call
self.added('collection',id,{...})

// First argument - is a name of the collection that will be used on client side
// Second argument - Mongo _id (has to string or object)
// Third argument is data itself

// And don't forget to put self.ready() in a callback, because without it 'publish' won't work
