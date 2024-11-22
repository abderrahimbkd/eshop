import getProducts from '@/actions/getProducts';

import { getCurrentUser } from '@/actions/getCurrentUser';
import NullData from '@/app/components/NullData';
import ManageOrdersClient from './manageOrdersClient';
import getOrders from '@/actions/getOrders';

const ManageProducts = async () => {
  const orders = await getOrders();
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <NullData title="Opps! Access denied" />;
  }

  return (
    <div>
      <ManageOrdersClient orders={orders} />
    </div>
  );
};

export default ManageProducts;
