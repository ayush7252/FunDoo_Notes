import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { firestore } from '../Firebase/Api';

interface Note {
  id: string;
  title: string;
  note: string;
  createdAt: Date;
  notification: boolean;
  archived: boolean;
  reminderDate?: any;  // Changed to any to handle Firestore timestamp
  reminderLocation?: 'home' | 'office';
}

const RemindersScreen = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('notes')
      .where('notification', '==', true)
      .orderBy('reminderDate', 'asc')
      .onSnapshot(
        snapshot => {
          const notesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Note[];
          setNotes(notesData);
          setLoading(false);
        },
        error => {
          console.error('Error fetching notes:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, []);

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity style={styles.noteCard}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent}>{item.note}</Text>
      
      {item.reminderDate && (
        <Text style={styles.noteDate}>
          ⏰ Reminder: {item.reminderDate.toDate().toLocaleString()}
        </Text>
      )}
      
      {item.reminderLocation && (
        <Text style={styles.locationText}>
          📍 {item.reminderLocation.toUpperCase()}
        </Text>
      )}
      
      <Text style={styles.noteDate}>
        Created: {item.createdAt.toDate().toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="notifications-off" size={60} color="#fcbf49" />
            <Text style={styles.emptyText}>No upcoming reminders</Text>
            <Text style={styles.emptySubText}>Notes with reminders will appear here</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  noteCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#2196f3',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RemindersScreen;