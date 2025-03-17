import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { firestore } from '../Firebase/Api';

interface Note {
  id: string;
  title: string;
  note: string;
  createdAt: Date;
  archived: boolean;
  archivedAt: Date;
}

const ArchiveScreen = () => {
  const [archivedNotes, setArchivedNotes] = useState<Note[]>([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let unsubscribe: () => void;
    
    const initializeArchive = async () => {
      try {
        const query = firestore.collection('notes')
          .where('archived', '==', true)
          .orderBy('archivedAt', 'desc');

        unsubscribe = query.onSnapshot(
          async (snapshot) => {
            try {
              const notesPromises = snapshot.docs.map(async (doc) => {
                const data = doc.data();
                
                // Check krne ke liye ki data hai 
                if (!data.archivedAt) {
                  console.warn(`Document ${doc.id} missing archivedAt field`);
                  return null;
                }

                return {
                  id: doc.id,
                  title: data.title || 'Untitled Note',
                  note: data.note || 'No content',
                  createdAt: data.createdAt?.toDate() || new Date(),
                  archived: data.archived || false,
                  archivedAt: data.archivedAt.toDate()
                } as Note;
              });

              const notes = (await Promise.all(notesPromises)).filter(Boolean) as Note[];
              setArchivedNotes(notes);
              setLoading(false);
            } catch (parseError) {
              console.error('Data parsing error:', parseError);
              setError('Failed to process archived notes');
              setLoading(false);
            }
          },
          (error) => {
            console.error('Firestore error:', error);
            setError(`Error loading notes: ${error.message}`);
            setLoading(false);
          }
        );
      } catch (initError) {
        console.error('Initialization error:', initError);
        setError('Failed to initialize archive');
        setLoading(false);
      }
    };

    initializeArchive();
    return () => unsubscribe?.();
  }, []);

  const handleUnarchiveNotes = async () => {
    if (selectedNoteIds.length === 0) return;

    try {
      const batch = firestore.batch();
      const updates = selectedNoteIds.map(noteId => {
        const noteRef = firestore.collection('notes').doc(noteId);
        return batch.update(noteRef, {
          archived: false
        });
      });

      await batch.commit();

      setArchivedNotes(prevNotes =>
        prevNotes.filter(note => !selectedNoteIds.includes(note.id))
      );

      setSelectedNoteIds([]);  
      Alert.alert('Success', `${selectedNoteIds.length} note(s) unarchived`);
    } catch (error) {
      console.error('Unarchive error:', error);
      Alert.alert('Error', `Failed to unarchive: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#61a0bf" />
        <Text style={styles.loadingText}>Loading Archive...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={80} color="red" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Selection Header */}
      {selectedNoteIds.length > 0 && (
        <View style={styles.selectionHeader}>
          <TouchableOpacity onPress={() => setSelectedNoteIds([])}>
            <Icon name="close" size={24} color="grey" />
          </TouchableOpacity>
          
          <Text style={styles.selectionCount}>{selectedNoteIds.length} selected</Text>
          
          <TouchableOpacity 
            onPress={handleUnarchiveNotes} 
            style={styles.unarchiveButton}
          >
            <Icon name="unarchive" size={24} color="white" />
            <Text style={styles.unarchiveText}>Restore</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content Area */}
      {archivedNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="archive" size={150} color="#61a0bf" />
          <Text style={styles.emptyText}>No archived notes found</Text>
          <Text style={styles.emptySubtext}>Notes you archive will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={archivedNotes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.noteCard,
                selectedNoteIds.includes(item.id) && styles.selectedNote
              ]}
              onLongPress={() => {
                setSelectedNoteIds(prev => 
                  prev.includes(item.id) 
                    ? prev.filter(id => id !== item.id) 
                    : [...prev, item.id]
                );
              }}
            >
              {selectedNoteIds.includes(item.id) && (
                <Icon 
                  name="check-circle" 
                  size={24} 
                  color="#2196f3" 
                  style={styles.checkbox} 
                />
              )}
              
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent}>{item.note}</Text>
              
              <View style={styles.dateContainer}>
                <Icon name="access-time" size={14} color="#999" />
                <Text style={styles.archiveDate}>
                  {item.archivedAt.toLocaleDateString()} •{' '}
                  {item.archivedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#61a0bf',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#61a0bf',
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#212529',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#6c757d',
    fontSize: 14,
    marginTop: 8,
  },
  noteCard: {
    backgroundColor: 'white',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#61a0bf',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  archiveDate: {
    fontSize: 12,
    color: '#868e96',
  },
  listContainer: {
    padding: 16,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    elevation: 4,
  },
  selectionCount: {
    color: '#2196f3',
    fontSize: 16,
    fontWeight: '500',
  },
  unarchiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#61a0bf',
    borderRadius: 8,
  },
  unarchiveText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  checkbox: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  selectedNote: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 1,
  },
});

export default ArchiveScreen;
