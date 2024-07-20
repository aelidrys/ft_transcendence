// AbstractView.js
export default class AbstractView {
    constructor() {

        this.data = null;
        this.payload = null;
        this.profiles = null;
        this.friendsreq = null;
        this.mysendreq = null;
        this.pageTitle = null;
        this.myprofile = null;
        this.gethtmlcheck = true;
        console.log("AbstractView constructor called");
    }
    base64UrlDecode(str) {
        // Replace non-url compatible chars with base64 standard chars
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad out with standard base64 required padding characters
        switch (str.length % 4) {
            case 0: break; // No pad chars in this case
            case 2: str += '=='; break; // Two pad chars
            case 3: str += '='; break; // One pad char
            default: throw new Error('Invalid base64 string');
        }
        // Decode base64 string
        return atob(str);
      }
    setTitle(title) {
        document.title = title;
    }

    setHead(head) {
        document.head.innerHTML += head;
    }
    async getHead(){
        return "";
    }
    async getHtml() {
        return "";
    }

    afterRender() {
        console.log("nothing after render \n\n\n");
    }

    async setPayload(){
        try {
          let access_token = localStorage.getItem('access_token');
          console.log("access token :",access_token);
          const parts = access_token.split('.');
          if (parts.length !== 3) {
              alert('Invalid JWT');
              return;
          }
          console.log(parts[1]);
          this.payload = JSON.parse(this.base64UrlDecode(parts[1]));
          console.log("payload",this.payload);
          } catch (error) {
              console.error('An err or occurred:', error);
          }
      }


    async getSidebar(){
      const activeLink = [
        {name:"HOME" ,active:"active"},
        {name:"GAMES",active:""},
        {name:"PROFILE",active:""},
        {name:"TOURNAMENT",active:""},
        {name:"FRIENDS",active:""}, 
        {name:"LEADERBOARD",active:""},
        {name:"SETTINGS",active:""},
      ]
      activeLink.forEach(element => {
        
        if (element.name === this.pageTitle)
          element.active = "active";
        else
          element.active = "";
      })
      activeLink.map(element => console.log(`${element.name}  : ${element.active}`));
        return `   
        
        <img class="img-fluid mt-0" src="/static/images/logoor.png" alt="">
        <div class="display-t"> <span>  ${this.pageTitle}</span></div>
        <ul>
            <li data-link >
            <a class=" ${activeLink[0].active} d-flex  p-3 align-items-center fs-5   rounded-2 mb-2 ms-3 "  href="/home" data-link>
              <i data-link class="fa-solid fa-house  fa-fw"></i>
            </a>
        </li>
          <li data-link >
            <a class=" ${activeLink[1].active}  d-flex  p-3 align-items-center fs-5  rounded-2 mb-2 ms-3 " data-link id="game_buttun" href="/games" >
              <i data-link class="fa-solid fa-gamepad fa-fw"></i>
            </a>
          </li>
          <li data-link >
            <a class=" ${activeLink[2].active}   d-flex  p-3 align-items-center fs-5  rounded-2 mb-2 ms-3  " data-link href="/profile" >
              <i data-link class="fa-solid fa-user  fa-fw"></i>
            </a>
          </li>
          <li data-link >
              <a class="  ${activeLink[3].active}   d-flex  p-3 align-items-center fs-5  rounded-2 mb-2 ms-3  " data-link  href="/tournament" >
                  <i data-link class="fa-solid fa-trophy fa-fw"></i>
            </a>
        </li>
          <li data-link >
            <a class=" ${activeLink[4].active}   d-flex  p-3 align-items-center fs-5 rounded-2 mb-2 ms-3  "  href="/friends" >
              <i data-link class="fa-solid fa-user-group fa-fw"></i>
            </a>
          </li>
      
          <li data-link >
            <a class=" ${activeLink[5].active}   d-flex  p-3 align-items-center fs-5 rounded-2 mb-2 ms-3  "  href="/leaderboard" >
              <i data-link class="fa-solid fa-ranking-star"></i>
            </a>
          </li>
      
          <li data-link >
            <a class=" ${activeLink[6].active}   d-flex  p-3 align-items-center fs-5 rounded-2 mb-2 ms-3  " href="/settings" >
              <i data-link class="fa-solid fa-gear"></i>
            </a>
          </li>
          <li data-link >
            <a class=" d-flex  p-3 align-items-center fs-5 rounded-2 mb-2 ms-3  " href="/login" >
              <i data-link class="fa-solid fa-gear"></i>
            </a>
          </li>
          <li data-link >
            <a class=" d-flex  p-3 align-items-center fs-5 rounded-2 mb-2 ms-3  " href="/register" >
              <i data-link class="fa-solid fa-gear"></i>
            </a>
          </li>
    
        </ul>

        <div class=" logout-btn position-absolute bottom-0  start-50 translate-middle-x">
          
    
              <button type="button" class="btn btn-secondary"><i class="fa-solid fa-right-from-bracket"></i>
              <a  data-link href="/logout">Log out</a> </button>
          </div>

          `

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
      

      async setDataProfiles() {
        try {
          let access_token = localStorage.getItem('access_token');
      
          const response = await fetch(`/api/profile/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch profiles');
          }
      
          const responseData = await response.json();
          this.profiles  = responseData;
      
          console.log('Profile data:', responseData);
          console.log('here  profiles:\n\n\n\n', this.profiles);
      
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }

      async setDataFriendRequest() {
        try {
          let access_token = localStorage.getItem('access_token');
      
          const response = await fetch(`/api/frequest/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch friendsrequest');
          }
      
          const responseData = await response.json();
          this.friendsreq  = responseData.ireceive;
          this.mysendreq = responseData.isend    //.map(reqsended => reqsended.username);
          
          console.log('friendsrequest data:', responseData);
          console.log('here  friendsrequest:\n\n\n\n', Array.from(this.friendsreq));
          console.log('here  sednfriendsrequest:\n\n\n\n', Array.from(this.mysendreq));
      
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }


}
