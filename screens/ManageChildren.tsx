import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import TitleSubtitle from '../components/TitleSubtitle';
import CustomButton from '../components/Button';
import { Crianca } from '../types/services/criancas';
import axios from '../hooks/useApi';
import { ApiError, TError } from '../types';
import ChildModal from '../components/CriarCriancaModal';
import EditChildModal from '../components/EditarCriancaModal';

const ManageChildrenScreen = () => {
    const [search, setSearch] = useState('');
    const [childrenList, setChildrenList] = useState<Crianca[]>([]);

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Estado para controlar o modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modaleEditVisible, setEditModalVisible] = useState(false);
    const [selectedChild, setSelectedChild] = useState<Crianca>({ ativo: true, dataCriacao: '', dataNascimento: '', id: 0, nome: '', responsavel: '' });


    const handleEdit = (child: Crianca) => {
        setSelectedChild(child);
        setEditModalVisible(true);
    };


    const handleAdd = () => {
        setSelectedChild({ ativo: true, dataCriacao: '', dataNascimento: '', id: 0, nome: '', responsavel: '' })
        setModalVisible(true);
    };


    useEffect(() => {
        const fetchChildren = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Crianca[]>('/api/Crianca');
                setChildrenList(response.data);
            } catch (error) {
                console.error('Erro ao buscar crianças:', error);
                const nError = error as TError | ApiError;

                setError(`Erro código: ${nError?.trace}, ${nError?.message}  `)
            } finally {
                setLoading(false);
            }
        };
        fetchChildren();
    }, [modalVisible, modaleEditVisible]);

    // Função para renderizar cada item da lista
    const renderChildItem = ({ item }: { item: Crianca }) => (
        <View style={styles.childItem}>
            <Text style={styles.childName}>{item.nome}</Text>
            <Text style={styles.childInfo}>
                Data de Nascimento: {new Date(item.dataNascimento).toLocaleDateString()} | Responsável: {item.responsavel}
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
            <TitleSubtitle title="Gerenciar Crianças" subtitle="Gerencie aqui todas as crianças do sistema" alignment="left" />

            {/* Título de "Crianças Cadastradas" */}
            <Text style={styles.sectionTitle}>Crianças Cadastradas</Text>

            {/* Campo de pesquisa */}
            <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar"
                value={search}
                onChangeText={setSearch}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <CustomButton
                text="Adicionar Criança"
                onPress={handleAdd}
                backgroundColor="#fe0000"
                style={{ marginVertical: 20 }}
            />

            {/* Lista de crianças */}
            {!loading &&
                <FlatList
                    data={childrenList.filter(child => child?.nome?.toLowerCase().includes(search.toLowerCase()))}
                    renderItem={renderChildItem}
                    keyExtractor={item => item?.id.toString()}
                />
            }
            <ChildModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}

            />
            <EditChildModal
                isVisible={modaleEditVisible}
                onClose={() => setEditModalVisible(false)}
                selectedChild={selectedChild} />
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
    childItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    childName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    childInfo: {
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

export default ManageChildrenScreen;
