import getProducts from '@/actions/getProducts';

import { getCurrentUser } from '@/actions/getCurrentUser';
import NullData from '@/app/components/NullData';

import OrderClient from './OrderClient';
import getOrdersByUserId from '@/actions/getOrdersByUserId';

const ManageProducts = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <NullData title="Opps! Access denied" />;
  }

  const orders = await getOrdersByUserId(currentUser.id);
  if (!orders) {
    return <NullData title="No orders Yet" />;
  }

  return (
    <div>
      <OrderClient orders={orders} />
    </div>
  );
};

export default ManageProducts;
