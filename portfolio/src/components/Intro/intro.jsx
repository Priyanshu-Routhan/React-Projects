import React from 'react';
import bg from '../../assets/image.png'
import './intro.css';
import btnImg from '../../assets/hireme.png'
import { Link } from 'react-scroll';


const Intro = () => {
  return (
    <section id='intro'>
         <div className="introContent">
            <span className='hello'>Hello</span>
            <span className='introText'>I'm <span className='introName'>Priyanshu</span> <br /> Website Designer</span>
            <p className="introPara">I am a skilled website designer experience in creating <br />visually appealing and user- friendly website.</p>
            <Link><button className='btn'><img src={btnImg} alt="hire Me" className='btnImg' />Hire Me</button></Link>
         </div>
         <img src={bg} alt="Profile" className='bg'/>
    </section>
  )
}

export default Intro
