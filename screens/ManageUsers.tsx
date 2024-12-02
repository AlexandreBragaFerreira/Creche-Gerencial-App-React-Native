import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import TitleSubtitle from '../components/TitleSubtitle';
import CustomButton from '../components/Button';
import { UsuarioDto } from '../types/services/usuarios';
import axios from '../hooks/useApi';
import { ApiError, TError } from '../types';
import UsuarioModal from '../components/CriarUsuarioModal';
import EditUsuarioModal from '../components/EditarUsuarioModal';

const ManageUsersScreen = () => {
    const [search, setSearch] = useState('');
    const [usersList, setUsersList] = useState<UsuarioDto[]>([]);

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Estado para controlar o modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEditVisible, setEditModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UsuarioDto>({ id: 0, nome: '', email: '', dataCriacao: '', ativo: true, cargo: '' });

    const handleEdit = (usuario: UsuarioDto) => {
        setSelectedUser(usuario);
        setEditModalVisible(true);
    };

    const handleAdd = () => {
        setSelectedUser({ id: 0, nome: '', email: '', ativo: true, cargo: '', dataCriacao: '' });
        setModalVisible(true);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get<UsuarioDto[]>('/api/Usuario');
                setUsersList(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                const nError = error as TError | ApiError;

                setError(`Erro código: ${nError?.trace}, ${nError?.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [modalVisible, modalEditVisible]);

    // Função para renderizar cada item da lista
    const renderUserItem = ({ item }: { item: UsuarioDto }) => (
        <View style={styles.userItem}>
            <Text style={styles.userName}>{item.nome}</Text>
            <Text style={styles.userInfo}>Email: {item.email}</Text>
            <Text style={styles.userInfo}>Status: {item.ativo ? 'Ativo' : 'Inativo'}</Text>
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
            <TitleSubtitle title="Gerenciar Usuários" subtitle="Gerencie os usuários do sistema" alignment="left" />

            {/* Título de "Usuários Cadastrados" */}
            <Text style={styles.sectionTitle}>Usuários Cadastrados</Text>

            {/* Campo de pesquisa */}
            <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar"
                value={search}
                onChangeText={setSearch}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <CustomButton
                text="Adicionar Usuário"
                onPress={handleAdd}
                backgroundColor="#fe0000"
                style={{ marginVertical: 20 }}
            />

            {/* Lista de usuários */}
            {!loading && (
                <FlatList
                    data={usersList.filter(user => user?.nome?.toLowerCase().includes(search.toLowerCase()))}
                    renderItem={renderUserItem}
                    keyExtractor={item => item?.id.toString()}
                />
            )}
            <UsuarioModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
            <EditUsuarioModal
                isVisible={modalEditVisible}
                onClose={() => setEditModalVisible(false)}
                selectedUsuario={selectedUser}
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
    userItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userInfo: {
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

export default ManageUsersScreen;
