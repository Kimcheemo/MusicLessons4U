import React, { useState } from 'react';
import { View, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type DatePickerProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  mode?: 'date';
};

export default function DatePicker({
  label = 'Select Date',
  value,
  onChange,
  mode = 'date',
  minimumDate,
  maximumDate,
}: DatePickerProps) {
  const [show, setShow] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View>
      <Button title={label} onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          value={value ?? new Date()}
          mode={mode}
          display="spinner"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
}