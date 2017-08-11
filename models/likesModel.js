const conn = require('./dbModel.js')

function attachLike(user_id, post_id, done) {
    let sql = `
    INSERT INTO likes (user_id,post_id)
    VALUES (?,?)
    `
    conn.query(sql, [user_id, post_id], function (err, results, fields) {
        if (!err) {
            console.log("attachLike success", results)
            done(true, results)
        } else {
            console.log("attachLike had an error", err)
            done(false, err)
        }
    })
}
function getLikes(user_id, obj) {
    let sql = `
    SELECT user_id, timestamp
    FROM likes
    WHERE post_id = ? AND active = true`
    conn.query(sql, [obj.id], function (err, results, fields) {
        if (!err) {
            obj.likeCount = results.length
            obj.likes = { 'likes': results }
            if (results.findIndex(function (item) {
                return item.id == user_id
            }) > -1) {
                obj.liked = true
            }
            console.log("getLikes", obj)
            return obj
        } else {
            console.log("getLikes had an error", err)
            return null
        }
    })
}
function chainGetLikes(post_obj_arr, user_id) {
    return new Promise(function(resolve,reject){
        let arr_promise = post_obj_arr.map(function(item){
            return getLikesPromise(item,user_id)
        })
        let arr_results = Promise.all(arr_promise)
        console.log(arr_results)
        arr_results.then(resolve)
    })
    
}
function getLikesPromise(post_obj, user_id) {
    return new Promise(function (resolve, reject) {
        let sql = `
        SELECT *
        FROM likes
        JOIN users On likes.user_id=users.id
        WHERE post_id = ? AND active = true
        `
        conn.query(sql, [post_obj.id], function (err, results, fields) {
            if (!err) {
                post_obj.likeCount = results.length
                post_obj.likes = results
                if (results.findIndex(function (item) {
                    return item.user_id == user_id
                }) > -1) {
                    post_obj.liked = true
                }
                resolve(post_obj)
            }
            else {
                console.log("getLikesPromise has an error", err)
                reject(err)
            }
        })
    })
}

module.exports = {
    attachLike: attachLike,
    getLikes: getLikes,
    getLikesPromise: getLikesPromise,
    chainGetLikes: chainGetLikes
}