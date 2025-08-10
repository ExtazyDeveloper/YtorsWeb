import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTruck,
  FaTools,
  FaShieldAlt,
  FaArrowRight,
  FaHeart,
  FaSearch
} from 'react-icons/fa';
import { useAdminData } from '../context/AdminDataContext';
import { useWishlist } from '../context/WishlistContext';
import { getMainImage } from '../utils/imageHelpers';

function Home() {
  const { products, popularProductIds } = useAdminData();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const openSearchModal = () => {
    window.dispatchEvent(new Event('openSearchModal'));
  };

  const handleContactClick = () => {
    navigate('/about');
    setTimeout(() => {
      const contactsSection = document.querySelector('.contacts-section');
      if (contactsSection) {
        contactsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleToggleWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };
  
  const features = [
    {
      icon: <FaTruck />,
      title: "Быстрая доставка",
      text: "Доставляем запчасти по всей России в кратчайшие сроки"
    },
    {
      icon: <FaTools />,
      title: "Качественные детали",
      text: "Только оригинальные и сертифицированные запчасти"
    },
    {
      icon: <FaShieldAlt />,
      title: "Гарантия качества",
      text: "Полная гарантия на все товары и профессиональная поддержка"
    }
  ];

  // Получаем популярные товары из контекста по ID
  const popularProducts = popularProductIds
    .map(id => products.find(product => product.id === id))
    .filter(product => product) // Убираем undefined если товар не найден
    .map(product => ({
      id: product.id,
      title: product.title,
      price: `${product.price.toLocaleString()} ₽`,
      icon: getMainImage(product)?.data || '📦'
    }));

  // Оригинальный массив для справки:
  const _originalPopularProducts = [
    {
      id: 11,
      title: "Гусеницы для вездехода",
      price: "45,000 ₽",
      icon: "🔗"
    },
    {
      id: 1,
      title: "Двигатель 2.0L дизельный",
      price: "180,000 ₽",
      icon: "⚙️"
    },
    {
      id: 8,
      title: "Коробка передач механическая",
      price: "95,000 ₽",
      icon: "🔧"
    },
    {
      id: 12,
      title: "Амортизатор передний",
      price: "12,000 ₽",
      icon: "🛠️"
    },
    {
      id: 15,
      title: "Аккумулятор 12V 100Ah",
      price: "15,000 ₽",
      icon: "🔋"
    },
    {
      id: 17,
      title: "Сиденье водителя",
      price: "25,000 ₽",
      icon: "🪑"
    }
  ];

  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Запчасти для вездеходов</h1>
              <p>
                Качественные запчасти для всех типов вездеходов.
                Быстрая доставка по всей России. Гарантия качества на все товары.
              </p>
              <div className="hero-buttons">
                <Link to="/catalog" className="cta-button">
                  Перейти в каталог
                  <FaArrowRight />
                </Link>
                <button className="contact-button" onClick={handleContactClick}>
                  Связаться с менеджером
                </button>
              </div>
              <div className="hero-search">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Поиск по каталогу"
                  readOnly
                  onClick={openSearchModal}
                />
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-placeholder">
                🚗
              </div>
              <p>Надёжные запчасти для вашего вездехода</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Почему выбирают нас</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-text">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="products">
        <div className="container">
          <h2 className="section-title">Популярные товары</h2>
          <div className="products-grid">
            {popularProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                <div className="product-image">
                  {(() => {
                    const productData = products.find(p => p.id === product.id);
                    if (!productData) return <span className="product-icon">{product.icon}</span>;
                    
                    const mainImage = getMainImage(productData);
                    if (mainImage?.data?.startsWith('data:image')) {
                      return <img src={mainImage.data} alt={product.title} className="product-image-img" />;
                    }
                    return <span className="product-icon">{mainImage?.data || product.icon}</span>;
                  })()}
                  <button
                    className={`wishlist-toggle-home ${isInWishlist(product.id) ? 'active' : ''}`}
                    onClick={(e) => handleToggleWishlist(product.id, e)}
                    title={isInWishlist(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                  >
                    <FaHeart />
                  </button>
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-price">{product.price}</div>
                  <button className="product-button">Подробнее</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
