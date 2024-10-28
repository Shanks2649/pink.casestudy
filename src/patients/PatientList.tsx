import React, {useEffect, useState} from "react";
import fhirClient from "../fhirClient";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {NavigateFunction, useNavigate} from "react-router-dom";

export interface FhirPatient {
    id: string;
    name: string;
    gender?: string;
    birthDate?: string;
}

const PatientList: React.FC = () => {
    const [patients, setPatients] = useState<FhirPatient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const client = fhirClient;
                const response = await client.request("Patient", {pageLimit: 1});

                const fetchedPatients: FhirPatient[] = response.entry.map((entry: any) => {
                    const patient = entry.resource;
                    const name = patient.name && patient.name[0] ? patient.name[0].text || `${patient.name[0].given?.join(" ")} ${patient.name[0].family}` : "Unbekannt";
                    return {
                        id: patient.id,
                        name,
                        gender: patient.gender,
                        birthDate: patient.birthDate,
                    };
                });
                setPatients(fetchedPatients);
            } catch (error) {
                console.error("Fehler beim Laden der Daten:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);
    const navigate: NavigateFunction = useNavigate();

    const table = useMaterialReactTable({
        data: patients,
        enableColumnActions: false,
        enableTopToolbar: false,
        muiTableBodyRowProps: ({row}) => ({
            onClick: (event) => {
                navigate(`/patients/${row.original.id}`);
            },
            sx: {
                cursor: 'pointer',
            },
        }),
        columns: [{
            header: "Id",
            accessorKey: "id",
        }, {
            header: "Name",
            accessorKey: "name",
        }, {
            header: "Geschlecht",
            accessorKey: "gender",
        }, {
            header: "Gebrutsdatum",
            accessorKey: "birthDate",
        }]
    });

    if (loading) return <div>Loading...</div>;
    return (
        <div>
            <h1>Patient List</h1>
            <MaterialReactTable
                table={table}
            />
        </div>
    );
};

export default PatientList;