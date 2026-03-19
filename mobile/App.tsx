import React, {useEffect} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useAuthStore} from './src/store/authStore';
import {HomeScreen} from './src/screens/HomeScreen';
import {ProfileScreen} from './src/screens/ProfileScreen';
import {LoginScreen} from './src/screens/LoginScreen';
import {ProductDetailScreen} from './src/screens/ProductDetailScreen';
import {OrderHistoryScreen} from './src/screens/OrderHistoryScreen';
import {CartScreen} from './src/screens/CartScreen';
import {CheckoutScreen} from './src/screens/CheckoutScreen';
import {Layout} from './src/components/Layout';
import {StyleSheet, View} from 'react-native';
import type {RootStackParamList} from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const ACCENT = '#0DF2F2';

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: ACCENT,
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {fontSize: 12, fontWeight: '600'},
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Discover',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color}: {color: string}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Search',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color}: {color: string}) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Orders',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color}: {color: string}) => (
            <MaterialCommunityIcons name="package-variant" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color}: {color: string}) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const {isLoggedIn, loading, loadToken} = useAuthStore();

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color={ACCENT} />
      </View>
    );
  }

  return (
    <Layout>
      <Stack.Navigator id={undefined}>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OrderHistory"
              component={OrderHistoryScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </Layout>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;
