import React, {useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

export interface ProfileEditData {
  fullName: string;
  email: string;
}

export interface ProfileEditProps {
  profile: {
    fullName?: string;
    email?: string;
  };
  onSubmit: (data: ProfileEditData) => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({profile, onSubmit}) => {
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [email, setEmail] = useState(profile.email || '');

  const handleSubmit = useCallback(() => {
    onSubmit({fullName, email});
  }, [onSubmit, fullName, email]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        testID="profile-edit-fullname"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        testID="profile-edit-email"
      />
      <Button mode="contained" onPress={handleSubmit} testID="profile-edit-save">
        Save
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});
