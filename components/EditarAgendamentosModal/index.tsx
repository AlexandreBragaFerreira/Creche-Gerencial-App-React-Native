import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../hooks/useApi';
import InputField from '../InputField';
import SelectDropdown from 'react-native-select-dropdown';
import { AgendamentoDTO, AtualizarAgendamentoDTO } from '../../types/services/agendamento';

interface EditAgendamentoModalProps {
    isVisible: boolean;
    onClose: () => void;
    selectedAgendamento: AgendamentoDTO | null;
}

const EditAgendamentoModal: React.FC<EditAgendamentoModalProps> = ({
    isVisible,
    onClose,
    selectedAgendamento,
}) => {
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

        if (isVisible) {
            fetchTurmas();
            fetchCriancas();

            if (isVisible && selectedAgendamento) {
                setDataInicial(
                    new Date(selectedAgendamento.dataInicial)
                        .toLocaleDateString('pt-BR')
                );
                setDataFinal(
                    new Date(selectedAgendamento.dataFinal)
                        .toLocaleDateString('pt-BR')
                );
                setObservacao(selectedAgendamento?.observacao || '');
                setSelectedTurmaId(selectedAgendamento?.turma?.id);
                setSelectedCriancaId(selectedAgendamento?.crianca?.id);
            }
        }
    }, [isVisible, selectedAgendamento]);

    const handleSaveAgendamento = async () => {
        const parseDate = (date: string) => {
            const dateParts = date.split('/');
            return new Date(
                parseInt(dateParts[2]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0])
            ).toISOString();
        };

        const updatedAgendamento: AtualizarAgendamentoDTO = {
            id: selectedAgendamento?.id || 0,
            idCrianca: selectedCriancaId || 0,
            idTurma: selectedTurmaId || 0,
            dataInicial: parseDate(dataInicial),
            dataFinal: parseDate(dataFinal),
            observacoes: observacao,
        };

        try {
            setLoading(true);
            await axios.put(`/api/Agendamento/${selectedAgendamento?.id}`, updatedAgendamento, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem('@authToken')}`,
                },
            });
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar agendamento:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Editar Agendamento</Text>

                    {/* Seleção de Criança */}
                    <Text style={styles.label}>Selecione a Criança</Text>
                    <SelectDropdown
                        data={crianças}
                        defaultValue={crianças.find((crianca) => crianca.id === selectedCriancaId)}
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
                    />

                    {/* Seleção de Turma */}
                    <Text style={styles.label}>Selecione a Turma</Text>
                    <SelectDropdown
                        data={turmas}
                        defaultValue={turmas.find((turma) => turma.id === selectedTurmaId)} // Preencher com a turma associada
                        onSelect={(selectedItem) => setSelectedTurmaId(selectedItem.id)}
                        renderButton={(selectedItem) => {
                            return (
                                <View style={styles.dropdownButtonStyle}>
                                    <Text style={styles.dropdownButtonTxtStyle}>
                                        {selectedItem ? selectedItem.nome : 'Selecione a Turma'}
                                    </Text>
                                </View>
                            );
                        }}
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

                    {/* Observação */}
                    <InputField
                        label="Observação"
                        value={observacao}
                        onChangeText={setObservacao}
                        placeholder="Observações" keyboardType={'default'} />

                    {/* Botões */}
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
    dropdownButtonArrowStyle: {
        fontSize: 16,
    },
    dropdownItemStyle: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownItemIconStyle: {
        fontSize: 20,
        marginRight: 10,
    },
    dropdownItemTxtStyle: {
        fontSize: 16,
    },
    dropdownMenuStyle: {
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
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


export default EditAgendamentoModal;