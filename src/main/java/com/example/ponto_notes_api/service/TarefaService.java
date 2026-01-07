package com.example.ponto_notes_api.service;

import com.example.ponto_notes_api.exception.ResourceNotFuondException;
import com.example.ponto_notes_api.model.Tarefa;
import com.example.ponto_notes_api.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TarefaService {

    private final TarefaRepository tarefaRepository;

    @Autowired
    public TarefaService(TarefaRepository tarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    public List<Tarefa> listarTodas() {
        return tarefaRepository.findAll();
    }

    public Tarefa salvar(Tarefa tarefa) {
        return tarefaRepository.save(tarefa);
    }

    public Tarefa Atualizar(Long id, Tarefa tarefaDados) {
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFuondException("Erro ao encontrar tarefa: " + id));

        tarefa.setTitulo(tarefaDados.getTitulo());
        tarefa.setDescricao(tarefaDados.getDescricao());
        tarefa.setDataVencimento(tarefaDados.getDataVencimento());
        tarefa.setStatusTarefa(tarefaDados.getStatusTarefa());
        tarefa.setPrioridadeTarefa(tarefaDados.getPrioridadeTarefa());

        return tarefaRepository.save(tarefa);
    }

    public void deletar(Long id) {
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFuondException("Erro ao encontrar tarefa: " + id));
        tarefaRepository.delete(tarefa);
    }

    public Tarefa buscarPorId(Long id) {
        return tarefaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFuondException("Erro ao encontrar tarefa: " + id));
    }

    public List<Tarefa> buscarPorTitulo(String titulo) {
        List<Tarefa> resultados = tarefaRepository.findByTituloContainingIgnoreCase(titulo);
                if (resultados.isEmpty()) {
                    throw new RuntimeException("Nenhum resultado encontrado com essa pesquisa");
                }
                return resultados;
    }

    public List<Tarefa> buscarPorStatus(Long idStatusTarefa) {
        List<Tarefa> resultados = tarefaRepository.findByStatusTarefa_IdStatusTarefa(idStatusTarefa);
                if (resultados.isEmpty()) {
                    throw new RuntimeException("Nenhum resultado encontrado com esse status");
                }
                return resultados;
    }

    public List<Tarefa> buscarPorFiltro(String titulo, Long idStatusTarefa) {
        if (titulo != null && idStatusTarefa != null) {
            return tarefaRepository.findByTituloContainingIgnoreCaseAndStatusTarefa_IdStatusTarefa(titulo, idStatusTarefa);
        } else if (titulo != null) {
            return buscarPorTitulo(titulo);
        } else if (idStatusTarefa != null) {
            return buscarPorStatus(idStatusTarefa);
        } else {
            return listarTodas();
        }
    }
}
