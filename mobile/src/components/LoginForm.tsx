import React, {useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';

export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isRegister?: boolean;
  loading: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({onSubmit, isRegister, loading, error}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback(() => {
    onSubmit({username, password});
  }, [onSubmit, username, password]);

  const btnText = isRegister ? 'Register' : 'Login';

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error} testID="login-error">{error}</Text> : null}
      <Button
        mode="contained"
        loading={loading}
        disabled={loading}
        onPress={handleSubmit}
        testID="login-submit-btn">
        {btnText}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
