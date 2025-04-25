import React, { memo, useCallback } from "react";
import { IMenuItem } from "@/store/menuItemSlice"; // Assuming you have a MenuItem type
import { X } from "lucide-react"; // Import an icon for the clear button

interface MenuItemsListProps {
  items: IMenuItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  loading?: boolean;
}

const MenuItemsList = memo(({ 
  items, 
  selectedItemId, 
  onSelectItem,
  loading 
}: MenuItemsListProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string | null) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectItem(id);
      }
    },
    [onSelectItem]
  );

  const handleClearSelection = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectItem(null);
  }, [onSelectItem]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3 border rounded-lg bg-gray-100 animate-pulse h-16" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No menu items yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Clear selection button - only shown when an item is selected */}
      {selectedItemId && (
        <button
          onClick={handleClearSelection}
          className="flex items-center justify-center w-full p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          aria-label="Clear selection"
        >
          <X className="w-4 h-4 mr-1" />
          Clear Selection
        </button>
      )}

      <ul className="space-y-2" aria-label="Menu items list">
        {items.map((item) => (
          <li 
            key={item._id}
            tabIndex={0}
            role="button"
            aria-pressed={selectedItemId === item._id}
            aria-label={`Menu item: ${item.name}, Price: $${item.price.toFixed(2)}`}
            onClick={() => onSelectItem(item._id)}
            onKeyDown={(e) => handleKeyDown(e, item._id)}
            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selectedItemId === item._id
                ? "bg-blue-50 border-blue-300 shadow-sm"
                : "hover:bg-gray-50 hover:shadow-sm"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-sm font-medium text-gray-600">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.discount && item.discount > 0 && (
                    <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                      {item.discount}% off
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    item.stock
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.stock ? "In stock" : "Out of stock"}
                </span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    item.publish
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {item.publish ? "Published" : "Hidden"}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default MenuItemsList;