/**
 * Created by nathan on 2017/3/27.
 */
var db = require('../chatRoom/db')
var dbInstance = db.setPath('leaveMessages/messages')
// //dbInstance.db.dropDatabase()
// dbInstance.on('open',function (aaa) {
//     console.log(aaa)
//     dbInstance.db.dropDatabase(function (aaa) {
//         console.log(aaa)
//     })
// })

var schema = db.Schema,
    ObjectId = db.ObjectId

var messageSchema = new schema({
    from: {type : String},
    to: { type : String , index : true , default : 'public'},
    content: { type : String , default : '123456'},
    createTime : { type : String }
})

var messageModel = dbInstance.model('message',messageSchema)

exports.add = function (condition , fn) {
    new messageModel(condition).save(function (err, doc) {
        if(fn)fn(err , doc)
    })
}

exports.find = function (options, fn) {
    messageModel
        .find({})
        .sort({'_id':-1})
        .where('to',options.to)
        .limit(options.limit*1)
        .skip(options.limit*(options.page-1))
        .exec(function (err, doc) {
            if(fn)fn(err , doc)
        })

}
