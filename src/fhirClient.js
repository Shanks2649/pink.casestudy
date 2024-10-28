import FHIR from "fhirclient";

const fhirClient = FHIR.client({
    serverUrl: "http://hapi.fhir.org/baseR4",
});

export default fhirClient;