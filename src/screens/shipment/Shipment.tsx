import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ParcelList from './components/ParcelList';
import usePlaceOrder from '@utils/store/placeOrderStore';
import useAuthStore from '@utils/store/authStore';
import CustomDatePicker from './components/CustomDatePicker';

// Enhanced type definitions
interface Customer {
  name: string;
  role?: string;
}

interface Order {
  id: number;
  consigneeName: string;
  customer: Customer;
  orderId: string;
  orderStatusString: string;
  paymentTypeString: string;
  parcelTypeString: string;
  parcelType: number;
  isInsured: boolean;
  createdAt: string;
  [key: string]: any;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface BaseFilterConfig {
  type: 'text' | 'select' | 'boolean' | 'date';
  label: string;
  icon: string;
}

interface TextFilterConfig extends BaseFilterConfig {
  type: 'text';
}

interface SelectFilterConfig extends BaseFilterConfig {
  type: 'select';
  options: string[];
}

interface BooleanFilterConfig extends BaseFilterConfig {
  type: 'boolean';
}

interface DateFilterConfig extends BaseFilterConfig {
  type: 'date';
}

type FilterConfig = TextFilterConfig | SelectFilterConfig | BooleanFilterConfig | DateFilterConfig;

type FilterValue = string | boolean | DateRange | undefined;

interface SelectedFilters {
  [key: string]: FilterValue;
}

const FILTER_CONFIGS: Record<string, FilterConfig> = {
  consigneeName: {
    type: 'text',
    label: 'Consignee Name',
    icon: 'person-outline'
  },
  customerName: {
    type: 'text',
    label: 'Customer Name',
    icon: 'people-outline'
  },
  orderId: {
    type: 'text',
    label: 'Order ID',
    icon: 'document-text-outline'
  },
  orderStatusString: {
    type: 'select',
    label: 'Order Status',
    icon: 'stats-chart-outline',
    options: ['ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED']
  },
  paymentTypeString: {
    type: 'select',
    label: 'Payment Type',
    icon: 'card-outline',
    options: ['DIGITAL_PAYMENT', 'CASH']
  },
  parcelTypeString: {
    type: 'select',
    label: 'Parcel Type',
    icon: 'cube-outline',
    options: ['DOCUMENT', 'PARCEL', 'DOCUMENT_FLYER']
  },
  isInsured: {
    type: 'boolean',
    label: 'Insurance',
    icon: 'shield-checkmark-outline'
  },
  createdAt: {
    type: 'date',
    label: 'Date Range',
    icon: 'calendar-outline'
  }
};

// Utility function to format backend options for display
// const formatOptionForDisplay = (option: string): string => {
//   return option
//     .toLowerCase()
//     .split('_')
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// };

const formatOptionForDisplay = (option: string): string => {
  // Replace underscores with spaces if present
  let formatted = option.replace('_', ' ').toLowerCase();

  // Split into parts and capitalize first letter of each word
  const parts = formatted.split(' ');
  formatted = parts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Special handling for "(Flyer)"
  formatted = formatted.replace('(flyer)', '(Flyer)');

  return formatted;
};

// Utility function to format filter value for display
const formatFilterValueForDisplay = (key: string, value: FilterValue): string => {

  if (value === undefined) return '';

  if (typeof value === 'string') {
    return key.includes('String') ? formatOptionForDisplay(value) : value;
  }

  if (typeof value === 'boolean') {
    return value ? 'Insured' : 'Not Insured';
  }

  if (value && typeof value === 'object' && 'startDate' in value) {
    const dateRange = value as DateRange;
    return `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`;
  }

  return String(value);

};

const Shipment: React.FC = () => {
  const { orders, getUserOrders } = usePlaceOrder();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [isFilteringActive, setIsFilteringActive] = useState<boolean>(false);

  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [tempDateRange, setTempDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date()
  });

