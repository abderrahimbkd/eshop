/* eslint-disable react-hooks/exhaustive-deps */
import { CartProductType } from '@/app/product/[productId]/ProductDetails';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  paymentIntent: string | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleSetPaymentIntent: (val: string | null) => void;
  handleClearCart: () => void;
};

// create context
export const CartContext = createContext<CartContextType | null>(null);

//create provider
interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  // de ne pas perdre product after refresh
  useEffect(() => {
    const cartItem: any = localStorage.getItem('eShopCartItems');
    const cProducts: CartProductType[] | null = JSON.parse(cartItem);
    const eShopPaymentIntent: any = localStorage.getItem('eShopPaymentIntent');
    const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);

    setCartProducts(cProducts);
    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;
            acc.total += itemTotal;
            acc.qty += item.quantity;
            return acc;
          },
          {
            total: 0,
            qty: 0,
          }
        );
        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };
    getTotals();
  }, [cartProducts]);

  // add product to cart
  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart;

      if (prev) {
        updatedCart = [...prev, product];
      } else {
        updatedCart = [product];
      }
      toast.success('Product added to cart');
      localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart));

      return updatedCart;
    });
  }, []);

  // remove product from cart
  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filterProducts = cartProducts.filter((item) => {
          return item.id !== product.id;
        });
        setCartProducts(filterProducts);
        toast.success('Product removed');
        localStorage.setItem('eShopCartItems', JSON.stringify(filterProducts));
      }
    },
    [cartProducts]
  );

  // Increase Quantity
  const handleCartQtyIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity === 99) {
        return toast.error('Opps Maximum reached');
      }

      if (cartProducts) {
        updatedCart = [...cartProducts];
        const existingIndex = cartProducts.findIndex((item) => item.id === product.id);
        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity = ++updatedCart[existingIndex].quantity;
        }
        setCartProducts(updatedCart);
        localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  // Decrease quantity
  const handleCartQtyDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity === 1) {
        return toast.error('Opps Minimun reached');
      }

      if (cartProducts) {
        updatedCart = [...cartProducts];
        const existingIndex = cartProducts.findIndex((item) => item.id === product.id);
        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity = --updatedCart[existingIndex].quantity;
        }
        setCartProducts(updatedCart);
        localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  //Clear cart data
  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    localStorage.setItem('eShopCartItems', JSON.stringify(null));
    
  }, [cartProducts]);

  const handleSetPaymentIntent = useCallback( (val: string | null) => {
      setPaymentIntent(val);
      localStorage.setItem('eShopPaymentIntent', JSON.stringify(val));
    },
    [paymentIntent]
  );

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    paymentIntent,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    handleSetPaymentIntent,
  };

  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error('useCart must be used within a CartContextProvider');
  }
  return context;
};
