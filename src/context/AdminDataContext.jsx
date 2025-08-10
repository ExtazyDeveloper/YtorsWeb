import React, { createContext, useContext, useState } from 'react';
import { 
  categoryStructure, 
  initialProducts, 
  initialBrands, 
  initialPromotions, 
  initialAboutContent 
} from '../data/initialData.js';
import { migrateProductImages } from '../utils/imageHelpers';

const AdminDataContext = createContext();

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
};

export const AdminDataProvider = ({ children }) => {
  // Состояние данных
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('adminProducts');
    let productsData = saved ? JSON.parse(saved) : initialProducts;
    
    // Автоматически мигрируем products при первой загрузке
    productsData = productsData.map(product => migrateProductImages(product));
    
    return productsData;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('adminCategories');
    return saved ? JSON.parse(saved) : categoryStructure;
  });

  const [brands, setBrands] = useState(() => {
    const saved = localStorage.getItem('adminBrands');
    return saved ? JSON.parse(saved) : initialBrands;
  });

  const [promotions, setPromotions] = useState(() => {
    const saved = localStorage.getItem('adminPromotions');
    return saved ? JSON.parse(saved) : initialPromotions;
  });

  const [aboutContent, setAboutContent] = useState(() => {
    const saved = localStorage.getItem('adminAboutContent');
    if (saved) {
      try {
        const parsedContent = JSON.parse(saved);
        // Мигрируем данные для обеспечения совместимости
        const migratedContent = {
          ...initialAboutContent,
          ...parsedContent,
          team: parsedContent.team || initialAboutContent.team,
          history: {
            ...initialAboutContent.history,
            ...(parsedContent.history || {})
          },
          footer: {
            ...initialAboutContent.footer,
            ...(parsedContent.footer || {})
          },

        };
        console.log('AdminDataContext: Loaded and migrated about content:', migratedContent);
        return migratedContent;
      } catch (error) {
        console.error('AdminDataContext: Error parsing saved about content:', error);
        return initialAboutContent;
      }
    }
    console.log('AdminDataContext: Using initial about content');
    return initialAboutContent;
  });

  const [popularProductIds, setPopularProductIds] = useState(() => {
    const saved = localStorage.getItem('adminPopularProducts');
    return saved ? JSON.parse(saved) : [11, 1, 8, 2]; // ID популярных товаров по умолчанию
  });

  // Функции для работы с товарами
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id)) + 1
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
  };

  const updateProduct = (id, updatedProduct) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
  };

  // Функции для работы с категориями
  const addCategory = (categoryName, subcategories = []) => {
    const updatedCategories = {
      ...categories,
      [categoryName]: subcategories
    };
    setCategories(updatedCategories);
    localStorage.setItem('adminCategories', JSON.stringify(updatedCategories));
  };

  const updateCategory = (oldName, newName, subcategories) => {
    const updatedCategories = { ...categories };
    delete updatedCategories[oldName];
    updatedCategories[newName] = subcategories;
    setCategories(updatedCategories);
    localStorage.setItem('adminCategories', JSON.stringify(updatedCategories));
  };

  const deleteCategory = (categoryName) => {
    const updatedCategories = { ...categories };
    delete updatedCategories[categoryName];
    setCategories(updatedCategories);
    localStorage.setItem('adminCategories', JSON.stringify(updatedCategories));
  };

  // Функции для работы с брендами
  const addBrand = (brandName) => {
    if (!brands.includes(brandName)) {
      const updatedBrands = [...brands, brandName];
      setBrands(updatedBrands);
      localStorage.setItem('adminBrands', JSON.stringify(updatedBrands));
    }
  };

  const deleteBrand = (brandName) => {
    const updatedBrands = brands.filter(brand => brand !== brandName);
    setBrands(updatedBrands);
    localStorage.setItem('adminBrands', JSON.stringify(updatedBrands));
  };

  // Функции для работы с акциями
  const addPromotion = (promotion) => {
    const newPromotion = {
      ...promotion,
      id: Math.max(...promotions.map(p => p.id)) + 1
    };
    const updatedPromotions = [...promotions, newPromotion];
    setPromotions(updatedPromotions);
    localStorage.setItem('adminPromotions', JSON.stringify(updatedPromotions));
  };

  const updatePromotion = (id, updatedPromotion) => {
    const updatedPromotions = promotions.map(promo => 
      promo.id === id ? { ...promo, ...updatedPromotion } : promo
    );
    setPromotions(updatedPromotions);
    localStorage.setItem('adminPromotions', JSON.stringify(updatedPromotions));
  };

  const deletePromotion = (id) => {
    const updatedPromotions = promotions.filter(promo => promo.id !== id);
    setPromotions(updatedPromotions);
    localStorage.setItem('adminPromotions', JSON.stringify(updatedPromotions));
  };

  // Функция для обновления контента "О компании"
  const updateAboutContent = (newContent) => {
    console.log('AdminDataContext: Updating about content:', newContent);
    console.log('AdminDataContext: Previous about content:', aboutContent);
    console.log('AdminDataContext: Team data in new content:', newContent.team);
    console.log('AdminDataContext: History data in new content:', newContent.history);
    
    // Убеждаемся, что структура данных полная
    const completeContent = {
      ...initialAboutContent,
      ...newContent,
      team: newContent.team || [],
      history: {
        ...initialAboutContent.history,
        ...(newContent.history || {})
      },
      footer: {
        ...initialAboutContent.footer,
        ...(newContent.footer || {})
      }
    };
    
    setAboutContent(completeContent);
    localStorage.setItem('adminAboutContent', JSON.stringify(completeContent));
    
    console.log('AdminDataContext: Complete content saved:', completeContent);
    console.log('AdminDataContext: Saved team:', completeContent.team);
    console.log('AdminDataContext: Saved history:', completeContent.history);
  };

  // Функции для работы с популярными товарами
  const updatePopularProducts = (productIds) => {
    setPopularProductIds(productIds);
    localStorage.setItem('adminPopularProducts', JSON.stringify(productIds));
  };

  const value = {
    // Данные
    products,
    categories,
    brands,
    promotions,
    aboutContent,
    popularProductIds,
    
    // Функции для товаров
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Функции для категорий
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Функции для брендов
    addBrand,
    deleteBrand,
    
    // Функции для акций
    addPromotion,
    updatePromotion,
    deletePromotion,
    
    // Функция для контента
    updateAboutContent,
    
    // Функции для популярных товаров
    updatePopularProducts
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};
