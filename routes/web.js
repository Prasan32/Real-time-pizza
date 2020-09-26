
const homeController=require('../app/http/controllers/homeController');
const authController=require('../app/http/controllers/authController');
const cartController=require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const AdminOrderController=require('../app/http/controllers/admin/orderController')

//middleware
const guest=require('../app/http/middlewares/guest');
const auth=require('../app/http/middlewares/auth')
const admin=require('../app/http/middlewares/admin')

function initRoutes(app){

    app.get('/',homeController().index)

    // auth routes
    app.get('/login',guest,authController().login)
    app.post('/login',guest,authController().postLogin)
    app.get('/register',guest,authController().register)
    app.post('/register',guest,authController().postRegister);
    app.post('/logout',authController().logout)

    //cart routes
    app.get('/cart',cartController().index)
    app.post('/update-cart',cartController().update)
    
    //cutomer order routes
    app.post('/orders',auth,orderController().store)
    app.get('/customer/orders',auth,orderController().index)

    //admin routes
    app.get('/admin/orders',admin,AdminOrderController().index)
    
}

module.exports=initRoutes;