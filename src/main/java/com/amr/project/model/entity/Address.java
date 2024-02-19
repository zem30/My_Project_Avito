package com.amr.project.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "city_index")
    private String cityIndex;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "country_id",referencedColumnName = "id")
    private Country country;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private City city;

    @Column
    private String street;

    @Column
    private String house;

    @JsonIgnore
    @OneToOne(mappedBy = "address", cascade = {CascadeType.PERSIST})
    private User user;

    @Override
    public String toString() {
        return "Address{" +
                "id=" + id +
                ", cityIndex='" + cityIndex + '\'' +
                ", country=" + country +
                ", city=" + city +
                ", street='" + street + '\'' +
                ", house='" + house + '\'' +
                '}';
    }

    public Address(String cityIndex) {
        this.cityIndex = cityIndex;
    }
}
