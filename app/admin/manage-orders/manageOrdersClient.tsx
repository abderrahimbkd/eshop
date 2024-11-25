/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Order, Product, User } from '@prisma/client';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { formatPrice } from '@/utils/formatPrice';
import Heading from '@/app/components/Heading';
import Status from '@/app/components/Status';
import { MdAccessTimeFilled, MdDeliveryDining, MdDone, MdRemoveRedEye } from 'react-icons/md';
import ActionBtn from '@/app/components/ActionBtn';
import { useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import moment from 'moment';

interface ManageOrdersClientProps {
  orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
  user: User;
};

const ManageOrdersClient: React.FC<ManageOrdersClientProps> = ({ orders }) => {
  const router = useRouter();

  let rows: any = [];

  if (orders) {
    rows = orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatPrice(order.amount / 100),
        paymentStatus: order.status,
        date: moment(order.createDate).fromNow(),
        deliveryStatus: order.deliveryStatus,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'customer', headerName: 'Customer Name', width: 130 },
    {
      field: 'amount',
      headerName: 'Amount(USD)',
      width: 100,
      renderCell: (params) => {
        return <div className="font-bold text-slate-800">{params.row.amount}</div>;
      },
    },

    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      width: 120,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">
            {params.row.paymentStatus === 'pending' ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.paymentStatus === 'complete' ? (
              <Status text="completed" icon={MdDone} bg="bg-green-200" color="text-green-700" />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: 'delivery Status',
      headerName: 'Delivery Status',
      width: 120,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800">
            {params.row.deliveryStatus === 'pending' ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : params.row.deliveryStatus === 'dispatched' ? (
              <Status
                text="dispatched"
                icon={MdDeliveryDining}
                bg="bg-purple-200"
                color="text-purple-700"
              />
            ) : params.row.deliveryStatus === 'delivered' ? (
              <Status text="delivered" icon={MdDone} bg="bg-green-200" color="text-green-700" />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-4 w-full">
            <ActionBtn
              icon={MdDeliveryDining}
              onclick={() => {
                handleDispatch(params.row.id);
              }}
            />
            <ActionBtn
              icon={MdDone}
              onclick={() => {
                handleDelete(params.row.id);
              }}
            />
            <ActionBtn
              icon={MdRemoveRedEye}
              onclick={() => {
                router.push(`/order/${params.row.id}`);
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleDispatch = useCallback((id: string) => {
    axios
      .put('/api/order', {
        id,
        deliveryStatus: 'dispatched',
      })
      .then((res) => {
        toast.success('Product dispatched');
        router.refresh();
      })
      .catch((error) => {
        toast.error('Something went wrong!');
      });
  }, []);

  const handleDelete = useCallback((id: string) => {
    axios
      .put('/api/order', {
        id,
        deliveryStatus: 'delivered',
      })
      .then((res) => {
        toast.success('Product delivered');
        router.refresh();
      })
      .catch((error) => {
        toast.error('Something went wrong!');
      });
  }, []);

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mb-4 mt-8">
        <Heading title="Manage Orders" />
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

export default ManageOrdersClient;
