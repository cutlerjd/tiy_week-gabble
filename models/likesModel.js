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

module.exports = {
    attachLike: attachLike
}