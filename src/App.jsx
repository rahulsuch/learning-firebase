import { useState } from 'react'
import { getDatabase, set, ref } from 'firebase/database'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { app } from '../firebase'

const db = getDatabase(app);
function App() {
  
  const [count, setCount] = useState(1)
  const postData = () => {
    // code to post data to firebase
    set(ref(db, 'users/rahul/'), {
      id: 1,
      name: "rahul",
      age: 24
    })
  }

  return (
    <>
      <h1>Learning Firebase</h1>
      <button onClick={postData}>update data</button>
    </>
  )
}

export default App
