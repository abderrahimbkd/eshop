import ManageProductsClient from './manageProductsClient';
import { getCurrentUser } from '@/actions/getCurrentUser';
import getProducts from '@/actions/getProducts';
import NullData from '@/app/components/NullData';

const ManageProducts = async () => {
  const products = await getProducts({ category: null });
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <NullData title="Opps! Access denied" />;
  }

  return (
    <div>
      <ManageProductsClient products={products} />
    </div>
  );
};

export default ManageProducts;
