package com.amr.project.model.entity;

import com.amr.project.model.enums.Gender;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.validator.constraints.Length;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.Calendar;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private int age;
    private boolean activate;
    private String activationCode;
    private Gender gender;
    private Calendar birthday;

    @Column(unique = true)
    @NotBlank
    @Email(message = "Введите корректный email")
    private String email;

    @Column(unique = true)
    @NotBlank(message = "Введите имя пользователя")
    @Length(min = 4, message = "Имя пользователя должно быть не менее 4 символов")
    private String username;

    @Column
    @NotBlank(message = "Введите пароль")
    @Length(min = 6, message = "пароль должен быть не менее 6 символов")
    private String password;

    @Column(unique = true)
    @Length(min = 11, message = "phone number must be at least 11 characters")
    private String phone;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "address_id",referencedColumnName = "id")
    @ToString.Exclude
    private Address address;

    @ManyToMany(fetch = FetchType.LAZY, targetEntity = Role.class, cascade = CascadeType.MERGE)
    @JoinTable(name = "user_role",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")})
    @ToString.Exclude
    private Set<Role> roles;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id",referencedColumnName = "id")
    @ToString.Exclude
    private Image images;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinTable(name = "user_coupon",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "coupon_id")})
    @ToString.Exclude
    private List<Coupon> coupons;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<CartItem> cartItems;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinTable(name = "user_adverts",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "advert_id")})
    private List<Advert> adverts;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Order> orders;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_review",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "review_id")})
    @ToString.Exclude
    private List<Review> reviews;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_shop",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "shop_id")})
    @ToString.Exclude
    private List<Shop> shops;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    private Favorite favorite;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "users_discounts",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "discount_id")})
    @ToString.Exclude
    private List<Discount> discounts;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return activate;
    }

}