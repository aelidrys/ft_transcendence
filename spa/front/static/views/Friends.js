import AbstractView from "../js/AbstractView.js";
import { navigateTo } from "../js/index.js";
export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Friends");
    this.pageTitle= "FRIENDS";
  }

  async getHtml() {
    await this.setPayload();
    await this.setData();
    await this.setDataProfiles();
    await this.setDataFriendRequest();
    this.myprofile = await this.getProfileById(this.payload.user_id);
    console.log("freindes request ",this.friendsreq );


    let  texthtml =`    <header class="headbar w-100  align-items-center justify-content-between  p-4">
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
  <div class="message-success">
  <i class="fa-solid fa-circle-check"></i>
</div>
<div class="message-error">
  <i class="fa-solid fa-circle-exclamation"></i>
</div>

<div class="message-info">
  <i class="fa-solid fa-circle-exclamation"></i>
</div>`;


   texthtml += this.allUserHtml();
   texthtml += this.allFriendRequestHtml();
   texthtml += this.allUserFriendsList();
    return texthtml;
}


async checkUesr(profile,username)
{
  
}
allUserHtml(){
  let texthtml = `
  <div class="send-request-friend">
      <div class="t-sett d-flex align-items-center">
          <h1> Add new Friends </h1>
          <i class="fa-solid fa-user-plus"></i>
      </div>
      <ul class="d-grid">`;

  let added= ``;


  for (let profile of this.profiles) {

    if (profile.user.id != this.payload.user_id) {
      
      console.log(`ID: ${profile.user.id}`);
      console.log(`Username: ${profile.user.username}`);
      console.log('----------------------------------');
      console.log('----------------------------------',this.myprofile.friends);
      if (this.myprofile.friends.find(e => e.username === profile.user.username) === undefined) {

          let reqsend = this.mysendreq.find(e =>e.receiver.username === profile.user.username) ;
          let reqrecive = this.friendsreq.find(e => e.sender.username === profile.user.username);
        if (reqsend !== undefined) {
          added = `
          <div class="play-now addf" data-id="${profile.user.id}">
            <a class="text-center btn">
              <i class="fa-solid fa-user-check"></i>
              <span> ADDED</span>
            </a>
          </div>
          <div class="play-now  deletef" data-id="${reqsend.id}" >
            <a class="text-center btn decline"><i class="fa-solid fa-user-xmark"></i>
              <span> Cancel add </span></a>
          </div>     

          `         ;
        }
        else if (reqrecive !== undefined){
            added = `          <div class="play-now acceptf  " data-id="${reqrecive.id}">
            <a class="text-center btn" ><i class="fas fa-check"></i>
                <span> ACCPET</span></a>
            </div>`;
        }
        else {
          added = `<div class="play-now addf" data-id="${profile.user.id}">
                <a class="text-center btn">
                  <i class="fa-solid fa-user-plus"></i>
                <span> ADD</span>
              </a>
            </div>
            
            `
        }
        texthtml += `
        <li class="d-flex justify-content-between">
                <img src="${profile.avatar}" alt="">

                
                  ${added}

                <p class="w-100">${profile.user.username}</p>
                </li>`;
              }
              
            }
        }
    texthtml += `
    </ul>
</div>`;
    return texthtml;

}


getProfileById(id) {
  return this.profiles.find(profile => profile.user.id === id);
}


allUserFriendsList(){
  let texthtml = `
  <div class="send-request-friend  accept-request-friend  ">
  <div class="t-sett d-flex align-items-center">
      <h1> My Friends</h1>
      <i class="fas fa-user-friends"></i>
  </div>
  <ul class="d-grid">
`;


const profile = this.getProfileById(this.payload.user_id);

if (profile) {
  console.log("PROFILE      :", profile); 
} else {
  console.log('Profile not found');
}



console.log("PROFILE     fffffffff :", profile.friends); 
let status = "";
  for (let friend of profile.friends) {


      
      console.log(`ID: ${friend.id}`);
      console.log(`Username: ${friend.username}`);
      console.log(`isonline: ${this.getProfileById(friend.id).is_online}`);
      console.log('----------------------------------');
      if (this.getProfileById(friend.id).is_online) {
          status = `<span style="color: green;">Online</span>`;
      }
      else 
          status = `<span style="color: red;">Offline</span>`;

        texthtml += `
        <li class="d-flex justify-content-between" >
          ${status}

        <img src="${this.getProfileById(friend.id).avatar}" alt=""> 
        <p class="w-100">  ${ friend.username}</p>
        <div class="play-now ">
            <a class="text-center btn " href="{% url 'friend_details' userID=friend.id  %}"><i class="fas fa-check"></i>
                <span> VIEW PROFILE</span></a>
            </div>
            <div class="play-now ">
                <a class="text-center btn decline" href="{% url 'remove_friend' userID=friend.id  %}"><i class="fas fa-check"></i>
                    <span> unfriend</span></a>
                </div>
                <div class="play-now ">
                    <a class="text-center btn decline" href="#"><i class="fa-solid fa-gamepad"></i>
                        <span> start game</span></a>
                    </div>
        </li> `;
              }
              
    texthtml += `
    </ul>
</div>`;
    return texthtml;

}

