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
let hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (erorr) {
            reject(erorr);
        }
    })
}
const createNewUser = async (data) => {
    let check = await checkEmail(data.email);
    let hashedPassword = hashUserPassword(data.password);
    if (check) {
        return {
            errCode: 1,
            message: 'your email is existed',
        }
    } else {
        newUser = await db.User.create({
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
        })
        return {
            errCode: 0,
            message: 'your account is create succesfully',
        }
    }
}
const checkEmail = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await db.User.findOne({
                where: { email } //{email: email}
            })
            resolve(check);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    checkUserRequest: checkUserRequest,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
}