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
      butn1.addEventListener("click" , this.chooseTournament.bind(this, 4, 'update'));
      butn1.addEventListener("mouseover" , this.tourn_hover.bind(this, 'trn4', 4));
      butn1.addEventListener("mouseout" ,this.tourn_out.bind(this, 'trn4', 4));
      
      butn2 = document.getElementById("trn8");
      console.log(butn2)
      butn2.addEventListener("click" , this.chooseTournament.bind(this, 8, 'update'));
      butn2.addEventListener("mouseover" , this.tourn_hover.bind(this, 'trn8', 8));
      butn2.addEventListener("mouseout" ,this.tourn_out.bind(this, 'trn8', 8));
    }
  }

  async tourn_hover(element_id, plyrs_num, event){
    const domc = document.getElementById(element_id);
    if (domc.contains(event.fromElement))
      return;
    // console.log("_________________");
    // console.log(event);
    // console.log("_________________");

    var url = `/tournament/tourn_hover/?trn_size=${plyrs_num}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok){
      const data = await response.text();
      var trn_data = JSON.parse(data);
      if (trn_data.created == 'true')
        this.trn_data(element_id, trn_data);
      else{
        var content = `
          <div id='no_trn'>
            <h1>No Tournament Available click to create a new Tournament</h1>
          </div>
        `;
        document.getElementById(element_id).innerHTML = content
      }
    }
    else{
      console.log('!!!!!!!!!!!----ERROR----!!!!!!!!!!!')
    }
  }
  
  trn_data(element_id, trn_data){
    var content = '';
    var players = trn_data.players;
    var unknown = trn_data.unknown;
    for (const player of players)
      content += `
        <img src="${player.image_url}" height="80" class="player_img">
    `;
    for (let i = 0 ; i < unknown; i++)
      content += `
      <img src="media/unkonu_p.png" height="80" class="player_img">
    `;

    content = `<div class='container1' id='trn_info'>  ${content} </div>`;
    document.getElementById(element_id).innerHTML = content;

  }

  tourn_out(element_id, plyrs_num, event){
    const domc = document.getElementById(element_id);
    if (domc.contains(event.toElement))
      return;
    // console.log("_________________");
    // console.log(event);
    // console.log("_________________");
    var content = `
      <h1>Tournament Of ${plyrs_num} Players</h1>
    `;
    document.getElementById(element_id).innerHTML = content;
  }

  async chooseTournament(plyrs_num, task){
    
    var content = "";
    var url = `/tournament/api/?trn_size=${plyrs_num}`;
    
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

        if (data.type == 'tourn')
          content = this.updatePlayer(data, task);
        if (data.type == 'matche')
          this.display_matche(data);
        
      }else
      {
        content = "error";
      }
      
      // WEB SOCKET //
      if (joined == false | socket == null){
        socket = new WebSocket('ws://'+ window.location.host +`/ws/tourn/?size=${plyrs_num}`)
        socket.onmessage = e =>{
          const trn_data = JSON.parse(e.data);
          console.log("SSSSSSocket type: =====>",data.type);
          if (trn_data.type == 'tourn')
            this.updatePlayer(trn_data);
          if (trn_data.type == "matche")
            this.display_matche(trn_data);
        };
      }
      return content;
  }

  generateTournChoiceHtml()
  {
    return `
      <div class="button-trn box1 rounded-5" id="trn4">
        <h1 id='trn_info'>Tournament Of 4 Players</h1>
      </div>
      <div class="button-trn box1 rounded-5" id="trn8">
          <h1>Tournament of 8 Players</h1>
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

  updatePlayer(data, task) {
    var content = "";
    console.log('++++++++++ update_tourn ++++++++++');
    var players = data.players;
    var unknown = data.unknown;
    for (const playr of players)
      content += this.generatePlayerHTML(playr);
    for (let i = 0 ; i < unknown; i++)
      content += this.generatePlaceholderHTML();

    content = `
      <h3>Welcome in tournament <span class='cg'> ${data.trn_name} </span></h3>
      <div class='container1'>  ${content} </div>`;
    ;
    if (task == 'update'){
      document.getElementById('trn').innerHTML = content;
    }
    else
      return content;
  }
  
  display_matche(data){
    var matches = data.matches;
    var content = "";
    var id = this.data.user.id;
    for (const matche of matches){
      if (matche.p1_pr_id == id | matche.p2_pr_id == id)
        content = this.generateMatcheHtml(matche);
    }
    
    content = `
    <h3>Welcome in tournament <span class='cg'> ${data.trn_name} </span></h3>
    <div class='container1'>  ${content} </div>`;
    document.getElementById('trn').innerHTML = content;
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
        content = await this.chooseTournament(data.trn_size, 'return');
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

