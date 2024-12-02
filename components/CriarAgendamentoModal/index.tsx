import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../hooks/useApi';
import InputField from '../InputField';
import SelectDropdown from 'react-native-select-dropdown';

interface AgendamentoModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const AgendamentoModal: React.FC<AgendamentoModalProps> = ({ isVisible, onClose }) => {
    const [nome, setNome] = useState('');
    const [dataInicial, setDataInicial] = useState<string>('');
    const [dataFinal, setDataFinal] = useState<string>('');
    const [observacao, setObservacao] = useState('');
    const [loading, setLoading] = useState(false);

    const [turmas, setTurmas] = useState<any[]>([]);
    const [crianças, setCrianças] = useState<any[]>([]);
    const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
    const [selectedCriancaId, setSelectedCriancaId] = useState<number | null>(null);

    useEffect(() => {
        const fetchTurmas = async () => {
            try {
                const response = await axios.get('/api/Turma', {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem('@authToken')}`,
                    },
                });
                setTurmas(response.data);
            } catch (error) {
                console.error('Erro ao carregar turmas:', error);
            }
        };

        const fetchCriancas = async () => {
            try {
                const response = await axios.get('/api/Crianca', {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem('@authToken')}`,
                    },
                });
                setCrianças(response.data);
            } catch (error) {
                console.error('Erro ao carregar crianças:', error);
            }
        };

        fetchTurmas();
        fetchCriancas();
    }, [isVisible]);

    const handleSaveAgendamento = async () => {
        const parseDate = (dateString: string): string => {
            const [day, month, year] = dateString.split('/');
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
        };

        const agendamentoData = {
            idCrianca: selectedCriancaId,
            idTurma: selectedTurmaId,
            dataInicial: parseDate(dataInicial),
            dataFinal: parseDate(dataFinal),
            observacao,
        };

        try {
            setLoading(true);
            await axios.post('/api/Agendamento', agendamentoData, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem('@authToken')}`,
                },
            });
            onClose();
        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Criar Agendamento</Text>

                    <Text style={styles.label}>Selecione a Criança</Text>
                    <SelectDropdown
                        data={crianças}
                        onSelect={(selectedItem) => setSelectedCriancaId(selectedItem.id)}
                        renderButton={(selectedItem) => (
                            <View style={styles.dropdownButtonStyle}>
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {selectedItem ? selectedItem.nome : 'Selecione a Criança'}
                                </Text>
                            </View>
                        )}
                        renderItem={(item, index, isSelected) => (
                            <View
                                style={{
                                    ...styles.dropdownItemStyle,
                                    ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                }}
                            >
                                <Text style={styles.dropdownItemTxtStyle}>{item.nome}</Text>
                            </View>
                        )}
                        dropdownStyle={styles.dropdownMenuStyle}
                        showsVerticalScrollIndicator={false}
                    />

                    <Text style={styles.label}>Selecione a Turma</Text>
                    <SelectDropdown
                        data={turmas}
                        onSelect={(selectedItem) => setSelectedTurmaId(selectedItem.id)}
                        renderButton={(selectedItem) => (
                            <View style={styles.dropdownButtonStyle}>
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {selectedItem ? selectedItem.nome : 'Selecione a Turma'}
                                </Text>
                            </View>
                        )}
                        renderItem={(item, index, isSelected) => (
                            <View
                                style={{
                                    ...styles.dropdownItemStyle,
                                    ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                }}
                            >
                                <Text style={styles.dropdownItemTxtStyle}>{item.nome}</Text>
                            </View>
                        )}
                        dropdownStyle={styles.dropdownMenuStyle}
                        showsVerticalScrollIndicator={false}
                    />

                    <InputField
                        label="Data Inicial"
                        value={dataInicial}
                        onChangeText={setDataInicial}
                        placeholder="DD/MM/YYYY"
                        keyboardType="default"
                    />
                    <InputField
                        label="Data Final"
                        value={dataFinal}
                        onChangeText={setDataFinal}
                        placeholder="DD/MM/YYYY"
                        keyboardType="default"
                    />
                    <InputField
                        label="Observação"
                        value={observacao}
                        onChangeText={setObservacao}
                        placeholder="Observações"
                        keyboardType="default"
                    />

                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleSaveAgendamento}
                            disabled={loading}
                        >
                            <Text style={styles.modalButtonText}>
                                {loading ? 'Salvando...' : 'Salvar'}
                            </Text>
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
    dropdownMenuStyle: {
        width: '100%',
    },
    dropdownButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    dropdownButtonTxtStyle: {
        fontSize: 16,
        flex: 1,
    },
    dropdownItemStyle: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownItemTxtStyle: {
        fontSize: 16,
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

export default AgendamentoModal;
