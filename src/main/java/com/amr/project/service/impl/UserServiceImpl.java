package com.amr.project.service.impl;

import com.amr.project.dao.impl.ReadWriteDao;
import com.amr.project.model.entity.User;
import com.amr.project.service.abstracts.ReadWriteServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ReadWriteServiceImpl<User,Long> {

    protected UserServiceImpl(ReadWriteDao<User, Long> dao) {
        super(dao);
    }
}
