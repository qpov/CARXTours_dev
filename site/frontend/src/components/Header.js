import React from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import '../css/header.css';

class Header extends React.Component {
  static contextType = AuthContext;

  state = {
    isMenuOpen: false,
  }

  toggleMenu = () => {
    this.setState(prevState => ({
      isMenuOpen: !prevState.isMenuOpen,
    }))
  }

  render() {
    const { isLoggedIn } = this.context;
    const { isMenuOpen } = this.state;
  
    return (
      <div className='header'>
        <Link to='/' className={`brand-name ${isMenuOpen ? 'hidden' : ''}`}>CARX Tours</Link>
        
        <div className={`menu-btn ${isMenuOpen ? 'show' : ''}`} onClick={this.toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={`menu ${isMenuOpen ? 'show' : ''}`}>
          <div className='ivents'>
            <Link to='/ivents'>События</Link>
          </div>
          <div className='login'>
            <Link to={isLoggedIn ? '/profile' : '/login'}>{isLoggedIn ? 'Профиль' : 'Вход'}</Link>
          </div>
        </div>
      </div>
    );
  }  
};

export default Header;
