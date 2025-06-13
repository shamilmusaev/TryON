const MAX_WARDROBE_ITEMS = 100;
const STORAGE_KEY = 'wardrobe_items';

const wardrobeStorage = {
  
  saveItem(itemData) {
    if (!itemData || !itemData.url) {
      console.error('Невозможно сохранить: неверные данные', itemData);
      return null;
    }

    try {
      let items = this.getAllItems();
      
      const newItem = {
        ...itemData,
        id: `wardrobe_${new Date().getTime()}`,
        savedAt: new Date().toISOString(),
      };

      // Проверяем, нет ли уже такого элемента
      const existingItemIndex = items.findIndex(item => item.url === newItem.url);
      if (existingItemIndex > -1) {
        console.log('Элемент уже в гардеробе.');
        return items[existingItemIndex];
      }

      items.unshift(newItem);

      if (items.length > MAX_WARDROBE_ITEMS) {
        items = items.slice(0, MAX_WARDROBE_ITEMS);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      console.log(`✅ Изображение сохранено в гардероб. ID: ${newItem.id}`);
      return newItem;
    } catch (error) {
      console.error('Ошибка сохранения в гардероб:', error);
      return null;
    }
  },

  getAllItems() {
    try {
      const items = localStorage.getItem(STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Ошибка получения элементов из гардероба:', error);
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  },

  deleteItem(itemId) {
    try {
      let items = this.getAllItems();
      const updatedItems = items.filter(item => item.id !== itemId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      console.log(`🗑️ Элемент удален из гардероба. ID: ${itemId}`);
      return true;
    } catch (error) {
      console.error('Ошибка удаления элемента из гардероба:', error);
      return false;
    }
  },
};

export default wardrobeStorage; 