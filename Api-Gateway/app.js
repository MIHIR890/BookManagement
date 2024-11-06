const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
//defining routes and their ports
const routes = {
    '/register' : 'http://localhost:3000/',
    '/login': 'http://localhost:3000/',
    


}

//create a proxy for each route
for(const route in routes){
    const target = routes[route];
    app.use(route, createProxyMiddleware({target}));
}
//Port number
const PORT = 8000;
app.listen(PORT, ()=> {
    console.log("API GATEWAY STARTED");
})