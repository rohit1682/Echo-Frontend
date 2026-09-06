import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Blank entry route. The auth redirect in the root layout immediately routes to
 * either the (auth) or (tabs) group based on session state.
 */
export default function Index() {
  const theme = useTheme();
  return <View style={{ flex: 1, backgroundColor: theme.colors.bg }} />;
}
