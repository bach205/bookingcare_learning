import db from '../models/index';
import bcrypt from "bcryptjs";
let salt = bcrypt.genSaltSync(10);

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

    if (check) {
        return {
            errCode: 1,
            message: 'your email is existed',
        }
    } else {
        let hashedPassword = await hashUserPassword(data.password);
        await db.User.create({
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

const handleDeleteUser = async (id) => {
    try {
        let check = await db.User.destroy({
            where: { id },
        })
        if (check) return {
            errCode: 0,
            message: 'delete successfully',
        }; else return {
            errCode: 1,
            message: 'user have deleted already'

        }
    } catch (error) {
        return {
            errCode: 2,
            message: error.toString(),
        };
    }
}

const handlePutUser = async (data) => {
    let user = await db.User.findOne({
        where: { id: data.id },
    })
    let check = await checkEmail(data.email);
    if (check) {
        return {
            errCode: 1,
            message: 'your email is existed',
        }
    } else {
        if (user) {
            user.email = data.email;
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.address = data.address;
            await user.save();
            return {
                errCode: 0,
                message: 'update successfully',
            }
        }
        else return {
            errCode: 1,
            message: 'your user is not existed',
        }
    }


}
module.exports = {
    checkUserRequest: checkUserRequest,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    handleDeleteUser: handleDeleteUser,
    handlePutUser: handlePutUser,
}