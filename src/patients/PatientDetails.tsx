import React, {useEffect, useState} from "react";
import {Card, CardContent, Typography} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {useParams} from "react-router-dom";
import fhirClient from "../fhirClient";
import {Patient} from "fhir/r4";


const PatientDetails: React.FC = () => {
    const {patientId} = useParams();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            setLoading(true);
            try {
                const response = await fhirClient.request<Patient>(`Patient/${patientId}`);
                setPatient(response);
            } catch (error) {
                console.error("Fehler beim Laden der Daten:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientDetails();
    }, [patientId]);

    if (loading) return <div>Loading...</div>;
    if (!patient) return <div>Patientendaten nicht verfügbar.</div>;

    // Format patient name
    const name =
        patient.name && patient.name[0]
            ? patient.name[0].text || `${patient.name[0].given?.join(" ")} ${patient.name[0].family}`
            : "Unknown";

    return (
        <Card style={{maxWidth: 600, margin: "20px auto"}}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    Details zum Patienten
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Typography variant="h6">Name:</Typography>
                        <Typography>{name}</Typography>
                    </Grid>

                    <Grid size={6}>
                        <Typography variant="h6">Geschlecht:</Typography>
                        <Typography>{patient.gender}</Typography>
                    </Grid>

                    <Grid size={6}>
                        <Typography variant="h6">Geburtsdatum:</Typography>
                        <Typography>{patient.birthDate}</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography variant="h6">Telefon:</Typography>
                        <Typography>
                            {patient.telecom?.find((contact) => contact.system === "phone")?.value || "-"}
                        </Typography>
                    </Grid>

                    <Grid size={6}>
                        <Typography variant="h6">Email:</Typography>
                        <Typography>
                            {patient.telecom?.find((contact) => contact.system === "email")?.value || "-"}
                        </Typography>
                    </Grid>

                    <Grid size={12}>
                        <Typography variant="h6">Adresse:</Typography>
                        <Typography>
                            {patient.address && patient.address[0]
                                ? `${patient.address[0].line?.join(", ")}, ${patient.address[0].city}, ${patient.address[0].state}, ${patient.address[0].postalCode}`
                                : "Keine Adresse verfügbar"}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default PatientDetails;
