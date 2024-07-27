// import  {router,navigateTo}   from "./router.js";


import Home from "/static/views/Home.js";
import Profile from "/static/views/Profile.js";
import Settings from "/static/views/Settings.js";
import Login from "/static/views/Login.js"
import Register from "/static/views/Register.js";
import Logout  from "/static/views/Logout.js";
import Friends from "/static/views/Friends.js";
import Games from "/static/views/Games.js";
import Tournament from "/static/views/Tournament.js";
import Leaderboard from "/static/views/Leaderboard.js";
// import Friends  from "/views/Friends.js";

export const navigateTo = url => {
    history.pushState(null ,null,url);
    router();
}

export const router = async () => {
    const routes = [
        {path:"/home",view: Home},
        {path:"/profile",view: Profile},
        {path:"/settings",view:Settings},
        {path:"/login",view:Login},
        {path:"/register",view:Register},
        {path:"/logout",view:Logout},
        {path:"/friends",view:Friends},
        {path:"/games",view:Games},
        {path:"/tournament",view:Tournament},
        {path:"/leaderboard",view:Leaderboard},
    ];
    const potentialMatches = routes.map(route => {
        return {
            route:route,
            isMatch :location.pathname === route.path,
        };
    });
    let match = potentialMatches.find(potentialMatche => potentialMatche.isMatch);
    if(!match){
        match ={
            route : routes[0],
            isMatch: true
        } 
    }
    var view = await new match.route.view();
    document.querySelector(".sidebar").innerHTML = await view.getSidebar();
    document.querySelector(".content").innerHTML = await view.getHtml();
    console.log("\n ***** index afterRender ****** \n");
    view.afterRender();
};


window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded",()=>{

    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]") || e.target.closest("[data-link]")) {
            e.preventDefault();
            const linkElement = e.target.closest("a");
            if (linkElement) {
                console.log("data-linkxx")
                tokenIsValid(linkElement.href)
            }
        }
    });
    // router();
})

 const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    console.log("entere here ")
    const response = await fetch('/api/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();
    if (response.ok) {

        localStorage.setItem('access_token', data.access);
    } else {

        console.error('\n\n\n\nFailed to refresh token', data,"\n\n\n\n\n");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigateTo('/login');
    }
};

// Call refreshAccessToken periodically
// refreshAccessToken();
// setInterval(refreshAccessToken, 18 * 60 * 1000); // Refresh every 15 minutes

const tokenIsValid = async (pathname) => {
    const accessToken = localStorage.getItem('access_token');

    if(!accessToken)
    {
        navigateTo("/login"); 
        return ;  
    }
    const response = await fetch(`/api/protected/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        console.log("Token is valid.");
        navigateTo(pathname);
    } else {
        console.warn("Token is invalid. Attempting to refresh.");
        await refreshAccessToken();
        const retryResponse = await fetch(`/api/protected/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        });

        if (retryResponse.ok) {
            console.log("Token refreshed and retry successful.");
            navigateTo(pathname);
        } else {
            console.error("Failed to refresh token and retry.", retryResponse);
            navigateTo("/login");
        }
    }
};

if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
    document.addEventListener('DOMContentLoaded', tokenIsValid(location.pathname));
}

// FETCH PROTECETD DATA TO TEST TOKEN-----------------------------------------------