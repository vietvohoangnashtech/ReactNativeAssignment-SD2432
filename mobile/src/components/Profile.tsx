import React from 'react';
import { View, StyleSheet } from 'react-native';
import {Text} from 'react-native-paper';
import type {ProfileData} from '../types';

export interface ProfileProps {
  profile: Pick<ProfileData, 'username' | 'fullName' | 'email'>;
}

export const Profile: React.FC<ProfileProps> = ({profile}) => {
  return (
    <View style={styles.container} testID="profile-container">
      <Text style={styles.text} testID="profile-username">Username: {profile.username}</Text>
      {profile.fullName ? (
        <Text style={styles.text} testID="profile-fullname">Full Name: {profile.fullName}</Text>
      ) : null}
      {profile.email ? <Text style={styles.text} testID="profile-email">Email: {profile.email}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});
