import { Server } from "socket.io";

let IO;

export const initIO = (httpServer) => {
    IO = new Server(httpServer);

    IO.use(
        (socket,next) => {
            if(socket.handshake.query) {
                let callerId = socket.handshake.query.callerId;
                socket.user = callerId;
                next();
            }
        }
    );

    IO.on(
        "connection", 
        (socket) => {
            console.log(socket.user, "Connected");
            socket.join(socket.user);

            socket.on(
                "call",
                (data) => {
                    let callerId = data.callerId;
                    let rtcMessage = data.rtcMessage;
                }
            );
        }
    );

    socket.on(
        "answerCall",
        (data) => {
            let callerId = data.callerId;
            let rtcMessage = data.rtcMessage;

            socket.to(callerId).emit(
                "callAnswered",
                {
                    callee: socket.user,
                    rtcMessage: rtcMessage
                }
            );
        }
    );
    
    
    socket.on(
        "ICEcandidate",
        (data) => {
            console.log("ICEcandidate data.caleeId", data.calleeId);
            let calleeId = data.calleeId;
            let rtcMessage = data.rtcMessage;

            socket.to(caleeId).emit(
                "ICEcandidate", 
                {
                    sender: socket.user,
                    rtcMessage: rtcMessage
                }
            );
        }

    );
};


export const getIO = () => {
    if (!IO) {
        throw Error("IO not initialized.");
        
    }
    else {
        return IO;
    }
}