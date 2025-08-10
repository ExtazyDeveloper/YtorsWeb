import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useAdminData } from '../context/AdminDataContext';
import { useCartActions } from '../hooks/useCartActions';
import { getMainImage } from '../utils/imageHelpers';
import './Wishlist.css';

function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { products } = useAdminData();
  const { addToCart } = useCartActions();

  // Получаем полные данные товаров из избранного
  const wishlistProducts = wishlistItems
    .map(productId => products.find(product => product.id === productId))
    .filter(product => product); // Убираем undefined товары

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      brand: product.brand || '',
      quantity: 1
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="empty-wishlist">
            <FaHeart className="empty-wishlist-icon" />
            <h2>Ваш список избранного пуст</h2>
            <p>Добавьте товары в избранное, чтобы не потерять их</p>
            <Link to="/catalog" className="continue-shopping-btn">
              Перейти в каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <div className="wishlist-title">
            <Link to="/" className="back-button">
              <FaArrowLeft />
            </Link>
            <h1>
              <FaHeart className="wishlist-icon" />
              Избранное ({wishlistProducts.length})
            </h1>
          </div>
          
          {wishlistProducts.length > 0 && (
            <button 
              className="clear-wishlist-btn"
              onClick={clearWishlist}
            >
              Очистить все
            </button>
          )}
        </div>

        <div className="wishlist-grid">
          <AnimatePresence>
            {wishlistProducts.map((product) => (
              <motion.div
                key={product.id}
                className="wishlist-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="wishlist-item-image">
                  {(() => {
                    const mainImage = getMainImage(product);
                    if (mainImage?.data?.startsWith('data:image')) {
                      return <img src={mainImage.data} alt={product.title} />;
                    }
                    return <span className="product-icon">{mainImage?.data || '📦'}</span>;
                  })()}
                </div>
                
                <div className="wishlist-item-info">
                  <h3 className="product-title">{product.title}</h3>
                  {product.brand && (
                    <p className="product-brand">{product.brand}</p>
                  )}
                  <p className="product-price">{product.price.toLocaleString()} ₽</p>
                  <p className="product-quantity">
                    В наличии: {product.quantity || 0} шт
                  </p>
                </div>
                
                <div className="wishlist-item-actions">
                  <motion.button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.quantity || product.quantity === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaShoppingCart />
                    В корзину
                  </motion.button>
                  
                  <Link 
                    to={`/product/${product.id}`}
                    className="view-product-btn"
                  >
                    Подробнее
                  </Link>
                  
                  <button
                    className="remove-from-wishlist-btn"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    title="Удалить из избранного"
                  >
                    <FaTimes />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="wishlist-summary">
          <div className="summary-info">
            <h3>Итого в избранном: {wishlistProducts.length} товаров</h3>
            <p>Общая стоимость: {wishlistProducts.reduce((sum, product) => sum + product.price, 0).toLocaleString()} ₽</p>
          </div>
          
          <div className="summary-actions">
            <button 
              className="add-all-to-cart-btn"
              onClick={() => {
                wishlistProducts.forEach(product => {
                  if (product.quantity > 0) {
                    handleAddToCart(product);
                  }
                });
              }}
            >
              <FaShoppingCart />
              Добавить все в корзину
            </button>
            
            <Link to="/catalog" className="continue-shopping-link">
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
