import React from 'react';
import { View, Text } from 'react-native';
import { Package } from 'lucide-react-native';
import { RecordCard } from './RecordCard';
import { styles } from '../styles/styles';

export const RecordsList = ({ filterMonth, filteredRecords }) => {
  return (
    <View style={styles.recordsSection}>
      <Text style={styles.recordsTitle}>
        {filterMonth === 'All' ? 'All Records' : filterMonth} ({filteredRecords.length})
      </Text>
      
      {filteredRecords.length === 0 ? (
        <View style={styles.emptyState}>
          <Package size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No records found</Text>
        </View>
      ) : (
        filteredRecords.map((record) => (
          <RecordCard key={record.id} record={record} />
        ))
      )}
    </View>
  );
};