/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Product } from '@prisma/client';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { formatPrice } from '@/utils/formatPrice';
import Heading from '@/app/components/Heading';
import Status from '@/app/components/Status';
import { MdCached, MdClose, MdDelete, MdDone, MdRemoveRedEye } from 'react-icons/md';
import ActionBtn from '@/app/components/ActionBtn';
import { useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import firebaseApp from '@/libs/firebase';

interface ManageProductsClientProps {
  products: Product[];
}

const ManageProductsClient: React.FC<ManageProductsClientProps> = ({ products }) => {
  const router = useRouter();
  const storage = getStorage(firebaseApp);

  let rows: any = [];

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        images: product.images,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
      renderCell: (params) => {
        return <div className="font-bold text-slate-800">{params.row.price}</div>;
      },
    },
    { field: 'category', headerName: 'Category', width: 100 },
    { field: 'brand', headerName: 'Brand', width: 100 },
    { field: 'inStock', headerName: 'inStock', width: 100 },
    {
      field: 'images',
      headerName: 'Images',
      width: 120,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">
            {params.row.inStock === true ? (
              <Status text="in Stock" icon={MdDone} bg="bg-teal-200" color="text-teal-700" />
            ) : (
              <Status text="out of Stock" icon={MdClose} bg="bg-rose-200" color="text-rose-700" />
            )}
          </div>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
              icon={MdCached}
              onclick={() => {
                handleToggleStock(params.row.id, params.row.inStock);
              }}
            />
            <ActionBtn
              icon={MdDelete}
              onclick={() => {
                handleDelete(params.row.id, params.row.images);
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onclick={() => {
                router.push(`product/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleToggleStock = useCallback((id: string, inStock: boolean) => {
    axios
      .put('/api/product', {
        id,
        inStock: !inStock,
      })
      .then((res) => {
        toast.success('Product status changed');
        router.refresh();
      })
      .catch((error) => {
        toast.error('Something went wrong!');
      });
  }, []);

  const handleDelete = useCallback(async (id: string, images: any[]) => {
    toast('Deleting product,please wait!');

    const handleImageDelete = async () => {
      try {
        for (const item of images) {
          if (item.image) {
            const imageRef = ref(storage, item.image);
            await deleteObject(imageRef);
            console.log('image delete', item.image);
          }
        }
      } catch (error) {
        return console.log('Deleting images error', error);
      }
    };

    await handleImageDelete();

    // delete the product

    axios
      .delete(`/api/product/${id}`)
      .then((res) => {
        toast.success('Product deleted');
        router.refresh();
      })
      .catch((error) => {
        toast.error('Something went wrong!');
      });
  }, []);

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Product" />
      </div>
      <DataGrid
        style={{ height: 600, width: '100%' }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 9 },
          },
        }}
        pageSizeOptions={[9, 20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default ManageProductsClient;
