import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

export default createRouter({
    routes, // routes: routes
    history: createWebHistory(), // we can create two types of history: createWebHistory() and createWebHashHistory()
    linkActiveClass: 'active', // this will add the class active to the active link
});

// hasHistory will make our url like this -> /#/tasks