// import { create } from "zustand";
// import { persist, PersistOptions } from "zustand/middleware";
// import axios from "axios";
// import { API_URL } from "@env";

// // const apiLink: string = API_URL;

// const apiLink = API_URL;
// console.log("API Link From depositStore : ", apiLink );

// interface Payment {
//   id: number;
//   orderId: number;
//   riderId: string;
//   amountReceivedRider: number;
//   amountPaidRider: number;
//   commission: number;
//   refund: number;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   order:any;
//   consignmentNumber?: string; // Optional, added for future API update
// }

// interface Token {
//   id: number;
//   token: string;
//   transactionStatus: string;
//   expiry: string;
//   easypaisaId: string;
//   transactionAmount: number;
//   transactionDateTime: string | null;
//   orderList: { orderId: number; consignmentNumber: string }[];
// }

// interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// interface DepositStore {
//   isLoading: boolean;
//   todayPayments: Payment[];
//   pastPayments: { total: number; payments: Payment[] };
//   selectedConsignments: string[];
//   selectedOrderIds: number[];
//   totalSelectedAmount: number;
//   todayTokens: Token[];
//   pastTokens: Token[];
//   error: string | null; // Added error state
//   fetchTodayPayments: (token: string) => Promise<void>;
//   fetchPastPayments: (token: string) => Promise<void>;
//   toggleSelection: (orderId: number, amount: number, consignmentNumber: string) => void;
//   generateToken: (token: string) => Promise<any>;
//   generateTodaysToken: (token: string) => Promise<any>;
//   generatePastsToken: (token: string) => Promise<any>;
//   fetchTokens: (token: string) => Promise<void>;
//   payNow: (token: string) => Promise<any>;
// }

// const useDepositStore = create<DepositStore>()(
//   persist(
//     (set, get) => ({
//       isLoading: false,
//       todayPayments: [],
//       pastPayments: { total: 0, payments: [] },
//       selectedConsignments: [],
//       selectedOrderIds: [],
//       totalSelectedAmount: 0,
//       todayTokens: [],
//       pastTokens: [],
//       error: null,

//       fetchTodayPayments: async (token: string) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await axios.get<ApiResponse<Payment[]>>(
//             `${apiLink}/payments/today-payments`,
//             { headers: { authorization: `${token}` } }
//           );
//           set({ todayPayments: response.data.data, isLoading: false });
//         } catch (error: unknown) {
//           const message = (error as any)?.response?.data?.message || "Failed to fetch today’s payments";
//           set({ isLoading: false, error: message });
//         }
//       },

//       fetchPastPayments: async (token: string) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await axios.get<
//             ApiResponse<{ total: number; payments: Payment[] }>
//           >(`${apiLink}/payments/past-payments`, {
//             headers: { authorization: `${token}` },
//           });
//           set({ pastPayments: response.data.data, isLoading: false });
//         } catch (error: unknown) {
//           const message = (error as any)?.response?.data?.message || "Failed to fetch past payments";
//           set({ isLoading: false, error: message });
//         }
//       },

//       toggleSelection: (orderId: number, amount: number, consignmentNumber: string) => {
//         const { selectedOrderIds, selectedConsignments, totalSelectedAmount } = get();
//         if (selectedOrderIds.includes(orderId)) {
//           set({
//             selectedOrderIds: selectedOrderIds.filter((id) => id !== orderId),
//             selectedConsignments: selectedConsignments.filter((cn) => cn !== consignmentNumber),
//             totalSelectedAmount: totalSelectedAmount - amount,
//           });
//         } else {
//           set({
//             selectedOrderIds: [...selectedOrderIds, orderId],
//             selectedConsignments: [...selectedConsignments, consignmentNumber],
//             totalSelectedAmount: totalSelectedAmount + amount,
//           });
//         }
//       },

//       generateToken: async (token: string) => {
//         const { selectedOrderIds } = get();
//         if (selectedOrderIds.length === 0) return;

//         set({ isLoading: true, error: null });
//         try {
//           const response = await axios.post<ApiResponse<any>>(
//             `${apiLink}/payments/generate-todays-token`,
//             { orderIds: selectedOrderIds },
//             { headers: { authorization: `${token}` } }
//           );
//           set({ isLoading: false });
//           return response.data;
//         } catch (error: unknown) {
//           const message = (error as any)?.response?.data?.message || "Failed to generate token";
//           set({ isLoading: false, error: message });
//           throw error;
//         }
//       },  

//       generatePastsToken: async (token: string) => {
        
//         // const { selectedOrderIds } = get();
//         // if (selectedOrderIds.length === 0) return;

