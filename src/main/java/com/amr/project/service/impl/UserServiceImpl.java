package com.amr.project.service.impl;

import com.amr.project.converter.UserMapper;
import com.amr.project.converter.UserUpdateMapper;
import com.amr.project.dao.abstracts.UserDao;
import com.amr.project.inserttestdata.repository.ItemRepository;
import com.amr.project.inserttestdata.repository.UserRepository;
import com.amr.project.model.dto.ImageDto;
import com.amr.project.model.dto.UserDto;
import com.amr.project.model.dto.UserUpdateDto;
import com.amr.project.model.entity.*;
import com.amr.project.model.enums.Gender;
import com.amr.project.service.abstracts.AddressService;
import com.amr.project.service.abstracts.CityService;
import com.amr.project.service.abstracts.CountryService;
import com.amr.project.service.abstracts.UserService;
import com.amr.project.service.email.EmailSenderService;
import com.amr.project.service.email.EmailVerificationService;
import com.amr.project.util.TrackedEmailUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.NoResultException;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.*;


@Service
public class UserServiceImpl extends ReadWriteServiceImpl<User, Long> implements UserService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService verificationService;
    private final TrackedEmailUser trackedEmailUser;
    private final EmailSenderService emailSenderService;
    private final UserRepository userRepository;
    private final CityService cityService;
    private final CountryService countryService;
    private final AddressService addressService;
    private final UserUpdateMapper userUpdateMapper;

    @Autowired
    public UserServiceImpl(EmailSenderService emailSenderService,
                           TrackedEmailUser trackedEmailUser,
                           UserDao userDao,
                           EmailVerificationService verificationService,
                           ItemRepository itemRepository,
                           UserRepository userRepository,
//                           UserMapper userMapper,
                           PasswordEncoder passwordEncoder,
                           CityService cityService,
                           CountryService countryService,
                           AddressService addressService,
                           UserUpdateMapper userUpdateMapper) {
        super(userDao);
        this.userDao = userDao;
        this.emailSenderService = emailSenderService;
        this.trackedEmailUser = trackedEmailUser;
        this.verificationService = verificationService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cityService = cityService;
        this.countryService = countryService;
        this.addressService = addressService;
        this.userUpdateMapper = userUpdateMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public User findByUsername(String username) throws NoResultException {
        return userDao.findByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public User findByEmail(String email) throws NoResultException {
        return userDao.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public User findByPhone(String phone) throws NoResultException {
        return userDao.findByPhone(phone);
    }

    @Override
    @Transactional
    public void persist(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.persist(user);
        verificationService.sendVerificationEmail(user);
    }

    @Override
    @Transactional
    public void update(User user) {
        userDao.update(user);
    }

    @Override
    @Transactional
    public void delete(User user) {
        emailSenderService.sendSimpleEmail(trackedEmailUser.trackedEmailUserDelete(user));
        userDao.delete(user);
    }

    @Override
    public List<User> findByRole(String role) throws NoResultException {
        return userDao.findByRole(role);
    }

    @Override
    @SuppressWarnings("unchecked")
    public User getAuthorized() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user;
    }

    @Override
    @SuppressWarnings("unchecked")
    public User getUserId(Long id){
        User user = userRepository.findById(id).orElse(null);
        return user;
    }

    @Override
    public UserUpdateDto getUserUpdateDtoById(Long id) {
        User user = userDao.getByKey(id);
        UserUpdateDto userUpdateDto = userUpdateMapper.userToDto(user);
        userUpdateDto.setPassword(null);
        return userUpdateDto;
    }

    @Override
    @Transactional
    public void updateUserDto(UserUpdateDto userUpdateDto) {
        User user = userDao.getByKey(userUpdateDto.getId());
        if (!(userUpdateDto.getPassword()=="")) {
            user.setPassword(passwordEncoder.encode(userUpdateDto.getPassword()));
        }
        System.err.println("Service: " + user);

        Gender[] list = Gender.values();
        Gender sex = Arrays.stream(list).filter(g -> g.toString().equals(userUpdateDto.getGender())).findFirst().orElseThrow();

        Address address = user.getAddress();
        City city = address.getCity();
        System.out.println("city: " + city);
        if(!city.getName().equals(userUpdateDto.getAddress().getCity())) {
            cityService.createAndSaveCity(userUpdateDto.getAddress().getCity(), userUpdateDto.getAddress().getCountry());
            city = cityService.getByName(userUpdateDto.getAddress().getCity());
            System.out.println("new city: " + city);
        }

        Country country = address.getCountry();
        System.out.println("country: " + country);
        if(!country.getName().equals(userUpdateDto.getAddress().getCountry())) {
            countryService.createAndSaveCountry(userUpdateDto.getAddress().getCountry(),
                    city);
            country = countryService.getByName(userUpdateDto.getAddress().getCountry());
            System.out.println("new country: " + country);
        }

        address.setCityIndex(userUpdateDto.getAddress().getCityIndex());
        address.setCountry(country);
        address.setCity(city);
        address.setStreet(userUpdateDto.getAddress().getStreet());
        address.setHouse(userUpdateDto.getAddress().getHouse());

        user.setEmail(userUpdateDto.getEmail());
        user.setUsername(userUpdateDto.getUsername());
        user.setUsername(userUpdateDto.getUsername());
        user.setPhone(userUpdateDto.getPhone());
        user.setFirstName(userUpdateDto.getFirstName());
        user.setLastName(userUpdateDto.getLastName());
        user.setAddress(address);
        user.setGender(sex);
        user.setBirthday(userUpdateDto.getBirthday());

        System.err.println("updated User: " + user);

        userRepository.save(user);
    }
}
