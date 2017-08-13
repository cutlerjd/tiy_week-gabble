const conn = require('./dbModel.js')
const bcrypt = require('bcryptjs');

function authenticate(username, password, done) {
    let sql = `
    SELECT *
    FROM users
    WHERE username = ?
    `
    conn.query(sql, [username.toLowerCase()], function (err, results, fields) {
        if (!err) {
            if (results[0]) {
                let passwordHash = results[0].passwordHash
                if (bcrypt.compareSync(password, passwordHash)) {
                    let user = results[0]
                    console.log("Hashes match!")
                    done(null, user)
                } else {
                    console.log("bad pw")
                    done(null, false)
                }
            } else{
                console.log("bad username")
                done(null, false)
            }
        } else {
            console.log(err)
            done(err, null)
        }
    })
}

function createUser(username, password, displayName, done) {
    const hash = bcrypt.hashSync(password, 8);
    let sql = `
    INSERT INTO users (username,passwordHash,displayName)
    VALUES (?,?,?)
    `
    conn.query(sql, [username, hash, displayName], function (err, results, fields) {
        if (!err) {
            console.log("results", results)
            console.log("hash", hash)
            done(true, username)
        } else {
            console.log(err)
            done(false, err)
        }
    })
}
function findById(id, done) {
    console.log("findById was called")
    let sql = `
    SELECT *
    FROM users
    WHERE id = ?
    `
    conn.query(sql, [id], function (err, results, fields) {
        if (!err) {
            console.log("findByID no error")
            done(null, results[0])
        } else {
            console.log(err)
            done(err, null)
        }
    })
}
module.exports = {
    authenticate: authenticate,
    createUser: createUser,
    findById: findById
}
