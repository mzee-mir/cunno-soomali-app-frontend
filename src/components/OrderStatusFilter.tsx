import React from 'react';
import { ORDER_STATUS } from "@/config/order-status-config"; // Import ORDER_STATUS
import { useTranslation } from 'react-i18next';

type OrderStatusFilterProps = {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
};

const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({ selectedStatus, onStatusChange }) => {
  const { t } = useTranslation();
  return (
    <div className="mb-4">
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">{t('orderStatusFilter.status')}</option>
        {ORDER_STATUS.map(status => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrderStatusFilter;
