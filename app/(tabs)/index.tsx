import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventory } from '@/hooks/useInventory';
import { StatsCard } from '@/components/StatsCard';
import { AlertCard } from '@/components/AlertCard';
import { Package, TriangleAlert as AlertTriangle, TrendingDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const { 
    items, 
    alerts, 
    loading, 
    getLowStockItems, 
    getOutOfStockItems,
    clearAlerts,
    refreshInventory
  } = useInventory();
  const router = useRouter();

  const lowStockItems = getLowStockItems();
  const outOfStockItems = getOutOfStockItems();

  const handleRefresh = async () => {
    await refreshInventory();
  };

  const navigateToInventory = () => {
    router.push('/inventory');
  };

  const navigateToAddItem = () => {
    router.push('/add-item');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Van Inventory</Text>
          <Text style={styles.subtitle}>Dashboard Overview</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatsCard
            title="Total Items"
            value={items.length}
            subtitle="in inventory"
            color="#2563eb"
            icon={<Package size={20} color="#2563eb" />}
          />
          <StatsCard
            title="Low Stock"
            value={lowStockItems.length}
            subtitle="items"
            color="#ea580c"
            icon={<AlertTriangle size={20} color="#ea580c" />}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatsCard
            title="Out of Stock"
            value={outOfStockItems.length}
            subtitle="items"
            color="#dc2626"
            icon={<TrendingDown size={20} color="#dc2626" />}
          />
          <StatsCard
            title="Categories"
            value={new Set(items.map(item => item.category)).size}
            subtitle="different types"
            color="#16a34a"
            icon={<Package size={20} color="#16a34a" />}
          />
        </View>

        {alerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Stock Alerts</Text>
              <TouchableOpacity onPress={clearAlerts}>
                <Text style={styles.clearButton}>Clear All</Text>
              </TouchableOpacity>
            </View>
            {alerts.slice(0, 5).map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
            {alerts.length > 5 && (
              <Text style={styles.moreAlertsText}>
                +{alerts.length - 5} more alerts
              </Text>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={navigateToAddItem}
            >
              <Text style={styles.actionButtonText}>Add New Item</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={navigateToInventory}
            >
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                View Inventory
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {lowStockItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items Needing Restock</Text>
            {lowStockItems.slice(0, 3).map(item => (
              <View key={item.id} style={styles.restockItem}>
                <View style={styles.restockInfo}>
                  <Text style={styles.restockName}>{item.name}</Text>
                  <Text style={styles.restockPartNumber}>Part #: {item.partNumber}</Text>
                  <Text style={styles.restockStock}>
                    {item.currentStock} {item.unit} remaining
                  </Text>
                </View>
                <View style={styles.restockBadge}>
                  <Text style={styles.restockBadgeText}>
                    Need {Math.max(1, item.minStock - item.currentStock + 5)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
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
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  clearButton: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  moreAlertsText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#1e293b',
  },
  restockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  restockInfo: {
    flex: 1,
  },
  restockName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  restockPartNumber: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  restockStock: {
    fontSize: 14,
    color: '#ea580c',
  },
  restockBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  restockBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
});