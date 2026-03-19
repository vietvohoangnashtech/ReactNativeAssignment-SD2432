import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {Text, ActivityIndicator} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../utils/axios';
import {useAuthStore} from '../store/authStore';
import {localProfileDB} from '../utils/localProfileDB';
import {ACCENT, BG, CARD_BG, DARK, MUTED, DANGER, DANGER_BG} from '../constants/theme';
import type {ProfileData} from '../types';
import type {RootStackNavigationProp} from '../types/navigation';

const HEADING = '#1F2937';
const MID = '#374151';
const LABEL_COLOR = MUTED;
const DIVIDER = '#F3F4F6';
const ORDER_BG = '#F1F5F9';
const LOGOUT_BG = DANGER_BG;
const LOGOUT_TEXT = DANGER;

interface ProfileUpdatePayload {
  firstName: string;
  lastName: string;
  age?: number;
}

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'MainTabs'>>();
  const {logout, setUser} = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/profiles');
      const data: ProfileData = response.data;
      setProfile(data);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setAge(data.age ? String(data.age) : '');
      // Save to local DB (assignment task 5)
      await localProfileDB.save(data);
    } catch (err: any) {
      // If network fails, load from local DB
      const local = await localProfileDB.get();
      if (local) {
        setProfile(local as ProfileData);
        setFirstName(local.firstName || '');
        setLastName(local.lastName || '');
        setAge(local.age ? String(local.age) : '');
        setError('Showing cached profile (offline)');
      } else {
        const msg = err.response?.data?.message;
        setError(Array.isArray(msg) ? msg[0] : msg || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: ProfileUpdatePayload = {firstName, lastName};
      if (age.trim()) {
        const parsedAge = parseInt(age, 10);
        if (!Number.isNaN(parsedAge) && parsedAge > 0) {
          payload.age = parsedAge;
        }
      }
      const response = await axiosInstance.patch('/profiles', payload);
      const updated: ProfileData = {
        ...profile,
        ...response.data,
        firstName,
        lastName,
        age: payload.age,
      };
      setProfile(updated);
      await localProfileDB.save(updated);
      setUser(updated);
      setIsEdit(false);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await localProfileDB.clear();
          logout();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  const displayName = profile
    ? profile.fullName ||
      [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
      profile.username
    : 'User';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.spacer} />
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialCommunityIcons name="cog-outline" size={22} color={DARK} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>{error}</Text>
          </View>
        ) : null}

        {/* Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {displayName[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.cameraBtn}>
              <MaterialCommunityIcons name="camera" size={12} color="#111" />
            </View>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          {profile?.username && (
            <Text style={styles.usernameHandle}>@{profile.username}</Text>
          )}
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM MEMBER</Text>
          </View>
        </View>

        {/* Account Details */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Account Details</Text>
            <TouchableOpacity onPress={() => setIsEdit(!isEdit)}>
              <Text style={styles.editLink}>
                {isEdit ? 'Cancel' : 'Edit Details'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Email (read-only) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={styles.readonlyInput}>
              <Text style={styles.readonlyText}>
                {profile?.email || 'No email set'}
              </Text>
            </View>
          </View>

          {/* First Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>FIRST NAME</Text>
            {isEdit ? (
              <TextInput
                style={styles.editableInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor={MUTED}
              />
            ) : (
              <Text style={styles.fieldValue}>
                {profile?.firstName || '—'}
              </Text>
            )}
          </View>

          {/* Last Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>LAST NAME</Text>
            {isEdit ? (
              <TextInput
                style={styles.editableInput}
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor={MUTED}
              />
            ) : (
              <Text style={styles.fieldValue}>
                {profile?.lastName || '—'}
              </Text>
            )}
          </View>

          {/* Age */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>AGE</Text>
            {isEdit ? (
              <TextInput
                style={styles.editableInput}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholderTextColor={MUTED}
              />
            ) : (
              <Text style={styles.fieldValue}>
                {profile?.age ? String(profile.age) : '—'}
              </Text>
            )}
          </View>

          {isEdit && (
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color="#111" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('OrderHistory')}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, {backgroundColor: ORDER_BG}]}>
                <MaterialCommunityIcons
                  name="package-variant"
                  size={20}
                  color={MID}
                />
              </View>
              <Text style={styles.actionText}>Order History</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={MUTED}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, {backgroundColor: LOGOUT_BG}]}>
                <MaterialCommunityIcons
                  name="logout"
                  size={20}
                  color={LOGOUT_TEXT}
                />
              </View>
              <Text style={[styles.actionText, {color: LOGOUT_TEXT}]}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: BG},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  header: {
    backgroundColor: CARD_BG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
  },
  headerTitle: {fontSize: 18, fontWeight: '600', color: DARK},
  headerBtn: {width: 40, alignItems: 'flex-end'},
  spacer: {width: 40},
  warningBanner: {
    backgroundColor: '#FEF9C3',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  warningText: {fontSize: 13, color: '#92400E', textAlign: 'center'},
  identityCard: {
    backgroundColor: CARD_BG,
    margin: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarWrap: {position: 'relative', marginBottom: 12},
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(13,242,242,0.3)',
  },
  avatarText: {fontSize: 36, fontWeight: '700', color: '#111'},
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ACCENT,
    borderWidth: 2,
    borderColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayName: {fontSize: 22, fontWeight: '700', color: HEADING, marginBottom: 4},
  usernameHandle: {fontSize: 14, color: MUTED, marginBottom: 12},
  premiumBadge: {
    backgroundColor: 'rgba(13,242,242,0.15)',
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 4,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '700',
    color: ACCENT,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formCard: {
    backgroundColor: CARD_BG,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {fontSize: 18, fontWeight: '700', color: DARK},
  editLink: {fontSize: 14, fontWeight: '600', color: ACCENT},
  fieldGroup: {marginBottom: 20},
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: LABEL_COLOR,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  readonlyInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  readonlyText: {fontSize: 14, color: MUTED},
  editableInput: {
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
    paddingVertical: 8,
    fontSize: 14,
    color: DARK,
  },
  fieldValue: {fontSize: 14, color: DARK, paddingVertical: 8},
  saveBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: {opacity: 0.7},
  saveBtnText: {fontSize: 16, fontWeight: '700', color: '#111'},
  actionsSection: {marginHorizontal: 16, marginBottom: 80, gap: 12},
  actionRow: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {fontSize: 16, fontWeight: '500', color: MID},
});


