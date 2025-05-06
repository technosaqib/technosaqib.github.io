let peer;
let connections = [];
let currentVoiceCall;
let currentVideoCall;
// Function to add an audio stream
function addAudioStream(stream, userId, mute = false) {
  const audioGrid = document.getElementById("audio-grid") || document.body;
  const audio = document.createElement("audio");
  audio.srcObject = stream;
  audio.autoplay = true;
  audio.muted = mute;
  audio.id = `audio-${userId}`;
  audioGrid.appendChild(audio);
}
// Function to remove an audio stream
function removeAudioStream(userId) {
  const audio = document.getElementById(`audio-${userId}`);
  if (audio) {
    audio.remove();
  }
}
function startApp() {
  const name = document.getElementById("nameInput").value.trim();
  if (!name) {
    alert("Enter a name!");
    return;
  }
  document.getElementById("login").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  document.getElementById("userNameDisplay").innerText = name;
  peer = new Peer(name + "-" + Math.floor(Math.random() * 10000));
  peer.on("open", id => {
    document.getElementById("myId").innerText = id;
  });
  peer.on("connection", conn => {
    console.log('New connection from:', conn.peer);
    connections.push(conn);
    conn.on("data", msg => {
      handleData(msg, conn.peer);
    });
    conn.on("close", () => {
      console.log('Connection closed with:', conn.peer);
      connections = connections.filter(c => c !== conn);
      removeVideoStream(conn.peer);
      removeAudioStream(conn.peer);
    });
    conn.on("error", err => {
      console.error("Connection error:", err);
      connections = connections.filter(c => c !== conn);
      removeVideoStream(conn.peer);
      removeAudioStream(conn.peer);
    });
  });
  peer.on("call", call => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        call.answer(stream);
        if (stream.getVideoTracks().length > 0) {
          currentVideoCall = call;
          document.getElementById('stopVideoBtn').style.display = 'inline-block';
        } else if (stream.getAudioTracks().length > 0) {
          currentVoiceCall = call;
          document.getElementById('stopVoiceBtn').style.display = 'inline-block';
        }
        call.on("stream", userStream => {
          if (userStream.getVideoTracks().length > 0) {
            addVideoStream(userStream, call.peer);
          } else if (userStream.getAudioTracks().length > 0) {
            addAudioStream(userStream, call.peer);
          }
        });
        call.on("close", () => {
          if (currentVoiceCall === call) {
            currentVoiceCall = null;
            document.getElementById('stopVoiceBtn').style.display = 'none';
          }
          if (currentVideoCall === call) {
            currentVideoCall = null;
            document.getElementById('stopVideoBtn').style.display = 'none';
          }
          removeVideoStream(call.peer);
          removeAudioStream(call.peer);
        });
      })
      .catch(err => {
        console.error("Failed to get media stream:", err);
      });
  });
  peer.on("error", err => {
    console.error("PeerJS error:", err);
  });
}
function copyRoomId() {
  const id = document.getElementById("myId").innerText;
  navigator.clipboard.writeText(id)
    .then(() => alert("Room ID copied to clipboard!"))
    .catch(err => alert("Failed to copy Room ID."));
}
function shareRoomId() {
  const id = document.getElementById("myId").innerText;
  const shareText = `Join my private chat and call: ${id}`;
  if (navigator.share) {
    navigator.share({
      title: 'Join Private Chat',
      text: shareText,
    })
    .then(() => console.log('Shared successfully'))
    .catch((error) => console.log('Sharing failed', error));
  } else {
    alert(`You can copy and share this link manually: ${shareText}`);
  }
}
function connectToUser() {
  const connectId = document.getElementById("connectId").value.trim();
  if (!connectId) {
    alert("Enter Room ID to connect");
    return;
  }
  const conn = peer.connect(connectId);
  conn.on("open", () => {
    console.log('Connected to:', connectId);
    connections.push(conn);
    alert("Connected to " + connectId.split('-')[0]);
  });
  conn.on("data", msg => {
    handleData(msg, conn.peer);
  });
  conn.on("close", () => {
    console.log('Connection closed with:', connectId);
    connections = connections.filter(c => c !== conn);
    removeVideoStream(connectId);
    removeAudioStream(connectId);
  });
  conn.on("error", err => {
    console.error("Connection error:", err);
    connections = connections.filter(c => c !== conn);
    removeVideoStream(connectId);
    removeAudioStream(connectId);
  });
}
function sendMessage() {
  const msg = document.getElementById("message").value.trim();
  if (!msg) return;
  const data = { type: 'text', payload: msg };
  document.getElementById("chat").innerHTML += `<p><b>You:</b> ${msg}</p>`;
  connections.forEach(c => c.send(data));
  document.getElementById("message").value = "";
}
function sendImage() {
  const file = document.getElementById("imageInput").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const data = { type: 'image', payload: reader.result };
      document.getElementById("chat").innerHTML += `<p><b>You (Image):</b> <img src="${reader.result}" style="max-width: 200px;"></p>`;
      connections.forEach(c => c.send(data));
    };
    reader.readAsDataURL(file);
  }
}
function
