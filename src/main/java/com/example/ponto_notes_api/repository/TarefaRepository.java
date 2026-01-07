package com.example.ponto_notes_api.repository;

import com.example.ponto_notes_api.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {

    public List<Tarefa> findByTituloContainingIgnoreCase(String titulo);

    public List<Tarefa> findByStatusTarefa_IdStatusTarefa(Long idStatusTarefa);

    public List<Tarefa> findByTituloContainingIgnoreCaseAndStatusTarefa_IdStatusTarefa(String titulo, Long idStatusTarefa);
}

