import React, { useState } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaTags,
  FaList
} from 'react-icons/fa';
import { useAdminData } from '../../context/AdminDataContext';
import './CategoryManagement.css';

function CategoryManagement() {
  const { 
    data, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory
  } = useAdminData();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [editSubcategoryName, setEditSubcategoryName] = useState('');
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState('');

  // Добавление новой категории
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  // Начать редактирование категории
  const startEditCategory = (categoryName) => {
    setEditingCategory(categoryName);
    setEditCategoryName(categoryName);
  };

  // Сохранить изменения категории
  const saveEditCategory = () => {
    if (editCategoryName.trim() && editCategoryName !== editingCategory) {
      updateCategory(editingCategory, editCategoryName.trim());
    }
    setEditingCategory(null);
    setEditCategoryName('');
  };

  // Отменить редактирование категории
  const cancelEditCategory = () => {
    setEditingCategory(null);
    setEditCategoryName('');
  };

  // Удалить категорию
  const handleDeleteCategory = (categoryName) => {
    if (confirm(`Удалить категорию "${categoryName}" и все её товары?`)) {
      deleteCategory(categoryName);
    }
  };

  // Добавление новой подкатегории
  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() && selectedCategoryForSub) {
      addSubcategory(selectedCategoryForSub, newSubcategoryName.trim());
      setNewSubcategoryName('');
    }
  };

  // Начать редактирование подкатегории
  const startEditSubcategory = (categoryName, subcategoryName) => {
    setEditingSubcategory(`${categoryName}::${subcategoryName}`);
    setEditSubcategoryName(subcategoryName);
  };

  // Сохранить изменения подкатегории
  const saveEditSubcategory = () => {
    const [categoryName, oldSubName] = editingSubcategory.split('::');
    if (editSubcategoryName.trim() && editSubcategoryName !== oldSubName) {
      updateSubcategory(categoryName, oldSubName, editSubcategoryName.trim());
    }
    setEditingSubcategory(null);
    setEditSubcategoryName('');
  };

  // Отменить редактирование подкатегории
  const cancelEditSubcategory = () => {
    setEditingSubcategory(null);
    setEditSubcategoryName('');
  };

  // Удалить подкатегорию
  const handleDeleteSubcategory = (categoryName, subcategoryName) => {
    if (confirm(`Удалить подкатегорию "${subcategoryName}" и все её товары?`)) {
      deleteSubcategory(categoryName, subcategoryName);
    }
  };

  return (
    <div className="category-management">
      <div className="page-header">
        <h2>
          <FaTags /> Управление категориями
        </h2>
        <p>Добавляйте, редактируйте и удаляйте категории и подкатегории товаров</p>
      </div>

      <div className="category-content">
        {/* Добавление новой категории */}
        <div className="section">
          <h3>
            <FaPlus /> Добавить категорию
          </h3>
          <div className="add-category-form">
            <input
              type="text"
              placeholder="Название новой категории"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button 
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="add-btn"
            >
              <FaPlus /> Добавить
            </button>
          </div>
        </div>

        {/* Список категорий */}
        <div className="section">
          <h3>
            <FaList /> Категории ({Object.keys(data.categoryStructure).length})
          </h3>
          <div className="categories-list">
            {Object.entries(data.categoryStructure).map(([categoryName, subcategories]) => (
              <div key={categoryName} className="category-item">
                <div className="category-header">
                  <div className="category-info">
                    {editingCategory === categoryName ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEditCategory()}
                          autoFocus
                        />
                        <button onClick={saveEditCategory} className="save-btn">
                          <FaSave />
                        </button>
                        <button onClick={cancelEditCategory} className="cancel-btn">
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4>{categoryName}</h4>
                        <span className="subcategory-count">
                          {subcategories.length} подкатегорий
                        </span>
                      </>
                    )}
                  </div>
                  
                  {editingCategory !== categoryName && (
                    <div className="category-actions">
                      <button 
                        onClick={() => startEditCategory(categoryName)}
                        className="edit-btn"
                        title="Редактировать"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(categoryName)}
                        className="delete-btn"
                        title="Удалить"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                {/* Подкатегории */}
                <div className="subcategories">
                  {subcategories.map((subcategoryName) => (
                    <div key={subcategoryName} className="subcategory-item">
                      {editingSubcategory === `${categoryName}::${subcategoryName}` ? (
                        <div className="edit-form">
                          <input
                            type="text"
                            value={editSubcategoryName}
                            onChange={(e) => setEditSubcategoryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && saveEditSubcategory()}
                            autoFocus
                          />
                          <button onClick={saveEditSubcategory} className="save-btn">
                            <FaSave />
                          </button>
                          <button onClick={cancelEditSubcategory} className="cancel-btn">
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="subcategory-name">{subcategoryName}</span>
                          <div className="subcategory-actions">
                            <button 
                              onClick={() => startEditSubcategory(categoryName, subcategoryName)}
                              className="edit-btn"
                              title="Редактировать"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDeleteSubcategory(categoryName, subcategoryName)}
                              className="delete-btn"
                              title="Удалить"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Добавление новой подкатегории */}
        <div className="section">
          <h3>
            <FaPlus /> Добавить подкатегорию
          </h3>
          <div className="add-subcategory-form">
            <select
              value={selectedCategoryForSub}
              onChange={(e) => setSelectedCategoryForSub(e.target.value)}
            >
              <option value="">Выберите категорию</option>
              {Object.keys(data.categoryStructure).map(categoryName => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Название новой подкатегории"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory()}
            />
            <button 
              onClick={handleAddSubcategory}
              disabled={!newSubcategoryName.trim() || !selectedCategoryForSub}
              className="add-btn"
            >
              <FaPlus /> Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryManagement;
