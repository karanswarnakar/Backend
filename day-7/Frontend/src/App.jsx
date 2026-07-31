import React, { useState } from 'react'
import axios from 'axios';
const App = () => {
  const [notes, setNotes] = useState([])
  axios.get("http://localhost:8080/api/notes")
    .then((res) => {
      setNotes(res.data.notes);

    })
  const [title, setTitle] = useState("")
  const [decription, setDecription] = useState("")

  async function addNote(title, decription) {

    try{
      const note = await axios.post("http://localhost:8080/api/notes", {
      title,decription
    })
      .then((res) => {
        console.log(res);
      })
      
    }
    catch(err){
      console.log(err);
      
    }
    
  }


  return (
    <>
      <nav>
        <input
          type="text"
          placeholder='Enter title'
          onChange={
            (e) => {
              setTitle(e.target.value)
            }
          }
        />
        <input
          type="text"
          placeholder='Enter decription'
          onChange={
            (e) => {
              setTitle(e.target.value)
            }
          }
        />

        <button className='btn add-note'
          onClick={
            ()=>{
              addNote(title,decription)
            }
          }
        >Add Note</button>
        <button className='btn update'>Patch Note</button>
        <button className='btn delete'>Delete Note</button>
      </nav>
      <div className="notes">
        {
          notes.map((note, idx) => {
            return <div className="note" key={idx}>
              <img src="../src/assets/app-icon-blue.png" alt="" />
              <div className="data">
                <div className="title">{note.title}</div>
                <div className="decription">{note.decription}</div>
              </div>
            </div>

          })
        }
      </div>
      {/* <div className="add">
      <img src="../src/assets/add.png" alt="" />
    </div> */}
    </>
  )
}

export default App