  useEffect(() => {
    const fetchOrders = async () => {
      if (token) {
        setLoading(true);
        await getUserOrders(token);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  useEffect(() => {
    if (!orders || !Array.isArray(orders)) return;
    applyFilters();
    // Set filtering active if there are any filters
    setIsFilteringActive(Object.keys(selectedFilters).length > 0);
  }, [selectedFilters, orders]);

  // console.log("TCL ~ Shipment ~ orders", orders);
  // console.log("TCL ~ Shipment ~ orders", JSON.stringify(orders, null, 2));

  const applyFilters = () => {
    let filtered = (orders ?? []).filter((order: Order) => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (value === undefined) return true;

        const config = FILTER_CONFIGS[key];

        switch (config.type) {
          // case 'text':
          //   if (typeof value !== 'string') return true;
          //   const searchValue = value.toLowerCase();
          //   if (key === 'customerName') {
          //     return order.customer.name.toLowerCase().includes(searchValue);
          //   }
          //   return String(order[key]).toLowerCase().includes(searchValue);

          case 'text':
            if (typeof value !== 'string') return true;
            const searchValue = value.toLowerCase();

            // Special handling for customerName based on order.customer.role
            if (key === 'customerName') {
              const role = order.customer?.role?.toLowerCase();

              // For 'express-agent' role, check senderName
              if (role === 'express-agent' && order.senderName) {
                return order.senderName.toLowerCase().includes(searchValue);
              }
              // For 'user' role or undefined role, check customer.name
              if ((role === 'user' || !role) && order.customer?.name) {
                return order.customer.name.toLowerCase().includes(searchValue);
              }
              // Fallback: check both fields if available
              return (
                (order.customer?.name?.toLowerCase()?.includes(searchValue) || false) ||
                (order.senderName?.toLowerCase()?.includes(searchValue) || false)
              );
            }
            return String(order[key]).toLowerCase().includes(searchValue);

          case 'select':
            return order[key] === value;

          case 'boolean':
            return order[key] === value;

          case 'date':
            if (!value || typeof value !== 'object' || !('startDate' in value) || !('endDate' in value)) {
              return true;
            }
            const dateRange = value as DateRange;
            const orderDate = new Date(order[key]);

            // Set hours to 0 for proper date comparison
            const startDate = new Date(dateRange.startDate);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(dateRange.endDate);
            endDate.setHours(23, 59, 59, 999);

            return orderDate >= startDate && orderDate <= endDate;

          default:
            return true;
        }
      });
    });

    // Sort filtered orders by createdAt in descending order (newest first)
    // filtered.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Sort filtered orders by createdAt in descending order (newest first)
    filtered = filtered.sort((a: Order, b: Order) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredOrders(filtered);

    // Show filter applied feedback if filters are active
    if (Object.keys(selectedFilters).length > 0) {
      // Optional: Add a visual feedback that filters were applied
    }

  };
  const removeFilter = (key: string) => {
    const newFilters = { ...selectedFilters };
    delete newFilters[key];
    setSelectedFilters(newFilters);
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setActiveFilterCategory(null);
  };

  const applyDateFilter = () => {
    if (activeFilterCategory) {
      setSelectedFilters(prev => ({
        ...prev,
        [activeFilterCategory]: {
          startDate: tempDateRange.startDate,
          endDate: tempDateRange.endDate
        }
      }));

      // Close the filter input
      setActiveFilterCategory(null);
    }
  };

  const renderFilterInput = (key: string) => {
    const config = FILTER_CONFIGS[key];

    switch (config.type) {
      case 'text':
        return (
          <View style={styles.textFilterContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={`Enter ${config.label}`}
              placeholderTextColor={"#666"}
              value={typeof selectedFilters[key] === 'string' ? selectedFilters[key] as string : ''}
              onChangeText={(text) => setSelectedFilters(prev => ({
                ...prev,
                [key]: text.length > 0 ? text : undefined
              }))}
              autoFocus
            />
          </View>
        );

      case 'select':
        return (
           <View style={[styles.selectFilterContainer,
          //  {backgroundColor:'green', alignItems:'center'}
           ]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ marginStart: 10, paddingEnd: 20 }}
            >
              {(config as SelectFilterConfig).options.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.selectOption,
                    selectedFilters[key] === option && styles.selectedOption,
                    // {borderWidth:1}
                  ]}
                  onPress={() => {
                    setSelectedFilters(prev => {
                      // Toggle selection
                      const newFilters = { ...prev };
                      if (newFilters[key] === option) {
                        delete newFilters[key];
                      } else {
                        newFilters[key] = option;
                      }
                      return newFilters;
                    });
                  }}
                >
                  <Text style={[
                    { color: 'black' },
                    selectedFilters[key] === option && { color: 'white', fontWeight: 'bold' }
                  ]}>
                    {formatOptionForDisplay(option)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 'boolean':
        return (
          <View style={styles.booleanFilterContainer}>
            <TouchableOpacity
              style={[
                styles.booleanOption,
                selectedFilters[key] === true && styles.selectedOption
              ]}
              onPress={() => setSelectedFilters(prev => {
                // Toggle selection
                const newFilters = { ...prev };
                if (newFilters[key] === true) {
                  delete newFilters[key];
                } else {
                  newFilters[key] = true;
                }
                return newFilters;
              })}
            >
              <Text style={[{ color: "black" }, selectedFilters[key] === true && { color: 'white', fontWeight: 'bold' }]}>
                Insured
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.booleanOption,
                selectedFilters[key] === false && styles.selectedOption
              ]}
              onPress={() => setSelectedFilters(prev => {
                // Toggle selection
                const newFilters = { ...prev };
                if (newFilters[key] === false) {
                  delete newFilters[key];
                } else {
                  newFilters[key] = false;
                }
                return newFilters;
              })}
            >
              <Text style={[{ color: "black" }, selectedFilters[key] === false && { color: 'white', fontWeight: 'bold' }]}>
                Not Insured
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'date':
        return (
          <View style={styles.dateFilterContainer}>
            <Text style={styles.dateFilterLabel}>Select Date Range</Text>
            <View style={styles.dateRangeWrapper}>
              <View style={styles.dateRangeContainer}>
                <Text style={styles.dateRangeLabel}>From:</Text>
                <CustomDatePicker
                  date={tempDateRange.startDate}
                  onDateChange={(startDate: Date) => {
                    setTempDateRange(prev => ({
                      ...prev,
                      startDate
                    }));
                  }}
                />
              </View>
              <View style={styles.dateRangeContainer}>
                <Text style={styles.dateRangeLabel}>To:</Text>
                <CustomDatePicker
                  date={tempDateRange.endDate}
                  onDateChange={(endDate: Date) => {
                    setTempDateRange(prev => ({
                      ...prev,
                      endDate
                    }));
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.applyDateButton}
              onPress={applyDateFilter}
            >
              <Text style={styles.applyDateButtonText}>Apply Date Filter</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  const refetch = () => {
    if (token) {
      getUserOrders(token);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <ActivityIndicator size="large" color="#ED1C24" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Filter Section */}
        <View style={styles.filterSection}>

          <View style={styles.filterHeaderContainer}>
            {filteredOrders.length > 0 && <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.filterHeader, activeFilterCategory && { borderBottomWidth: 0, paddingBottom: 0 }]}
              contentContainerStyle={{ marginStart: 15, paddingEnd: 30, gap: 10 }}
            >
              {Object.entries(FILTER_CONFIGS).map(([key, config]) => {
                const isSelected = activeFilterCategory === key;
                const isApplied = key in selectedFilters;

                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.filterHeaderItem,
                      isSelected && styles.activeFilterHeaderItem,
                      isApplied && !isSelected && styles.appliedFilterHeaderItem
                    ]}
                    onPress={() => {
                      // Initialize temp date range if selected filter is date
                      if (config.type === 'date') {
                        const currentDateRange = selectedFilters[key] as DateRange | undefined;
                        setTempDateRange({
                          startDate: currentDateRange?.startDate || new Date(),
                          endDate: currentDateRange?.endDate || new Date()
                        });
                      }
                      setActiveFilterCategory(prev => prev === key ? null : key);
                    }}
                  >
                    <Icon
                      name={config.icon as any}
                      size={20}
                      color={
                        isSelected ? '#333' :
                          isApplied ? '#ED1C24' :
                            '#666'
                      }
                    />
                    <Text
                      style={[
                        styles.filterHeaderText,
                        isApplied && styles.appliedFilterHeaderText,
                        isSelected && { color: '#333', fontWeight: 'bold' }
                      ]}
                    >
                      {config.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

            </ScrollView>}

            {isFilteringActive && (
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Active Filter Input */}
          {activeFilterCategory && (
            <View style={styles.activeFilterInputWrapper}>
              {renderFilterInput(activeFilterCategory)}
            </View>
          )}

        </View>

        {/* Active Filters */}
        {Object.keys(selectedFilters).length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.activeFiltersContainer}
            contentContainerStyle={{ marginStart: 10, paddingEnd: 20 }}
          >
            {Object.entries(selectedFilters).map(([key, value]) => {
              const displayValue = formatFilterValueForDisplay(key, value);

              return (
                <TouchableOpacity
                  key={key}
                  style={styles.activeFilterChip}
                  onPress={() => removeFilter(key)}
                >
                  <Text style={styles.activeFilterText}>
                    {FILTER_CONFIGS[key].label}: {displayValue}
                  </Text>
                  <Icon name="close" size={16} color="red" />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Results Count Banner when filtering */}
        {isFilteringActive && (
          <View style={styles.resultsCountBanner}>
            <Text style={styles.resultsCountText}>
              {filteredOrders.length} {filteredOrders.length === 1 ? 'result' : 'results'} founds
            </Text>
          </View>
        )}

        {/* Parcel List */}
        <ParcelList list={filteredOrders} refetch={refetch} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterSection: {
    backgroundColor: '#f8f9fa',
  },
  filterHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterHeader: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flex: 1,
  },
  filterHeaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activeFilterHeaderItem: {
    borderColor: '#ED1C24',
    borderWidth: 1,
  },
  appliedFilterHeaderItem: {
    backgroundColor: 'rgba(237, 28, 36, 0.1)',
    borderColor: '#ED1C24',
    borderWidth: 1,
  },
  filterHeaderText: {
    marginLeft: 8,
    color: '#333',
  },
  appliedFilterHeaderText: {
    marginLeft: 8,
    color: '#ED1C24',
    fontWeight: 'bold',
  },
  activeFilterInputWrapper: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    minHeight: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  textFilterContainer: {
    padding: 10,
    width: '100%',
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectFilterContainer: {
    paddingVertical: 13,
    width: '100%',
    alignItems:'center'
  },
  selectOption: {
    paddingHorizontal: 15,
    marginHorizontal: 5,
    backgroundColor: '#f1f3f5',
    borderRadius: 20,
    borderWidth: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  booleanFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  booleanOption: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#f1f3f5',
    borderRadius: 20,
    borderWidth: 0.1,
  },
  selectedOption: {
    backgroundColor: 'rgba(237, 28, 36, 1)',
    color: 'white',
  },
  dateFilterContainer: {
    padding: 15,
    width: '100%',
  },
  dateFilterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dateRangeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateRangeLabel: {
    marginRight: 10,
    fontSize: 14,
  },
  applyDateButton: {
    backgroundColor: '#ED1C24',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  applyDateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeFiltersContainer: {
    paddingVertical: 10,
    // backgroundColor: '#f1f3f5',
    // height: 55,
    // backgroundColor: 'pink',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(237, 28, 36, 1)',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 8,
    paddingVertical: 0,
    marginLeft: 4,
    height: 30,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'pink'
  },
  activeFilterText: {
    // color: 'white',
    color: 'black',
    marginRight: 4,
  },
  clearAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingRight: 20,
    // backgroundColor:'pink',
    // borderColor:'#000',
    // borderWidth:0.5,
    // borderLeftColor:'#000',
    // borderLeftWidth:0.5,
    // borderBottomColor:'#000',
    // borderBottomWidth:0.55,
  },
  clearAllText: {
    color: '#ED1C24',
    fontWeight: 'bold',
    paddingTop: 10,
  },
  resultsCountBanner: {
    // backgroundColor: 'rgba(237, 28, 36, 0.1)',
    backgroundColor: 'pink',
    padding: 8,
    alignItems: 'center',
  },
  resultsCountText: {
    color: '#333',
    fontWeight: 'bold',
  }
});

export default Shipment;