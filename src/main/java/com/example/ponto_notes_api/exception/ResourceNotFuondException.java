package com.example.ponto_notes_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFuondException extends RuntimeException {
  public ResourceNotFuondException(String message) {
    super(message);
  }
}
