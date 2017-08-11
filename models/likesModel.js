const conn = require('./dbModel.js')

function attachLike(user_id,post_id,done){
    let sql = `
    INSERT INTO likes (user_id,post_id)
    VALUES (?,?)
    `
    conn.query(sql,[user_id,post_id],function(err,results,fields){
        if(!err){
            console.log("attachLike success",results)
            done( true,results)
        } else {
            console.log("attachLike had an error",err)
            done(false, err)
        }
    })
}
function getLikes(user_id,obj){
    let sql =`
    SELECT user_id, timestamp
    FROM likes
    WHERE post_id = ? AND active = true`
    conn.query(sql,[obj.id],function(err,results,fields){
        //console.log("getLikes obj and obj.id",obj,obj.id)
        //console.log(results)
        if(!err){
        obj.likeCount = results.length
        obj.likes = {'likes':results}
        if(results.findIndex(function(item){
            return item.id == user_id
        }) > -1){
            obj.liked = true
        }
        console.log(obj)
        return obj
    } else {
        console.log("getLikes had an error",err)
        return null
    }
    })
}
module.exports = {
    attachLike: attachLike,
    getLikes: getLikes
}