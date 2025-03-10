import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { firestore } from '../Firebase/Api';

const CreateNewScreen = ({ navigation }: any) => {
  const [labels, setLabels] = useState<any[]>([]); // Update type to store id as well
  const [newLabel, setNewLabel] = useState('');
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editedLabel, setEditedLabel] = useState('');

  useEffect(() => {
    const unsubscribe = firestore
      .collection('labels')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const labelsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLabels(labelsData);
      });

    return () => unsubscribe();
  }, []);

  const handleAddLabel = async () => {
    if (newLabel.trim()) {
      try {
        await firestore.collection('labels').add({
          name: newLabel.trim(),
          notes: [],
          createdAt: new Date(),
        });
        setNewLabel('');
      } catch (error) {
        console.error('Error adding label: ', error);
      }
    }
  };

  const handleDeleteLabel = async (id: string) => {
    try {
      await firestore.collection('labels').doc(id).delete();
    } catch (error) {
      console.error('Error deleting label: ', error);
    }
  };

  const handleEditLabel = (id: string, name: string) => {
    setEditingLabelId(id);
    setEditedLabel(name);
  };

  const handleSaveLabel = async () => {
    if (editedLabel.trim() && editingLabelId) {
      try {
        await firestore.collection('labels').doc(editingLabelId).update({
          name: editedLabel.trim(),
        });
        setEditingLabelId(null);
        setEditedLabel('');
      } catch (error) {
        console.error('Error updating label: ', error);
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>Edit labels</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity>
          <Icon name="add" size={32} color={'grey'} />
        </TouchableOpacity>
        <TextInput
          placeholder="Create a label"
          style={styles.Input}
          placeholderTextColor={'grey'}
          value={newLabel}
          onChangeText={setNewLabel}
        />
        <TouchableOpacity onPress={handleAddLabel}>
          <Icon name="check" size={28} color={'grey'} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={labels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.labelItem}>
            <View>
            <Icon name="label-outline" size={30} color={'grey'} />
            </View>
            {editingLabelId === item.id ? (
              <View style={styles.editLabelContainer}>
                <TextInput
                  value={editedLabel}
                  onChangeText={setEditedLabel}
                  style={styles.Input}
                  placeholder="Edit label"
                />
                <TouchableOpacity onPress={handleSaveLabel}>
                  <Icon name="check" size={28} color={"grey"} />
                </TouchableOpacity>
                
              </View>
            ) : (
              <>
                <Text style={styles.labelText}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleEditLabel(item.id, item.name)}>
                  <Icon name="edit" size={25} color={'grey'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteLabel(item.id)}>
                  <Icon name="delete" size={25} color={'grey'} />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default CreateNewScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 40,
    borderBottomWidth: 1,
    height: 50,
    borderColor: 'grey',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  Input: {
    height: 40,
    fontSize: 17,
    flex: 1,
    marginHorizontal: 10,
  },
  labelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex:1,
    alignItems: 'center',
    marginBottom: 10,
    height: 50,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  labelText: {
    fontSize: 16,
    lineHeight: 20,
  },
  editLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:'black',
    // height: 40,
    width: 300,
    // marginRight:20,
    
   
  },
});
