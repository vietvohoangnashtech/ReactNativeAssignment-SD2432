import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useCartStore} from '../store/cartStore';
import {ACCENT, BG, CARD_BG, DARK, MID, DIVIDER, DANGER} from '../constants/theme';
import {ScreenHeader} from '../components/ScreenHeader';
import type {RootStackNavigationProp} from '../types/navigation';

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Cart'>>();
  const {items, removeItem, updateQuantity, totalAmount, clearCart} =
    useCartStore();

  const renderItem = ({item}: {item: (typeof items)[0]}) => (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        {item.image ? (
          <Image
            source={{uri: item.image}}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <MaterialCommunityIcons name="image" size={32} color={MID} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() =>
              item.quantity > 1
                ? updateQuantity(item.id, item.quantity - 1)
                : removeItem(item.id)
            }>
            <MaterialCommunityIcons
              name={item.quantity > 1 ? 'minus' : 'delete-outline'}
              size={16}
              color={item.quantity > 1 ? DARK : DANGER}
            />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}>
            <MaterialCommunityIcons name="plus" size={16} color={DARK} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeItem(item.id)}>
        <MaterialCommunityIcons name="close" size={18} color={MID} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={`My Cart${items.length > 0 ? ` (${items.length})` : ''}`}
        onBack={() => navigation.goBack()}
        right={
          items.length > 0 ? (
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="cart-outline" size={64} color={MID} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add items to get started</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.shopBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={it => String(it.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Order summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Subtotal ({items.length} items)
              </Text>
              <Text style={styles.summaryValue}>
                ${totalAmount().toFixed(2)}
              </Text>
            </View>
            <View style={[styles.summaryRow, {marginTop: 4}]}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={[styles.summaryValue, {color: '#10B981'}]}>
                Free
              </Text>
            </View>
            <View style={[styles.summaryDivider, {marginVertical: 12}]} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${totalAmount().toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate('Checkout')}>
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color={DARK}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: BG},
  list: {padding: 16, gap: 12, paddingBottom: 8},
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DIVIDER,
    padding: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageBox: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },
  productImage: {width: '100%', height: '100%'},
  info: {flex: 1, justifyContent: 'space-between'},
  name: {fontSize: 14, fontWeight: '600', color: DARK, marginBottom: 4},
  price: {fontSize: 16, fontWeight: '700', color: DARK},
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {fontSize: 15, fontWeight: '700', color: DARK, minWidth: 20, textAlign: 'center'},
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8},
  emptyTitle: {fontSize: 20, fontWeight: '700', color: DARK},
  emptySubtitle: {fontSize: 14, color: MID, marginBottom: 16},
  shopBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  shopBtnText: {fontSize: 16, fontWeight: '700', color: DARK},
  summary: {
    backgroundColor: CARD_BG,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: DIVIDER,
    gap: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {fontSize: 14, color: MID, fontWeight: '500'},
  summaryValue: {fontSize: 14, fontWeight: '600', color: DARK},
  summaryDivider: {height: 1, backgroundColor: DIVIDER},
  totalLabel: {fontSize: 16, fontWeight: '700', color: DARK},
  totalValue: {fontSize: 20, fontWeight: '800', color: DARK},
  checkoutBtn: {
    marginTop: 16,
    backgroundColor: ACCENT,
    borderRadius: 12,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: ACCENT,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutBtnText: {fontSize: 16, fontWeight: '700', color: DARK},
  clearText: {fontSize: 14, fontWeight: '600', color: DANGER},
});


