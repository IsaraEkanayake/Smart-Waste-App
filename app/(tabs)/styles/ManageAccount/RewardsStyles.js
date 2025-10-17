import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 12, 
    fontSize: 16, 
    color: '#6B7280' 
  },
  content: { 
    flex: 1 
  },
  contentContainer: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 20 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#111827', 
    marginBottom: 16, 
    marginTop: 8 
  },
  emptyState: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 60 
  },
  emptyStateText: { 
    fontSize: 18, 
    color: '#9CA3AF', 
    marginTop: 16, 
    fontWeight: '600' 
  },
  emptyStateSubtext: { 
    fontSize: 14, 
    color: '#D1D5DB', 
    marginTop: 8 
  },
  bottomPadding: { 
    height: 20 
  },
});