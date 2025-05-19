import React, {useState, useEffect} from 'react';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App(){
  const [addFriend, setAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(){
    setAddFriend(prev => !prev);
    setSelectedFriend(null);
  }

  function handleNewFriend(friend){
    setFriends(friends => [...friends, friend]);
  }

  function handleSelectedFriend(friend){
    setSelectedFriend(prev => prev?.id === friend.id ? null : friend);
    setAddFriend(false);
  }

  function handleSplitBill(value){
    setFriends((friends => 
      friends.map(friend => 
        friend.id === selectedFriend.id 
        ? ({...friend, balance: friend.balance + value}) 
        : friend)
    ))
    setSelectedFriend(null);
  }

  return(
    <div className="app">
      <div className="sidebar">
        <FriendList list={friends} onSelected={handleSelectedFriend} selected={selectedFriend}/>
        {addFriend && <FormAddFriend onAddFriend={handleNewFriend} />}
        <Button onClick={handleAddFriend}>{addFriend ? "close" : "Add friend"}</Button>
      </div>
      {selectedFriend && <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill}/>}
    </div>)
}

function Button({children, onClick}){
  return(
    <button className="button" onClick={onClick}>{children}</button>
  )
}

function FormAddFriend({onAddFriend}){
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e){
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `https://i.pravatar.cc/48?u=${id}`,
      balance: 0
    }
    onAddFriend(newFriend);
  }

  return(
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <InputForm type="text" disabled={false} value={name} onChange={e=>setName(e.target.value)}>👫 Friend Name</InputForm >
      <InputForm type="text" disabled={false} value={image} onChange={(e)=> setImage(e.target.value)}>🖼 Image URL</InputForm>
      <Button>Add</Button>
    </form>
  )
}

function InputForm({children, type, disabled, value, onChange}){
  return(
    <>
      <label>{children}</label>
      <input type={type} value={value} disabled={disabled} onChange={onChange}/>
    </>
  )
}

function FriendList({list, onSelected, selected}){
  return(
    <ul>
      {list.map(friend => (<Friend key={friend.id} data={friend} selected={selected} onSelected={onSelected}/>))}
    </ul>
  )
}

function Friend({data, onSelected, selected}){
  const isSelected = selected?.id === data.id;

  return(
    <li>
      <img src={data.image} alt={data.name} />
      <h3>{data.name}</h3>
      {data.balance === 0 
      ? <p>You and {data.name} are even</p> 
      : data.balance > 0 
      ? <p className="green">{data.name} owes you {data.balance}</p> 
      : <p className='red'>You owe {data.name} ${Math.abs(data.balance)}</p>}
      <Button onClick={()=>onSelected(data)}>{isSelected ? "close" : "Select"}</Button>
    </li>
  )
}

function FormSplitBill({friend, onSplitBill}){
  const [bill, setBill] = useState("");
  const [userBill, setUserBill] = useState("");
  const friendBill = (bill - userBill);
  const [whosPaying, setWhosPaying] = useState("user");

  function handleSubmit(e){
    e.preventDefault();
    if (!bill || !userBill) return;
    onSplitBill(whosPaying === "user" ? friendBill : -userBill)

  }
  return(
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split a bill with {friend.name}</h2>
      <InputForm value={bill} onChange={(e)=>setBill(Number(e.target.value))}>💰 Bill Value</InputForm>
      <InputForm value={userBill} onChange={(e)=>setUserBill(Number(e.target.value) > bill ? userBill : Number(e.target.value))}>🕴 Your expense</InputForm>
      <InputForm value={friendBill} disabled={true}>👫 {friend.name}'s expense</InputForm>
      <label>🤑Who is paying the bill?</label>
      <select value={whosPaying} onChange={(e)=>setWhosPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">friend</option>
      </select>
      <Button>Split bill</Button>
    </form>
  )
}