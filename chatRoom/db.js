/**
 * Created by nathan on 2017/3/5.
 */
var mongoose = require('mongoose')

var basePath = "mongodb://localhost/"
var dbUrl = basePath + 'default'
var connection

mongoose.Promise = global.Promise
exports = module.exports = mongoose
exports.setPath = function (name) {
    dbUrl = basePath + name
    connection =  mongoose.createConnection(dbUrl)
    return connection
}

// connection.on('connected', function () {
//     console.log('Mongoose connected to ' + dbUrl);
// });
// connection.on('error',function (err) {
//     console.log('Mongoose connection error: ' + err);
// });
// connection.on('disconnected', function () {
//     console.log('Mongoose disconnected');
// });
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});
