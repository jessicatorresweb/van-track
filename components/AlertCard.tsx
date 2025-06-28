import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StockAlert } from '@/types/inventory';
import { TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, TrendingUp, X } from 'lucide-react-native';

interface AlertCardProps {
  alert: StockAlert;
  onDismiss?: (id: string) => void;
}

export function AlertCard({ alert, onDismiss }: AlertCardProps) {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'out':
        return <AlertCircle size={20} color="#dc2626" />;
      case 'low':
        return <AlertTriangle size={20} color="#ea580c" />;
      case 'overstock':
        return <TrendingUp size={20} color="#2563eb" />;
      default:
        return <AlertTriangle size={20} color="#64748b" />;
    }
  };

  const getAlertColor = () => {
    switch (alert.type) {
      case 'out':
        return '#dc2626';
      case 'low':
        return '#ea580c';
      case 'overstock':
        return '#2563eb';
      default:
        return '#64748b';
    }
  };

  const getBackgroundColor = () => {
    switch (alert.type) {
      case 'out':
        return '#fef2f2';
      case 'low':
        return '#fff7ed';
      case 'overstock':
        return '#eff6ff';
      default:
        return '#f8fafc';
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {getAlertIcon()}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.message, { color: getAlertColor() }]}>
            {alert.message}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(alert.timestamp).toLocaleDateString()}
          </Text>
        </View>
        {onDismiss && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => onDismiss(alert.id)}
          >
            <X size={16} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ea580c',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  dismissButton: {
    padding: 4,
  },
});