import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Header, Loader} from '../../component';
import {useNavigation} from '@react-navigation/native';

export const Cart = () => {
  const navigation: any = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const storedCart = await AsyncStorage.getItem('cartItems');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        const updatedCart = parsedCart.map((item: any) => ({
          ...item,
          quantity: item.quantity || 1,
        }));
        setCartItems(updatedCart);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
    }
  };

  const updateQuantity = async (
    id: number,
    action: 'increase' | 'decrease',
  ) => {
    const updatedCart: any = cartItems.map((item: any) => {
      if (item.id === id) {
        const updatedItem = {...item};
        if (action === 'increase') {
          updatedItem.quantity += 1;
        } else if (action === 'decrease' && updatedItem.quantity > 1) {
          updatedItem.quantity -= 1;
        }
        return updatedItem;
      }
      return item;
    });

    setCartItems(updatedCart);
    await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const removeItem = async (id: number) => {
    const updatedCart = cartItems.filter((item: any) => item.id !== id);
    setCartItems(updatedCart);
    await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const clearCart = async () => {
    setCartItems([]);
    await AsyncStorage.removeItem('cartItems');
  };

  const handleCheckout = () => {
    setIsModalVisible(true);
  };

  const confirmOrder = () => {
    clearCart();
    setIsModalVisible(false);
  };

  const renderCartItem = ({item}: any) => (
    <View style={styles.cartItem}
    accessible
     >
      <View style={styles.flexDirectionRow}>
        <Image source={{uri: item.image}} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item?.title}</Text>
          <Text style={styles.itemPrice}>{`₹${item?.price}`}</Text>

          <View style={styles.quantityContainer}>
            <Pressable 
            accessibilityLabel="Decrease quantity"
            accessibilityRole="button"
            onPress={() => updateQuantity(item?.id, 'decrease')}>
              <Text style={styles.quantityButton}>-</Text>
            </Pressable>
            <Text style={styles.quantity}>{item?.quantity || '1'}</Text>
            <Pressable  accessibilityLabel="Increase quantity"
              accessibilityRole="button" onPress={() => updateQuantity(item?.id, 'increase')}>
              <Text style={styles.quantityButton}>+</Text>
            </Pressable>
          </View>
        </View>
        <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${item?.title} from cart`}
          style={styles.removeButton}
          onPress={() => removeItem(item.id)}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </Pressable>
      </View>
      <Text style={styles.itemDescription} numberOfLines={3}>
        {item?.description}
      </Text>
    </View>
  );

  const ListEmptyComponent = () => {
    return <Text style={styles.emptyCart}>Your cart is empty.</Text>;
  };

  return (
    <View accessible style={styles.container}>
      <Header
        BackIconAvailable={true}
        CartIconAvailable={false}
        title="Cart"
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.main}>
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item: any) => item?.id.toString()}
            renderItem={renderCartItem}
            ListEmptyComponent={ListEmptyComponent}
          />
        )}
      </View>
      {cartItems?.length ? (
        <Pressable accessibilityRole={'button'} accessibilityLabel={'Checkout'} style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </Pressable>
      ) : null}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalText}>Order placed successfully.</Text>
            <Pressable style={styles.modalButton} onPress={confirmOrder}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  flexDirectionRow: {flexDirection: 'row'},
  cartItem: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    fontSize: 24,
    paddingHorizontal: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  removeButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  emptyCart: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
  },
  checkoutButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: 300,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
