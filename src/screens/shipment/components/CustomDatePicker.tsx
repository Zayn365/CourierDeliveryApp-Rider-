import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomDatePickerProps {
  date?: Date;
  onDateChange: (date: Date) => void;
  initialDate?: Date;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  date,
  onDateChange,
  initialDate = new Date()
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(date || initialDate);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Update selected date when prop changes
  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);

  // Generate years range (last 10 years to next 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 21 },
    (_, i) => currentYear - 10 + i
  );

  // Months array
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  // Generate days based on selected month and year
  const getDays = (year: number, month: number): number[] => {
    return Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => i + 1
    );
  };

  const handleDateSelection = () => {
    onDateChange(selectedDate);
    setModalVisible(false);
  };

  const updateDate = (year?: number, month?: number, day?: number) => {
    const newDate = new Date(
      year ?? selectedDate.getFullYear(),
      month ?? selectedDate.getMonth(),
      day ?? selectedDate.getDate()
    );
    setSelectedDate(newDate);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dateText}>
          {selectedDate.toLocaleDateString()}
        </Text>
        <Icon name="calendar-outline" size={18} color="#666" style={styles.calendarIcon} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.actionButton}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDateSelection} style={styles.actionButton}>
                  <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Selected Date Preview */}
            <View style={styles.selectedDatePreview}>
              <Text style={styles.selectedDateText}>
                {selectedDate.toDateString()}
              </Text>
            </View>

            {/* Date Selection Rows */}
            <View style={styles.pickerContainer}>
              {/* Year Picker */}
              <View style={styles.columnWrapper}>
                <Text style={styles.columnHeader}>Year</Text>
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  style={styles.columnPicker}
                  contentContainerStyle={styles.scrollViewContent}
                  contentOffset={{ y: years.indexOf(selectedDate.getFullYear()) * 40, x: 0 }}
                >
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        selectedDate.getFullYear() === year && styles.selectedPickerItem
                      ]}
                      onPress={() => updateDate(year)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedDate.getFullYear() === year && styles.selectedPickerItemText
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Month Picker */}
              <View style={styles.columnWrapper}>
                <Text style={styles.columnHeader}>Month</Text>
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  style={styles.columnPicker}
                  contentContainerStyle={styles.scrollViewContent}
                  contentOffset={{ y: selectedDate.getMonth() * 40, x: 0 }}
                >
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.pickerItem,
                        selectedDate.getMonth() === index && styles.selectedPickerItem
                      ]}
                      onPress={() => updateDate(undefined, index)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedDate.getMonth() === index && styles.selectedPickerItemText
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Day Picker */}
              <View style={styles.columnWrapper}>
                <Text style={styles.columnHeader}>Day</Text>
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  style={styles.columnPicker}
                  contentContainerStyle={styles.scrollViewContent}
                  contentOffset={{ y: (selectedDate.getDate() - 1) * 40, x: 0 }}
                >
                  {getDays(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth()
                  ).map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.pickerItem,
                        selectedDate.getDate() === day && styles.selectedPickerItem
                      ]}
                      onPress={() => updateDate(undefined, undefined, day)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedDate.getDate() === day && styles.selectedPickerItemText
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#333',
  },
  calendarIcon: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 8,
  },
  cancelButton: {
    color: '#ED1C24',
    fontSize: 16,
  },
  doneButton: {
    color: '#ED1C24',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDatePreview: {
    alignItems: 'center',
    marginVertical: 15,
  },
  selectedDateText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  columnWrapper: {
    flex: 1,
  },
  columnPicker: {
    flex: 1,
  },
  scrollViewContent: {
    // paddingVertical: 10,
  },
  columnHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#ED1C24',
    color: 'white',
    fontSize: 17
  },
  pickerItem: {
    padding: 10,
    alignItems: 'center',
  },
  selectedPickerItem: {
    backgroundColor: 'rgba(237, 28, 36, 0.3)',
  },
  pickerItemText: {
    color: '#333',
  },
  selectedPickerItemText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default CustomDatePicker;
