export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client && to.path !== "/login") {
        const isAuthenticated = localStorage.getItem("loginInfo");
        if (!isAuthenticated) {
            localStorage.removeItem("loginInfo");
            return navigateTo("/login");
        }
    }
});
