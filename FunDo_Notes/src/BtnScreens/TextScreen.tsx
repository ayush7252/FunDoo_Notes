import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {firestore} from '../Firebase/Api';
import {Text} from 'react-native-gesture-handler';

const TextScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [optionVisible , setOptionVisible] = useState(false);

  const handleSaveAndGoBack = async () => {
    try {
      if (title || note) {
        await firestore.collection('notes').add({
          title,
          note,
          notification: false,
          archived: false,
          createdAt: new Date(),
        });
      }
      navigation.goBack();
      setNote('');
      setTitle('');
    } catch (error) {
      Alert.alert('Error', 'Could not save note');
    }
  };

  const openModal = async () => {
    setModalVisible(true);
  };
  const closeModal = async () => {
    setModalVisible(false);
  };
  const openOptionModal = async () => {
    setOptionVisible(true);
  };
  const closeOptionModal = async () => {
    setOptionVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSaveAndGoBack}>
          <Icon name="arrow-back" size={24} color="grey" />
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="push-pin" size={30} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Reminders')}>
            <Icon name="notifications" size={30} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Archive')}>
            <Icon name="archive" size={30} color="grey" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Text Inputs */}
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor="#878786"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.noteInput}
        placeholder="Note"
        placeholderTextColor="#878786"
        value={note}
        onChangeText={setNote}
        textAlignVertical="top"
        multiline={true}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerContent} onPress={openModal}>
          <Icon name="add-box" size={25} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerContent}>
          <Icon name="palette" size={25} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerContent}>
          <Icon name="text-format" size={25} color="grey" />
        </TouchableOpacity>
        <Text style={{color: 'white'}}>Edited just now</Text>
        <TouchableOpacity style={styles.footerContent} onPress={openOptionModal}>
          <Icon name="more-vert" size={30} color="grey" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}>
        <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                closeModal();
              }}>
                <Icon name="photo-camera" size={20} color="grey" />
              <Text style={{color:'grey',lineHeight:20, fontSize:17}}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                closeModal();
              }}>
                <Icon name="image" size={20} color="grey" />
              <Text style={{color:'grey',lineHeight:20, fontSize:17}}>Add Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                closeModal();
              }}>
                <Icon name="brush" size={20} color="grey" />
              <Text style={{color:'grey',lineHeight:20, fontSize:17}}>Drawing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                closeModal();
              }}>
                <Icon name="mic" size={20} color="grey" />
              <Text style={{color:'grey',lineHeight:20, fontSize:17}}>Recording</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                closeModal();
              }}>
                <Icon name="check-box" size={20} color="grey" />
              <Text style={{color:'grey',lineHeight:20, fontSize:17}}>Tick boxes</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        transparent={true}
        visible={optionVisible}
        onRequestClose={closeOptionModal}>
        <TouchableOpacity style={styles.modalOverlay} onPress={closeOptionModal}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                closeOptionModal();
              }}>
                <Icon name="delete" size={25} color="grey" />
              <Text style={{color:'grey',fontSize:17}}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                closeOptionModal();
              }}>
                <Icon name="content-copy" size={25} color="grey" />
              <Text style={{color:'grey',fontSize:17}}>Make a copy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                closeOptionModal();
              }}>
                <Icon name="share" size={25} color="grey" />
              <Text style={{color:'grey',fontSize:17}}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                closeOptionModal();
              }}>
                <Icon name="person-add" size={25} color="grey" />
              <Text style={{color:'grey',fontSize:17}}>Collaborator</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                closeOptionModal();
              }}>
                <Icon name="label" size={25} color="grey" />
              <Text style={{color:'grey',fontSize:17}}>Labels</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                closeOptionModal();
              }}>
                <Icon name="help" size={25} color="grey" />
              <Text style={{color:'grey',fontSize:17}}>Help & feedback</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default TextScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 8,
  },
  titleInput: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 8,
    color: 'white',
  },
  noteInput: {
    fontSize: 20,
    padding: 8,
    minHeight: 200,
    textAlignVertical: 'top',
    borderRadius: 8,
    color: 'white',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#212529',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerContent: {
    // gap: 20
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#253237',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  option: {
    fontSize: 23,
    paddingVertical: 15,
    flexDirection:'row',
    alignItems: 'center',
    gap: 10,
  },
});
