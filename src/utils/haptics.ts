import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/** Thin, web-safe haptics helpers used across the UI for tactile feedback. */
const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

export const haptics = {
  light() {
    if (enabled) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  medium() {
    if (enabled) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  success() {
    if (enabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  warning() {
    if (enabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  selection() {
    if (enabled) void Haptics.selectionAsync();
  },
};
