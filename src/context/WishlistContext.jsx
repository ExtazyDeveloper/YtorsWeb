import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Загрузка избранного из localStorage при инициализации
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlistItems(parsedWishlist);
      }
    } catch (error) {
      console.error('Ошибка при загрузке избранного:', error);
      setWishlistItems([]);
    }
  }, []);

  // Сохранение избранного в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Ошибка при сохранении избранного:', error);
    }
  }, [wishlistItems]);

  // Добавить товар в избранное
  const addToWishlist = (productId) => {
    if (!wishlistItems.includes(productId)) {
      setWishlistItems(prev => [...prev, productId]);
      console.log(`Товар ${productId} добавлен в избранное`);
      return true;
    }
    return false;
  };

  // Удалить товар из избранного
  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(id => id !== productId));
    console.log(`Товар ${productId} удален из избранного`);
  };

  // Переключить статус товара в избранном (добавить/удалить)
  const toggleWishlist = (productId) => {
    if (wishlistItems.includes(productId)) {
      removeFromWishlist(productId);
      return false; // удален
    } else {
      addToWishlist(productId);
      return true; // добавлен
    }
  };

  // Проверить, находится ли товар в избранном
  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  // Получить количество товаров в избранном
  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  // Очистить избранное
  const clearWishlist = () => {
    setWishlistItems([]);
    console.log('Избранное очищено');
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
