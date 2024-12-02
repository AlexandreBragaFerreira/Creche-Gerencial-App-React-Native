import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import TitleSubtitle from '../components/TitleSubtitle';
import CustomButton from '../components/Button';
import { TurmaDTO } from '../types/services/turmas';
import axios from '../hooks/useApi';
import { ApiError, TError } from '../types';
import TurmaModal from '../components/CriarTurmaModal';
import EditTurmaModal from '../components/EditarTurmaModal';

const ManageClassesScreen = () => {
    const [search, setSearch] = useState('');
    const [classesList, setClassesList] = useState<TurmaDTO[]>([]);

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Estado para controlar o modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEditVisible, setEditModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState<TurmaDTO>({ ativo: true, dataCriacao: '', id: 0, nome: '', capacidadeMaxima: 0, idadeMinima: 0, idadeMaxima: 0 });

    const handleEdit = (turma: TurmaDTO) => {
        setSelectedClass(turma);
        setEditModalVisible(true);
    };

    const handleAdd = () => {
        setSelectedClass({ ativo: true, dataCriacao: '', id: 0, nome: '', capacidadeMaxima: 0, idadeMinima: 0, idadeMaxima: 0 });
        setModalVisible(true);
    };

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const response = await axios.get<TurmaDTO[]>('/api/Turma');
                setClassesList(response.data);
            } catch (error) {
                console.error('Erro ao buscar turmas:', error);
                const nError = error as TError | ApiError;

                setError(`Erro código: ${nError?.trace}, ${nError?.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, [modalVisible, modalEditVisible]);

    // Função para renderizar cada item da lista
    const renderClassItem = ({ item }: { item: TurmaDTO }) => (
        <View style={styles.classItem}>
            <Text style={styles.className}>{item.nome}</Text>
            <Text style={styles.classInfo}>
                Capacidade Máxima: {item.capacidadeMaxima} | Idade Mínima: {item.idadeMinima} | Idade Máxima: {item.idadeMaxima}
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
            <TitleSubtitle title="Gerenciar Turmas" subtitle="Gerencie aqui todas as turmas do sistema" alignment="left" />

            {/* Título de "Turmas Cadastradas" */}
            <Text style={styles.sectionTitle}>Turmas Cadastradas</Text>

            {/* Campo de pesquisa */}
            <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar"
                value={search}
                onChangeText={setSearch}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <CustomButton
                text="Adicionar Turma"
                onPress={handleAdd}
                backgroundColor="#fe0000"
                style={{ marginVertical: 20 }}
            />

            {/* Lista de turmas */}
            {!loading &&
                <FlatList
                    data={classesList.filter(turma => turma?.nome?.toLowerCase().includes(search.toLowerCase()))}
                    renderItem={renderClassItem}
                    keyExtractor={item => item?.id.toString()}
                />
            }
            <TurmaModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
            <EditTurmaModal
                isVisible={modalEditVisible}
                onClose={() => setEditModalVisible(false)}
                selectedTurma={selectedClass}
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
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
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
    classItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    className: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    classInfo: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    editButton: {
        marginTop: 10,
    },
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
    modalInput: {
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 10,
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
    modalCloseButton: {
        marginTop: 20,
        backgroundColor: '#fe0000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
});

export default ManageClassesScreen;
