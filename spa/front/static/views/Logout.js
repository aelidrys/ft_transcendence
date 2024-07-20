// Login.js
import AbstractView from "../js/AbstractView.js";
import { closeSocketConnection } from "../js/utils.js";
export default class extends AbstractView {
    constructor() {
        super();
        console.log("log out constructor called");
        // document.querySelector(".sidebar").style.display = "none";
        // document.querySelector("header").style.display = "none";

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        closeSocketConnection();
        this.setTitle("Logout");
        this.setHead(`
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!-- Main Template css file -->
            <link rel="stylesheet" href="/static/css/style.css">
            <!-- Render all elements normally -->
            <link rel="stylesheet" href="/static/css/normalize.css">
            <!-- Font Awesome Library -->
            <link rel="stylesheet" href="/static/css/all.min.css" />
            <!-- Google Fonts -->
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
                href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@200;300;400;500;600;700;800&display=swap"
                rel="stylesheet"
            />
        `);
    }
    async getSidebar(){
        return ``;
    }
    async getHtml() {
        return `
            <div class="container">
             <div class="logout">
                <h1>Logout successful! <i class="fa-solid fa-circle-check"></i></h1>
                 
                <img class="by" src="/static/image/by.jpeg" alt="">
                <button><a href="/login" data-link ="">Login again</a></button>
            </div>

            </div>
        `;
    }
}
