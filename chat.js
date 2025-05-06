let peer, conn, localStream, currentCall;

function agreeTOS() {
  document.getElementById("tos-popup").style.display = "none";
  document.getElementById("main-interface").style.display = "block";
}

function disagreeTOS() {
  window.location.href = "https://google.com";
}

function generateID(name) {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${name.toLowerCase().replace(/\s/g, "")}-${randomNum}`;
}

function registerUser() {
  const name = document.getElementById("username").value.trim();
  if (!name) return alert("Enter a name!");

  const userId = generateID(name);
  peer = new Peer(userId);

  peer.on('open', id => {
    document.getElementById("my-id").innerText = id;
    document.getElementById("chat-interface").style.display = "block";

    peer.on('connection', incoming => {
      conn = incoming;
      conn.on('data', msg => showMessage("Friend", msg));
    });

    peer.on('call', call => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          localStream = stream;
          currentCall = call;
          call.answer(stream);
          call.on('stream', remote => {
            document.getElementById("remote-video").srcObject = remote;
            document.getElementById("local-video").srcObject = stream;
          });
        });
    });
  });
}

function connect() {
  const friendId = document.getElementById("friend-id").value.trim();
  if (!friendId) return alert("Enter your friend's ID!");

  conn = peer.connect(friendId);
  conn.on('open', () => {
    conn.on('data', msg => showMessage("Friend", msg));
  });
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const msg = input.value.trim();
  if (!msg || !conn) return;

  conn.send(msg);
  showMessage("Me", msg);
  input.value = "";
}

function showMessage(sender, msg) {
  const div = document.createElement("div");
  div.textContent = `${sender}: ${msg}`;
  document.getElementById("messages").appendChild(div);
}

function copyID() {
  const id = document.getElementById("my-id").innerText;
  navigator.clipboard.writeText(id).then(() => alert("Copied!"));
}

function shareID() {
  const id = document.getElementById("my-id").innerText;
  const shareText = `Hey, connect with me on Chat! My ID is: ${id}`;
  if (navigator.share) {
    navigator.share({ title: "Chat ID", text: shareText });
  } else {
    alert("Sharing not supported. Copy the ID manually.");
  }
}

function startVoiceCall() {
  callPeer(false);
}

function startVideoCall() {
  callPeer(true);
}

function callPeer(videoEnabled) {
  const friendId = document.getElementById("friend-id").value.trim();
  if (!friendId) return alert("Enter friend's ID!");

  navigator.mediaDevices.getUserMedia({ video: videoEnabled, audio: true })
    .then(stream => {
      localStream = stream;
      document.getElementById("local-video").srcObject = stream;

      const call = peer.call(friendId, stream);
      currentCall = call;

      call.on('stream', remote => {
        document.getElementById("remote-video").srcObject = remote;
      });
    });
}

function stopCall() {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }
  if (currentCall) currentCall.close();
  document.getElementById("local-video").srcObject = null;
  document.getElementById("remote-video").srcObject = null;
}
