import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {Text, ActivityIndicator} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../utils/axios';
import {CARD_BG, MUTED, DANGER} from '../constants/theme';
import {ScreenHeader} from '../components/ScreenHeader';
import type {Order} from '../types';
import type {RootStackNavigationProp} from '../types/navigation';

const BG = '#F8FAFA';
const DARK = '#0F172A';
const MID = '#64748B';
const DIVIDER = '#E2E8F0';
const ACTIVE_TAB = '#0D9488';
const INACTIVE_TAB = '#64748B';

const DELIVERED_BG = '#DCFCE7';
const DELIVERED_TEXT = '#15803D';
const SHIPPED_BG = 'rgba(13,148,136,0.1)';
const SHIPPED_TEXT = '#0D9488';
const PENDING_BG = '#FEF9C3';
const PENDING_TEXT = '#92400E';
const CANCELLED_BG = '#FEE2E2';
const CANCELLED_TEXT = '#DC2626';
const SLATE_BG = '#E2E8F0';
const SLATE_TEXT = '#475569';

type FilterTab = 'All' | 'Ongoing' | 'Completed' | 'Cancelled';

const statusConfig: Record<string, {bg: string; color: string}> = {
  delivered: {bg: DELIVERED_BG, color: DELIVERED_TEXT},
  shipped: {bg: SHIPPED_BG, color: SHIPPED_TEXT},
  processing: {bg: SHIPPED_BG, color: SHIPPED_TEXT},
  pending: {bg: PENDING_BG, color: PENDING_TEXT},
  cancelled: {bg: CANCELLED_BG, color: CANCELLED_TEXT},
};

const TABS: FilterTab[] = ['All', 'Ongoing', 'Completed', 'Cancelled'];
const ONGOING_STATUSES = ['pending', 'processing', 'shipped'];

export const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'OrderHistory'>>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/orders');
      setOrders(response.data);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Failed to load orders');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchOrders().finally(() => setLoading(false));
  }, [fetchOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const filtered = orders.filter(o => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Ongoing') return ONGOING_STATUSES.includes(o.status);
    if (activeTab === 'Completed') return o.status === 'delivered';
    if (activeTab === 'Cancelled') return o.status === 'cancelled';
    return true;
  });

  const getStatusLabel = (status: string) => status.toUpperCase();
  const getStatusStyle = (status: string) =>
    statusConfig[status] || {bg: SLATE_BG, color: SLATE_TEXT};

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const renderActionButtons = (order: Order) => {
    const s = order.status;
    if (s === 'delivered') {
      return (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
            <Text style={styles.primaryBtnText}>Reorder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
            <Text style={styles.secondaryBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (s === 'shipped' || s === 'processing') {
      return (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
            <MaterialCommunityIcons name="map-marker" size={14} color="#FFF" style={{marginRight: 4}} />
            <Text style={styles.primaryBtnText}>Track Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
            <Text style={styles.secondaryBtnText}>Details</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (s === 'cancelled') {
      return (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
            <Text style={styles.secondaryBtnText}>Buy Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderOrder = ({item}: {item: Order}) => {
    const sc = getStatusStyle(item.status);
    return (
      <View style={styles.orderCard}>
        <View style={styles.cardTop}>
          <View style={styles.cardLeft}>
            <Text style={styles.orderId}>
              ORDER #{`ORD-${String(item.id).padStart(5, '0')}`}
            </Text>
            <View style={[styles.statusBadge, {backgroundColor: sc.bg}]}>
              <Text style={[styles.statusText, {color: sc.color}]}>
                {getStatusLabel(item.status)}
              </Text>
            </View>
            <Text style={styles.orderTotal}>
              ${Number(item.totalAmount).toFixed(2)}
            </Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.orderImageWrap}>
            <MaterialCommunityIcons name="package-variant" size={36} color={MID} />
          </View>
        </View>
        {renderActionButtons(item)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Order History"
        onBack={() => navigation.goBack()}
      />

      {/* Filter tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}>
              {tab === 'All' ? 'All Orders' : tab}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={ACTIVE_TAB} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[ACTIVE_TAB]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={48}
                color={MID}
              />
              <Text style={styles.emptyText}>No orders yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: BG},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20},
  tabBar: {
    flexDirection: 'row',
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    position: 'relative',
  },
  tabText: {fontSize: 14, fontWeight: '700', color: INACTIVE_TAB},
  tabTextActive: {color: ACTIVE_TAB},
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: ACTIVE_TAB,
    borderRadius: 1,
  },
  list: {padding: 16, paddingBottom: 100, gap: 16},
  orderCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DIVIDER,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardLeft: {gap: 4},
  orderId: {
    fontSize: 12,
    fontWeight: '700',
    color: MID,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statusBadge: {
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  statusText: {fontSize: 10, fontWeight: '700', textTransform: 'uppercase'},
  orderTotal: {fontSize: 18, fontWeight: '800', color: DARK},
  orderDate: {fontSize: 12, fontWeight: '500', color: MID},
  orderImageWrap: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {flexDirection: 'row', gap: 8},
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {backgroundColor: ACTIVE_TAB},
  primaryBtnText: {fontSize: 14, fontWeight: '700', color: '#FFFFFF'},
  secondaryBtn: {backgroundColor: '#F1F5F9'},
  secondaryBtnText: {fontSize: 14, fontWeight: '700', color: '#334155'},
  errorText: {color: '#EF4444', textAlign: 'center'},
  emptyText: {fontSize: 16, color: MID, marginTop: 12},
});


