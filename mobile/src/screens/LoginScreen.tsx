import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text, TextInput, ActivityIndicator, Checkbox} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuthStore} from '../store/authStore';
import axiosInstance from '../utils/axios';
import {ACCENT, BG, CARD_BG, DARK, MID, MUTED, INPUT_BG, INPUT_BORDER} from '../constants/theme';

const HEADING = '#1F2937';
const LABEL = '#374151';
const PLACEHOLDER = MID;
const BTN_TEXT = DARK;
const LINK = ACCENT;
const FOOTER = MUTED;
const TAB_BG = INPUT_BG;

export const LoginScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {login} = useAuthStore();

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (
      activeTab === 'signup' &&
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const endpoint = activeTab === 'login' ? '/auth/login' : '/auth/register';
      const body =
        activeTab === 'login'
          ? {username, password}
          : {username, password, email, fullName};
      const response = await axiosInstance.post(endpoint, body);
      const {access_token, user} = response.data;
      await login(access_token, user);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      // TODO: Integrate with @react-native-google-signin/google-signin
      // Example implementation:
      // const {idToken} = await GoogleSignin.signIn();
      // const response = await axiosInstance.post('/auth/google', {idToken});
      
      setError('Google sign-in coming soon');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      // TODO: Integrate with react-native-facebook-sdk
      // Example implementation:
      // const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      // if (result.isCancelled) return;
      // const data = await AccessToken.getCurrentAccessToken();
      // const response = await axiosInstance.post('/auth/facebook', {accessToken: data?.accessToken});
      
      setError('Facebook sign-in coming soon');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Facebook sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>�️</Text>
          </View>
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subtitle}>Please enter your details</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabStrip}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'login' && styles.tabActive]}
              onPress={() => {setActiveTab('login'); setError(null);}}>
              <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'signup' && styles.tabActive]}
              onPress={() => {setActiveTab('signup'); setError(null);}}>
              <Text style={[styles.tabText, activeTab === 'signup' && styles.tabTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="johndoe123"
                placeholderTextColor={PLACEHOLDER}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                outlineColor={INPUT_BORDER}
                activeOutlineColor={ACCENT}
                mode="outlined"
                theme={{roundness: 12}}
                testID="login-username-input"
              />
            </View>

            {activeTab === 'signup' && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    placeholderTextColor={PLACEHOLDER}
                    value={fullName}
                    onChangeText={setFullName}
                    outlineColor={INPUT_BORDER}
                    activeOutlineColor={ACCENT}
                    mode="outlined"
                    theme={{roundness: 12}}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="john@example.com"
                    placeholderTextColor={PLACEHOLDER}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    outlineColor={INPUT_BORDER}
                    activeOutlineColor={ACCENT}
                    mode="outlined"
                    theme={{roundness: 12}}
                  />
                </View>
              </>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                testID="login-password-input"
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(v => !v)}
                  />
                }
                outlineColor={INPUT_BORDER}
                activeOutlineColor={ACCENT}
                mode="outlined"
                theme={{roundness: 12}}
              />
            </View>

            {activeTab === 'login' && (
              <>
                <TouchableOpacity style={styles.forgotRow}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <View style={styles.biometricsRow}>
                  <Checkbox
                    status={useBiometrics ? 'checked' : 'unchecked'}
                    onPress={() => setUseBiometrics(!useBiometrics)}
                    color={ACCENT}
                  />
                  <Text style={styles.biometricsText}>Use biometrics for faster login</Text>
                </View>
              </>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color={BTN_TEXT} />
              ) : (
                <Text style={styles.signInBtnText}>
                  {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            {activeTab === 'login' && (
              <TouchableOpacity style={styles.biometricsBtn}>
                <MaterialCommunityIcons name="fingerprint" size={20} color={ACCENT} />
                <Text style={styles.biometricsBtnText}>Sign in with Biometrics</Text>
              </TouchableOpacity>
            )}

            {activeTab === 'login' && (
              <>
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtonsRow}>
                  <TouchableOpacity 
                    style={[styles.socialBtn, loading && styles.socialBtnDisabled]}
                    onPress={handleGoogleSignIn}
                    disabled={loading}>
                    <MaterialCommunityIcons name="google" size={20} color={DARK} />
                    <Text style={styles.socialBtnText}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.socialBtn, loading && styles.socialBtnDisabled]}
                    onPress={handleFacebookSignIn}
                    disabled={loading}>
                    <MaterialCommunityIcons name="facebook" size={20} color={DARK} />
                    <Text style={styles.socialBtnText}>Facebook</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>

        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service{'\n'}and Privacy Policy.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: BG},
  scroll: {flexGrow: 1, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 48},
  logoArea: {alignItems: 'center', marginBottom: 24},
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(13,242,242,0.1)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  logoText: {fontSize: 32},
  heading: {fontSize: 24, fontWeight: '700', color: HEADING, marginBottom: 4},
  subtitle: {fontSize: 16, color: PLACEHOLDER},
  card: {
    width: '100%', backgroundColor: CARD_BG, borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
  },
  tabStrip: {
    flexDirection: 'row', backgroundColor: TAB_BG, borderRadius: 12,
    padding: 4, marginBottom: 24,
  },
  tab: {flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 12},
  tabActive: {
    backgroundColor: CARD_BG,
    shadowColor: '#000', shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
  },
  tabText: {fontSize: 14, fontWeight: '500', color: PLACEHOLDER},
  tabTextActive: {color: HEADING},
  form: {gap: 16},
  fieldGroup: {gap: 4},
  label: {fontSize: 14, fontWeight: '500', color: LABEL},
  input: {backgroundColor: CARD_BG, fontSize: 16},
  forgotRow: {alignItems: 'flex-end'},
  forgotText: {fontSize: 14, fontWeight: '500', color: LINK},
  biometricsRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  biometricsText: {fontSize: 14, fontWeight: '400', color: '#4B5563', marginLeft: 8},
  errorText: {color: '#EF4444', fontSize: 14, textAlign: 'center'},
  signInBtn: {
    backgroundColor: ACCENT, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center',
    shadowColor: ACCENT, shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6, marginTop: 4,
  },
  signInBtnDisabled: {opacity: 0.7},
  signInBtnText: {fontSize: 16, fontWeight: '700', color: BTN_TEXT},
  biometricsBtn: {
    borderWidth: 2,
    borderColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  biometricsBtnText: {fontSize: 14, fontWeight: '600', color: ACCENT},
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {flex: 1, height: 1, backgroundColor: '#E5E7EB'},
  dividerText: {fontSize: 12, fontWeight: '400', color: '#6B7280'},
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'stretch',
  },
  socialBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  socialBtnDisabled: {opacity: 0.6},
  socialBtnText: {fontSize: 14, fontWeight: '500', color: LABEL},
  footer: {fontSize: 12, color: FOOTER, textAlign: 'center', marginTop: 24, lineHeight: 18},
});


