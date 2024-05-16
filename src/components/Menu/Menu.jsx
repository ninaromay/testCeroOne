import './Menu.css'
import { NavLink } from 'react-router-dom'

function Menu() {
    const menu = [
        {key: 0, id: 'Home',     link:'/'},
        {key: 1, id: 'Contacts', link:'/contacts'},
        {key: 2, id: 'Accounts', link:'/accounts'},
        {key: 3, id: 'Payments', link:'/payments'}
    ]

  return (
    <div className="menu-container">
        <ul className="menu-ul">
            {menu.map((item, i) => <li key={i} className="menu-li"><NavLink to={item.link}>{item.id}</NavLink></li>)}
        </ul>
    </div>
  )
}

export default Menu