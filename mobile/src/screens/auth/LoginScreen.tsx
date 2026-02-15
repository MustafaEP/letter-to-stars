import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppLogo from '../../components/common/AppLogo';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Starfield from '../../components/common/Starfield';
import CustomAlert from '../../components/common/CustomAlert';
import { colors } from '../../styles/globalStyles';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Geçerli bir email giriniz';
    }

    if (!password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ email, password });
    } catch (error: any) {
      setAlertMessage(error.response?.data?.message || 'Bir hata oluştu');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Starfield Background */}
      <Starfield count={80} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerIconContainer}>
                  <AppLogo size={56} />
                </View>
                <Text style={styles.title}>Letter to Stars</Text>
                <Text style={styles.subtitle}>
                  Günlüğünü yaz, yıldızlara ulaş ✨
                </Text>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="ornek@email.com"
                  error={errors.email}
                />

                <Input
                  label="Şifre"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  error={errors.password}
                />

                <Button title="Giriş Yap" onPress={handleLogin} loading={loading} />

                {/* Register Link */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Hesabın yok mu? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Kayıt Ol</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Error Alert */}
      <CustomAlert
        visible={alertVisible}
        title="Giriş Başarısız"
        message={alertMessage}
        type="error"
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  headerIconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.primary[400],
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: colors.primary[400],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray[300],
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: colors.gray[400],
    fontSize: 14,
  },
  link: {
    color: colors.primary[400],
    fontWeight: '600',
    fontSize: 14,
  },
});