import React from 'react';
import { View, StyleSheet } from 'react-native';
import {Text} from 'react-native-paper';

interface Props {
  profile: {
    username: string;
    fullName?: string;
    email?: string;
  };
}

const Profile: React.FC<Props> = ({profile}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Username: {profile.username}</Text>
      {profile.fullName && (
        <Text style={styles.text}>Full Name: {profile.fullName}</Text>
      )}
      {profile.email && <Text style={styles.text}>Email: {profile.email}</Text>}
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

export default Profile;
