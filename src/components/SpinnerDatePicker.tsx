import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet, Button, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";


type Props = {
  label?: string;
  value?: Date | null;
  onChange?: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
};

const SpinnerDatePicker: React.FC<Props> = ({
  label,
  value,
  onChange,
  maximumDate,
  minimumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (event.type === "set" && date) {
      onChange?.(date);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.button} onPress={() => setShowPicker(true)}>
        <Text style={styles.buttonText}>Select Date</Text>
      </TouchableOpacity>

      <Text>{value ? format(value, "PPP") : "No date selected"}</Text>

      {/* Modal for iOS */}
      {Platform.OS === "ios" && showPicker && (
  <Modal transparent animationType="slide" visible={showPicker}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalShell}>
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="spinner"
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => setShowPicker(false)}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}

      {/* Android fallback */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
  padding: 16,
  backgroundColor: "#fff",
  borderWidth: 1, // for debugging
  borderColor: "blue", // to see the boundaries
},

  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  button: {
  padding: 12,
  backgroundColor: "#4A90E2",
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  marginVertical: 12,
},
buttonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalOverlay: {
  flex: 1,
  justifyContent: "flex-end",
  backgroundColor: "rgba(0,0,0,0.5)", // dimmed backdrop
},
modalContent: {
  padding: 16,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  borderWidth: 2, // add this for debugging
  borderColor: "red",
  minHeight: 250, // ensures space for the spinner
  justifyContent: "center",
},
doneButton: {
  marginTop: 12,
  padding: 12,
  backgroundColor: "#4A90E2",
  borderRadius: 8,
  alignItems: "center",
},
doneText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},
modalShell: {
  padding: 16,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  borderWidth: 1,
  borderColor: "#fff", // white border around the spinner
  backgroundColor: "transparent", // don't block the spinner
},

});

export default SpinnerDatePicker;