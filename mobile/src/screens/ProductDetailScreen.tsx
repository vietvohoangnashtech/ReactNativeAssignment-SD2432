import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCartStore} from '../store/cartStore';
import {ACCENT, BG, CARD_BG, DARK, MUTED, STAR_COLOR} from '../constants/theme';
import type {Product} from '../types';
import type {RootStackNavigationProp, ProductDetailRouteProp} from '../types/navigation';

const DARK_TEXT = DARK;
const TAG_TEXT = ACCENT;
const DIVIDER = '#F3F4F6';

export const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'ProductDetail'>>();
  const route = useRoute<ProductDetailRouteProp>();
  const {product}: {product: Product} = route.params;
  const {addItem} = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={DARK_TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialCommunityIcons name="share-variant" size={22} color={DARK_TEXT} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product image with pagination */}
        <View style={styles.imageSection}>
          {product.image ? (
            <Image source={{uri: product.image}} style={styles.productImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons name="image" size={64} color={MUTED} />
            </View>
          )}
          {/* Image pagination indicator */}
          <View style={styles.paginationContainer}>
            <View style={styles.paginationDot} />
          </View>
        </View>

        {/* Product info */}
        <View style={styles.infoSection}>
          <View style={styles.infoTop}>
            <View style={styles.infoLeft}>
              {product.isOnSale && (
                <Text style={styles.newTag}>NEW ARRIVAL</Text>
              )}
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(s => (
                  <MaterialCommunityIcons
                    key={s}
                    name={s <= 4 ? 'star' : 'star-half-full'}
                    size={16}
                    color={STAR_COLOR}
                  />
                ))}
                <Text style={styles.reviewCount}> (128 Reviews)</Text>
              </View>
            </View>
            <TouchableOpacity>
              <MaterialCommunityIcons name="heart-outline" size={26} color={DARK_TEXT} />
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>${Number(product.price).toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                ${Number(product.originalPrice).toFixed(2)}
              </Text>
            )}
          </View>
        </View>

        {/* Key features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresGrid}>
            {[
              {icon: 'battery-80', label: 'Battery', value: '48 Hours'},
              {icon: 'bluetooth', label: 'Sync', value: 'Bluetooth 5.2'},
              {icon: 'water', label: 'Water', value: '5ATM Resist'},
              {icon: 'shield-check', label: 'Warranty', value: '12 Months'},
            ].map(f => (
              <View key={f.label} style={styles.featureTile}>
                <View style={styles.featureIconWrap}>
                  <MaterialCommunityIcons name={f.icon as any} size={20} color={ACCENT} />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureValue}>{f.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* Reviews */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>User Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {[
            {
              name: 'Jane Doe',
              date: '2 days ago',
              text: 'Absolutely love this! The quality is impressive and highly accurate.',
            },
            {
              name: 'Mark Smith',
              date: '1 week ago',
              text: 'The best product I have owned so far. Highly recommended for the price.',
            },
          ].map((r, i) => (
            <View
              key={i}
              style={[styles.reviewItem, i === 0 && styles.reviewItemBorder]}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{r.name[0]}</Text>
                </View>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewerName}>{r.name}</Text>
                  <View style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <MaterialCommunityIcons
                        key={s}
                        name="star"
                        size={12}
                        color={STAR_COLOR}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addCartText}>{added ? 'Added!' : 'Add to Cart'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyNowBtn}
          onPress={() => {
            addItem({
              id: product.id,
              name: product.name,
              price: Number(product.price),
              image: product.image,
            });
            navigation.navigate('Checkout');
          }}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: BG},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
  },
  headerBtn: {padding: 8},
  headerTitle: {fontSize: 18, fontWeight: '600', color: DARK_TEXT},
  imageSection: {
    backgroundColor: CARD_BG,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {width: '100%', height: '100%', resizeMode: 'cover'},
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    backgroundColor: CARD_BG,
    padding: 24,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoLeft: {flex: 1, marginRight: 12},
  newTag: {
    fontSize: 12,
    fontWeight: '700',
    color: TAG_TEXT,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  productName: {fontSize: 24, fontWeight: '700', color: DARK_TEXT, marginBottom: 8},
  starsRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  reviewCount: {fontSize: 13, color: '#6B7280', marginLeft: 4},
  priceRow: {flexDirection: 'row', alignItems: 'baseline', gap: 12},
  currentPrice: {fontSize: 30, fontWeight: '700', color: DARK_TEXT},
  originalPrice: {
    fontSize: 18,
    color: MUTED,
    textDecorationLine: 'line-through',
  },
  section: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  lastSection: {marginBottom: 100},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK_TEXT,
    marginBottom: 12,
  },
  seeAll: {fontSize: 14, color: ACCENT, fontWeight: '600'},
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  featureTile: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: DIVIDER,
    borderRadius: 12,
    padding: 12,
  },
  featureIconWrap: {
    backgroundColor: 'rgba(13,242,242,0.1)',
    borderRadius: 8,
    padding: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featureLabel: {fontSize: 12, color: '#6B7280', marginBottom: 2},
  featureValue: {fontSize: 14, fontWeight: '600', color: DARK_TEXT},
  descriptionText: {fontSize: 14, color: '#4B5563', lineHeight: 22},
  reviewItem: {paddingVertical: 12},
  reviewItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  reviewAvatarText: {fontSize: 16, fontWeight: '700', color: '#111'},
  reviewMeta: {flex: 1},
  reviewerName: {fontSize: 14, fontWeight: '600', color: DARK_TEXT},
  reviewStars: {flexDirection: 'row', marginTop: 2},
  reviewDate: {fontSize: 12, color: MUTED},
  reviewText: {fontSize: 14, color: '#6B7280', lineHeight: 20},
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CARD_BG,
    borderTopWidth: 1,
    borderTopColor: DIVIDER,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  addCartBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ACCENT,
  },
  addCartText: {
    fontSize: 16,
    fontWeight: '700',
    color: ACCENT,
  },
  buyNowBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT,
  },
});


