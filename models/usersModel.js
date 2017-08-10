const conn = require('./dbModel.js')
const bcrypt = require('bcryptjs');

function checkPassword(username,password,done){
    let sql  = `
    SELECT passwordHash
    FROM users
    WHERE username = ?
    `
    conn.query(sql,[username],function(err,results,fields){
        let passwordHash = results[0].passwordHash
        if(!err){
            if(bcrypt.compareSync(password, passwordHash)){
                console.log("Hashes match!")
                done (true,username)
            }else {
                done (false,null)
            }
        }else {
            console.log(err)
            done (false, err)
        }
    })
}

function createUser(username,password,displayName,done){
    const hash = bcrypt.hashSync(password, 8);
    let sql = `
    INSERT INTO users (username,passwordHash,displayName)
    VALUES (?,?,?)
    `
    conn.query(sql,[username,hash,displayName],function(err,results,fields){
        if(!err){
            console.log("results",results)
            console.log("hash",hash)
            done (true,username)
        }else {
            console.log(err)
            done (false,err)
        }
    })
}

module.exports = {
    createUser : createUser,
    checkPassword : checkPassword
}
