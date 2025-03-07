package kripton.userservice.controller;

import kripton.userservice.feignClientKeycloak.AuthService;
import kripton.userservice.feignClientKeycloak.LoginRequest;
import kripton.userservice.feignClientKeycloak.LoginResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



//@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        return authService.loginToKeycloak(request);
    }
}
