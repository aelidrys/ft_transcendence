import AbstractView from "../js/AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Leaderboard");
    this.pageTitle = "LEADERBOARD";
    
//      this.setHead(`   <meta charset="UTF-8">
//      <meta name="viewport" content="width=device-width, initial-scale=1.0">
//      <title>Pingpong</title>
//      <link rel="stylesheet" href="/static/css/bootstrap.min.css" />
//      <link rel="stylesheet" href="/static/css/all.min.css" />
//      <link rel="stylesheet" href="/static/css/master.css" />
 
//      <link rel="preconnect" href="https://fonts.googleapis.com">
//  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Jaro:opsz@6..72&family=Rakkas&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Shojumaru&family=Titan+One&display=swap" rel="stylesheet">
 
//  `)  
  }

  async getHtml() {
    return `        
        <div class="wrapper d-grid  gap-2 m-3">
        <div class=" d-flex align-items-end justify-content-end box1 rounded-5"> 
         <img src="/image/mhyb.png" alt="">
         </div>
         <div class=" d-flex align-items-end justify-content-end box3 rounded-5"> 
          <img src="/image/yppi.png" alt="">
          </div>
        <div class=" d-flex align-items-end justify-content-between box2 rounded-5 ">
          
          <img src="image/droitvs.png" alt="">
          <div class="text-center m-2">

            <h3>Pingpong</h3>
            <p class=" m-3">Welcome to the pingpong world come join us for a game!</p>
            <div class="play-now">
              <a class="text-center btn " href="games.html"><i class="fa-solid fa-play"></i>
                <span> PlayNow</span></a>
              </div>
          </div>
            <img src="image/qauchevs.png" alt="">
        
        </div>
    </div>
    `
      ;
  }
}