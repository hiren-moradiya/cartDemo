import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProductList} from '../../redux/action';
import {Header, Loader} from '../../component';
import {ROUTES} from '../../utils';

export const ProductList = () => {
  const disPatch: any = useDispatch();
  const navigation: any = useNavigation();

  const {ProductListLoading, ProductListSuccess} = useSelector(
    (state: any) => state?.ProductList,
  );

  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    disPatch(getProductList());
  }, []);

  useEffect(() => {
    // Filter products based on the search query
    if (searchText) {
      const filtered = ProductListSuccess.filter((item: any) =>
        item?.title?.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(ProductListSuccess);
    }
  }, [searchText, ProductListSuccess]);

  const addToCart = async (item: any) => {
    try {
      const existingCart = await AsyncStorage.getItem('cartItems');
      let cartItems = existingCart ? JSON.parse(existingCart) : [];

      const isItemInCart = cartItems.some(
        (cartItem: any) => cartItem.id === item.id,
      );

      if (isItemInCart) {
        Alert.alert('Item is already in the cart');
        return;
      } else {
        cartItems.push(item);
        await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
        Alert.alert('Item added to the cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.productCard}>
        <Image
          source={{uri: item?.image}}
          resizeMode="contain"
          style={styles.productImage}
        />
        <View style={{flex: 1}}>
          <Text style={styles.productTitle}>{item?.title}</Text>
          <Text style={styles.productPrice}>{`₹${item?.price}`}</Text>
          <Pressable
            style={styles.addToCartButton}
            onPress={() => addToCart(item)}>
            <Text style={styles.addToCartText}>{'Add to cart'}</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{'No data found'}</Text>
    </View>
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await disPatch(getProductList());
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Header
        BackIconAvailable={false}
        CartIconAvailable={true}
        title="Products"
        onPressBack={() => navigation.goBack()}
        onPressCart={() => navigation?.navigate(ROUTES.CART)}
      />
      <View style={styles.main}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search products"
          value={searchText}
          onChangeText={setSearchText}
        />
        {ProductListLoading ? (
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            extraData={filteredProducts}
            renderItem={renderItem}
            ListEmptyComponent={ListEmptyComponent}
            keyExtractor={(_, index) => index?.toString()}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  main: {
    flex: 1,
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    height: 100,
    width: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 12,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
