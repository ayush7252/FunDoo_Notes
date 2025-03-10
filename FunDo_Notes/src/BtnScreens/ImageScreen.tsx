import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const ImageScreen = ({ navigation }:any) => {
  // Function to open the camera
  const handleTakePhoto = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false, 
      maxHeight: 2000, 
      maxWidth: 2000, 
      saveToPhotos: true, 
    };
  
    launchCamera(options, (response) => {
      if (response.didCancel) {
        Alert.alert('User cancelled camera');
      } else if (response.errorCode) {
        switch (response.errorCode) {
          case 'camera_unavailable':
            Alert.alert('Camera not available on this device');
            break;
          case 'permission':
            Alert.alert('Permission not granted to access the camera');
            break;
          default:
            Alert.alert('Camera Error: ', response.errorMessage);
        }
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri; // URI of the captured image
        Alert.alert('Photo URI: ', imageUri);
        // You can now use the imageUri to display or upload the image
      } else {
        Alert.alert('Unexpected error occurred');
      }
    });
  };

  const handleChooseImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('User cancelled image picker');
      } else {
        const imageUri = response.assets[0].uri;
        Alert.alert('Image URI: ', imageUri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.background}
        activeOpacity={1}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.popupContainer}>
        <Text style={styles.heading}>Add image</Text>

        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleTakePhoto}
          >
            <Icon name="camera" size={30} color="black" />
            <Text style={styles.buttonText}>Take photo</Text>
          </TouchableOpacity>

          {/* Choose Image Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleChooseImage}
          >
            <Icon name="photo-library" size={30} color="black" />
            <Text style={styles.buttonText}>Choose image</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  popupContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
    width: '80%',
    elevation: 5,
    zIndex: 1,
  },
  heading: {
    fontSize: 23,
    fontWeight: '700',
    marginBottom: 5,
    lineHeight: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    marginLeft: 15,
    lineHeight: 20,
  },
});

export default ImageScreen;