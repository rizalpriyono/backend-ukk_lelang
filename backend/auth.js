const jwt = require("jsonwebtoken")
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY
const {response} = require('./helper/wrapper')

auth = (role1, role2, role3) => {
    let role = [role1, role2, role3]
    return (req, res, next) => {
        let header = req.headers.authorization
        let token = header && header.split(" ")[1]

        let jwtHeader = {
            algorithm: "HS256"
        }
        if (token == null) {
            return response(res, 'fail', '', 'Unauthorized', 401)
        } else {
            jwt.verify(token, SECRET_KEY, jwtHeader, (error, user) => {
                if (error) {
                    return response(res, 'fail', '', 'Invalid Token', 401)
                } else {
                    if (role.includes(user.level)) {
                        console.log(role);
                        req.user = user
                        // if(user.username == )
                        next()
                    }else{
                        return response(res, 'fail', '', 'You dont have access', 401)
                    }

                }
            })
        }
    }

}

module.exports = auth