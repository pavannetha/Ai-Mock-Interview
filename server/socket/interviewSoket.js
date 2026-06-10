export default function interviewSocket(socket) {
  socket.on("first-message", (data) => {
    console.log("first messsage revieved", data);

    socket.emit("comfirm-interview", {
      message: "first meesage recieved good to start interview",
    });
  });
}
