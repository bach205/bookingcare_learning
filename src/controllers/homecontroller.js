import db from '../models/index';
import CRUDService from '../service/CRUDService';

const homePage = async (req, res) => {
    let data = await db.User.findAll();
    return res.render('home.ejs', {
        data: JSON.stringify(data)
    })

}
const aboutPage = (req, res) => {
    return res.render('test/about.ejs');
}
const crudPage = (req, res) => {
    return res.render('crud.ejs');
}
const postCrud = async (req, res) => {
    await CRUDService.createNewUser(req.body);
    res.send('<script>alert("create account success");</script>');
    res.render('home.ejs');
}
const getCrud = async (req, res) => {
    let user = await CRUDService.getAllUsers();
    return res.render('post-crud.ejs', {
        user: user,
    });
}
const putCrud = async (req, res) => {
    let id = req.query.id;
    let user = await CRUDService.getUserInfo(id);
    return res.render('update-crud.ejs', {
        user: user,
    });
}
const updatingCrud = async (req, res) => {
    let userData = req.body;
    await CRUDService.updatedUser(userData);
    let user = await CRUDService.getAllUsers();
    return res.render('post-crud.ejs', {
        user: user,
    });
}
const deleteCrud = async (req, res) => {
    let id = req.query.id;
    await CRUDService.deleteUser(id);
    let user = await CRUDService.getAllUsers();
    return res.render('post-crud.ejs', {
        user: user,
    });
}
module.exports = {
    homePage: homePage,
    aboutPage: aboutPage,
    crudPage: crudPage,
    postCrud: postCrud,
    getCrud: getCrud,
    putCrud: putCrud,
    updatingCrud: updatingCrud,
    deleteCrud: deleteCrud,
}