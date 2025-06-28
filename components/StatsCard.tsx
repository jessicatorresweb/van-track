import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, subtitle, color = '#2563eb', icon }: StatsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
        </View>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  iconContainer: {
    marginLeft: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
  },
});