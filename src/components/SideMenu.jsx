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

      <div className="copyright-text">
        <span>© 2025 GameVault</span>
      </div>


    </div>
  )
}

export default SideMenu