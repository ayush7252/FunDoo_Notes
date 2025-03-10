import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Point {
  x: number;
  y: number;
}

interface SavedPath {
  path: Point[];
  color: string;
  brushSize: number;
  pencilType: 'normal' | 'marker' | 'brush';
}

interface CurrentPath {
  path: Point[];
  color: string;
  brushSize: number;
  pencilType: 'normal' | 'marker' | 'brush';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DrawingScreen = ({navigation}:any) => {
  const [paths, setPaths] = useState<SavedPath[]>([]);
  const [currentPath, setCurrentPath] = useState<CurrentPath | null>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedBrushSize, setSelectedBrushSize] = useState(5);
  const [selectedPencilType, setSelectedPencilType] = useState<'normal' | 'marker' | 'brush'>('normal');
  const [undonePaths, setUndonePaths] = useState<SavedPath[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const currentPathRef = useRef<CurrentPath | null>(null);
  const selectedColorRef = useRef(selectedColor);
  const selectedBrushSizeRef = useRef(selectedBrushSize);

  useEffect(() => {
    currentPathRef.current = currentPath;
  }, [currentPath]);

  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    selectedBrushSizeRef.current = selectedBrushSize;
  }, [selectedBrushSize]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const { locationX, locationY } = evt.nativeEvent;
        if (currentPathRef.current) {
          setPaths(prev => [...prev, currentPathRef.current!]);
        }
        setCurrentPath({
          path: [{ x: locationX, y: locationY }],
          color: selectedColorRef.current,
          brushSize: selectedPencilType === 'marker' 
            ? selectedBrushSizeRef.current * 2
            : selectedBrushSizeRef.current,
          pencilType: selectedPencilType,
        });
      },
      onPanResponderMove: evt => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prev => {
          if (!prev) return null;
          return {
            ...prev,
            path: [...prev.path, { x: locationX, y: locationY }],
          };
        });
      },
      onPanResponderRelease: () => {
        if (currentPathRef.current) {
          setPaths(prev => [...prev, currentPathRef.current!]);
          setCurrentPath(null);
        }
      },
    }),
  ).current;

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath(null);
    setUndonePaths([]);
  };

  const undoLast = () => {
    if (currentPath) {
      setCurrentPath(null);
    } else if (paths.length > 0) {
      const lastPath = paths[paths.length - 1];
      setPaths(prev => prev.slice(0, -1));
      setUndonePaths(prev => [...prev, lastPath]);
    }
  };

  const redoLast = () => {
    if (undonePaths.length > 0) {
      const lastUndonePath = undonePaths[undonePaths.length - 1];
      setPaths(prev => [...prev, lastUndonePath]);
      setUndonePaths(prev => prev.slice(0, -1));
    }
  };

  const getStrokeProps = (pencilType: 'normal' | 'marker' | 'brush') => {
    switch (pencilType) {
      case 'normal':
        return { 
          strokeOpacity: 3, 
          strokeDasharray: 'none' 
        };
      case 'marker':
        return { 
          strokeOpacity: 0.6, 
          strokeDasharray: 'none',
          strokeWidth: selectedBrushSize * 0.5
        };
      case 'brush':
        return { 
          strokeOpacity: 0.5, 
          strokeDasharray: '2,2' 
        };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drawing Canvas</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={redoLast} style={styles.headerButton}>
            <Icon name="redo" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={undoLast} style={styles.headerButton}>
            <Icon name="undo" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.canvasContainer}>
        <Svg style={styles.canvas}>
          {paths.map((path, index) => (
            <Path
              key={`saved-${index}`}
              stroke={path.color}
              strokeWidth={path.brushSize}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="transparent"
              d={path.path.reduce(
                (acc, point, i) =>
                  i === 0
                    ? `M ${point.x},${point.y}`
                    : `${acc} L ${point.x},${point.y}`,
                '',
              )}
              {...getStrokeProps(path.pencilType)}
            />
          ))}
          {currentPath && (
            <Path
              key="current-path"
              stroke={currentPath.color}
              strokeWidth={currentPath.brushSize}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="transparent"
              d={currentPath.path.reduce(
                (acc, point, i) =>
                  i === 0
                    ? `M ${point.x},${point.y}`
                    : `${acc} L ${point.x},${point.y}`,
                '',
              )}
              {...getStrokeProps(currentPath.pencilType)}
            />
          )}
        </Svg>
        <View
          style={StyleSheet.absoluteFill}
          {...panResponder.panHandlers}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.pencilTypeButton} onPress={clearCanvas}>
          <Icon name="delete" size={24} color="#000" />
        </TouchableOpacity>

        {[
          { type: 'normal', icon: 'edit' },
          { type: 'marker', icon: 'highlight' },
          { type: 'brush', icon: 'brush' }
        ].map(({ type, icon }) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.pencilTypeButton,
              selectedPencilType === type && styles.selectedPencilType,
            ]}
            onPress={() => setSelectedPencilType(type as 'normal' | 'marker' | 'brush')}
            onLongPress={() => setIsPopupVisible(true)}
          >
            <Icon name={icon} size={24} color="#000" />
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={isPopupVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPopupVisible(false)}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Select Color</Text>
            <View style={styles.colorPicker}>
              {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'].map(
                color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => {
                      setSelectedColor(color);
                      setIsPopupVisible(false);
                    }}
                  />
                ),
              )}
            </View>

            <Text style={styles.popupTitle}>Select Brush Size</Text>
            <View style={styles.brushSizeContainer}>
              {[3, 5, 8, 12].map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.brushSizeButton,
                    { width: size * 2, height: size * 2, borderRadius: size },
                    selectedBrushSize === size && styles.selectedBrush,
                  ]}
                  onPress={() => {
                    setSelectedBrushSize(size);
                    setIsPopupVisible(false);
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  canvas: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  pencilTypeButton: {
    padding: 10,
    alignItems: 'center',
  },
  selectedPencilType: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedColor: {
    borderColor: '#000',
    transform: [{ scale: 1.2 }],
  },
  brushSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 16,
  },
  brushSizeButton: {
    backgroundColor: '#333',
  },
  selectedBrush: {
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default DrawingScreen;