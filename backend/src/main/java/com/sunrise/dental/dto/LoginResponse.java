package com.sunrise.dental.dto;

public class LoginResponse {
    private String token;
    private String refreshToken;
    private String role;
    private String fullName;
    private String username;

    public LoginResponse() {}
    public LoginResponse(String token, String refreshToken, String role, String fullName, String username) {
        this.token = token; this.refreshToken = refreshToken; this.role = role; this.fullName = fullName; this.username = username;
    }

    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
    public String getRole() { return role; }
    public String getFullName() { return fullName; }
    public String getUsername() { return username; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private String token, refreshToken, role, fullName, username;
        public Builder token(String t) { this.token = t; return this; }
        public Builder refreshToken(String rt) { this.refreshToken = rt; return this; }
        public Builder role(String r) { this.role = r; return this; }
        public Builder fullName(String f) { this.fullName = f; return this; }
        public Builder username(String u) { this.username = u; return this; }
        public LoginResponse build() { return new LoginResponse(token, refreshToken, role, fullName, username); }
    }
}
