import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import AppLogo from '../../components/common/AppLogo';
import Starfield from '../../components/common/Starfield';
import { colors } from '../../styles/globalStyles';

const APP_VERSION = Constants.expoConfig?.version || '1.0.0';
const SUPPORT_EMAIL = 'portakalm11@gmail.com';
const PRIVACY_URL = 'https://lettertostars.mustafaerhanportakal.com/privacy';
const WEBSITE_URL = 'https://lettertostars.mustafaerhanportakal.com';

type LinkItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
};

function LinkItem({ icon, title, subtitle, onPress }: LinkItemProps) {
  return (
    <TouchableOpacity style={styles.linkItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.linkLeft}>
        <Ionicons name={icon} size={22} color={colors.primary[400]} />
        <View>
          <Text style={styles.linkTitle}>{title}</Text>
          {subtitle && <Text style={styles.linkSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="open-outline" size={18} color={colors.gray[500]} />
    </TouchableOpacity>
  );
}

export default function AboutScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const openUrl = async (url: string, fallbackMessage?: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else if (fallbackMessage) {
        Alert.alert('Bilgi', fallbackMessage);
      }
    } catch {
      Alert.alert('Hata', 'Bağlantı açılamadı');
    }
  };

  const openEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
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
          <Text style={styles.headerTitle}>Hakkında</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* App Info */}
          <View style={styles.appInfoCard}>
            <AppLogo size={64} />
            <Text style={styles.appName}>Yıldızlara Mektup</Text>
            <Text style={styles.appVersion}>Sürüm {APP_VERSION}</Text>
            <Text style={styles.appDescription}>
              Günlüğünü yaz, AI ile IELTS seviyene göre dönüştür, yeni kelimeler öğren.
              Yıldızlara mektup yazarak İngilizceni geliştir ✨
            </Text>
          </View>

          {/* Links */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DESTEK & BİLGİ</Text>
            <View style={styles.linkCard}>
              <LinkItem
                icon="mail-outline"
                title="Yardım & Destek"
                subtitle="Bize ulaşın"
                onPress={openEmail}
              />
              <View style={styles.divider} />
              <LinkItem
                icon="document-text-outline"
                title="Gizlilik Politikası"
                subtitle="Veri kullanımı hakkında"
                onPress={() => openUrl(PRIVACY_URL, 'Gizlilik politikası web sitemizde yayınlanacaktır.')}
              />
              <View style={styles.divider} />
              <LinkItem
                icon="globe-outline"
                title="Web Sitesi"
                subtitle="lettertostars.mustafaerhanportakal.com"
                onPress={() => openUrl(WEBSITE_URL)}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with ❤️ in Turkey</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  appInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gray[100],
    marginTop: 16,
  },
  appVersion: {
    fontSize: 13,
    color: colors.gray[500],
    marginTop: 4,
  },
  appDescription: {
    fontSize: 14,
    color: colors.gray[300],
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray[500],
    marginBottom: 10,
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  linkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  linkTitle: {
    fontSize: 14,
    color: colors.gray[200],
    marginLeft: 12,
    fontWeight: '500',
  },
  linkSubtitle: {
    fontSize: 12,
    color: colors.gray[500],
    marginLeft: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: 48,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 13,
    color: colors.gray[500],
  },
});
