import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../../components/common/AppLogo';
import { useAuth } from '../../contexts/AuthContext';
import Starfield from '../../components/common/Starfield';
import CustomAlert from '../../components/common/CustomAlert';
import { colors } from '../../styles/globalStyles';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const confirmLogout = async () => {
    setShowLogoutAlert(false);
    await logout();
  };

  const MenuItem = ({
    icon,
    title,
    onPress,
    showChevron = true,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress?: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color={colors.primary[400]} />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={colors.gray[500]} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Starfield Background */}
      <Starfield count={60} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <AppLogo size={24} />
              <Text style={styles.headerTitle}>Profil</Text>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              {/* Avatar */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    '?'}
                </Text>
              </View>

              {/* Name */}
              <Text style={styles.userName}>{user?.name || 'İsimsiz Kullanıcı'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>-</Text>
                <Text style={styles.statLabel}>Günlük</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>-</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>-</Text>
                <Text style={styles.statLabel}>Kelime</Text>
              </View>
            </View>
          </View>

          {/* Menu Sections */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>HESAP</Text>
            <View style={styles.menuCard}>
              <MenuItem icon="person-outline" title="Profili Düzenle" />
              <View style={styles.divider} />
              <MenuItem icon="lock-closed-outline" title="Şifre Değiştir" />
            </View>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>UYGULAMA</Text>
            <View style={styles.menuCard}>
              <MenuItem icon="notifications-outline" title="Bildirimler" />
              <View style={styles.divider} />
              <MenuItem icon="moon-outline" title="Karanlık Mod" showChevron={false} />
              <View style={styles.divider} />
              <MenuItem icon="language-outline" title="Dil" />
            </View>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>HAKKINDA</Text>
            <View style={styles.menuCard}>
              <MenuItem icon="help-circle-outline" title="Yardım & Destek" />
              <View style={styles.divider} />
              <MenuItem icon="document-text-outline" title="Gizlilik Politikası" />
              <View style={styles.divider} />
              <MenuItem icon="information-circle-outline" title="Uygulama Hakkında" />
            </View>
          </View>

          {/* Logout */}
          <View style={styles.logoutSection}>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.red[400]} />
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Letter to Stars</Text>
            <Text style={styles.footerSubtext}>Made with ❤️ in Turkey</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Logout Confirmation Alert */}
      <CustomAlert
        visible={showLogoutAlert}
        title="Çıkış Yap"
        message="Çıkış yapmak istediğinizden emin misiniz?"
        type="warning"
        buttons={[
          { text: 'İptal', style: 'cancel' },
          { text: 'Çıkış Yap', style: 'destructive', onPress: confirmLogout },
        ]}
        onClose={() => setShowLogoutAlert(false)}
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary[400],
    textShadowColor: colors.primary[400],
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  userSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary[400],
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.gray[100],
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray[400],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary[400],
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[400],
    marginTop: 4,
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray[500],
    marginBottom: 10,
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    color: colors.gray[200],
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoutSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.red[400],
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    color: colors.gray[500],
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 11,
    color: colors.gray[600],
    marginTop: 4,
  },
});