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
      <button 
        type="button" 
        className="logo"
        onClick={() => sectionActive('home')}
      >
        <i className="bi bi-safe2-fill"></i>
        <span className="brand">GameVault</span>
      </button>
      <ul className='nav'>
       {
        navData.map(item => (
        <NavListItem key={item._id} item={item} navOnClick={handleNavOnClick}/>
      ))
      }
      </ul>

      <ul className="social">
        <li>
          <button type="button" className="social-link-btn">
           <i className="bi bi-instagram"></i>
          </button>
        </li>
        <li>
          <button type="button" className="social-link-btn">
           <i className="bi bi-twitter-x"></i>
          </button>
        </li>
        <li>
          <button type="button" className="social-link-btn">
           <i className="bi bi-youtube"></i>
          </button>
        </li>
        <li>
          <button type="button" className="social-link-btn share">
           <i className="bi bi-share"></i>
          </button>
        </li>
      </ul>


    </div>
  )
}

export default SideMenu