allFriendRequestHtml(){



  let texthtml = 
  `<div class="send-request-friend  accept-request-friend ">
      <div class="t-sett d-flex align-items-center">
          <h1> Friends Request's </h1>
          <i class="fas fa-check"></i>
      </div>
      <ul class="d-grid">`;
  for (let freq of this.friendsreq) {
        console.log(`ID: ${freq.sender.id}`);
        console.log(`Username: ${freq.sender.username}`);
        console.log('----------------------------------');
        
        texthtml += `
        <li class="d-flex justify-content-between" >
        <img src="${freq.sender.profile.avatar}" alt=""> 
        <div class="play-now acceptf  " data-id="${freq.id}">
            <a class="text-center btn" ><i class="fas fa-check"></i>
                <span> ACCPET</span></a>
            </div>
            <div class="play-now  deletef" data-id="${freq.id}" >
                <a class="text-center btn decline"><i class="fas fa-x"></i>
                    <span> Decline</span></a>
                </div>
            <p class="w-100">  ${freq.sender.username}</p>
        </li>`;
    }
    texthtml += `
    </ul>
</div>`;

    return texthtml;
}
async sendRequestFriend(id){
    let access_token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`/api/addfriend/${id}/`,{
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
      })
      let responseData = await response.json();

      if (response.ok)
        {

          // const keyserr = Object.keys(responseData);    
          // const valueerr = Object.values(responseData);  
          
          // console.log("new friend added successfuly :",responseData);        
          // console.log("new friend added successfuly :",keyserr[0]);  
          // console.log("new friend added successfuly :",valueerr[0]);  
          // let msgerr = document.querySelector(`.message-${keyserr[0]}`);
          // msgerr.innerHTML = `  <p><i class="fa-solid fa-triangle-exclamation"></i> ${valueerr[0]}</p>`;
          // msgerr.style.display = "block";
          // setInterval(()=> {msgerr.style.display = "none";},10000) 
          navigateTo("/friends");
        } 
      else 
      {
        console.log("Faild to add new friend: ",responseData);
        navigateTo("/friends");


      }
    } catch (error) {
      console.log("error :",error)      
    }

  }

  async acceptRequestFriend(id){
    let access_token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`api/acceptfriend/${id}/`,{
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
      })
      let responseData = await response.json();

      if (response.ok) {
        console.log("new friend accepted successfuly :",responseData); 
        const keyserr = Object.keys(responseData);    
        const valueerr = Object.values(responseData);  
        
        console.log("new friend added successfuly :",responseData);        
        console.log("new friend added successfuly :",keyserr[0]);  
        console.log("new friend added successfuly :",valueerr[0]);  
        let msgerr = document.querySelector(`.message-${keyserr[0]}`);
        msgerr.innerHTML = `  <p><i class="fa-solid fa-triangle-exclamation"></i> ${valueerr[0]}</p>`;
        msgerr.style.display = "block";
        setInterval(()=> {msgerr.style.display = "none";},10000) 
        navigateTo("/friends");       
      }
      else 
        console.log("Faild to accept new friend: ",responseData);
    } catch (error) {
      console.log("error :",error)      
    }

  }
  async deleteRequestFriend(id){
    let access_token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`api/acceptfriend/${id}/`,{
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
      })
      let responseData = await response.json();
      if (response.ok) {
        console.log("new friend accepted successfuly :",responseData); 
        navigateTo("/friends");       
      }
      else 
        console.log("Faild to accept new friend: ",responseData);
    } catch (error) {
      console.log("error :",error)      
    }

  }
  async afterRender() {
      document.querySelector(".send-request-friend").addEventListener("click", async (e )=> {
          let addf = e.target.closest(".addf"); 
          let deletef = e.target.closest(".deletef"); 
          let acceptf = e.target.closest(".acceptf"); 

          if (addf) {
            await this.sendRequestFriend(parseInt(addf.dataset.id));
              console.log("data id:", addf.dataset.id);
          }
          if (deletef) {
            await this.deleteRequestFriend(parseInt(deletef.dataset.id));
              console.log("data id:", deletef.dataset.id);
          }
          if (acceptf) {
            await this.acceptRequestFriend(parseInt(acceptf.dataset.id));
              console.log("data id:", acceptf.dataset.id);
          } 
      });
      document.querySelector(".accept-request-friend").addEventListener("click", async (e )=> {
        let acceptf = e.target.closest(".acceptf"); 
        let deletef = e.target.closest(".deletef"); 
        if (acceptf) {
          await this.acceptRequestFriend(parseInt(acceptf.dataset.id));
            console.log("data id:", acceptf.dataset.id);
        }
        if (deletef) {
          await this.deleteRequestFriend(parseInt(deletef.dataset.id));
            console.log("data id:", deletef.dataset.id);
        }


    });
  }
}
  // {% for user in users %}
  // {% if not user.is_superuser  %}
  // {% if user != request.user and user not in user_friends %}
  //     {% endif %}
  //     {% endif %}
  //     {% endfor %}