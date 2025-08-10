import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTruck, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaHeart
} from 'react-icons/fa';
import { useCart } from './context/CartContext';
import { useAdminData } from './context/AdminDataContext';
import { useWishlist } from './context/WishlistContext';
import SearchModal from './components/SearchModal';
import telegramSetup from './utils/telegramSetup';
import debugOrders from './utils/debugOrders';
import './App.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const { aboutContent } = useAdminData();
  const { getWishlistCount } = useWishlist();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  const footerData = aboutContent.footer || {
    aboutSection: {
      title: 'О компании',
      description: 'Мы специализируемся на поставке качественных запчастей для вездеходов всех типов и марок.'
    },
    contactsSection: {
      title: 'Контакты',
      phone: '+7 (800) 123-45-67',
      email: 'info@vezdehod-zapchasti.ru',
      address: 'г. Москва, ул. Примерная, 123'
    },
    informationSection: {
      title: 'Информация',
      links: [
        { text: 'Доставка и оплата', url: '/about' },
        { text: 'Гарантия', url: '/about' },
        { text: 'Возврат товара', url: '/about' },
        { text: 'Политика конфиденциальности', url: '/about' }
      ]
    },
    copyright: '© 2024 ВездеходЗапчасти. Все права защищены.'
  };

  const isActiveLink = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <FaTruck />
              ВездеходЗапчасти
            </Link>
            <nav className="nav">
              <Link 
                to="/" 
                className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
              >
                Главная
              </Link>
              <Link 
                to="/catalog" 
                className={`nav-link ${isActiveLink('/catalog') ? 'active' : ''}`}
              >
                Каталог
              </Link>
              <Link 
                to="/promotions" 
                className={`nav-link ${isActiveLink('/promotions') ? 'active' : ''}`}
              >
                Акции
              </Link>
              <Link 
                to="/about" 
                className={`nav-link ${isActiveLink('/about') ? 'active' : ''}`}
              >
                О компании
              </Link>
              <a 
                href="#contacts" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/about');
                  setTimeout(() => {
                    const contactsSection = document.querySelector('.contacts-section');
                    if (contactsSection) {
                      contactsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
              >
                Контакты
              </a>
            </nav>
            <div className="header-actions">
              <button className="icon-button" onClick={handleSearchClick}>
                <FaSearch />
              </button>
              <button className="icon-button wishlist-button" onClick={handleWishlistClick}>
                <FaHeart />
                {getWishlistCount() > 0 && (
                  <span className="wishlist-count">{getWishlistCount()}</span>
                )}
              </button>
              <button className="icon-button cart-button" onClick={handleCartClick}>
                <FaShoppingCart />
                {getCartItemsCount() > 0 && (
                  <span className="cart-count">{getCartItemsCount()}</span>
                )}
              </button>
              <button className="mobile-menu-button">
                <FaBars />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>{footerData.aboutSection.title}</h3>
              <p>{footerData.aboutSection.description}</p>
            </div>
            <div className="footer-section">
              <h3>{footerData.contactsSection.title}</h3>
              <a href={`tel:${footerData.contactsSection.phone.replace(/[^+\d]/g, '')}`}>
                <FaPhone /> {footerData.contactsSection.phone}
              </a>
              <a href={`mailto:${footerData.contactsSection.email}`}>
                <FaEnvelope /> {footerData.contactsSection.email}
              </a>
              <a href="#">
                <FaMapMarkerAlt /> {footerData.contactsSection.address}
              </a>
            </div>
            <div className="footer-section">
              <h3>{footerData.informationSection.title}</h3>
              {footerData.informationSection.links.map((link, index) => (
                <Link key={index} to={link.url}>{link.text}</Link>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <p>{footerData.copyright}</p>
          </div>
        </div>
      </footer>
      
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={closeSearchModal} 
      />
    </div>
  );
}

export default App;
