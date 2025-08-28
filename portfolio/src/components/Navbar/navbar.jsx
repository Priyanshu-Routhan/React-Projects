import React from 'react'
import './navbar.css'
import logo from '../../assets/logo.png'
import contactImg from '../../assets/contact.png'
import {Link} from 'react-scroll';
const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={logo} alt="Logo" className='logo'/>
      <div className='desktopMenu'>

        <Link className="desktopMenuList">Home</Link>
        <Link className="desktopMenuList">About</Link>
        <Link className="desktopMenuList">Portfolio</Link>
        <Link className="desktopMenuList">Clients</Link>

      </div>

      <button className='desktopMenuBtn'>
        <img src={contactImg} alt="" className='desktopMenuImg' />Contact Me
      </button>
    </div>
  )
}

export default Navbar;
