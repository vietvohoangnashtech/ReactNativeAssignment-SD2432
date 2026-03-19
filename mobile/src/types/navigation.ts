import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import type {Product} from './index';

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  ProductDetail: {product: Product};
  OrderHistory: undefined;
  Cart: undefined;
  Checkout: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Orders: undefined;
  Profile: undefined;
};

/** Typed navigation prop helpers */
export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
