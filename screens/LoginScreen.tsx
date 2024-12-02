import React, { useState } from 'react';
import { SafeAreaView, View, Image, StyleSheet, Text } from 'react-native';
import TitleSubtitle from '../components/TitleSubtitle';
import Button from '../components/Button';
import InputField from '../components/InputField';
import axios from '../hooks/useApi';
import { ApiError, TError } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse } from '../types/services/credenciais';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            // Realizando a chamada à API            
            const payload = {
                email,
                senha: password,
            };

            const response = await axios.post('/api/Credenciais/login', payload);

            await AsyncStorage.setItem('@authToken', response?.data?.token);

            navigation.navigate('HomeScreen');

        } catch (err: any) {
            console.log('erro', err)
            const nError = error as TError | ApiError;

            setError(`Erro código: ${nError?.trace}, ${nError?.message}  `,
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>

                <Image
                    source={require('../assets/brand_icon.png')}
                    style={styles.icon}
                />

                <TitleSubtitle
                    title="Entre agora mesmo"
                    subtitle="Entre com sua conta para continuar usando nosso aplicativo."
                    alignment="center"
                />

                <InputField
                    label="Insira seu email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email" keyboardType={'default'} />

                <InputField
                    label="Insira sua senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="Senha" keyboardType={'default'} />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Button
                    text="Entrar"
                    onPress={handleLogin}
                    backgroundColor="#fe0000"
                    style={{ marginTop: 30 }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        padding: 20
    },
    icon: {
        aspectRatio: 1,
        height: '20%',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
    },
});

export default LoginScreen;
