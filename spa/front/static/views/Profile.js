import AbstractView from "../js/AbstractView.js";
// import { } from "../js/router.js";
import { navigateTo } from "../js/index.js";
export default class extends AbstractView {
  constructor() {
    super();
    console.log("profile constructer called \n\n");
    this.setTitle("Profile");

    this.pageTitle = "PROFILE";

 }

 async setData() {
  try {
    let access_token = localStorage.getItem('access_token');

    const response = await fetch(`/api/profile/${this.payload.user_id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch profile data');
    }

    const responseData = await response.json();
    this.data  = responseData;

    console.log('Profile data:', responseData);
    console.log('here  data:\n\n\n\n', this.data);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}


  
async getHtml() {

    await this.setPayload();
    await this.setData();
    console.log("payload", this.payload);
    console.log("data", this.data);


  console.log("in html data \n\n\n\n",this.data);
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

    <div class="pr-welcome m-2 d-flex justify-content-between">
    <p>  <i class="fa-solid fa-user  fa-fw"></i> Welcome,${this.data.user.username} </p> 
      <div class="btn-settings">  <i class="fa-solid fa-gear"></i></div>
  </div>
<div class="user-profile d-grid   gap-2  rounded-4 ms-3 me-3 mb-2 ">
  <div class="position-relative avatar-profile d-flex justify-content-around flex-wrap align-items-center">

    
    <div class="position-absolute top-0 start-50 translate-middle image-container">
      <img class=" avatar " src="${this.data.avatar}" alt="">
      <span><i class="fa-solid fa-pencil"></i></span>
    </div>
      <form class="form-avatar"  action="" method="post">
            <input type="file" name="avatar" class="form-control-file" accept="image/*" id="id_avatar">                   
    </form>
      

    <div class="pr-name w-60 text-center">
      <p class="mt-5   text-uppercase fst-italic fw-bold">${this.data.user.username}</p>
      <p class="mt-5   text-uppercase fst-italic fw-bold">${this.data.user.email}</p>
    </div>
  </div>
  <div class="level-profile d-flex justify-content-center  flex-column m-5">
    <h4>Level 25</h4>    
    <div class="progress rounded-4 position-relative overflow-visible">
      <span class="w-25 rounded-4 "></span>
    </div>
    
  </div>
</div>

        `;
  }


  async updateProfile(file) {
    console.log("enter herer \n\n\n\n\n\n")
    let access_token = localStorage.getItem('access_token');
    const formData = new FormData();
        formData.append('avatar', file);
        // const data = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(`/api/profile/${this.payload.user_id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                // body: JSON.stringify(data)
                body: formData
            });

            const responseData = await response.json();
            if (response.ok) {
              
                console.log('Avatar updated successfully', responseData);
                // refreshAccessToken();
                navigateTo("/profile")
            } else {
                console.error('Update avatar failed', responseData);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
}

  afterRender() {
    const imageContainer = document.querySelector('.image-container');
    let avatar = document.querySelector(".avatar");
    let changeimg = document.querySelector(".form-control-file");

    imageContainer.onclick = function () {
        changeimg.click();
    };

    changeimg.onchange = () => {
      const file = changeimg.files[0];
      this.updateProfile(file);
  };

    imageContainer.addEventListener('mouseenter', () => {
        avatar.style.filter = "blur(5px)";
    });

    imageContainer.addEventListener('mouseleave', () => {
        avatar.style.filter = 'none';
    });

}
}