import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../hooks/useApi';
import InputField from '../InputField';
import { CriarUsuarioDto } from '../../types/services/usuarios';

interface UsuarioModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const UsuarioModal: React.FC<UsuarioModalProps> = ({ isVisible, onClose }) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    // Função para salvar o usuário
    const handleSaveUsuario = async () => {
        if (!nome || !email || !cargo || !senha) return; // Validação básica de campos

        const usuarioData: CriarUsuarioDto = {
            nome,
            email,
            cargo,
            senha,
        };

        try {
            setLoading(true);
            // Enviar a requisição para criar o usuário
            await axios.post('/api/Usuario', usuarioData, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem('@authToken')}`,
                },
            });
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Adicionar Usuário</Text>
                    <InputField
                        label="Nome"
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Nome do usuário"
                        keyboardType="default"
                    />
                    <InputField
                        label="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="E-mail do usuário"
                        keyboardType="email-address"
                    />
                    <InputField
                        label="Cargo"
                        value={cargo}
                        onChangeText={setCargo}
                        placeholder="Cargo do usuário"
                        keyboardType="default"
                    />
                    <InputField
                        label="Senha"
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="Senha do usuário"
                        secureTextEntry
                        keyboardType='default'
                    />
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={styles.modalButton} onPress={handleSaveUsuario} disabled={loading}>
                            <Text style={styles.modalButtonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#900500' }]}
                            onPress={onClose}
                        >
                            <Text style={styles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        backgroundColor: '#fe0000',
        padding: 10,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default UsuarioModal;
