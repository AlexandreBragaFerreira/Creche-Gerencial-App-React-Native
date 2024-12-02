import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../hooks/useApi';
import InputField from '../InputField';
import { AtualizarTurmaDTO, TurmaDTO } from '../../types/services/turmas';

interface EditTurmaModalProps {
    isVisible: boolean;
    onClose: () => void;
    selectedTurma: TurmaDTO | null;
}

const EditTurmaModal: React.FC<EditTurmaModalProps> = ({
    isVisible,
    onClose,
    selectedTurma,
}) => {
    const [nome, setNome] = useState('');
    const [capacidadeMaxima, setCapacidadeMaxima] = useState<number>(0);
    const [idadeMinima, setIdadeMinima] = useState<number>(0);
    const [idadeMaxima, setIdadeMaxima] = useState<number>(0);
    const [ativo, setAtivo] = useState<boolean>(true);
    const [criancasIds, setCriancasIds] = useState<number[]>([]);
    const [agendamentosIds, setAgendamentosIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedTurma) {
            setNome(selectedTurma.nome);
            setCapacidadeMaxima(selectedTurma.capacidadeMaxima);
            setIdadeMinima(selectedTurma.idadeMinima);
            setIdadeMaxima(selectedTurma.idadeMaxima);
            setAtivo(selectedTurma.ativo);            
        }
    }, [selectedTurma]);

    const handleSaveTurma = async () => {
        if (!nome || capacidadeMaxima <= 0 || idadeMinima <= 0 || idadeMaxima <= 0 || !selectedTurma) return;

        const updatedTurma: AtualizarTurmaDTO = {
            ...selectedTurma,
            nome,
            capacidadeMaxima,
            idadeMinima,
            idadeMaxima,
            ativo,
            criancasIds,
            agendamentosIds,
        };

        try {
            setLoading(true);
            // Atualizar a turma
            await axios.put(`/api/Turma/${selectedTurma.id}`, updatedTurma, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem('@authToken')}`,
                },
            });
        } catch (error) {
            console.error('Erro ao atualizar turma:', error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Editar Turma</Text>
                    <InputField
                        label="Nome"
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Nome" keyboardType={'default'} />
                    <InputField
                        label="Capacidade Máxima"
                        value={String(capacidadeMaxima)}
                        onChangeText={(text) => setCapacidadeMaxima(Number(text))}
                        placeholder="Capacidade Máxima"
                        keyboardType="numeric"
                    />
                    <InputField
                        label="Idade Mínima"
                        value={String(idadeMinima)}
                        onChangeText={(text) => setIdadeMinima(Number(text))}
                        placeholder="Idade Mínima"
                        keyboardType="numeric"
                    />
                    <InputField
                        label="Idade Máxima"
                        value={String(idadeMaxima)}
                        onChangeText={(text) => setIdadeMaxima(Number(text))}
                        placeholder="Idade Máxima"
                        keyboardType="numeric"
                    />
                    <View style={styles.toggleContainer}>
                        <Text style={styles.label}>Ativo</Text>
                        <TouchableOpacity
                            style={[styles.toggleButton, ativo ? styles.active : styles.inactive]}
                            onPress={() => setAtivo(!ativo)}
                        >
                            <Text style={styles.toggleButtonText}>{ativo ? 'Ativo' : 'Inativo'}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Você pode adicionar campos para selecionarem as crianças e agendamentos se necessário */}
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
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    toggleButton: {
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    active: {
        backgroundColor: '#fe0000',
    },
    inactive: {
        backgroundColor: '#900500',
    },
    toggleButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
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

export default EditTurmaModal;
