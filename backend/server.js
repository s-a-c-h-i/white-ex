const express=require('express')
const app=express()
//add http to create the server
const server=require('http').createServer(app);
const {Server}=require('socket.io')  //expecting server
const {addUser, getUser,removeUser,getuserinroom}=require('./utils/users')
const io=new Server(server)  //Server   is a class

app.get("/",(req,res)=>{
res.send("this is home page")
})

let roomidglobal,imgURLglobal //to store just revious img and room id
// Jab koi naya user server se connect hota hai
io.on("connection",(socket)=>{
  console.log("user connected",socket.id)
socket.on("userjoined",(data)=>{   //checking foor event
  
  const {name,roomid,userid,host,presenter}=data     //This line destructures the data object received //from the client into individual variables name, 
  console.log("name",name);

// User ko room mein join karaya jata hai
// Jo user join kar raha hai usko success ka message bheja jata hai
// console.log(data);
roomidglobal = roomid
socket.join(roomid)
const users=addUser({name,roomid,userid,host,presenter,socketid:socket.id})  ///adding the new userr
//console.log(users); 
socket.emit("userisjoined",{success: true,users})  //sucesful joinin\  ,,passing users will not update users in realtime
  // console.log(users.length)
socket.broadcast.to(roomid).emit("userjoinedmsgbroadcast",name)
socket.broadcast.to(roomid).emit("allusers",users)   //emittting all the users
  
// Room ke sare users ko whiteboard ka purana image bheja jata hai
socket.broadcast.to(roomid).emit("whiteBoardDataResponse",{
imgURL:imgURLglobal,})
 
})
  // Jab whiteboard ka naya data aata hai
socket.on("whiteboarddata",(data)=>{
imgURLglobal=data;  // Whiteboard ka naya data 'imgURLglobal' mein store kiya jata hai
// Room ke sare users ko naya whiteboard data bheja jata hai
socket.broadcast.to(roomidglobal).emit("whiteBoardDataResponse",{
imgURL:data,               //It sends the updated imgURL data as part of the event payload.
})
})

socket.on("message",(data)=>{
const {message}=data
const user=getUser(socket.id)
if(user) {
console.log(user)
//removeUser(socket.id)
console.log(message);
    socket.broadcast.to(roomidglobal).emit("messageresponse",{ message, name:user.name})
  }
})

//from front to baackend
socket.on("disconnect",()=>{
  const user=getUser(socket.id)
  console.log("diconnected user",user);
  if(user) {
    const users = removeUser(socket.id)
    socket.broadcast.to(roomidglobal).emit("userdisconnected", user.name);
    socket.broadcast.to(roomidglobal).emit("allusers", getuserinroom(user.roomid)); //updates user ki info 
  }
})
})

const port=process.env.PORT || 5000;
server.listen(port,()=>{console.log('server is runnning')})