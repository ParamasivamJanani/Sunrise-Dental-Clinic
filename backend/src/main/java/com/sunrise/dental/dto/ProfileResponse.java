package com.sunrise.dental.dto;

public class ProfileResponse {

    private String username;
    private String email;
    private String fullName;
    private String contactNumber;
    private String address;
    private String role;

    public ProfileResponse() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String username, email, fullName, contactNumber, address, role;
        public Builder username(String v) { this.username = v; return this; }
        public Builder email(String v) { this.email = v; return this; }
        public Builder fullName(String v) { this.fullName = v; return this; }
        public Builder contactNumber(String v) { this.contactNumber = v; return this; }
        public Builder address(String v) { this.address = v; return this; }
        public Builder role(String v) { this.role = v; return this; }
        public ProfileResponse build() {
            ProfileResponse r = new ProfileResponse();
            r.username = username; r.email = email; r.fullName = fullName;
            r.contactNumber = contactNumber; r.address = address; r.role = role;
            return r;
        }
    }
}
