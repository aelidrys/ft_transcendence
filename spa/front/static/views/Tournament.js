import AbstractView from "../js/AbstractView.js";

var butn1 = null;
var butn2 = null;
var joined = false;
var socket = null;

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Tournament");
    this.pageTitle = "TOURNAMENT";  
  }

  async afterRender()
  {
    if (joined == false){
      console.log('%%%%%%% AFTER RANDER %%%%%%%%%%')
      butn1 = document.getElementById("trn4");
      console.log(butn1)
      butn1.addEventListener("click" ,this.chooseTournament.bind(this, 4, "NO"));
      
      butn2 = document.getElementById("trn8");
      console.log(butn2)
      butn2.addEventListener("click" ,this.chooseTournament.bind(this, 8, "NO"));
    }
  }

  async chooseTournament(players){
    // WEB SOCKET //
    
    var content = "";
    // console.log(`Tournament of ${players} players selected.`);
    var url = '/tournament/api/?trn_size=4'
    if (players == 8)
      url = '/tournament/api/?trn_size=8';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.data)
    });

    if (response.ok)
      {
        const resp_data = await response.text();
        var data = JSON.parse(resp_data);

        if (data.type == 'tourn'){
          
          for (const player of data.players) 
            content += this.generatePlayerHTML(player);
          
          for (let i = 0; i < data.unknown; i++)
            content += this.generatePlaceholderHTML();
        }
        if (data.type == 'matche'){
          var matches = data.matches;
          var id = this.data.user.id;
          for (const matche of matches){
            if (matche.p1_pr_id == id | matche.p2_pr_id == id)
              content = this.generateMatcheHtml(matche);
          }
        }
          // this.display_matche(data);
        
        
        
      }else
      {
        content = "error";
      }

      if (joined == false | socket == null){
        socket = new WebSocket('ws://'+ window.location.host +`/ws/tourn/?size=${players}`)
        socket.onmessage = e =>{
          const trn_data = JSON.parse(e.data);
          console.log("888888888 ",data.type," 8888888888");
          if (trn_data.type == 'tourn')
            this.updatePlayer(trn_data);
          if (trn_data.type == "matche")
            this.display_matche(trn_data);
        };
      }

      content = `
      <h3>Welcome in tournament <span class='cg'> ${data.trn_name} </span></h3>
      <div class='container1'>  ${content} </div>`
    document.getElementById('trn').innerHTML = content;
  }

  generateTournChoiceHtml()
  {
    return `
      <div class="button-card box1 rounded-5" id="trn4">
        <h1>Tournament Of 4 Players</h1>
        <h1> mode : online</h1>
      </div>
      <div class="button-card box1 rounded-5" id="trn8">
        <h1>Tournament of 8 Players</h1>
        <h1> mode : online</h1>
      </div>
      `;
  }

  generatePlayerHTML(player)
  {
      return `
      <div class="data">
          <img src="${player.image_url}" alt="No image" width="140" class="player_img">
          <h3>${player.username}</h3>
      </div>
    `;
  }

  generatePlaceholderHTML() {
    return `
        <div class="data">
            <img src="media/unkonu_p.png" alt="No image" width="140" class="player_img">
            <h3>waiting player...</h3>
        </div>
    `;
  }

  generateMatcheHtml(matche) {
    return `
    <div class='matche'>
      <div class='player1'>
       <img src='${matche.p1_img}' alt="No image" width="140" class="player_img">
       <h3>${matche.p1_name}</h3>
      </div>
      <div class='player2'>
       <img src='${matche.p2_img}' alt="No image" width="140" class="player_img">
       <h3>${matche.p2_name}</h3>
      </div>
    </div>
    `
  }

  updatePlayer(data) {
    var content = "";
    console.log('++++++++++ update_tourn ++++++++++');
    var players = data.players;
    var unknown = data.unknown;
    for (const playr of players)
      content += this.generatePlayerHTML(playr);
    for (let i = 0 ; i < unknown; i++)
      content += this.generatePlaceholderHTML();
    document.querySelector('.container1').innerHTML = content;
  }
  
  display_matche(data){
    var matches = data.matches;
    var content = "";
    var id = this.data.user.id;
    for (const matche of matches){
      if (matche.p1_pr_id == id | matche.p2_pr_id == id)
        content = this.generateMatcheHtml(matche);
    }
    document.querySelector('.container1').innerHTML = content;
  }

  async getHtml() {
    await this.setPayload();
    await this.setData();
    
    var content = "";
    const req_data = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.data),
    }
    const url = '/tournament/is_inTourn/';
    const response = await fetch(url, req_data);
    if (response.ok){
      const resp_data = await response.text();
      var data = JSON.parse(resp_data);
      if (data.intourn == 'yes'){
        content += this.chooseTournament(data.trn_size, "YES");
        joined = true;
      }
      else{
        content += this.generateTournChoiceHtml();
      }
    }
    else
      console.log("!!!!!!!!! ERROR !!!!!!!!!");

  
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

    <div id="trn">
      ${content}
      </div>
      `;

      

  }
  

}

