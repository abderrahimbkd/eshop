import { getCurrentUser } from '@/actions/getCurrentUser';
import NullData from '@/app/components/NullData';

import ManageOrdersClient from '../admin/manage-orders/manageOrdersClient';
import getOrdersByUserId from '@/actions/getOrdersByUserId';

const Orders = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <NullData title="Opps! Access denied" />;
  }
  const orders = await getOrdersByUserId(currentUser.id);
  if (!orders) {
    return <NullData title="No order Yet" />;
  }
  return (
    <div>
      <ManageOrdersClient orders={orders} />
    </div>
  );
};

export default Orders;
