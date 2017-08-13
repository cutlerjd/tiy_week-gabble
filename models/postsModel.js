const conn = require('./dbModel.js')
const Likes = require('./likesModel.js')

function getAllPosts(id,done){
    let sql = `
    SELECT *
    FROM posts
    JOIN users ON posts.user_id=users.id
    WHERE active = 1
    ORDER BY timestamp DESC`
    conn.query(sql,function(err,results,fields){
        arr = Likes.chainGetLikes(results,id)
        arr.then(function(data){
            return identifyOwner(data,id)
        }).then(done)
    })
}
function createPost(id,text,done){
    let sql = `
    INSERT INTO posts (user_id,postcontents)
    VALUES (?,?)
    `
    conn.query(sql,[id,text],function(err, results, fields){
        if(!err){
            console.log("createPost posting was successful",results)
            done (true, results)
        } else{
            console.log("createPost was not sucessful",err)
            
            done (false, err)
        }
    })
}
function deletePost(id,done){
    let sql = `
    UPDATE posts
    SET active = false
    WHERE id = ?`
    conn.query(sql,[id],function(err,results,fields){
        if(!err){
            done(true,results)
        }else{
            done(false,err)
        }
    })
}
function identifyOwner(arr,id){
    return new Promise(function(resolve,reject){
        arr.forEach(function(item){
            if(item.user_id == id){
                item.owner = true
            }
        })
        resolve (arr)
    })
}
module.exports = {
    getAllPosts: getAllPosts,
    createPost: createPost,
    deletePost: deletePost
}