import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../hooks/useApi';
import InputField from '../InputField';
import { CriarCrianca, EditarCrianca } from '../../types/services/criancas';

interface EditChildModalProps {
    isVisible: boolean;
    onClose: () => void;
    selectedChild: EditarCrianca | null;
}

const EditChildModal: React.FC<EditChildModalProps> = ({
    isVisible,
    onClose,
    selectedChild,
}) => {
    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState<string>(''); // String no formato dd/mm/yyyy
    const [responsavel, setResponsavel] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedChild) {
            setNome(selectedChild.nome);
            setDataNascimento(formatDate(new Date(selectedChild.dataNascimento))); // Formatar a data recebida
            setResponsavel(selectedChild.responsavel);
        }
    }, [selectedChild]);

    // Função para formatar a data em dd/mm/yyyy
    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Função para salvar as alterações
    const handleSaveChild = async () => {
        if (!nome || !dataNascimento || !responsavel || !selectedChild) return; // Validação básica de campos

        // Converter a data de nascimento para o formato Date antes de enviar
        const dateParts = dataNascimento.split('/');
        const formattedDate = new Date(
            parseInt(dateParts[2]), // Ano
            parseInt(dateParts[1]) - 1, // Mês (0-indexed)
            parseInt(dateParts[0]) // Dia
        );

        const updatedChild: CriarCrianca = {
            ...selectedChild,
            nome,
            dataNascimento: formattedDate.toISOString(),
            responsavel
        };

        try {
            setLoading(true);
            // Atualizar a criança
            await axios.put(`/api/Crianca/${selectedChild?.id}`, updatedChild, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem('@authToken')}`,
                },
            });
        } catch (error) {
            console.error('Erro ao atualizar criança:', error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>

                    <InputField
                        label="Nome"
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Nome" keyboardType={'default'} />
                    <InputField
                        label="Data de nascimento"
                        value={dataNascimento}
                        onChangeText={setDataNascimento}
                        placeholder="dd/mm/yyyy" keyboardType={'default'} />
                    <InputField
                        label="Responsável"
                        value={responsavel}
                        onChangeText={setResponsavel}
                        placeholder="Responsável" keyboardType={'default'} />
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={styles.modalButton} onPress={handleSaveChild} disabled={loading}>
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
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

export default EditChildModal;