//         set({ isLoading: true, error: null });
//         try {
//           const response = await axios.post<ApiResponse<any>>(
//             `${apiLink}/payments/generate-past-token`,
//             // { orderIds: selectedOrderIds },
//             { headers: { authorization: `${token}` } }
//           );
//           set({ isLoading: false });
//           return response.data;
//         } catch (error: unknown) {
//           const message = (error as any)?.response?.data?.message || "Failed to generate token";
//           set({ isLoading: false, error: message });
//           throw error;
//         }
//       }, 
      
//       generateTodaysToken: async (token: string) => {
//         const { selectedOrderIds } = get();
//         if (selectedOrderIds.length === 0) return;

//         set({ isLoading: true, error: null });
//         try {
//           const response = await axios.post<ApiResponse<any>>(
//             `${apiLink}/payments/generate-todays-token`,
//             { orderIds: selectedOrderIds },
//             { headers: { authorization: `${token}` } }
//           );
//           set({ isLoading: false });
//           return response.data;
//         } catch (error: unknown) {
//           const message = (error as any)?.response?.data?.message || "Failed to generate token";
//           set({ isLoading: false, error: message });
//           throw error;
//         }
//       }, 

//       fetchTokens: async (token: string) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await axios.get<ApiResponse<Token[]>>(
//             `${apiLink}/payments/get-tokens`,
//             { headers: { authorization: `${token}` } }
//           );
//           const tokens = response.data.data;
//           set({
//             todayTokens: tokens.filter((t) => !t.transactionDateTime),
//             pastTokens: tokens.filter((t) => t.transactionDateTime),
//             isLoading: false,
//           });
//         } catch (error: unknown) {
//           const message = (error as any)?.response?.data?.message || "Failed to fetch tokens";
//           set({ isLoading: false, error: message });
//         }
//       },

//       payNow: async (token: string) => {
//         const { pastPayments } = get();
//         if (pastPayments.payments.length === 0) return;

//         set({ isLoading: true, error: null });
//         try {
//           const response = await axios.post<ApiResponse<any>>(
//             `${apiLink}/payments/generate-todays-token`,
//             { orderIds: pastPayments.payments.map((p) => p.orderId) },
//             { headers: { authorization: `${token}` } }
//           );
//           set({ isLoading: false });
//           return response.data;
//         } catch (error: unknown) {
//           const message = (error as any)?.response?.data?.message || "Failed to process payment";
//           set({ isLoading: false, error: message });
//           throw error;
//         }
//       },
//     }),
//     {
//       name: "deposit-storage",
//     } as PersistOptions<DepositStore>
//   )
// );

// export default useDepositStore;

import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import axios from "axios";
import { API_URL } from "@env";

// const apiLink: string = API_URL;

const apiLink = API_URL;
console.log("API Link From depositStore : ", apiLink );

interface Payment {
  id: number;
  orderId: number;
  riderId: string;
  amountReceivedRider: number;
  amountPaidRider: number;
  commission: number;
  refund: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  order:any;
  consignmentNumber?: string; // Optional, added for future API update
}

interface Token {
  id: number;
  token: string;
  transactionStatus: string;
  expiry: string;
  easypaisaId: string;
  transactionAmount: number;
  transactionDateTime: string | null;
  orderList: { orderId: number; consignmentNumber: string }[];
  note: string; // Added note attribute for token classification
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface DepositStore {
  isLoading: boolean;
  todayPayments: Payment[];
  pastPayments: { total: number; payments: Payment[] };
  selectedConsignments: string[];
  selectedOrderIds: number[];
  totalSelectedAmount: number;
  todayTokens: Token[];
  pastTokens: Token[];
  error: string | null; // Added error state
  fetchTodayPayments: (token: string) => Promise<void>;
  fetchPastPayments: (token: string) => Promise<void>;
  toggleSelection: (orderId: number, amount: number, consignmentNumber: string) => void;
  generateToken: (token: string) => Promise<any>;
  generateTodaysToken: (token: string) => Promise<any>;
  generatePastsToken: (token: string) => Promise<any>;
  fetchTokens: (token: string) => Promise<void>;
  payNow: (token: string) => Promise<any>;
}

const useDepositStore = create<DepositStore>()(
  persist(
    (set, get) => ({
      isLoading: false,
      todayPayments: [],
      pastPayments: { total: 0, payments: [] },
      selectedConsignments: [],
      selectedOrderIds: [],
      totalSelectedAmount: 0,
      todayTokens: [],
      pastTokens: [],
      error: null,

      fetchTodayPayments: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get<ApiResponse<Payment[]>>(
            `${apiLink}/payments/today-payments`,
            { headers: { authorization: `${token}` } }
          );
          set({ todayPayments: response.data.data, isLoading: false });
        } catch (error: unknown) {
          const message = (error as any)?.response?.data?.message || "Failed to fetch today's payments";
          set({ isLoading: false, error: message });
        }
      },

      fetchPastPayments: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get<
            ApiResponse<{ total: number; payments: Payment[] }>
          >(`${apiLink}/payments/past-payments`, {
            headers: { authorization: `${token}` },
          });
          set({ pastPayments: response.data.data, isLoading: false });
        } catch (error: unknown) {
          const message = (error as any)?.response?.data?.message || "Failed to fetch past payments";
          set({ isLoading: false, error: message });
        }
      },

