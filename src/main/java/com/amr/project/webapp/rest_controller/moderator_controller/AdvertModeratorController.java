package com.amr.project.webapp.rest_controller.moderator_controller;

import com.amr.project.converter.AdvertMapper;
import com.amr.project.model.dto.AdvertDto;
import com.amr.project.model.entity.Advert;
import com.amr.project.service.abstracts.AdvertService;
import com.amr.project.service.abstracts.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/moderator/api/adverts")
@Api(tags = {"API для работы с объявлениями на странице модератора"})
public class AdvertModeratorController {

    private final AdvertService advertService;
    private final AdvertMapper advertMapper;
    private final UserService userService;

    @Autowired
    public AdvertModeratorController(AdvertService advertService, AdvertMapper advertMapper, UserService userService) {
        this.advertService = advertService;
        this.advertMapper = advertMapper;
        this.userService = userService;
    }

    @ApiOperation(value = "Отправляет все объявления не прошедшие модерацию на фронт")
    @GetMapping("/getUnmoderatedAdverts")
    public ResponseEntity<List<AdvertDto>> getUnmoderatedAdverts() {
        return ResponseEntity.ok(
                advertService.getUnmoderatedAdvets()
                        .stream()
                        .map(advertMapper::advertToDto)
                        .collect(Collectors.toList()));
    }

    @ApiOperation(value = "Отправляет одно не прошедшее модерацию объявление на фронт по id")
    @GetMapping("/getOneUnmoderatedAdvert/{id}")
    public ResponseEntity<AdvertDto> getOneUnmoderatedAdvert(@PathVariable("id") Long id) {
        Advert advert = advertService.getByKey(id);
        if (advert == null || advert.isModerated()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(advertMapper.advertToDto(advert));
    }

    @ApiOperation(value = "Получает измененное объявление из фронта и обновляет в базе данных")
    @PutMapping("/editAdvert")
    public ResponseEntity<AdvertDto> editAdvert(@RequestBody AdvertDto advertDto) {
        Advert advert = advertMapper.dtoToAdvert(advertDto);
        advert.setUser(userService.getUserId(advertDto.getUserId()));
        advertService.update(advert);
        return ResponseEntity.ok(advertMapper.advertToDto(advert));
    }

    @ApiOperation(value = "возвращает на фронт количество не прошедших модерацию товаров для счетчика")
    @GetMapping("/getUnmoderatedAdvertsCount")
    public ResponseEntity<Long> getUnmoderatedItemsCount() {
        int size = advertService.getUnmoderatedAdvets().size();
        return ResponseEntity.ok((long) size);
    }

}
