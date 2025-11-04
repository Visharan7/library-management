package com.library.librarymanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.library.librarymanagement.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
