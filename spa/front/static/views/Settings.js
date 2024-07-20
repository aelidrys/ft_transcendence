import AbstractView from "../js/AbstractView.js";
import { navigateTo } from "../js/index.js";


export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Settings");
        this.pageTitle = "SETTINGS";

    //     this.setHead(`   <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>Pingpong</title>
    //     <link rel="stylesheet" href="/static/css/bootstrap.min.css" />
    //     <link rel="stylesheet" href="/static/css/all.min.css" />
    //     <link rel="stylesheet" href="/static/css/master.css" />
    
    //     <link rel="preconnect" href="https://fonts.googleapis.com">
    // <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    // <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Jaro:opsz@6..72&family=Rakkas&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Shojumaru&family=Titan+One&display=swap" rel="stylesheet">
    
    // `) 
   }

    async getHtml() {
        await this.setPayload();
        await this.setData();
        console.log("payload   in html ", this.payload);
        return `
        <header class="headbar w-100  align-items-center justify-content-between  p-4">
        <div class="search position-relative">
      <input type="search" class="p-2  ps-5 rounded-3" placeholder="Type A Keyword">
    </div>
    <div class="icons d-flex align-items-center  ">
      <span class="notf postion-relative">
      <i class="fa-solid fa-bell fa-lg"></i>
    </span>
    <img src="${this.data.avatar}" class=" ms-3" alt="">
  </div>
</header>


<div class="settings-all d-grid     rounded-4 ms-3 me-3 mt-5 ">
    <div class="boxsett-1 d-flex justify-content-between">
        <div class="t-sett d-flex align-items-center">
            <h1> UserInfo </h1>
            <i class="fa-solid fa-user  fa-fw"></i>
        </div>
        <form method="post"  action="" class=" userinfo w-75 d-flex align-items-center">

              <div class="form-group m-3">
                  <label   class="small mb-1">Username:</label>
                      <input type="text" name="username" value="${this.data.user.username}" class="form-control" maxlength="100" required="" id="id_username">
                  <label class="small mb-1">Email:</label>
                      <input type="text" name="email" value="${this.data.user.email}" class="form-control" maxlength="320" required="" id="id_email">
              </div>
              <br><br>
              <button type="submit" class="btn btn-dark btn-lg">Save Changes</button>
              <button type="reset" class="btn btn-dark btn-lg">Reset</button>
              </form>

</div>
<div class="settings-all d-grid     rounded-4 ms-3 me-3 mt-5 ">
    <div class="boxsett-1 d-flex justify-content-between">
        <div class="t-sett d-flex align-items-center">
            <h1> Profile </h1>
            <i class="fa-solid fa-user  fa-fw"></i>
        </div>
            
            <form method="post"  action="" class="profileinfo w-75 d-flex align-items-center">

              <div class="form-group w-100 m-3">
                  <!-- <a href="#">Change Password</a>
                  <hr> -->
                  <label for="id_avatar" class="small mb-1">Change Avatar:</label>
                  <input type="file" name="avatar" class="form-control-file" accept="image/*" id="id_avatar">
                  <label class="small mb-1 w-100">Bio:</label> 
                  <textarea name="bio" cols="40" rows="5" class="form-control" required="" id="id_bio"  >${this.data.bio}</textarea>
              </div>
      <br><br>
      <button type="submit" class="btn btn-dark btn-lg">Save Changes</button>
      <button type="reset" class="btn btn-dark btn-lg">Reset</button>
  </form>
  </div>
        
        
        
            `;
    }
    async updateProfile(event){

        event.preventDefault();
        console.log("inside funstin update paylo",this.payload)
        let access_token = localStorage.getItem("access_token")
        const formdata = new FormData(event.target);
        // const data = Object.fromEntries(formdata.entries());

        try {
            const response = await fetch(`/api/profile/${this.payload.user_id}/`,
                {
                    method: 'PUT',
                    headers: {
                    'Authorization': `Bearer ${access_token}`
                    },
                    // body: JSON.stringify(data)
                    body: formdata
                }
            );
            
            const responseData = await response.json();
            if (response.ok) {
                console.log('Avatar updated successfully', responseData);
                navigateTo("/profile")
            } else {
                console.error('Update avatar failed', responseData);
            }

        } catch (error) {
            console.log("error :" ,error);
            
        }
    }

    async updateUser(event){
        event.preventDefault();
        console.log("inside funstin update paylo",this.payload)
        let access_token = localStorage.getItem("access_token")
        const formdata = new FormData(event.target);

        try {
            const response = await fetch(`/api/userupdate/`,
                {
                    method: 'PUT',
                    headers: {
                    'Authorization': `Bearer ${access_token}`
                    },
                    // body: JSON.stringify(data)
                    body: formdata
                }
            );
            
            const responseData = await response.json();
            if (response.ok) {
                console.log('Avatar updated successfully', responseData);
                navigateTo("/profile")
            } else {
                console.error('Update avatar failed', responseData);
            }

            } catch (error) {
                console.log("error :" ,error);
                
            }
        }

    afterRender() {
        document.querySelector(".profileinfo").addEventListener("submit",this.updateProfile.bind(this));
        document.querySelector(".userinfo").addEventListener("submit",this.updateUser.bind(this));
    }
}