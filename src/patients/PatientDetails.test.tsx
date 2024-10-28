import { render, screen, waitFor } from '@testing-library/react';
import PatientDetails from './PatientDetails';
import { Patient } from 'fhir/r4';
import '@testing-library/jest-dom/extend-expect';
import fhirClient from "../fhirClient";

const mockPatientData: Patient = {
    resourceType: 'Patient',
    id: '12345',
    name: [{ given: ['Peter'], family: 'Müller' }],
    gender: 'male',
    birthDate: '1990-01-01',
};
jest.mock('../fhirClient', () => {
    return {
        request: jest.fn(() => mockPatientData)
    }
});

describe('PatientDetails Component', () => {


    beforeEach(() => {
        (fhirClient.request as jest.Mock).mockReset(); // Reset mock before each test
    });

    it('renders patient details when data is successfully fetched', async () => {
        (fhirClient.request as jest.Mock).mockResolvedValue(mockPatientData); // Mock resolved value

        render(<PatientDetails />);

        await waitFor(() => {
            expect(screen.getByText('Details zum Patienten')).toBeInTheDocument();
            expect(screen.getByText('Peter Müller')).toBeInTheDocument();
            expect(screen.getByText('male')).toBeInTheDocument();
            expect(screen.getByText('1990-01-01')).toBeInTheDocument();
        });
    });

    it("renders loading indicator while fetching data", () => {
        (fhirClient.request as jest.Mock).mockReturnValue(new Promise(() => {})); // Mock unresolved promise to simulate loading
        render(<PatientDetails />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("displays error message when patient data cannot be fetched", async () => {
        (fhirClient.request as jest.Mock).mockRejectedValue(new Error("Fehler beim Laden der Daten"));
        render(<PatientDetails />);
        await waitFor(() => {
            expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
            expect(screen.getByText("Patientendaten nicht verfügbar.")).toBeInTheDocument();
        });
    });
});
