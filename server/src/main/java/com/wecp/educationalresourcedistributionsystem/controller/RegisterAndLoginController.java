package com.wecp.educationalresourcedistributionsystem.controller;


import com.wecp.educationalresourcedistributionsystem.dto.LoginRequest;
import com.wecp.educationalresourcedistributionsystem.dto.LoginResponse;
import com.wecp.educationalresourcedistributionsystem.entity.User;
import com.wecp.educationalresourcedistributionsystem.jwt.JwtUtil;
import com.wecp.educationalresourcedistributionsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class RegisterAndLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    // @PostMapping("/api/user/register")
    // public ResponseEntity<User> registerUser(@RequestBody User user) {


    //     User registeredUser = userService.registerUser(user);
    //     return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    // }

@PostMapping("/api/user/register")
public ResponseEntity<User> registerUser(@RequestBody User user) {
    if (userService.existsByUsername(user.getUsername())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
    }
    User registeredUser = userService.registerUser(user);
    return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
}





    

    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password", e);
        }

        final UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());
        final String token = jwtUtil.generateToken(userDetails.getUsername());

        User user = userService.getUserByUsername(loginRequest.getUsername());
        return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getEmail(), user.getRole(),user.getId()));
    }
}
