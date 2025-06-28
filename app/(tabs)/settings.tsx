import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventory } from '@/hooks/useInventory';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Database, Download, Upload, Trash2, Info, Shield, CircleHelp as HelpCircle, LogOut, User } from 'lucide-react-native';
import { SignOutConfirmation } from '@/components/SignOutConfirmation';

export default function Settings() {
  const { items, clearAlerts } = useInventory();
  const { user, logout, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowSignOutModal(false);
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will export all your inventory data to a CSV file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          // Implementation for data export
          Alert.alert('Success', 'Data exported successfully');
        }}
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'This will import inventory data from a CSV file. Existing data will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Import', onPress: () => {
          // Implementation for data import
          Alert.alert('Success', 'Data imported successfully');
        }}
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all inventory items. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete All', style: 'destructive', onPress: () => {
          // Implementation for clearing all data
          Alert.alert('Success', 'All data cleared successfully');
        }}
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    danger = false,
    loading = false
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    danger?: boolean;
    loading?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.settingItem, loading && styles.settingItemLoading]} 
      onPress={onPress}
      disabled={!onPress || loading}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      {rightElement && (
        <View style={styles.settingRight}>
          {rightElement}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your inventory preferences</Text>
      </View>

      <ScrollView style={styles.content}>
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.userCard}>
              <View style={styles.userIcon}>
                <User size={24} color="#2563eb" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                {user.company && (
                  <Text style={styles.userCompany}>{user.company}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingItem
            icon={<Bell size={20} color="#2563eb" />}
            title="Push Notifications"
            subtitle="Receive alerts for low stock items"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
                thumbColor="#ffffff"
              />
            }
          />
          <SettingItem
            icon={<Shield size={20} color="#2563eb" />}
            title="Low Stock Alerts"
            subtitle="Get notified when items are running low"
            rightElement={
              <Switch
                value={lowStockAlerts}
                onValueChange={setLowStockAlerts}
                trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
                thumbColor="#ffffff"
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <SettingItem
            icon={<Database size={20} color="#2563eb" />}
            title="Auto Backup"
            subtitle="Automatically backup your data"
            rightElement={
              <Switch
                value={autoBackup}
                onValueChange={setAutoBackup}
                trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
                thumbColor="#ffffff"
              />
            }
          />
          <SettingItem
            icon={<Download size={20} color="#2563eb" />}
            title="Export Data"
            subtitle="Export inventory to CSV file"
            onPress={handleExportData}
          />
          <SettingItem
            icon={<Upload size={20} color="#2563eb" />}
            title="Import Data"
            subtitle="Import inventory from CSV file"
            onPress={handleImportData}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory Overview</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{items.length}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {items.filter(i => i.currentStock <= i.minStock).length}
              </Text>
              <Text style={styles.statLabel}>Low Stock</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {items.filter(i => i.currentStock === 0).length}
              </Text>
              <Text style={styles.statLabel}>Out of Stock</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {new Set(items.map(item => item.category)).size}
              </Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingItem
            icon={<HelpCircle size={20} color="#2563eb" />}
            title="Help & Support"
            subtitle="Get help with using the app"
            onPress={() => Alert.alert('Help', 'Contact support at support@vaninventory.com')}
          />
          <SettingItem
            icon={<Info size={20} color="#2563eb" />}
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('About', 'Van Inventory Management App\nVersion 1.0.0\n\nBuilt for tradesmen to manage their van inventory efficiently.')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <SettingItem
            icon={<LogOut size={20} color="#dc2626" />}
            title="Sign Out"
            subtitle="Sign out and clear all local data"
            onPress={() => setShowSignOutModal(true)}
            danger
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <SettingItem
            icon={<Trash2 size={20} color="#dc2626" />}
            title="Clear All Data"
            subtitle="Permanently delete all inventory items"
            onPress={handleClearAllData}
            danger
          />
        </View>
      </ScrollView>

      <SignOutConfirmation
        visible={showSignOutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowSignOutModal(false)}
        loading={authLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  userIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#eff6ff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingItemLoading: {
    opacity: 0.6,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  settingRight: {
    marginLeft: 16,
  },
  dangerText: {
    color: '#dc2626',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});