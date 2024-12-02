import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import TitleSubtitle from '../components/TitleSubtitle';
import CustomButton from '../components/Button';
import { Crianca } from '../types/services/criancas';
import { TurmaDTO } from '../types/services/turmas';
import axios from '../hooks/useApi';
import { ApiError, TError } from '../types';
import AgendamentoModal from '../components/CriarAgendamentoModal';
import { AgendamentoDTO } from '../types/services/agendamento';
import EditAgendamentoModal from '../components/EditarAgendamentosModal';

const ManageAgendamentosScreen = () => {
    const [search, setSearch] = useState('');
    const [agendamentosList, setAgendamentosList] = useState<AgendamentoDTO[]>([]);
    const [criancasList, setCriancasList] = useState<Crianca[]>([]);
    const [turmasList, setTurmasList] = useState<TurmaDTO[]>([]);

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Estado para controlar o modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEditVisible, setEditModalVisible] = useState(false);
    const [selectedAgendamento, setSelectedAgendamento] = useState<AgendamentoDTO>({
        id: 0,
        dataFinal: '',
        dataInicial: '', observacao: '',
        crianca: {
            id: 0, nome: '',
            dataNascimento: '',
            responsavel: '',
            dataCriacao: '',
            ativo: false
        },
        turma: {
            id: 0, nome: '',
            capacidadeMaxima: 0,
            idadeMinima: 0,
            idadeMaxima: 0,
            dataCriacao: '',
            ativo: false
        },
        dataCriacao: '',
        ativo: true,
    });

    const handleEdit = (agendamento: AgendamentoDTO) => {
        setSelectedAgendamento(agendamento);
        setEditModalVisible(true);
    };

    const handleAdd = () => {
        setSelectedAgendamento({
            id: 0,
            dataFinal: '',
            dataInicial: '', observacao: '',
            crianca: {
                id: 0, nome: '',
                dataNascimento: '',
                responsavel: '',
                dataCriacao: '',
                ativo: false
            },
            turma: {
                id: 0, nome: '',
                capacidadeMaxima: 0,
                idadeMinima: 0,
                idadeMaxima: 0,
                dataCriacao: '',
                ativo: false
            },
            dataCriacao: '',
            ativo: true,
        });
        setModalVisible(true);
    };

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                setLoading(true);
                const response = await axios.get<AgendamentoDTO[]>('/api/Agendamento');
                setAgendamentosList(response.data);
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
                const nError = error as TError | ApiError;
                setError(`Erro código: ${nError?.trace}, ${nError?.message}`);
            } finally {
                setLoading(false);
            }
        };

        const fetchCriancas = async () => {
            try {
                const response = await axios.get<Crianca[]>('/api/Crianca');
                setCriancasList(response.data);
            } catch (error) {
                console.error('Erro ao buscar crianças:', error);
            }
        };

        const fetchTurmas = async () => {
            try {
                const response = await axios.get<TurmaDTO[]>('/api/Turma');
                setTurmasList(response.data);
            } catch (error) {
                console.error('Erro ao buscar turmas:', error);
            }
        };

        fetchAgendamentos();
        fetchCriancas();
        fetchTurmas();

    }, [modalVisible, modalEditVisible]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Adiciona o zero à esquerda, se necessário
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0, então somamos 1
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
    };

    const renderAgendamentoItem = ({ item }: { item: AgendamentoDTO }) => (
        <View style={styles.agendamentoItem}>
            <Text style={styles.agendamentoData}>
                Data Inicial: {item?.dataInicial ? formatDate(item?.dataInicial.toString()) : 'Não informado'}
            </Text>
            <Text style={styles.agendamentoData}>
                Data Final: {item?.dataFinal ? formatDate(item?.dataFinal.toString()) : 'Não informado'}
            </Text>
            <Text style={styles.agendamentoInfo}>
                Criança: {item.crianca.nome} | Turma: {item.turma.nome}
            </Text>
            <CustomButton
                text="Editar"
                onPress={() => handleEdit(item)}
                backgroundColor="#fe0000"
                style={styles.editButton}
            />
        </View>
    );
    

    return (
        <SafeAreaView style={styles.safeArea}>
            <Image
                source={require('../assets/brand_icon.png')}
                style={styles.smallIcon}
            />

            {/* Título e Subtítulo */}
            <TitleSubtitle title="Gerenciar Agendamentos" subtitle="Gerencie os agendamentos de turmas e crianças" alignment="left" />

            {/* Campo de pesquisa */}
            <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar Agendamentos"
                value={search}
                onChangeText={setSearch}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <CustomButton
                text="Adicionar Agendamento"
                onPress={handleAdd}
                backgroundColor="#fe0000"
                style={{ marginVertical: 20 }}
            />

            {/* Lista de agendamentos */}
            {!loading &&
                <FlatList
                    data={agendamentosList.filter(agendamento => agendamento?.dataInicial?.toString().toLowerCase().includes(search.toLowerCase()))}
                    renderItem={renderAgendamentoItem}
                    keyExtractor={item => item?.id.toString()}
                />
            }

            <AgendamentoModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
            <EditAgendamentoModal
                isVisible={modalEditVisible}
                onClose={() => setEditModalVisible(false)}
                selectedAgendamento={selectedAgendamento}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    smallIcon: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    searchInput: {
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
    },
    agendamentoItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    agendamentoData: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    agendamentoInfo: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    editButton: {
        marginTop: 10,
    },
});

export default ManageAgendamentosScreen;
