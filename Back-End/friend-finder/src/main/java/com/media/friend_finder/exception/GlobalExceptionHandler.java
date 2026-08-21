//package com.media.friend_finder.exception;
//
//import com.media.friend_finder.dto.ErrorResponse;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import java.util.stream.Collectors;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    // 1. بيصطاد أخطاء الـ Validation (زي باسوورد ضعيف، إيميل غلط)
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
//        // بنجمع كل رسائل الخطأ من الـ DTO
//        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
//                .map(error -> error.getDefaultMessage())
//                .collect(Collectors.joining(", "));
//
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                .body(new ErrorResponse(errorMessage, HttpStatus.BAD_REQUEST.value()));
//    }
//
//    // 2. بيصطاد خطأ الإيميل المتكرر
//    @ExceptionHandler(UserAlreadyExistsException.class)
//    public ResponseEntity<ErrorResponse> handleUserExistsException(UserAlreadyExistsException ex) {
//        return ResponseEntity.status(HttpStatus.CONFLICT)
//                .body(new ErrorResponse(ex.getMessage(), HttpStatus.CONFLICT.value()));
//    }
//
//    // 3. بيصطاد أي خطأ غير متوقع
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(new ErrorResponse("حدث خطأ في السيرفر: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
//    }
//
//    // 4. بيصطاد الباسوورد أو الإيميل الغلط في اللوجين
//    @ExceptionHandler(BadCredentialsException.class)
//    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                .body(new ErrorResponse("البريد الإلكتروني أو كلمة المرور غير صحيحة", HttpStatus.UNAUTHORIZED.value()));
//    }
//}


package com.media.friend_finder.exception;

import com.media.friend_finder.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /*
     * =========================================================
     * 1. Validation Errors
     * =========================================================
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex
    ) {

        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(
                        new ErrorResponse(
                                errorMessage,
                                HttpStatus.BAD_REQUEST.value()
                        )
                );
    }


    /*
     * =========================================================
     * 2. User Already Exists
     * =========================================================
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserExistsException(
            UserAlreadyExistsException ex
    ) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .contentType(MediaType.APPLICATION_JSON)
                .body(
                        new ErrorResponse(
                                ex.getMessage(),
                                HttpStatus.CONFLICT.value()
                        )
                );
    }


    /*
     * =========================================================
     * 3. Bad Credentials
     * =========================================================
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException ex
    ) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(
                        new ErrorResponse(
                                "البريد الإلكتروني أو كلمة المرور غير صحيحة",
                                HttpStatus.UNAUTHORIZED.value()
                        )
                );
    }


    /*
     * =========================================================
     * 4. Any Other Exception
     * =========================================================
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex
    ) {

        /*
         * مهم جدًا أثناء التطوير:
         * نطبع الـ exception الحقيقي في الـ backend console
         * بدل ما نضيع السبب الحقيقي.
         */
        ex.printStackTrace();

        String message = ex.getMessage();

        if (message == null || message.isBlank()) {
            message = "حدث خطأ غير متوقع في السيرفر";
        }

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(
                        new ErrorResponse(
                                "حدث خطأ في السيرفر: " + message,
                                HttpStatus.INTERNAL_SERVER_ERROR.value()
                        )
                );
    }
}