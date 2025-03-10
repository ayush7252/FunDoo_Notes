import {StyleSheet, Text, View, TouchableOpacity, Animated} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const AddButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };
  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      {/* Additional Buttons */}
      <Animated.View
        style={[styles.subButton, {bottom: 70, opacity, width: 100}]}>
        <TouchableOpacity onPress={()=> navigation.navigate('TextScreen')}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 20,
                color: 'white',
                marginTop: 4,
                marginRight: 3,
              }}>
              Text
            </Text>
            <Icon name="format-size" size={30} color="white" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[styles.subButton, {bottom: 125, opacity, width: 100}]}>
        <TouchableOpacity onPress={()=> navigation.navigate('ListScreen')}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 20,
                color: 'white',
                marginTop: 4,
                marginRight: 3,
              }}>
              List
            </Text>
            <Icon name="check-box" size={27} color="white" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[styles.subButton, {bottom: 180, opacity, width: 120}]}>
        <TouchableOpacity onPress={()=> navigation.navigate('DrawingScreen')}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 20, color: 'white', marginRight: 5}}>
              Drawing
            </Text>
            <Icon name="brush" size={23} color="white" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[styles.subButton, {bottom: 235, opacity, width: 110}]}>
        <TouchableOpacity onPress={()=> navigation.navigate('Image')}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 20,
                color: 'white',
                marginTop: 4,
                marginRight: 4,
              }}>
              Image
            </Text>
            <Icon name="image" size={27} color="white" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Button */}
      <TouchableOpacity onPress={toggleMenu} style={styles.mainButton}>
        <Animated.View style={rotation}>
          <Icon name="add" size={40} color="white" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 35,
    right: 20,
  },
  mainButton: {
    height: 60,
    width: 60,
    backgroundColor: '#55614f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    elevation: 5,
  },
  subButton: {
    position: 'absolute',
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 18,
    backgroundColor: '#55614f',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 30,
    right: 2,
  },
});
