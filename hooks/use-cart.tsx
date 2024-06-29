import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
export type CartProductType = {
  id: string;
  name: string;
  description: string;
  image: any;
  color: string;
  size: string;
  quantity: number;
  priceInCents: number;
};
type CartContextType = {
  id?: string;
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleClearCart: () => void;
  //   paymentIntent: string | null;
  //   handleSetPaymentIntent: (val: string | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  //   const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  useEffect(() => {
    const cartItems: any = localStorage.getItem("lynxlinkPieces");
    const cProducts: CartProductType[] | null = JSON.parse(cartItems);
    // const lynxlinkPaymentIntent: any = localStorage.getItem("lynxlinkPieces");
    // const paymentIntent: string | null = JSON.parse(lynxlinkPaymentIntent);
    setCartProducts(cProducts);
    // setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.priceInCents * item.quantity;
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

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart;
      if (prev) {
        updatedCart = [...prev, product];
      } else {
        updatedCart = [product];
      }
      localStorage.setItem("lynxlinkPieces", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter((item) => {
          return item.id !== product.id;
        });
        setCartProducts(filteredProducts);
        localStorage.setItem(
          "lynxlinkPieces",
          JSON.stringify(filteredProducts)
        );
      }
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    localStorage.setItem("lynxlinkPieces", JSON.stringify(null));
  }, [cartProducts]);

  //   const handleSetPaymentIntent = useCallback(
  //     (val: string | null) => {
  //       setPaymentIntent(val);
  //       localStorage.setItem("eShopPaymentIntent", JSON.stringify(val));
  //     },
  //     [paymentIntent]
  //   );

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleClearCart,
    // paymentIntent,
    // handleSetPaymentIntent,
  };
  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within provider");
  }
  return context;
};
