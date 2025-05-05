let peer;
let connections = [];
let isConnected = false; // Track connection status

// Function to add an audio stream
function addAudioStream(stream, userId, mute = false) {
  const audioGrid = document.getElementById("audio-grid") || document.body; // Default to body if no audio-grid
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
    updateConnectionStatus(true);
    conn.on("data", msg => {
      document.getElementById("chat").innerHTML += `<p><b>${conn.peer.split('-')[0]}:</b> ${msg}</p>`;
    });

    conn.on("close", () => {
      console.log('Connection closed with:', conn.peer);
      connections = connections.filter(c => c !== conn);
      removeVideoStream(conn.peer);
      removeAudioStream(conn.peer);
      if (connections.length === 0) {
        updateConnectionStatus(false);
      }
    });

    conn.on("error", err => {
      console.error("Connection error:", err);
      connections = connections.filter(c => c !== conn);
      removeVideoStream(conn.peer);
      removeAudioStream(conn.peer);
      if (connections.length === 0) {
        updateConnectionStatus(false);
      }
    });
  });

  peer.on("call", call => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        call.answer(stream);
        call.on("stream", userStream => {
          if (stream.getVideoTracks().length > 0) {
            addVideoStream(userStream, call.peer);
          } else if (stream.getAudioTracks().length > 0) {
            addAudioStream(userStream, call.peer);
          }
        });
        call.on("close", () => {
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
    updateConnectionStatus(true);
    alert("Connected to " + connectId.split('-')[0]);
  });

  conn.on("data", msg => {
    document.getElementById("chat").innerHTML += `<p><b>${conn.peer.split('-')[0]}:</b> ${msg}</p>`;
  });

  conn.on("close", () => {
    console.log('Connection closed with:', connectId);
    connections = connections.filter(c => c !== conn);
    removeVideoStream(connectId);
    removeAudioStream(connectId);
    if (connections.length === 0) {
      updateConnectionStatus(false);
    }
  });

  conn.on("error", err => {
    console.error("Connection error:", err);
    connections = connections.filter(c => c !== conn);
    removeVideoStream(connectId);
    removeAudioStream(connectId);
    if (connections.length === 0) {
      updateConnectionStatus(false);
    }
  });
}

function sendMessage() {
  const msg = document.getElementById("message").value.trim();
  if (!msg) return;
  document.getElementById("chat").innerHTML += `<p><b>You:</b> ${msg}</p>`;
  connections.forEach(c => c.send(msg));
  document.getElementById("message").value = "";
}

function startVoiceCall() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(stream => {
      connections.forEach(c => {
        const call = peer.call(c.peer, stream);
        call.on("stream", userStream => {
          addAudioStream(userStream, call.peer, true); // Mute local audio for remote stream
        });
        call.on("close", () => {
          removeAudioStream(call.peer);
        });
      });
    })
    .catch(err => {
      console.error("Failed to get audio stream:", err);
    });
}

function startVideoCall() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(stream => {
      addVideoStream(stream, peer.id, true); // Add local video and mute it
      connections.forEach(c => {
        const call = peer.call(c.peer, stream);
        call.on("stream", userStream => {
          addVideoStream(userStream, call.peer);
        });
        call.on("close", () => {
          removeVideoStream(call.peer);
        });
      });
    })
    .catch(err => {
      console.error("Failed to get media stream:", err);
    });
}

function addVideoStream(stream, userId, mute = false) {
  const videoGrid = document.getElementById("video-grid");
  const video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;
  video.muted = mute;
  video.id = `video-${userId}`;
  videoGrid.appendChild(video);
}

function removeVideoStream(userId) {
  const video = document.getElementById(`video-${userId}`);
  if (video) {
    video.remove();
  }
}

function updateConnectionStatus(connected) {
  isConnected = connected;
  if (connected) {
    document.body.classList.add('connected');
  } else {
    document.body.classList.remove('connected');
  }
}
