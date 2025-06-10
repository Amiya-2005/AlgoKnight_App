import api from "./api";

const CONCEPT_ENDPOINTS = {
    GET_ALL: '/saved/concepts/get',
    ADD: '/saved/concepts/add',
    EDIT: '/saved/concepts/edit',
    REMOVE: '/saved/concepts/remove',
}

export const getAllConcepts = async () => {
    const response = await api.get(CONCEPT_ENDPOINTS.GET_ALL);
    return response.data;
}
export const addConcept = async (concept_details) => {
    const response = await api.post(CONCEPT_ENDPOINTS.ADD, concept_details);
    return response.data;
}
export const editConcept = async (concept_details, index) => {
    const response = await api.post(CONCEPT_ENDPOINTS.EDIT, { concept_details, index });
    return response.data;
}
export const removeConcept = async (index) => {
    const response = await api.post(CONCEPT_ENDPOINTS.REMOVE, { index });
    return response.data;
}

export default { getAllConcepts, addConcept, editConcept, removeConcept };