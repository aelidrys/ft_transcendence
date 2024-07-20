let socket = null;

export function createSocketConnection() {

    closeSocketConnection() ;
    const accessToken = localStorage.getItem('access_token');

    var loc = window.location;
    var wsStart = 'ws://';
    if (loc.protocol == 'https:') {
        wsStart = 'wss://'
    }
    var endpoint = wsStart + loc.host ;
    if (accessToken) {
        socket = new WebSocket(`${endpoint}/ws/status/?token=${accessToken}`); // Adjust the URL as needed

        socket.onopen = function(event) {
            console.log('WebSocket is open now.');
        };

        socket.onmessage = function(event) {
            console.log('WebSocket message received:', event);
        };

        // socket.onclose = function(event) {
        //     console.log('WebSocket is closed now.');
        // };

        socket.onerror = function(event) {
            console.error('WebSocket error observed:', event);
        };
    } else {
        console.error('No access token found, cannot create WebSocket connection.');
    }
}

export function closeSocketConnection() {
    if (socket) {
        console.log("logout and colose socket x') ")
        socket.close();
        socket = null;
    }
}
