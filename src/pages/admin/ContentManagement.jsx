import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { FaSave, FaTimes, FaEdit, FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
import IconSelector from '../../components/IconSelector';
import './ContentManagement.css';

export default function ContentManagement() {
  const { aboutContent, updateAboutContent } = useAdminData();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: aboutContent.title || '',
    description: aboutContent.description || '',
    advantages: aboutContent.advantages || [],
    whyChooseUs: aboutContent.whyChooseUs || [],
    team: aboutContent.team || [],
    history: aboutContent.history || { title: '', content: '', milestones: [] },
    contacts: aboutContent.contacts || {},
    footer: aboutContent.footer || {
      aboutSection: { title: '', description: '' },
      contactsSection: { title: '', phone: '', email: '', address: '' },
      informationSection: { title: '', links: [] },
      copyright: ''
    }
  });

  // Синхронизируем formData с aboutContent при изменении
  useEffect(() => {
    setFormData({
      title: aboutContent.title || '',
      description: aboutContent.description || '',
      advantages: aboutContent.advantages || [],
      whyChooseUs: aboutContent.whyChooseUs || [],
      team: aboutContent.team || [],
      history: aboutContent.history || { title: '', content: '', milestones: [] },
      contacts: aboutContent.contacts || {},
      footer: aboutContent.footer || {
        aboutSection: { title: '', description: '' },
        contactsSection: { title: '', phone: '', email: '', address: '' },
        informationSection: { title: '', links: [] },
        copyright: ''
      }
    });
  }, [aboutContent]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [name]: value
      }
    }));
  };

  const handleFooterChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        [section]: {
          ...prev.footer[section],
          [field]: value
        }
      }
    }));
  };

  const handleFooterLinkChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        informationSection: {
          ...prev.footer.informationSection,
          links: prev.footer.informationSection.links.map((link, i) => 
            i === index ? { ...link, [field]: value } : link
          )
        }
      }
    }));
  };

  const addFooterLink = () => {
    setFormData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        informationSection: {
          ...prev.footer.informationSection,
          links: [...prev.footer.informationSection.links, { text: '', url: '' }]
        }
      }
    }));
  };

  const removeFooterLink = (index) => {
    setFormData(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        informationSection: {
          ...prev.footer.informationSection,
          links: prev.footer.informationSection.links.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleHistoryChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      history: {
        ...prev.history,
        [name]: value
      }
    }));
  };

  // Управление преимуществами
  const addAdvantage = () => {
    setFormData(prev => ({
      ...prev,
      advantages: [...prev.advantages, { title: '', description: '', icon: '🎯' }]
    }));
  };

  const updateAdvantage = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      advantages: prev.advantages.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeAdvantage = (index) => {
    setFormData(prev => ({
      ...prev,
      advantages: prev.advantages.filter((_, i) => i !== index)
    }));
  };

  // Управление "Почему выбирают нас"
  const addWhyChooseUs = () => {
    setFormData(prev => ({
      ...prev,
      whyChooseUs: [...prev.whyChooseUs, { title: '', description: '', icon: '⭐' }]
    }));
  };

  const updateWhyChooseUs = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeWhyChooseUs = (index) => {
    setFormData(prev => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs.filter((_, i) => i !== index)
    }));
  };

  // Управление командой
  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team: [...prev.team, { 
        name: '', 
        position: '', 
        experience: '', 
        photo: '', 
        description: '' 
      }]
    }));
  };

  const updateTeamMember = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeTeamMember = (index) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index)
    }));
  };

  // Управление этапами истории
  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      history: {
        ...prev.history,
        milestones: [...prev.history.milestones, {
          year: new Date().getFullYear().toString(),
          title: '',
          description: ''
        }]
      }
    }));
  };

  const updateMilestone = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      history: {
        ...prev.history,
        milestones: prev.history.milestones.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const removeMilestone = (index) => {
    setFormData(prev => ({
      ...prev,
      history: {
        ...prev.history,
        milestones: prev.history.milestones.filter((_, i) => i !== index)
      }
    }));
  };

  // Загрузка фото для команды
  const handlePhotoUpload = (index, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateTeamMember(index, 'photo', e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const saveContent = () => {
    console.log('ContentManagement: Saving content data:', formData);
    console.log('ContentManagement: Current aboutContent before save:', aboutContent);
    console.log('ContentManagement: Team data being saved:', formData.team);
    console.log('ContentManagement: History data being saved:', formData.history);
    console.log('ContentManagement: Footer data being saved:', formData.footer);
    
    try {
      updateAboutContent(formData);
      console.log('ContentManagement: Content saved successfully');
      alert('Контент сохранен!');
    } catch (error) {
      console.error('ContentManagement: Error saving content:', error);
      alert('Ошибка при сохранении контента!');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Основная информация' },
    { id: 'advantages', label: 'Преимущества' },
    { id: 'whyChooseUs', label: 'Почему выбирают нас' },
    { id: 'team', label: 'Команда' },
    { id: 'history', label: 'История' },
    { id: 'contacts', label: 'Контакты' },
    { id: 'footer', label: 'Нижняя панель' }
  ];

  return (
    <div className="content-management">
      <h2>Управление контентом</h2>
      
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'basic' && (
          <div className="basic-info">
            <h3>Основная информация</h3>
            <div className="form-group">
              <label>Заголовок:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleBasicChange}
                placeholder="Название компании"
              />
            </div>
            <div className="form-group">
              <label>Описание:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleBasicChange}
                placeholder="Краткое описание компании"
                rows={4}
              />
            </div>
          </div>
        )}

        {activeTab === 'advantages' && (
          <div className="advantages-section">
            <div className="section-header">
              <h3>Наши преимущества</h3>
              <button onClick={addAdvantage} className="add-btn">
                <FaPlus /> Добавить преимущество
              </button>
            </div>
            
            {formData.advantages.map((advantage, index) => (
              <div key={index} className="advantage-item">
                <div className="advantage-header">
                  <span>Преимущество #{index + 1}</span>
                  <button onClick={() => removeAdvantage(index)} className="remove-btn">
                    <FaTrash />
                  </button>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Иконка:</label>
                    <IconSelector
                      value={advantage.icon}
                      onChange={(icon) => updateAdvantage(index, 'icon', icon)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Заголовок:</label>
                    <input
                      type="text"
                      value={advantage.title}
                      onChange={(e) => updateAdvantage(index, 'title', e.target.value)}
                      placeholder="Название преимущества"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Описание:</label>
                  <textarea
                    value={advantage.description}
                    onChange={(e) => updateAdvantage(index, 'description', e.target.value)}
                    placeholder="Подробное описание преимущества"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'whyChooseUs' && (
          <div className="why-choose-us-section">
            <div className="section-header">
              <h3>Почему выбирают нас</h3>
              <button onClick={addWhyChooseUs} className="add-btn">
                <FaPlus /> Добавить причину
              </button>
            </div>
            
            {formData.whyChooseUs.map((item, index) => (
              <div key={index} className="why-choose-us-item">
                <div className="item-header">
                  <span>Причина #{index + 1}</span>
                  <button onClick={() => removeWhyChooseUs(index)} className="remove-btn">
                    <FaTrash />
                  </button>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Иконка:</label>
                    <IconSelector
                      value={item.icon}
                      onChange={(icon) => updateWhyChooseUs(index, 'icon', icon)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Заголовок:</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateWhyChooseUs(index, 'title', e.target.value)}
                      placeholder="Заголовок причины"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Описание:</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateWhyChooseUs(index, 'description', e.target.value)}
                    placeholder="Подробное описание"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="team-section">
            <div className="section-header">
              <h3>Наша команда</h3>
              <button onClick={addTeamMember} className="add-btn">
                <FaPlus /> Добавить сотрудника
              </button>
            </div>
            
            {formData.team.map((member, index) => (
              <div key={index} className="team-member-item">
                <div className="member-header">
                  <span>Сотрудник #{index + 1}</span>
                  <button onClick={() => removeTeamMember(index)} className="remove-btn">
                    <FaTrash />
                  </button>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Фотография:</label>
                    <div className="photo-upload">
                      {member.photo && (
                        <img src={member.photo} alt="Фото сотрудника" className="member-photo-preview" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handlePhotoUpload(index, e.target.files[0]);
                          }
                        }}
                        className="file-input"
                      />
                      <button type="button" className="upload-btn" onClick={() => {
                        const input = document.querySelector(`input[type="file"]`);
                        if (input) input.click();
                      }}>
                        <FaUpload /> {member.photo ? 'Изменить фото' : 'Загрузить фото'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Имя:</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                      placeholder="Имя сотрудника"
                    />
                  </div>
                  <div className="form-group">
                    <label>Должность:</label>
                    <input
                      type="text"
                      value={member.position}
                      onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                      placeholder="Должность"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Опыт работы:</label>
                    <input
                      type="text"
                      value={member.experience}
                      onChange={(e) => updateTeamMember(index, 'experience', e.target.value)}
                      placeholder="например: 5 лет в отрасли"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Описание:</label>
                  <textarea
                    value={member.description}
                    onChange={(e) => updateTeamMember(index, 'description', e.target.value)}
                    placeholder="Краткое описание сотрудника и его роли"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h3>История компании</h3>
            
            <div className="form-group">
              <label>Заголовок раздела:</label>
              <input
                type="text"
                name="title"
                value={formData.history.title}
                onChange={handleHistoryChange}
                placeholder="История компании"
              />
            </div>
            
            <div className="form-group">
              <label>Основной текст:</label>
              <textarea
                name="content"
                value={formData.history.content}
                onChange={handleHistoryChange}
                placeholder="Расскажите историю вашей компании..."
                rows={6}
              />
            </div>
            
            <div className="milestones-section">
              <div className="section-header">
                <h4>Основные этапы</h4>
                <button onClick={addMilestone} className="add-btn">
                  <FaPlus /> Добавить этап
                </button>
              </div>
              
              {formData.history.milestones.map((milestone, index) => (
                <div key={index} className="milestone-item">
                  <div className="milestone-header">
                    <span>Этап #{index + 1}</span>
                    <button onClick={() => removeMilestone(index)} className="remove-btn">
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Год:</label>
                      <input
                        type="text"
                        value={milestone.year}
                        onChange={(e) => updateMilestone(index, 'year', e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                    <div className="form-group">
                      <label>Название события:</label>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                        placeholder="Важное событие"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Описание:</label>
                    <textarea
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      placeholder="Подробное описание события"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="contacts-section">
            <h3>Контактная информация</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Телефон:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.contacts.phone}
                  onChange={handleContactChange}
                  placeholder="+7 (495) 123-45-67"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.contacts.email}
                  onChange={handleContactChange}
                  placeholder="info@company.ru"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Адрес:</label>
              <input
                type="text"
                name="address"
                value={formData.contacts.address}
                onChange={handleContactChange}
                placeholder="г. Москва, ул. Примерная, д. 123"
              />
            </div>
            
            <div className="form-group">
              <label>Время работы:</label>
              <input
                type="text"
                name="workingHours"
                value={formData.contacts.workingHours}
                onChange={handleContactChange}
                placeholder="Пн-Пт: 9:00-18:00, Сб: 10:00-16:00"
              />
            </div>
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="footer-section">
            <h3>Нижняя панель (футер)</h3>
            
            <div className="footer-subsection">
              <h4>Раздел "О компании"</h4>
              <div className="form-group">
                <label>Заголовок:</label>
                <input
                  type="text"
                  value={formData.footer.aboutSection.title}
                  onChange={(e) => handleFooterChange('aboutSection', 'title', e.target.value)}
                  placeholder="О компании"
                />
              </div>
              <div className="form-group">
                <label>Описание:</label>
                <textarea
                  value={formData.footer.aboutSection.description}
                  onChange={(e) => handleFooterChange('aboutSection', 'description', e.target.value)}
                  placeholder="Краткое описание компании"
                  rows={3}
                />
              </div>
            </div>

            <div className="footer-subsection">
              <h4>Раздел "Контакты"</h4>
              <div className="form-group">
                <label>Заголовок:</label>
                <input
                  type="text"
                  value={formData.footer.contactsSection.title}
                  onChange={(e) => handleFooterChange('contactsSection', 'title', e.target.value)}
                  placeholder="Контакты"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Телефон:</label>
                  <input
                    type="text"
                    value={formData.footer.contactsSection.phone}
                    onChange={(e) => handleFooterChange('contactsSection', 'phone', e.target.value)}
                    placeholder="+7 (800) 123-45-67"
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={formData.footer.contactsSection.email}
                    onChange={(e) => handleFooterChange('contactsSection', 'email', e.target.value)}
                    placeholder="info@company.ru"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Адрес:</label>
                <input
                  type="text"
                  value={formData.footer.contactsSection.address}
                  onChange={(e) => handleFooterChange('contactsSection', 'address', e.target.value)}
                  placeholder="г. Москва, ул. Примерная, 123"
                />
              </div>
            </div>

            <div className="footer-subsection">
              <h4>Раздел "Информация"</h4>
              <div className="form-group">
                <label>Заголовок:</label>
                <input
                  type="text"
                  value={formData.footer.informationSection.title}
                  onChange={(e) => handleFooterChange('informationSection', 'title', e.target.value)}
                  placeholder="Информация"
                />
              </div>
              
              <div className="links-section">
                <div className="section-header">
                  <h5>Ссылки</h5>
                  <button onClick={addFooterLink} className="add-btn">
                    <FaPlus /> Добавить ссылку
                  </button>
                </div>
                
                {formData.footer.informationSection.links.map((link, index) => (
                  <div key={index} className="link-item">
                    <div className="link-header">
                      <span>Ссылка #{index + 1}</span>
                      <button onClick={() => removeFooterLink(index)} className="remove-btn">
                        <FaTrash />
                      </button>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Текст ссылки:</label>
                        <input
                          type="text"
                          value={link.text}
                          onChange={(e) => handleFooterLinkChange(index, 'text', e.target.value)}
                          placeholder="Название ссылки"
                        />
                      </div>
                      <div className="form-group">
                        <label>URL:</label>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleFooterLinkChange(index, 'url', e.target.value)}
                          placeholder="/about или https://example.com"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="footer-subsection">
              <h4>Авторские права</h4>
              <div className="form-group">
                <label>Текст копирайта:</label>
                <input
                  type="text"
                  value={formData.footer.copyright}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    footer: { ...prev.footer, copyright: e.target.value }
                  }))}
                  placeholder="© 2024 ВездеходЗапчасти. Все права защищены."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button onClick={saveContent} className="save-btn">
          <FaSave /> Сохранить изменения
        </button>
      </div>
    </div>
  );
}