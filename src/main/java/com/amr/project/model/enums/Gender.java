package com.amr.project.model.enums;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Gender {
    MALE("male"),
    FEMALE("female"),
    UNKNOWN("unknown");

    private String value;

    Gender(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static Gender fromString(String text) {
        for (Gender gender : Gender.values()) {
            if (gender.value.equalsIgnoreCase(text)) {
                return gender;
            }
        }
        throw new IllegalArgumentException("No constant with text " + text + " found");
    }
}