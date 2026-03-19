import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CARD_BG, DARK, DIVIDER} from '../constants/theme';

export interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({title, onBack, right}) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.btn} testID="screen-header-back">
      <MaterialCommunityIcons name="arrow-left" size={22} color={DARK} />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.right}>{right ?? null}</View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD_BG,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {fontSize: 20, fontWeight: '700', color: DARK},
  right: {width: 40, alignItems: 'flex-end'},
});
