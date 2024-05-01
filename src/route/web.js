import express from "express";
import homecontroller from "../controllers/homecontroller";
import userController from "../controllers/userController";
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homecontroller.homePage);
    router.get('/about', homecontroller.aboutPage);
    router.get('/crud', homecontroller.crudPage);
    router.post('/post-crud', homecontroller.postCrud);
    router.get('/get-crud', homecontroller.getCrud);
    router.get('/update-crud', homecontroller.putCrud);
    router.post('/updated-crud', homecontroller.updatingCrud);
    router.get('/delete-crud', homecontroller.deleteCrud);




    router.post('/api/login', userController.handleLogin);
    router.get('/api/user-manage', userController.userCRUD);
    router.post('/api/add-new-user', userController.addNewUser);
    router.delete('/api/delete-user', userController.deleteUser);
    router.put('/api/put-user', userController.putUser);
    return app.use("/", router);
}
module.exports = initWebRoutes;
