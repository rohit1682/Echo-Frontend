import React, { useState } from 'react';
import { Platform, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';
import { formatDate } from '../utils/format';

interface Props {
  label: string;
  value?: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  optional?: boolean;
}

/** A themed date picker field (native dialog on Android, inline on iOS). */
export function DateField({ label, value, onChange, placeholder = 'Select date', optional }: Props) {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  return (
    <View style={{ gap: 6 }}>
      <Text variant="label" color="textMuted">
        {label}
        {optional ? ' (optional)' : ''}
      </Text>
      <PressableScale
        haptic={false}
        onPress={() => setShow((s) => !s)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1.5,
          borderRadius: theme.radius.md,
          paddingHorizontal: 14,
          minHeight: 52,
        }}
      >
        <Text color={value ? 'text' : 'textFaint'}>{value ? formatDate(value) : placeholder}</Text>
        <Ionicons name="calendar-outline" size={18} color={theme.colors.textMuted} />
      </PressableScale>
      {show && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selected) => {
            if (Platform.OS !== 'ios') setShow(false);
            if (event.type === 'set' && selected) onChange(selected);
          }}
          themeVariant={theme.isDark ? 'dark' : 'light'}
        />
      )}
    </View>
  );
}
