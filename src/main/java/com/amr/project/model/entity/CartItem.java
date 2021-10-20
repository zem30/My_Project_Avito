package com.amr.project.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;



@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany (fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private List<Item> items;

    @ManyToOne(cascade = {CascadeType.MERGE})
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @JsonIgnore
    @ManyToOne(cascade = {CascadeType.MERGE})
    @JoinColumn(name = "user_id")
    private User user;

    private int quantity;

//    @Transient
//    public BigDecimal getSubTotal() {
//        return this.item.getPrice().subtract(BigDecimal.valueOf(this.item.getDiscount())
//                        .multiply(this.item.getPrice())
//                        .divide(BigDecimal.valueOf(100)))
//                .multiply(new BigDecimal(quantity)).setScale(2, RoundingMode.CEILING);
//    }


}
