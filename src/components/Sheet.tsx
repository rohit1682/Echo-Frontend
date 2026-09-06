import React, { useEffect, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

const SCREEN_H = Dimensions.get('window').height;

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/** A themed, gesture-dismissable bottom sheet with a spring slide-up + backdrop fade. */
export function Sheet({ visible, onClose, title, children }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [rendered, setRendered] = useState(visible);

  const translateY = useSharedValue(SCREEN_H);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      backdrop.value = withTiming(1, { duration: 220 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 220 });
    } else if (rendered) {
      backdrop.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(SCREEN_H, { duration: 240 }, (finished) => {
        if (finished) runOnJS(setRendered)(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const panelStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 800) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 220 });
      }
    });

  if (!rendered) return null;

  return (
    <Modal transparent visible={rendered} onRequestClose={onClose} statusBarTranslucent animationType="none">
      <View style={styles.fill}>
        <AnimatedPressable style={[styles.backdrop, backdropStyle]} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.avoider}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.panel,
              panelStyle,
              {
                backgroundColor: theme.colors.bgElevated,
                borderTopLeftRadius: theme.radius.xl,
                borderTopRightRadius: theme.radius.xl,
                paddingBottom: insets.bottom + theme.spacing.lg,
              },
            ]}
          >
            <GestureDetector gesture={pan}>
              <View style={styles.handleZone}>
                <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
                {title ? (
                  <Text variant="heading" center style={{ marginTop: 6 }}>
                    {title}
                  </Text>
                ) : null}
              </View>
            </GestureDetector>
            <View style={{ paddingHorizontal: theme.spacing.lg }}>{children}</View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
  fill: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  avoider: { justifyContent: 'flex-end' },
  panel: { maxHeight: '90%' },
  handleZone: { alignItems: 'center', paddingVertical: 12 },
  handle: { width: 42, height: 5, borderRadius: 3 },
});
