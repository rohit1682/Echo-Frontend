import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  topInset?: boolean;
}

/** Standard screen container: safe-area aware, themed background, optional scroll + pull-to-refresh. */
export function Screen({
  children,
  scroll = true,
  padded = true,
  refreshing,
  onRefresh,
  style,
  contentStyle,
  topInset = true,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const padding = padded ? { paddingHorizontal: theme.spacing.lg } : undefined;
  const paddingTop = topInset ? insets.top + theme.spacing.sm : theme.spacing.sm;

  if (!scroll) {
    return (
      <View style={[styles.flex, { backgroundColor: theme.colors.bg, paddingTop }, padding, style]}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: theme.colors.bg }, style]}
      contentContainerStyle={[
        { paddingTop, paddingBottom: insets.bottom + theme.spacing.xxxl * 2.2 },
        padding,
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
