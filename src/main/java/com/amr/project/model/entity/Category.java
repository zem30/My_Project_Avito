package com.amr.project.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.id.GUIDGenerator;

import javax.persistence.*;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Entity
@Table(name = "category")
//@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Category {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "guid", unique = true)
    private UUID guid;

    @Column(name = "category_name", unique = true)
    private String name;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinTable(
            name = "category_items",
            joinColumns = {@JoinColumn(name = "category_id")},
            inverseJoinColumns = {@JoinColumn(name = "item_id")}
    )
    private List<Item> items;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinTable(name = "category_advert")
    private List<Advert> adverts;

    public Category() {
        this.guid = UUID.randomUUID();
    }

    public String getGuid() {
        return guid.toString().replace("-","").toUpperCase();
    }

}
