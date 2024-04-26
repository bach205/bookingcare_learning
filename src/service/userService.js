import db from '../models/index';
import bcrypt from "bcryptjs";


const checkUserRequest = async (email, password) => {
    let userData = {};
    let user = new Promise(async (resolve, reject) => {
        try {
            let userId = await db.User.findOne({
                attributes: ['email', 'password', 'roleId'],
                where: { email: email },
                raw: true,
            })
            resolve(userId);
        } catch (error) {
            reject(error);
        }
    })
    let userInfo = await user;
    if (await user) {
        if (bcrypt.compareSync(password, userInfo.password)) {
            userData.errCode = 0;
            userData.message = "OK";
            delete userInfo.password;
            userData.userInfo = userInfo;
        } else {
            userData.errCode = 3;
            userData.message = '*your password is wrong';
        }
        return userData;
    } else {
        userData.errCode = 2;
        userData.message = '*your email is not exist';
        return userData;
    }
}

const getAllUser = async (userId) => {
    let user;
    if (userId === 'ALL') {
        user = await db.User.findAll({
            raw: true,
            attributes: {
                exclude: ['password'],
            }
        })
        return user;
    } else if (userId && userId !== 'ALL') {
        user = await db.User.findOne({
            where: { id: userId },
            raw: true,
            attributes: {
                exclude: ['password'],
            }
        })
        return user;
    }

}



module.exports = {
    checkUserRequest: checkUserRequest,
    getAllUser: getAllUser,
}