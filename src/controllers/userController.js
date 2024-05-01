import userService from '../service/userService';
const handleLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: '*please enter valid email or password',
            userInfo: {},
        })
    } else {
        let userData = await userService.checkUserRequest(email, password)
        if (userData.errCode == 0) {
            return res.status(200).json({
                errCode: userData.errCode,
                message: userData.message,
                userInfo: userData.userInfo ? userData.userInfo : {},

            })
        } else {
            return res.status(200).json({
                errCode: userData.errCode,
                message: userData.message,
                userInfo: userData.userInfo ? userData.userInfo : {},
            })
        }

    }
}

const userCRUD = async (req, res) => {
    let id = req.query.id;
    let user = await userService.getAllUser(id);
    return res.status(200).json({
        errCode: 0,
        message: 'ok',
        user,
    })
}

const addNewUser = async (req, res) => {
    let newUser = req.body;
    let status = await userService.createNewUser(newUser);
    res.status(200).json({
        status,
    })
}
const deleteUser = async (req, res) => {
    let userId = req.body.id;
    let status = await userService.handleDeleteUser(userId);
    res.status(200).json({
        errCode: status.errCode,
        message: status.message,
    })
}

const putUser = async (req, res) => {
    let userData = req.body;
    let status = await userService.handlePutUser(userData);
    res.status(200).json({
        status
    })
}
module.exports = {
    handleLogin: handleLogin,
    userCRUD: userCRUD,
    addNewUser: addNewUser,
    deleteUser: deleteUser,
    putUser: putUser,
}