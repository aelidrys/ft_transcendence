// Login.js
import AbstractView from "../js/AbstractView.js";
import { navigateTo } from "../js/index.js";
import { createSocketConnection } from "../js/utils.js";
export default class extends AbstractView {
    constructor() {
        super();
        console.log("Login constructor called");

        this.setTitle("Login");
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
    
    async getHtml() {
        return `
            <div class="container">
                <div class="login old-user"> 
                    <form class="login-input" action="" method="post">
                        <h1>SIGN IN</h1>
                        <input type="text" name="username" placeholder="username" required>
                        <input type="password" name="password" placeholder="password" required>
                        <input type="submit" class="signin" value="SIGN IN">
                    </form>
                    <a class="back-button switch-signup" href="/register">&lt; SIGN UP</a>
                    <div class="message-success">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <div class="message-error">
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </div>
                </div>
            </div>
        `;
    }

    async  loginUser(event) {

        event.preventDefault();
    
    
        console.log("entrer in login");
        const formdata = new FormData(event.target);
        const data = Object.fromEntries(formdata.entries());
    
       try {
            const response = await fetch(`/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                localStorage.setItem('access_token', responseData.access);
                localStorage.setItem('refresh_token', responseData.refresh);
                console.log('User login successfully', responseData);
                createSocketConnection();
                navigateTo("/home")// Redirect to home page after successful login
            } else {
                let msgerr = document.querySelector(".message-error");
                msgerr.innerHTML = `  <p><i class="fa-solid fa-triangle-exclamation"></i> ${responseData.detail}</p>`;
                msgerr.style.display = "block"; 
                console.error('Login failed', responseData);
            }
        } catch (error) {
            console.error('An err or occurred:', error);
        }
    }
   async getSidebar(){
        return ``;
    }
    afterRender(){
        document.querySelector(".login-input").addEventListener("submit", this.loginUser.bind(this));
    }
}
