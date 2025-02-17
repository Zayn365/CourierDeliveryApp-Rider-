import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import axios from 'axios';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

// Define types for the store
interface Chat {
  id: string;
  name?: string;
  createdAt?: string;
}

interface Message {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  type: string;
  file?: string;
  createdAt?: string;
}

interface ChatStore {
  notification: [];
  setNotification: (notification: any[]) => void;
  token: string | null;
  chats: Chat[];
  currentChatId: string | null;
  messages: Record<string, Message[]>;
  setChats: (chats: Chat[]) => void;
  createChatRoom: (
    message: string,
    token: string,
    orderId?: number,
  ) => Promise<void>;
  sendMessageApi: (
    content: string,
    type: string,
    token: string | null,
    file?: File,
  ) => Promise<void>;
  setCurrentChatId: (chatId: string) => void;
  intializeChatID: () => void;
  getChatByID: (token: string) => void;
}

const BASE_URL = API_URL;
const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      notification: [],
      setNotification: (notification: []) => set({notification}),
      token: null,
      chats: [],
      currentChatId: null,
      messages: {},

      // Set the token
      setChats: (chats: Chat[]) => set({chats}),

      // Set the current chat room ID
      setCurrentChatId: (chatId: string) => set({currentChatId: chatId}),

      // Create a chat room
      createChatRoom: async (
        message: string,
        token: string,
        orderId?: string,
      ) => {
        set({chats: []});
        let response: any;
        let chatId = null;
        try {
          response = await axios.post(
            `${BASE_URL}/chats/create-chat`,
            {message, orderId},
            {
              headers: {
                Authorization: token,
              },
            },
          );
          chatId = response.data?.data?.chatId;
          set({
            currentChatId: chatId,
          });
        } catch (error: any) {
          console.log(
            'Error in createChatRoom:',
            error?.message,
            error?.response?.data?.data,
          );
          if (error?.response?.data?.message === 'Already exists') {
            console.log(
              '🚀 ~ error?.response?.data?.data?.chatId:',
              error?.response?.data?.data?.chatId,
            );
            set({
              currentChatId: error?.response?.data?.data?.chatId,
            });
          } else {
            Alert.alert(
              'Error',
              error?.message || 'Failed to process chat request.',
            );
          }
        }
      },

      // Send a message
      sendMessageApi: async (
        content: string,
        type: string,
        token: string | null,
        file?: File,
      ) => {
        const chatId = get().currentChatId;
        try {
          const formData = new FormData();
          formData.append('chatId', chatId as string);
          formData.append('sender', 'user');
          formData.append('content', content);
          formData.append('type', type);

          if (file) {
            formData.append('file', file);
          }
          console.log(formData.getAll('file'), 'Check');
          const response: any = await axios.post(
            `${BASE_URL}/chats/send-message`,
            formData,
            {
              headers: {
                Authorization: token,
                'Content-Type': 'multipart/form-data',
              },
            },
          );

          const newMessage: Message | any = response.data?.data?.messages;
          set({chats: newMessage});
        } catch (error: any) {
          console.log('Error sending message:', error?.response);
          Alert.alert('Error', 'Failed to send message');
        }
      },
      intializeChatID: async () => {
        const chatID = await AsyncStorage.getItem('chatId');
        // console.log('🚀 ~ intializeChatID: ~ chatID:', chatID);

        set({currentChatId: chatID});
      },
      getChatByID: async (token: string, chatId: string) => {
        const response: any = await axios.get(
          `${BASE_URL}/chats/get-chat/${chatId}`,
          {
            headers: {
              Authorization: token,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        const res = response.data.data.chat?.messages;
        // console.log('🚀 ~ getChatByID: ~ res:', res);

        set({chats: res});
      },
    }),
    {
      name: 'chat-store', // Name of the storage key
      partialize: (state: any) => ({
        currentChatId: state.currentChatId,
      }), // Use AsyncStorage for React Native
    },
  ),
);

export default useChatStore;
