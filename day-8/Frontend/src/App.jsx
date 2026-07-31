import React, { useEffect, useState } from 'react'
import axios from "axios"
const App = () => {
  const [notes, setNotes] = useState([])

  const [title, setTitle] = useState("")
  const [decription, setDecription] = useState("")
  const [updateNoteId, setUpdateNoteId] = useState("")

  const [IsUudate, setIsUudate] = useState(false)
  
  const API = "https://note-app-1-9ktr.onrender.com";
  const fetchNote = () => {
    axios.get(`${API}/api/notes`)
      .then((res) => {
        setNotes(res.data.notes)
      })
  }
  const submitHandler = (e) => {
    e.preventDefault()

    const { title, decription } = e.target.elements;

    axios.post(`${API}/api/notes`, {
      title: title.value,
      decription: decription.value
    })
      .then((res => {
        fetchNote()
      }))
      .catch(err => {
        console.log(err);
      })

  }
  const deleteNote = (noteId) => {
    axios.delete(`${API}/api/notes/${noteId}`)
      .then((res) => {
        console.log(res.data);
        fetchNote()
      })
  }

  const updateNote = (title, decription) => {
    setTitle(title)
    setDecription(decription)
  }
  const updateHandeler= (title,decription,id) =>{
      axios.put(`${API}/api/notes/${id}`,
        {
          title:title,
          decription:decription
        }
      )
        .then(res => {
          console.log(res);
          fetchNote()
        })
  }
  useEffect(() => {
    fetchNote()
  }, [])

  return (
    <>
      <form className='note-create-form' onSubmit={submitHandler}>
        <input name='title' type="text" placeholder='Enter title' value={title} required onChange={(e) => {
          setTitle(e.target.value)
        }} />
        <input name='decription' type="text" placeholder='Enter decription' value={decription} required onChange={(e) => {
          setDecription(e.target.value)
        }} />
        {
          IsUudate != true ? <button className="btn create" type='submit'>Create</button> : <button className="btn create" type='button' onClick={()=>{
            updateHandeler(title,decription,updateNoteId)
          }}>Update</button>
        }
      </form>

      <div className="notes">
        {
          notes.map(
            (note, idx) => {
              return <div className="note" key={idx}>
                <div className="contener">
                  <img src="../src/assets/app-icon-blue.png" alt="" />
                  <div className="data">
                    <div className="title">{note.title}</div>
                    <div className="decription">{note.decription}</div>
                  </div>
                </div>
                <div className='button-contener'>
                  <button className='btn delete' onClick={
                    () => {
                      deleteNote(note._id)
                    }
                  }>Delete</button>
                  <button className='btn update' onClick={
                    () => {
                      setUpdateNoteId(note._id)
                      updateNote(note.title, note.decription)
                      setIsUudate(neg => !neg)
                    }
                  }>Update</button>
                </div>
              </div>
            }
          )
        }
      </div>
    </>
  )
}

export default App
