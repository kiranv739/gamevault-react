import React, {useState} from 'react'
import './sideMenu.css'
import navListData from '../data/NavListData'
import NavListItem from './NavListItem'

function SideMenu({ active, sectionActive })
 {
  const [navData,setNavData] = useState(navListData)
  
  const handleNavOnClick = (id,target) => {
    const newNavData = navData.map((nav) => {
      nav.active = false;
      if (nav._id === id) nav.active = true;
      return nav;
    });
    setNavData(newNavData);
    sectionActive(target);
  };
    
  return (
    <div className={`sideMenu ${active ? 'active': undefined}`}>
      <a href="" className="logo">
        <i className="bi bi-controller"></i>
        <span className="brand">GameVault</span>
      </a>
      <ul className='nav'>
       {
        navData.map(item => (
        <NavListItem key={item._id} item={item} navOnClick={handleNavOnClick}/>
      ))
      }
      </ul>

      <ul className="social">
        <li>
          <a href='#'>
           <i class="bi bi-instagram"></i>
          </a>
        </li>
        <li>
          <a href='#'>
           <i className="bi bi-twitter-x"></i>
          </a>
        </li>
        <li>
          <a href='#'>
           <i className="bi bi-youtube"></i>
          </a>
        </li>
        <li>
          <a href='#' className='share'>
           <i className="bi bi-share"></i>
          </a>
        </li>
      </ul>

      
    </div>
  )
}

export default SideMenu