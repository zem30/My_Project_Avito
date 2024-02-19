package com.amr.project.webapp.rest_controller.user_rest_controller;

import com.amr.project.converter.ItemMapper;
import com.amr.project.converter.OrderMapper;
import com.amr.project.converter.ShopMapper;
import com.amr.project.converter.UserMapper;
import com.amr.project.model.dto.*;
import com.amr.project.model.entity.User;
import com.amr.project.model.enums.Status;
import com.amr.project.service.abstracts.OrderService;
import com.amr.project.service.abstracts.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
@Api(tags = {"Api для работы с юзером и его данными"})
public class UserRestController {

    private final UserService userService;
    private final ShopMapper shopMapper;
    private final ItemMapper itemMapper;
    private final UserMapper userMapper;
    private final OrderService orderService;

    @GetMapping("/getUser")
    @ApiOperation(value = "Получение зарегистрированного пользователя")
    public ResponseEntity<UserDto> getUser() {
       UserDto userDto = userMapper.userToDto(userService.getAuthorized());
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/registration")
    @ApiOperation(value = "Валидация пользователя , поиск пользователя по ключевым полям в бд и дальнейшая регистрация ")
    public ResponseEntity<?> registrationNewUser(@Valid @RequestBody User user) {
        Map<String, Object> body = new LinkedHashMap<>();
        User registeredUser = userService.findByEmail(user.getEmail());
        if (registeredUser != null) {
            body.put("isExist", "User with this email exist");
            return ResponseEntity.badRequest().body(body);
        }
        registeredUser = userService.findByPhone(user.getPhone());
        if (registeredUser != null) {
            body.put("isExist", "User with this phone exist");
            return ResponseEntity.badRequest().body(body);
        }
        registeredUser = userService.findByUsername(user.getUsername());
        if (registeredUser != null) {
            body.put("isExist", "User with this username exist");
            return ResponseEntity.badRequest().body(body);
        }
        userService.persist(user);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/getUserShops/{id}")
    @ApiOperation(value = "Отдает список магазинов юзера с айди указанным в url")
    public ResponseEntity<List<ShopDto>> getShops(@PathVariable("id") Long id) {
        User user = userService.getUserId(id);
        List<ShopDto> shops = new ArrayList<>();
        user.getShops().forEach(shop -> shops.add(shopMapper.shopToDto(shop)));
        if (shops.size() < 1) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(shops);

    }

    @GetMapping("/getUserSalesItems/{id}")
    @ApiOperation(value = "Отдает список купленных товаров юзера с айди указанным в url")
    public ResponseEntity<List<ItemDto>> getUserSalesItems(@PathVariable("id") Long id) {
        User user = userService.getUserId(id);
        List<ItemDto> itemDtos = new ArrayList<>();
        user.getOrders().stream().forEach(order -> order.getItems().stream().forEach(item -> itemDtos.add(itemMapper.itemToDto(item))));
        if (itemDtos.size() == 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(itemDtos);

    }

    @GetMapping("/getOrders/{id}")
    @ApiOperation(value = "Отдает список заказов юзера с айди указанным в url")
    public ResponseEntity<List<OrderDto>> getOrders(@PathVariable("id") Long id) {
        User user = userService.getByKey(id);

        List<OrderDto> orderDtos = new ArrayList<>();
        user.getOrders().forEach(order -> orderDtos.add(OrderMapper.INSTANCE.orderToDto(order)));
        if (orderDtos.size() == 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderDtos);
    }

    @GetMapping("/getUser/{id}/getOrders/{shopId}/shop")
    @ApiOperation(value = "Список всех заказов пользователя со статусом 'COMPLETE' по id магазина")
    public ResponseEntity<List<OrderDto>> getOrdersByShopId(@PathVariable("id") Long id,
                                                            @PathVariable("shopId") Long shopId) {
        List<OrderDto> ordersDto = orderService.findAllByUserAndStatusAndShopId(id, Status.COMPLETE, shopId)
                .stream().map(OrderMapper.INSTANCE::orderToDto).collect(Collectors.toList());

        if (ordersDto.size() == 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(ordersDto);
    }

    @GetMapping("/getUser/{id}/getOrders/{itemId}/item")
    @ApiOperation(value = "Заказ пользователя со статусом 'COMPLETE' по id товара")
    public ResponseEntity<List<OrderDto>> getOrdersByItemId(@PathVariable("id") Long id,
                                                            @PathVariable("itemId") Long itemId) {
        List<OrderDto> ordersDto = orderService.findAllByUserAndStatusAndItemId(id, Status.COMPLETE, itemId)
                .stream().map(OrderMapper.INSTANCE::orderToDto).collect(Collectors.toList());

        if (ordersDto.size() == 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(ordersDto);
    }

    @GetMapping("/getUser/{id}")
    @ApiOperation(value = "Возвращает пользователя по id")
    public ResponseEntity<UserUpdateDto> getUserById(@PathVariable long id) {
        return new ResponseEntity<>(userService.getUserUpdateDtoById(id), HttpStatus.OK);
    }

    @PutMapping("/user")
    public ResponseEntity<UserUpdateDto> updateUser(@RequestBody UserUpdateDto userUpdateDto) {
        userService.updateUserDto(userUpdateDto);
        return new ResponseEntity<>(userUpdateDto, HttpStatus.OK);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Integer> deactivateUser(@PathVariable long id) {
        int idDeactivate = userService.deactivateUser(id);
        return new ResponseEntity<>(idDeactivate, HttpStatus.ACCEPTED);
    }
}
