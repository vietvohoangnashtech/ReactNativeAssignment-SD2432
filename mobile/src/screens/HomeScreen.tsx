import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Text, ActivityIndicator} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useAuthStore} from '../store/authStore';
import {useCartStore} from '../store/cartStore';
import axiosInstance from '../utils/axios';
import {ACCENT, CARD_BG, BG, INPUT_BG, DARK, MID} from '../constants/theme';
import type {Product} from '../types';
import type {RootStackNavigationProp} from '../types/navigation';

const IMG_BG = INPUT_BG;
const DARK_TEXT = DARK;
const MID_TEXT = '#4B5563';
const LIGHT_TEXT = MID;
const SEARCH_BG = INPUT_BG;
const ACTIVE_CAT_BG = ACCENT;
const INACTIVE_CAT_BG = BG;

const CATEGORIES = ['All Items', 'Electronics', 'Fashion', 'Home', 'Beauty'];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'MainTabs'>>();
  const {isLoggedIn} = useAuthStore();
  const {addItem, totalItems} = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Items');

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
      setFiltered(response.data);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Failed to load products');
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      fetchProducts().finally(() => setLoading(false));
    }
  }, [isLoggedIn, fetchProducts]);

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'All Items') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q),
      );
    }
    setFiltered(result);
  }, [search, activeCategory, products]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const cartCount = totalItems();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  const renderProduct = ({item}: {item: Product}) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', {product: item})}
      activeOpacity={0.85}>
      <View style={styles.imageWrap}>
        {item.image ? (
          <Image source={{uri: item.image}} style={styles.productImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="image" size={32} color={LIGHT_TEXT} />
          </View>
        )}
        {item.isOnSale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>SALE</Text>
          </View>
        )}
        <TouchableOpacity style={styles.wishlistBtn}>
          <MaterialCommunityIcons name="heart-outline" size={16} color={DARK_TEXT} />
        </TouchableOpacity>
      </View>
      <Text style={styles.productName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.productCategory}>{item.category}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.productPrice}>${Number(item.price).toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.addCartBtn}
          onPress={() =>
            addItem({id: item.id, name: item.name, price: Number(item.price), image: item.image})
          }>
          <MaterialCommunityIcons name="plus" size={16} color={DARK_TEXT} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.pageTitle}>Discover</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Cart')}>
              <MaterialCommunityIcons name="cart-outline" size={22} color={DARK_TEXT} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <MaterialCommunityIcons
            name="magnify"
            size={18}
            color={LIGHT_TEXT}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands..."
            placeholderTextColor={LIGHT_TEXT}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                activeCategory === cat && styles.categoryPillActive,
              ]}
              onPress={() => setActiveCategory(cat)}>
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.categoryTextActive,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products grid */}
      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ACCENT]} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const CARD_WIDTH = '48%';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: BG},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20},
  header: {
    backgroundColor: BG,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pageTitle: {fontSize: 20, fontWeight: '700', color: DARK_TEXT},
  headerIcons: {flexDirection: 'row', gap: 16},
  iconBtn: {position: 'relative', padding: 4},
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: ACCENT,
    borderRadius: 9999,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {fontSize: 10, fontWeight: '700', color: '#111827'},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SEARCH_BG,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {marginRight: 8},
  searchInput: {flex: 1, fontSize: 14, color: DARK_TEXT},
  categoryScroll: {marginBottom: 4},
  categoryContent: {paddingRight: 8, gap: 8, flexDirection: 'row'},
  categoryPill: {
    backgroundColor: INACTIVE_CAT_BG,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  categoryPillActive: {backgroundColor: ACTIVE_CAT_BG},
  categoryText: {fontSize: 14, fontWeight: '500', color: MID_TEXT},
  categoryTextActive: {color: '#000000', fontWeight: '600'},
  list: {padding: 16, paddingBottom: 100},
  row: {justifyContent: 'space-between', marginBottom: 16},
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageWrap: {
    height: 150,
    backgroundColor: IMG_BG,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {width: '100%', height: '100%', resizeMode: 'cover'},
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: IMG_BG,
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: ACCENT,
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  saleBadgeText: {fontSize: 10, fontWeight: '700', color: '#000'},
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 9999,
    padding: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: DARK_TEXT,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  productCategory: {
    fontSize: 12,
    color: LIGHT_TEXT,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  productPrice: {fontSize: 16, fontWeight: '700', color: DARK_TEXT},
  addCartBtn: {
    backgroundColor: ACCENT,
    borderRadius: 8,
    padding: 6,
  },
  errorText: {color: '#EF4444', textAlign: 'center'},
  emptyText: {color: LIGHT_TEXT, textAlign: 'center'},
});


