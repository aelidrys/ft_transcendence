

// Login.js
import AbstractView from "../js/AbstractView.js";
import { navigateTo } from "../js/index.js";
export default class extends AbstractView {
    constructor() {
        super();

        // document.querySelector(".sidebar").style.display = "none";
        // document.querySelector("header").style.display = "none";
        console.log("RGISTER constructor called");
        this.setTitle("Register");
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
        return `<div class="container">
        <div class="login new-user ">
            <form class="register-input"   action="" method="post">
                <h1>SIGIN UP</h1>
                <input type="text" name="username" placeholder="username"  required>
                <input type="text" name="first_name" placeholder="first_name"  required>
                <input type="text" name="last_name" placeholder="last_name"  required>
                <input  type="password"  name="password1" placeholder="password1"  required>
                <input  type="password" name="password2" placeholder="password2"  required>
                <input  type="email" name="email"   placeholder="email"  required>
                <input  type="submit" class="sigin" value="SIGIN UP">
            </form>
            <a class="back-button switch-signup" href="/login">&lt; SIGN IN</a>
            <div class="message-error "> <i class="fa-solid fa-circle-exclamation"></i>
            </div>
        </div>
        </div>`
        ;
    }
    async  registerUser(event) {
        
        event.preventDefault();
        
        const formdata = new FormData(event.target);
        const data = Object.fromEntries(formdata.entries());
        
        console.log(data);
        for (const [key, value] of formdata) {
            console.log([key, value]);
        }
    
        try {
            const response = await fetch(`/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                console.log(responseData.token.access);
                navigateTo("/login");
                console.log('User registered successfully', responseData);
            } else {
                let msgerr = document.querySelector(".message-error");
                msgerr.style.display = "none"; 
                msgerr.innerHTML = ` <i class="fa-solid fa-triangle-exclamation"></i> <p>${Object.keys(responseData)[0]} : ${ Object.values(responseData)[0]}</p>`;
                msgerr.style.display = "block"; 
                console.error('Registration failed', responseData);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
 
    async getSidebar(){
        return ``;
    }
    
    afterRender(){
        document.querySelector(".register-input").addEventListener("submit", this.registerUser.bind(this));

    }
}