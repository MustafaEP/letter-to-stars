import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Starfield from '../../components/common/Starfield';
import CustomAlert from '../../components/common/CustomAlert';
import { colors } from '../../styles/globalStyles';
import { authApi } from '../../api/auth.api';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ title: '', message: '', type: 'info' });

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!oldPassword) {
      newErrors.oldPassword = 'Mevcut şifre gereklidir';
    }

    if (!newPassword) {
      newErrors.newPassword = 'Yeni şifre gereklidir';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Yeni şifre en az 8 karakter olmalıdır';
    } else if (newPassword.length > 64) {
      newErrors.newPassword = 'Yeni şifre en fazla 64 karakter olabilir';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    } else if (!confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.changePassword(oldPassword, newPassword);
      setAlertConfig({
        title: 'Başarılı',
        message: 'Şifreniz başarıyla değiştirildi',
        type: 'success',
      });
      setAlertVisible(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setAlertVisible(false);
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      setAlertConfig({
        title: 'Hata',
        message: error.response?.data?.message || 'Şifre değiştirilemedi',
        type: 'error',
      });
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Starfield count={60} />

      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.gray[100]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Şifre Değiştir</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formCard}>
              <Input
                label="Mevcut Şifre"
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="••••••••"
                secureTextEntry
                error={errors.oldPassword}
              />
              <Input
                label="Yeni Şifre"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="En az 8 karakter"
                secureTextEntry
                error={errors.newPassword}
              />
              <Input
                label="Yeni Şifre (Tekrar)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureTextEntry
                error={errors.confirmPassword}
              />
              <Button
                title="Şifreyi Güncelle"
                onPress={handleChangePassword}
                loading={loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={[{ text: 'Tamam' }]}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cosmic.dark,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: colors.cosmic.dark,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[100],
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
