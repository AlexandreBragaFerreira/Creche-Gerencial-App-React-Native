import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../hooks/useApi';
import InputField from '../InputField';
import { CriarTurma } from '../../types/services/turmas';

interface TurmaModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const TurmaModal: React.FC<TurmaModalProps> = ({ isVisible, onClose }) => {
    const [nome, setNome] = useState('');
    const [capacidadeMaxima, setCapacidadeMaxima] = useState(0);
    const [idadeMinima, setIdadeMinima] = useState(0);
    const [idadeMaxima, setIdadeMaxima] = useState(0);
    const [loading, setLoading] = useState(false);

    // Função para salvar a turma
    const handleSaveTurma = async () => {
        if (!nome || capacidadeMaxima <= 0 || idadeMinima <= 0 || idadeMaxima <= 0) return; // Validação básica de campos

        const turmaData: CriarTurma = {
            nome,
            capacidadeMaxima,
            idadeMinima,
            idadeMaxima,
        };

        try {
            setLoading(true);
            // Enviar a requisição para criar a turma
            await axios.post('/api/Turma', turmaData, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem('@authToken')}`,
                },
            });
        } catch (error) {
            console.error('Erro ao salvar turma:', error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Adicionar Turma</Text>
                    <InputField
                        label="Nome"
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Nome da turma" keyboardType={'default'} />
                    <InputField
                        label="Capacidade Máxima"
                        value={capacidadeMaxima.toString()}
                        onChangeText={(text) => setCapacidadeMaxima(Number(text))}
                        keyboardType="numeric"
                        placeholder="Capacidade máxima"
                    />
                    <InputField
                        label="Idade Mínima"
                        value={idadeMinima.toString()}
                        onChangeText={(text) => setIdadeMinima(Number(text))}
                        keyboardType="numeric"
                        placeholder="Idade mínima"
                    />
                    <InputField
                        label="Idade Máxima"
                        value={idadeMaxima.toString()}
                        onChangeText={(text) => setIdadeMaxima(Number(text))}
                        keyboardType="numeric"
                        placeholder="Idade máxima"
                    />
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={styles.modalButton} onPress={handleSaveTurma} disabled={loading}>
                            <Text style={styles.modalButtonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#900500' }]} onPress={onClose}>
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

export default TurmaModal;
