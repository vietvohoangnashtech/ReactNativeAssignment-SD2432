import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Text, TextInput, ActivityIndicator} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../utils/axios';
import {useCartStore} from '../store/cartStore';
import {useAuthStore} from '../store/authStore';
import {ACCENT, BG, CARD_BG, DARK, MID, DIVIDER} from '../constants/theme';
import {ScreenHeader} from '../components/ScreenHeader';
import type {RootStackNavigationProp} from '../types/navigation';

const ACCENT_BORDER = ACCENT;
const INPUT_BG = BG;

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'];

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Checkout'>>();
  const {items, totalAmount, clearCart} = useCartStore();
  const {user} = useAuthStore();

  const [shippingAddress, setShippingAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0]);
  const [loading, setLoading] = useState(false);
  const [fetchingMethods, setFetchingMethods] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(PAYMENT_METHODS);

  useEffect(() => {
    setFetchingMethods(true);
    axiosInstance
      .get('/orders/payment-methods')
      .then(r => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setPaymentMethods(r.data);
          setSelectedPayment(r.data[0]);
        }
      })
      .catch(() => {/* use defaults */})
      .finally(() => setFetchingMethods(false));
  }, []);

  const placeOrder = async () => {
    if (!shippingAddress.trim()) {
      Alert.alert('Missing Info', 'Please enter a shipping address.');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
        totalAmount: totalAmount(),
        shippingAddress: shippingAddress.trim(),
        paymentMethod: selectedPayment,
      };
      await axiosInstance.post('/orders', payload);
      clearCart();
      Alert.alert('Order Placed!', 'Your order has been placed successfully.', [
        {
          text: 'View Orders',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{name: 'MainTabs'}],
            });
            setTimeout(() => navigation.navigate('OrderHistory'), 300);
          },
        },
        {
          text: 'Continue Shopping',
          onPress: () =>
            navigation.reset({index: 0, routes: [{name: 'MainTabs'}]}),
        },
      ]);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Checkout"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* Order summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map(item => (
            <View key={item.id} style={styles.summaryItem}>
              <View style={styles.summaryItemLeft}>
                <View style={styles.itemQtyBadge}>
                  <Text style={styles.itemQtyText}>{item.quantity}</Text>
                </View>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalAmount().toFixed(2)}</Text>
          </View>
        </View>

        {/* Shipping address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <TextInput
            mode="outlined"
            label="Full Address"
            value={shippingAddress}
            onChangeText={setShippingAddress}
            placeholder="Street, City, State, ZIP, Country"
            multiline
            numberOfLines={3}
            outlineColor={DIVIDER}
            activeOutlineColor={ACCENT_BORDER}
            style={[styles.input, {height: 70}]}
            contentStyle={{paddingTop: 8}}
            theme={{colors: {background: INPUT_BG}}}
          />
        </View>

        {/* Payment method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {fetchingMethods ? (
            <ActivityIndicator size="small" color={ACCENT} />
          ) : (
            <View style={styles.paymentList}>
              {paymentMethods.map(method => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentOption,
                    selectedPayment === method && styles.paymentOptionActive,
                  ]}
                  onPress={() => setSelectedPayment(method)}>
                  <MaterialCommunityIcons
                    name={
                      method.toLowerCase().includes('credit') ||
                      method.toLowerCase().includes('debit')
                        ? 'credit-card-outline'
                        : method.toLowerCase().includes('paypal')
                        ? 'alpha-p-circle-outline'
                        : 'cash'
                    }
                    size={20}
                    color={selectedPayment === method ? DARK : MID}
                  />
                  <Text
                    style={[
                      styles.paymentText,
                      selectedPayment === method && styles.paymentTextActive,
                    ]}>
                    {method}
                  </Text>
                  {selectedPayment === method && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={18}
                      color={DARK}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Customer info (read-only) */}
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery To</Text>
            <View style={styles.customerCard}>
              <MaterialCommunityIcons
                name="account-circle"
                size={36}
                color={MID}
              />
              <View style={styles.customerInfoBody}>
                <Text style={styles.customerName}>
                  {user.fullName || user.username}
                </Text>
                {user.email ? (
                  <Text style={styles.customerEmail}>{user.email}</Text>
                ) : null}
              </View>
            </View>
          </View>
        )}

        <View style={styles.scrollSpacer} />
      </ScrollView>

      {/* Place order button */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total Amount</Text>
          <Text style={styles.footerTotalValue}>${totalAmount().toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeOrderBtn, loading && styles.btnDisabled]}
          onPress={placeOrder}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={DARK} />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: BG},
  content: {padding: 16},
  section: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DIVIDER,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK,
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryItemLeft: {flexDirection: 'row', alignItems: 'center', flex: 1},
  itemQtyBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  itemQtyText: {fontSize: 11, fontWeight: '700', color: DARK},
  itemName: {fontSize: 14, color: DARK, flex: 1},
  itemPrice: {fontSize: 14, fontWeight: '700', color: DARK},
  divider: {height: 1, backgroundColor: DIVIDER, marginVertical: 12},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {fontSize: 16, fontWeight: '700', color: DARK},
  totalValue: {fontSize: 20, fontWeight: '800', color: DARK},
  input: {backgroundColor: INPUT_BG},
  paymentList: {gap: 8},
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: DIVIDER,
    borderRadius: 10,
    padding: 12,
  },
  paymentOptionActive: {
    borderColor: ACCENT_BORDER,
    backgroundColor: 'rgba(13,242,242,0.06)',
  },
  paymentText: {fontSize: 14, fontWeight: '500', color: MID},
  paymentTextActive: {fontWeight: '700', color: DARK},
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
  },
  customerName: {fontSize: 15, fontWeight: '700', color: DARK},
  customerEmail: {fontSize: 13, color: MID, marginTop: 2},
  checkIcon: {marginLeft: 'auto'},
  customerInfoBody: {marginLeft: 12},
  scrollSpacer: {height: 120},
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CARD_BG,
    borderTopWidth: 1,
    borderTopColor: DIVIDER,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerTotal: {flex: 1},
  footerTotalLabel: {fontSize: 12, color: MID, fontWeight: '500'},
  footerTotalValue: {fontSize: 22, fontWeight: '800', color: DARK},
  placeOrderBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ACCENT,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {opacity: 0.6},
  placeOrderText: {fontSize: 16, fontWeight: '700', color: DARK},
});


