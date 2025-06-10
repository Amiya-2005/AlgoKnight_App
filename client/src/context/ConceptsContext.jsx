import { createContext } from "react";
import conceptService from "../services/conceptService";

export const ConceptsContext = createContext();

export default function ConceptsProvider ({children}) {

    const getAllConcepts = async() => {
        try {
            const response = await conceptService.getAllConcepts();
            console.log("Response from server for get concepts req : ", response);
            return response.allConcepts;
        } catch (error) {
            console.log("Server call failed for get concepts req", error);
        } 
    }
    const addConcept = async(concept_details) => {
        try {
            const response = await conceptService.addConcept(concept_details);
            console.log("Response from server for add concept req : ", response);
            return response;
        } catch (error) {
            console.log("Server call failed for add concept req", error);
        } 
    }
    const editConcept = async(concept_details, index) => {
        try {
            const response = await conceptService.editConcept(concept_details , index);
            console.log("Response from server for edit concept req : ", response);
            return response;
        } catch (error) {
            console.log("Server call failed for edit concept req", error);
        } 
    }
    const removeConcept = async(index) => {
        try {
            const response = await conceptService.removeConcept(index);
            console.log("Response from server for remove concept req : ", response);
            return response;
        } catch (error) {
            console.log("Server call failed for remove concept req", error);
        } 
    }

    
    const value = {
        getAllConcepts,
        addConcept,
        editConcept,
        removeConcept
    }
    return <ConceptsContext.Provider value={value}>
        {children}
    </ConceptsContext.Provider>
}