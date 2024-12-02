import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Defina a URL base para todas as requisições
axios.defaults.baseURL = process.env.API_URL;

// Função para configurar o token de autenticação
const setAuthHeader = async () => {
  const token = await AsyncStorage.getItem('@authToken');
  console.log('oi', token)
  if (token) {
    // Defina o cabeçalho Authorization globalmente
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Caso não haja token, não envie cabeçalho de autenticação
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Chama a função de configuração do token
setAuthHeader();

export default axios;