      toggleSelection: (orderId: number, amount: number, consignmentNumber: string) => {
        const { selectedOrderIds, selectedConsignments, totalSelectedAmount } = get();
        if (selectedOrderIds.includes(orderId)) {
          set({
            selectedOrderIds: selectedOrderIds.filter((id) => id !== orderId),
            selectedConsignments: selectedConsignments.filter((cn) => cn !== consignmentNumber),
            totalSelectedAmount: totalSelectedAmount - amount,
          });
        } else {
          set({
            selectedOrderIds: [...selectedOrderIds, orderId],
            selectedConsignments: [...selectedConsignments, consignmentNumber],
            totalSelectedAmount: totalSelectedAmount + amount,
          });
        }
      },

      generateToken: async (token: string) => {
        const { selectedOrderIds } = get();
        if (selectedOrderIds.length === 0) return;

        set({ isLoading: true, error: null });
        try {
          const response = await axios.post<ApiResponse<any>>(
            `${apiLink}/payments/generate-todays-token`,
            { orderIds: selectedOrderIds },
            { headers: { authorization: `${token}` } }
          );
          set({ isLoading: false });
          return response.data;
        } catch (error: unknown) {
          const message = (error as any)?.response?.data?.message || "Failed to generate token";
          set({ isLoading: false, error: message });
          throw error;
        }
      },  

      generatePastsToken: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post<ApiResponse<any>>(
            `${apiLink}/payments/generate-past-token`,
            {}, // Empty object as body
            { headers: { authorization: `${token}` } }
          );
          set({ isLoading: false });
          return response.data;
        } catch (error: unknown) {
          const message = (error as any)?.response?.data?.message || "Failed to generate token";
          set({ isLoading: false, error: message });
          throw error;
        }
      }, 
      
      generateTodaysToken: async (token: string) => {
        const { selectedOrderIds } = get();
        if (selectedOrderIds.length === 0) return;

        set({ isLoading: true, error: null });
        try {
          const response = await axios.post<ApiResponse<any>>(
            `${apiLink}/payments/generate-todays-token`,
            { orderIds: selectedOrderIds },
            { headers: { authorization: `${token}` } }
          );
          set({ isLoading: false });
          return response.data;
        } catch (error: unknown) {
          const message = (error as any)?.response?.data?.message || "Failed to generate token";
          set({ isLoading: false, error: message });
          throw error;
        }
      }, 

      fetchTokens: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get<ApiResponse<Token[]>>(
            `${apiLink}/payments/get-tokens`,
            { headers: { authorization: `${token}` } }
          );
          const tokens = response.data.data;
          // set({
          //   todayTokens: tokens.filter((t) => !t.transactionDateTime),
          //   pastTokens: tokens.filter((t) => t.transactionDateTime),
          //   isLoading: false,
          // });
          set({
            todayTokens: tokens.filter((t) => t.note === "Today"),
            pastTokens: tokens.filter((t) => t.note === "Past"),
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = (error as any)?.response?.data?.message || "Failed to fetch tokens";
          set({ isLoading: false, error: message });
        }
      },

      payNow: async (token: string) => {
        const { pastPayments } = get();
        if (pastPayments.payments.length === 0) return;

        set({ isLoading: true, error: null });
        try {
          const response = await axios.post<ApiResponse<any>>(
            `${apiLink}/payments/generate-todays-token`,
            { orderIds: pastPayments.payments.map((p) => p.orderId) },
            { headers: { authorization: `${token}` } }
          );
          set({ isLoading: false });
          return response.data;
        } catch (error: unknown) {
          const message = (error as any)?.response?.data?.message || "Failed to process payment";
          set({ isLoading: false, error: message });
          throw error;
        }
      },
    }),
    {
      name: "deposit-storage",
    } as PersistOptions<DepositStore>
  )
);

export default useDepositStore;