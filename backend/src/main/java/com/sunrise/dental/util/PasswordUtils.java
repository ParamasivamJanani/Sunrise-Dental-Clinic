package com.sunrise.dental.util;

import java.security.SecureRandom;
import java.util.Base64;

public class PasswordUtils {

    public static String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[6];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
