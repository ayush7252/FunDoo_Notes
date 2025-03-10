import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { firestore } from '../Firebase/Api'

interface DeletedNote {
  id: string;
  title: string;
  note: string;
  deletedAt: Date;
}

const DeleteScreen = () => {
  const [deletedNotes, setDeletedNotes] = useState<DeletedNote[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = firestore.collection('deleted_notes')
      .orderBy('deletedAt', 'desc')
      .onSnapshot(snapshot => {
        const notes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DeletedNote[]
        setDeletedNotes(notes)
      })

    return () => unsubscribe()
  }, [])

  const handleRestoreNote = async () => {
    if (!selectedNoteId) return

    try {
      const noteRef = firestore.collection('deleted_notes').doc(selectedNoteId)
      const noteDoc = await noteRef.get()
      
      if (noteDoc.exists) {
        // Restore to original collection
        const noteData = noteDoc.data()
        await firestore.collection('notes').doc(selectedNoteId).set({
          ...noteData,
          createdAt: new Date(),
        })
        
        // Delete from deleted_notes
        await noteRef.delete()
        setSelectedNoteId(null)
      }
    } catch (error) {
      console.error('Error restoring note:', error)
      Alert.alert('Error', 'Could not restore note')
    }
  }

  const handleDeletePermanently = async () => {
    if (!selectedNoteId) return

    try {
      await firestore.collection('deleted_notes').doc(selectedNoteId).delete()
      setSelectedNoteId(null)
    } catch (error) {
      console.error('Error deleting note:', error)
      Alert.alert('Error', 'Could not delete note permanently')
    }
  }

  const renderNoteItem = ({ item }: { item: DeletedNote }) => (
    <TouchableOpacity 
      style={[
        styles.noteCard,
        selectedNoteId === item.id && styles.selectedNote
      ]}
      onLongPress={() => setSelectedNoteId(item.id)}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent}>{item.note}</Text>
      <Text style={styles.deleteDate}>
        Deleted: {new Date(item.deletedAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Action Header */}
      {selectedNoteId && (
        <View style={styles.actionHeader}>
          <TouchableOpacity onPress={() => setSelectedNoteId(null)}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleRestoreNote}
            >
              <Icon name="restore" size={24} color="#4CAF50" />
              <Text style={styles.actionText}>Restore</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleDeletePermanently}
            >
              <Icon name="delete-forever" size={24} color="#f44336" />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content */}
      {deletedNotes.length === 0 ? (
        <View style={styles.MainContainer}>
          <Icon name="delete" size={150} color="grey" />
          <Text style={styles.emptyText}>No notes in Recycle Bin</Text>
        </View>
      ) : (
        <FlatList
          data={deletedNotes}
          renderItem={renderNoteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'grey'
  },
  listContainer: {
    padding: 16
  },
  noteCard: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444'
  },
  selectedNote: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  deleteDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic'
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#333'
  }
})

export default DeleteScreen