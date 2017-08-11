const conn = require('./dbModel.js')

function getAllPosts(id,done){
    let sql = `
    SELECT *
    FROM posts
    WHERE active = 1`
    conn.query(sql,function(err,results,fields){
        let arr = identifyOwner(id,results)
        
        done(arr)
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
function identifyOwner(id,arr){
    arr.forEach(function(item){
        if(item.user_id == id){
            item.owner = true
        }
    })
    return arr
}
module.exports = {
    getAllPosts: getAllPosts,
    createPost: createPost
}