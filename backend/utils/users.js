const users=[]

const addUser=({name,roomid,userid,host,presenter,socketid})=>{
    const user={name,roomid,userid,host,presenter,socketid};
    users.push(user);
    return users.filter((user) => user.roomid === roomid);
}

const removeUser=(id)=>{
    const i=users.findIndex((user)=>user.socketid===id)
    if(i!==-1){
        return users.splice(i,1)[0]
    }
    return users
}

const getUser=(id)=>{
    return users.find((user)=>user.socketid===id)
}

const getuserinroom=(roomid)=>{
    return users.filter((user)=>user.roomid===roomid)
}
 
///exporting all these fuunction

module.exports={
    addUser,
    removeUser,
    getUser,
    getuserinroom
}

