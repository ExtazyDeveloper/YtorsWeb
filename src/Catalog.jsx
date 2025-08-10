import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCartActions } from './hooks/useCartActions';
import { useAdminData } from './context/AdminDataContext';
import { useWishlist } from './context/WishlistContext';
import { migrateProductImages, getMainImage } from './utils/imageHelpers';
import './Catalog.css';

export default function Catalog() {
  const { products, categories, brands } = useAdminData();
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Все');
  const [selectedBrand, setSelectedBrand] = useState('Все');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [inStock, setInStock] = useState(false);
  const { addToCartWithNotification } = useCartActions();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Создаем список категорий и брендов
  const categoryList = ['Все', ...Object.keys(categories)];
  const brandList = ['Все', ...brands];

  const minPrice = 0;
  const maxPrice = 200000;

  // Получаем подкатегории для выбранной категории
  const availableSubcategories = selectedCategory === 'Все' 
    ? [] 
    : ['Все', ...(categories[selectedCategory] || [])];

  // Сброс подкатегории при смене основной категории
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('Все');
  };

  const filteredProducts = products.filter((product) => {
    const byCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    const bySubcategory = selectedSubcategory === 'Все' || product.subcategory === selectedSubcategory;
    const byBrand = selectedBrand === 'Все' || product.brand === selectedBrand;
    const byPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const byStock = !inStock || product.available;
    return byCategory && bySubcategory && byBrand && byPrice && byStock;
  });

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartWithNotification(product, 1);
  };

  const handleToggleWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  return (
    <div className="catalog-wrapper">
      <aside className="catalog-filters">
        <h3>Фильтры</h3>
        <div className="filter-group">
          <label>Категория</label>
          <select value={selectedCategory} onChange={e => handleCategoryChange(e.target.value)}>
            {categoryList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {availableSubcategories.length > 0 && (
          <div className="filter-group">
            <label>Подкатегория</label>
            <select value={selectedSubcategory} onChange={e => setSelectedSubcategory(e.target.value)}>
              {availableSubcategories.map(subcat => (
                <option key={subcat} value={subcat}>{subcat}</option>
              ))}
            </select>
          </div>
        )}
        <div className="filter-group">
          <label>Производитель</label>
          <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
            {brandList.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Цена, ₽</label>
          <div className="price-range">
            <input
              type="number"
              min={minPrice}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
            />
            <span>-</span>
            <input
              type="number"
              min={priceRange[0]}
              max={maxPrice}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], +e.target.value])}
            />
          </div>
        </div>
        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={inStock}
              onChange={e => setInStock(e.target.checked)}
            />
            Только в наличии
          </label>
        </div>
      </aside>
      <main className="catalog-main">
        <h2>Каталог товаров</h2>
        <div className="catalog-grid">
          {filteredProducts.length === 0 && <div className="no-products">Нет товаров по выбранным фильтрам</div>}
          {filteredProducts.map(product => (
            <Link to={`/product/${product.id}`} className="catalog-card" key={product.id}>
              <div className="catalog-card-image">
                {(() => {
                  const migratedProduct = migrateProductImages(product);
                  const mainImage = getMainImage(migratedProduct);
                  
                  if (mainImage?.data?.startsWith('data:image')) {
                    return <img src={mainImage.data} alt={product.title} className="catalog-product-image" />;
                  }
                  return <span className="catalog-card-icon">{mainImage?.data || '📦'}</span>;
                })()}
                <button
                  className={`wishlist-toggle ${isInWishlist(product.id) ? 'active' : ''}`}
                  onClick={(e) => handleToggleWishlist(product.id, e)}
                  title={isInWishlist(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                  <FaHeart />
                </button>
              </div>
              <div className="catalog-card-info">
                <h3>{product.title}</h3>
                <div className="catalog-card-price">{product.price.toLocaleString()} ₽</div>
                <div className="catalog-card-category">
                  <span className="category">{product.category}</span>
                  {product.subcategory && <span className="subcategory"> → {product.subcategory}</span>}
                </div>
                <div className="catalog-card-meta">
                  <span className="catalog-card-brand">{product.brand}</span>
                  <span className={product.available ? 'in-stock' : 'out-of-stock'}>
                    {product.available ? <FaCheckCircle /> : <FaTimesCircle />} {product.available ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </div>
                <button 
                  className="catalog-card-btn"
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={!product.available}
                >
                  <FaShoppingCart /> В корзину
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
