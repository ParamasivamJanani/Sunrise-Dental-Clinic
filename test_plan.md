# Testing Methodology & Plan — Sunrise Dental Clinic

This document outlines the testing strategy used during the development of the Sunrise Dental Clinic system, specifically fulfilling the requirements of **Task C**.

## 1. Test-Driven Development (TDD) Approach
We utilized a TDD lifecycle (Red-Green-Refactor) for the critical business logic layers:
1. **Red**: Wrote unit tests for expected behaviors (e.g., throwing a `DuplicateAppointmentException` when registering an appointment that already exists).
2. **Green**: Implemented the minimum viable logic in the `AppointmentService` to pass the test.
3. **Refactor**: Optimized the code (e.g., using Java 25 builders instead of Lombok) while ensuring tests continued to pass.

## 2. Backend Unit Testing (JUnit 5 + Mockito)
All Service classes were isolated using Mockito to mock repository interactions.
- **`AppointmentServiceTest`**: Validated appointment registration, duplicate handling, and correct date querying.
- **`BillServiceTest`**: Validated the Strategy Pattern by ensuring different treatment types calculated distinct prices, and verified the `markAsPaid` status toggle.
- **`AuthServiceTest`**: Validated BCrypt password verification and JWT token generation logic.

*Note on JVM Compatibility*: Mocking on Java 25 required configuring the `maven-surefire-plugin` with the `-Dnet.bytebuddy.experimental=true` flag to support the newest JDK version.

## 3. Backend Integration Testing (MockMvc)
The presentation layer (Controllers) was tested using Spring's `MockMvc`:
- **`AppointmentControllerTest`**: Verified that the JSON serialization/deserialization works correctly.
- Verified that HTTP endpoints properly return `201 Created` for valid POST requests and `200 OK` for GET requests.
- Validated that Spring Security (`@WithMockUser`) correctly allows the `RECEPTIONIST` role to access protected endpoints.

## 4. Frontend Component Testing (Vitest + React Testing Library)
The React UI was tested to ensure proper rendering and user interaction flows:
- **`LoginPage.test.tsx`**: Verified that the form elements render, validation prevents empty submissions, and Axios is correctly invoked with the right payload.
- **`RegisterPage.test.tsx`**: Validated that the HTML5 client-side validation logic catches invalid Sri Lankan phone numbers and past dates before submission.

## 5. Execution Summary
- **Backend Tests**: 14/14 Passed (`mvn test`)
- **Frontend Tests**: 5/5 Passed (`npx vitest run`)
