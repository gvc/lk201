// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/web/endpoint.ex":
import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

function createCookie(name,value,days) {
  let expires;
  if (days) {
    let date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    expires = "; expires="+date.toGMTString();
  }
  else {
    expires = "";
  }
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}

function getUserID() {
  if(readCookie("user-id")) {
    return readCookie("user-id")
  } else {
    let userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0
      let v = c == 'x' ? r : r & 0x3 | 0x8
      return v.toString(16)
    })
    createCookie("user-id", userId)
    return userId
  }
}

socket.connect()

let previousTimestamp = new Date().getTime()
let milissecondsInterval = 200

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("tracking:motion", {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

let body = document.querySelector("body")

channel.push("visit_stats", {
  uid: getUserID(),
  path: window.location,
  time: previousTimestamp
})

body.addEventListener("mousemove", event => {
  let currentTimestamp = new Date().getTime()

  if(currentTimestamp - previousTimestamp > milissecondsInterval) {
    channel.push("movement", {
      uid: getUserID(),
      x: event.clientX,
      y: event.clientY,
      time: currentTimestamp
    })
    previousTimestamp = currentTimestamp
  }
})

body.addEventListener("click", event => {
  let currentTimestamp = new Date().getTime()
  let target = event.target
  let idSection = target.id != "" ? ("#" + target.id) : ""
  let classSection = target.className != "" ? ("." + target.className.split(" ").join(".")) : ""

  channel.push("click", {
    uid: getUserID(),
    target: target.tagName.toLowerCase() + idSection + classSection,
    x: event.pageX,
    y: event.pageY,
    time: currentTimestamp
  })
})

export default socket
