package com.bej.authentication.domain;

import javax.persistence.Entity;
import javax.persistence.Id;

// Add the @Entity annotation
@Entity
public class User {
    // Make userId as the primary key by using the @Id annotation
    @Id
    private String emailId;
    private String password;

    public User() {
    }

    public User(String emailId, String password) {
        this.emailId = emailId;
        this.password = password;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "emailId='" + emailId + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
