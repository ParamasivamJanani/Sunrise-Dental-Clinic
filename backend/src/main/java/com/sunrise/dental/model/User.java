package com.sunrise.dental.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(nullable = false)
    private boolean isActive = true;

    public User() {}

    public User(Long id, String username, String email, String password, String fullName, Role role, boolean isActive) {
        this.id = id; this.username = username; this.email = email; this.password = password;
        this.fullName = fullName; this.role = role; this.isActive = isActive;
    }

    public enum Role { ADMIN, RECEPTIONIST, DENTIST }

    // Getters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getFullName() { return fullName; }
    public Role getRole() { return role; }
    public boolean isActive() { return isActive; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setRole(Role role) { this.role = role; }
    public void setActive(boolean active) { isActive = active; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private String username; private String email; private String password;
        private String fullName; private Role role; private boolean isActive = true;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder username(String u) { this.username = u; return this; }
        public Builder email(String e) { this.email = e; return this; }
        public Builder password(String p) { this.password = p; return this; }
        public Builder fullName(String f) { this.fullName = f; return this; }
        public Builder role(Role r) { this.role = r; return this; }
        public Builder isActive(boolean a) { this.isActive = a; return this; }
        public User build() { return new User(id, username, email, password, fullName, role, isActive); }
    }
}
