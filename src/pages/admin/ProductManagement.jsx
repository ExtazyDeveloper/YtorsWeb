import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import MultiImageUpload from '../../components/MultiImageUpload';
import { migrateProductImages, getMainImage } from '../../utils/imageHelpers';
import './ProductManagement.css';

export default function ProductManagement() {
  const { products, categories, brands, addProduct, updateProduct, deleteProduct } = useAdminData();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    subcategory: '',
    brand: '',
    available: true,
    quantity: 0,
    images: [],
    description: ''
  });

  const categoryList = Object.keys(categories);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData(prev => ({
      ...prev,
      category: selectedCategory,
      subcategory: '' // Сбрасываем подкатегорию при смене категории
    }));
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingProduct(null);
    setFormData({
      title: '',
      price: '',
      category: '',
      subcategory: '',
      brand: '',
      available: true,
      quantity: 0,
      images: [],
      description: ''
    });
  };

  const startEditing = (product) => {
    setEditingProduct(product.id);
    setIsCreating(false);
    const migratedProduct = migrateProductImages(product);
    setFormData({ ...migratedProduct });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setIsCreating(false);
    setFormData({
      title: '',
      price: '',
      category: '',
      subcategory: '',
      brand: '',
      available: true,
      quantity: 0,
      images: [],
      description: ''
    });
  };

  const saveProduct = () => {
    console.log('Saving product:', { formData, isCreating, editingProduct });
    
    if (!formData.title || !formData.category) {
      alert('Заполните обязательные поля: название и категория!');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      alert('Укажите корректную цену товара!');
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0
      };

      if (isCreating) {
        console.log('Creating new product:', productData);
        addProduct(productData);
        alert('Товар создан!');
      } else {
        console.log('Updating existing product:', editingProduct, productData);
        updateProduct(editingProduct, productData);
        alert('Товар обновлен!');
      }
      
      cancelEditing();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Ошибка при сохранении товара!');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить товар?')) {
      deleteProduct(id);
      alert('Товар удален!');
    }
  };

  const availableSubcategories = formData.category ? categories[formData.category] || [] : [];

  return (
    <div className="product-management">
      <div className="management-header">
        <h2>Управление товарами</h2>
        <button onClick={startCreating} className="btn-primary">
          <FaPlus /> Добавить товар
        </button>
      </div>

      {(isCreating || editingProduct) && (
        <div className="product-form">
          <h3>{isCreating ? 'Создание товара' : 'Редактирование товара'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Название товара"
              />
            </div>

            <div className="form-group">
              <label>Цена *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Количество в наличии</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Категория *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                <option value="">Выберите категорию</option>
                {categoryList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Подкатегория</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                disabled={!formData.category}
              >
                <option value="">Выберите подкатегорию</option>
                {availableSubcategories.map(subcat => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Производитель</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              >
                <option value="">Выберите производителя</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="form-group form-group-full">
              <label>Изображения товара</label>
              <MultiImageUpload
                value={formData.images}
                onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                maxImages={5}
                placeholder="Добавить изображения товара"
              />
            </div>

            <div className="form-group form-group-full">
              <label>Описание</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Описание товара"
                rows="3"
              />
            </div>

            <div className="form-group form-group-full">
              <label>
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                />
                В наличии
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button onClick={saveProduct} className="btn-success">
              <FaSave /> Сохранить
            </button>
            <button onClick={cancelEditing} className="btn-secondary">
              <FaTimes /> Отмена
            </button>
          </div>
        </div>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Категория</th>
              <th>Подкатегория</th>
              <th>Производитель</th>
              <th>Наличие</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <div className="product-title">
                    {(() => {
                      const migratedProduct = migrateProductImages(product);
                      const mainImage = getMainImage(migratedProduct);
                      
                      if (mainImage?.data?.startsWith('data:image')) {
                        return <img src={mainImage.data} alt={product.title} className="product-image" />;
                      }
                      return <span className="product-icon">{mainImage?.data || '📦'}</span>;
                    })()}
                    {product.title}
                  </div>
                </td>
                <td>{product.price.toLocaleString()} ₽</td>
                <td>
                  <span className={`quantity-badge ${(product.quantity || 0) === 0 ? 'out-of-stock' : (product.quantity || 0) < 5 ? 'low-stock' : 'in-stock'}`}>
                    {product.quantity || 0} шт.
                  </span>
                </td>
                <td>{product.category}</td>
                <td>{product.subcategory || '-'}</td>
                <td>{product.brand}</td>
                <td>
                  <span className={product.available ? 'status-available' : 'status-unavailable'}>
                    {product.available ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => startEditing(product)}
                      className="btn-edit"
                      title="Редактировать"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="btn-delete"
                      title="Удалить"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
