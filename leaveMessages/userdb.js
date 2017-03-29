/**
 * Created by nathan on 2017/3/27.
 */

var db = require('../chatRoom/db')
var dbInstance = db.setPath('leaveMessages/user')
// //dbInstance.db.dropDatabase()
// dbInstance.on('open',function (aaa) {
//     console.log(aaa)
//     dbInstance.db.dropDatabase(function (aaa) {
//         console.log(aaa)
//     })
// })

var schema = db.Schema,
    ObjectId = db.ObjectId

var userSchema = new schema({
    user: { type : String , unique : true , index : true},
    password: { type : String , default : '123456'},
})

var userModel = dbInstance.model('user',userSchema)

//userModel.ensureIndexes({ user : 1})

// userModel.remove(function (err, docs) {
//     console.log(docs)
// })

exports.add = function (user , pwd , fn) {
    var condition = {}
    if(user)condition.user = user
    if(pwd)condition.password = pwd
    new userModel(condition).save(function (err, doc) {
        if(fn)fn(err , doc)
    })
}

exports.find = function (user, fn) {
    user?
        user = { user : user}:
        user = {}
    userModel.findOne(user,function (err, doc) {
        if(fn)fn(err , doc)
    })
}

exports.update = function (user, newVal ,fn) {
    userModel.update({
        user : user
    },newVal,function (err, doc) {
        if(fn)fn(err,doc)
    })
}

exports.delete = function (user, fn) {
    userModel.findOneAndRemove({
        user : user
    },function (err, doc) {
        if(fn)fn(err,doc)
    })
}