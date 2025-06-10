import api from './api';

const NETWORK_ENDPOINTS = {
    ALL_CONNECTIONS: '/fetch/network',
    TOGGLE_CONNECTION: '/friends/toggleFriend',
    SEARCH_USER: '/fetch/searchUser',
};

export const getAllConnections = async () => {
    const response = await api.get(NETWORK_ENDPOINTS.ALL_CONNECTIONS);
    return response.data;
}

export const toggleConnection = async (cid) => {
    const response = await api.post(NETWORK_ENDPOINTS.TOGGLE_CONNECTION, { friend_id: cid });
    return response.data;
}

export const searchUsers = async (keyword) => {
    const response = await api.post(NETWORK_ENDPOINTS.SEARCH_USER, {searchQuery : keyword});
    return response.data;
}

export default {
    getAllConnections,
    toggleConnection,
    searchUsers
}
