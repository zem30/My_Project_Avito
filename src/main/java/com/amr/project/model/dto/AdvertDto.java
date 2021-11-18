package com.amr.project.model.dto;

import com.amr.project.model.entity.Category;
import com.amr.project.model.entity.User;
import lombok.*;

import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@Builder
public class AdvertDto {
    private Long id;
    private String name;
    private String description;
    private int price;
    private String email;
    private List<CategoryDto>categories;
    private User user;
}
