import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
      <div className="rmdb-header">
        <div className="rmdb-header-content">
        <Link to="/">
        <img className="rmdb-logo" src="https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png" alt="rmdb-logo" />
        </Link>
        <img className="rmdb-tmdb-logo" src="./images/tmdb_logo.png" alt="tmdb-logo" />
        </div>
     </div>
    )

}

export default Header;