import AbstractView from "../js/AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Home");
    this.pageTitle = "HOME";
    // this.addSidebar();
   
//     this.setHead(`meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Pingpong</title>
//     <link rel="stylesheet" href="/static/css/bootstrap.min.css" />
//     <link rel="stylesheet" href="/static/css/all.min.css" />
//     <link rel="stylesheet" href="/static/css/master.css" />

//     <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Jaro:opsz@6..72&family=Rakkas&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Shojumaru&family=Titan+One&display=swap" rel="stylesheet">
// `);
   
    // document.querySelector(".sidebar").style.display = "block";
    // document.querySelector("header").style.display = "flex";
  
  
  }

 

  

  async getHtml() {

    await this.setPayload();
    await this.setData();
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
    
        <div class="wrapper d-grid  gap-2 m-3">
        <div class=" d-flex align-items-end justify-content-end box1 rounded-5"> 
         <img src="static/images/mhyb.png" alt="">
         </div>
         <div class=" d-flex align-items-end justify-content-end box3 rounded-5"> 
          <img src="static/images/yppi.png" alt="">
          </div>
        <div class=" d-flex align-items-end justify-content-between box2 rounded-5 ">
          
          <img src="static/images/droitvs.png" alt="">
          <div class="text-center m-2">

            <h3>Pingpong</h3>
            <p class=" m-3">Welcome to the pingpong world come join us for a game!</p>
            <div class="play-now">
              <a class="text-center btn " href="/games"><i class="fa-solid fa-play"></i>
                <span> PlayNow</span></a>
              </div>
          </div>
            <img src="static/images/qauchevs.png" alt="">
        
        </div>
    </div>
    `
      ;
  }
}