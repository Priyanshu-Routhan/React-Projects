import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [usersData, setUsersData] = useState([]);
  useEffect(() => {
    getUsersData();

  }, [])

  async function getUsersData() {
    const url = "https://dummyjson.com/users";
    let response = await fetch(url);
    response = await response.json();
    // console.log(response);

    setUsersData(response.users);
  }
  console.log(usersData);

  return (
    <div className='.container'>
      <h1>Fetch Data from API</h1>
      <ul className='list'>
            <li>FirstName</li>
            <li>LastName</li>
            <li>Age</li>
      </ul>
      {
        usersData && usersData.map((user) => {
          return(
          

          <ul className='list'>
            <li>{user.firstName}</li>
            <li>{user.lastName}</li>
            <li>{user.age}</li>

          </ul>
          )
          
        })
      }
    </div>
  )
}

export default App
