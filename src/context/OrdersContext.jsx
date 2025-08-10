import React, { createContext, useContext, useState, useEffect } from 'react';

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

// Статусы заказов
export const ORDER_STATUSES = {
  NEW: 'new',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Названия статусов на русском
export const STATUS_LABELS = {
  [ORDER_STATUSES.NEW]: 'Новый',
  [ORDER_STATUSES.CONFIRMED]: 'Подтвержден',
  [ORDER_STATUSES.PROCESSING]: 'В обработке',
  [ORDER_STATUSES.SHIPPED]: 'Отправлен',
  [ORDER_STATUSES.DELIVERED]: 'Доставлен',
  [ORDER_STATUSES.CANCELLED]: 'Отменен'
};

// Цвета для статусов
export const STATUS_COLORS = {
  [ORDER_STATUSES.NEW]: '#3b82f6',
  [ORDER_STATUSES.CONFIRMED]: '#f59e0b',
  [ORDER_STATUSES.PROCESSING]: '#8b5cf6',
  [ORDER_STATUSES.SHIPPED]: '#06b6d4',
  [ORDER_STATUSES.DELIVERED]: '#10b981',
  [ORDER_STATUSES.CANCELLED]: '#ef4444'
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Загрузка заказов из localStorage при инициализации
  useEffect(() => {
    console.log('OrdersContext: Загружаем заказы из localStorage...');
    try {
      const savedOrders = localStorage.getItem('orders');
      console.log('OrdersContext: Сохраненные заказы из localStorage:', savedOrders);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        console.log('OrdersContext: Распарсенные заказы:', parsedOrders);
        setOrders(parsedOrders);
      } else {
        console.log('OrdersContext: Сохраненных заказов не найдено');
      }
    } catch (error) {
      console.error('Ошибка при загрузке заказов:', error);
      setOrders([]);
    }
  }, []);

  // Сохранение заказов в localStorage при изменении
  useEffect(() => {
    console.log('OrdersContext: Сохраняем заказы в localStorage:', orders);
    try {
      localStorage.setItem('orders', JSON.stringify(orders));
      console.log('OrdersContext: Заказы успешно сохранены в localStorage');
    } catch (error) {
      console.error('Ошибка при сохранении заказов:', error);
    }
  }, [orders]);

  // Создать новый заказ
  const createOrder = (orderData) => {
    console.log('OrdersContext: createOrder вызван с данными:', orderData);
    
    const newOrder = {
      id: orderData.orderNumber,
      orderNumber: orderData.orderNumber,
      status: ORDER_STATUSES.NEW,
      customerInfo: orderData.orderForm,
      items: orderData.cartItems,
      pricing: orderData.priceCalculation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: []
    };

    console.log('OrdersContext: Создаем новый заказ:', newOrder);
    
    setOrders(prev => {
      console.log('OrdersContext: Текущие заказы:', prev);
      const newOrders = [newOrder, ...prev];
      console.log('OrdersContext: Новый список заказов:', newOrders);
      return newOrders;
    });
    
    console.log('OrdersContext: Заказ создан и добавлен в состояние');
    return newOrder;
  };

  // Обновить статус заказа
  const updateOrderStatus = (orderId, newStatus, note = '') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };

        // Добавляем заметку об изменении статуса
        if (note || order.status !== newStatus) {
          updatedOrder.notes = [
            ...order.notes,
            {
              id: Date.now(),
              text: note || `Статус изменен с "${STATUS_LABELS[order.status]}" на "${STATUS_LABELS[newStatus]}"`,
              timestamp: new Date().toISOString(),
              type: 'status_change'
            }
          ];
        }

        return updatedOrder;
      }
      return order;
    }));
  };

  // Добавить заметку к заказу
  const addOrderNote = (orderId, noteText) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          notes: [
            ...order.notes,
            {
              id: Date.now(),
              text: noteText,
              timestamp: new Date().toISOString(),
              type: 'note'
            }
          ],
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    }));
  };

  // Получить заказ по ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  // Получить заказы по статусу
  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  // Получить статистику заказов
  const getOrdersStats = () => {
    const stats = {
      total: orders.length,
      byStatus: {},
      totalRevenue: 0,
      recentOrders: orders.slice(0, 5)
    };

    // Подсчет по статусам
    Object.values(ORDER_STATUSES).forEach(status => {
      stats.byStatus[status] = orders.filter(order => order.status === status).length;
    });

    // Подсчет общей выручки (только доставленные заказы)
    stats.totalRevenue = orders
      .filter(order => order.status === ORDER_STATUSES.DELIVERED)
      .reduce((sum, order) => sum + (order.pricing?.total || 0), 0);

    return stats;
  };

  // Удалить заказ (только для отмененных заказов)
  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  // Поиск заказов
  const searchOrders = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return orders.filter(order => 
      order.orderNumber.toLowerCase().includes(lowercaseQuery) ||
      order.customerInfo.name.toLowerCase().includes(lowercaseQuery) ||
      order.customerInfo.phone.includes(lowercaseQuery) ||
      (order.customerInfo.email && order.customerInfo.email.toLowerCase().includes(lowercaseQuery))
    );
  };

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    addOrderNote,
    getOrderById,
    getOrdersByStatus,
    getOrdersStats,
    deleteOrder,
    searchOrders,
    ORDER_STATUSES,
    STATUS_LABELS,
    STATUS_COLORS
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};
