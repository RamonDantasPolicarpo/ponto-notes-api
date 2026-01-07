package com.example.ponto_notes_api.controller;

import com.example.ponto_notes_api.model.Tarefa;
import com.example.ponto_notes_api.service.TarefaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping ("api/tarefas")
@CrossOrigin(origins = "*")
@Tag (name = "Tarefa", description = "API para app de gerenciamento de tarefas")
public class TarefaController {

    private TarefaService tarefaService;

    @Autowired
    public TarefaController(TarefaService tarefaService) {
        this.tarefaService = tarefaService;
    }

    @GetMapping
    @Operation (summary = "Listar todas as tarefas", description = "Retorna uma lista de todas as tarefas cadastradas")
    @ApiResponse (responseCode = "200", description = "Lista de tarefas retornada com sucesso")
    public List<Tarefa> listarTodas() {
        return tarefaService.listarTodas();
    }

    @PostMapping
    @ApiResponses (value = {
            @ApiResponse (responseCode = "201", description = "Tarefa criada com sucesso"),
            @ApiResponse (responseCode = "400", description = "Requisição inválida")
    })
    @Operation (summary = "Criar uma nova tarefa", description = "Cria uma nova tarefa com os dados fornecidos")
    Tarefa criarTarefa(@RequestBody Tarefa novaTarefa) {
        return tarefaService.salvar(novaTarefa);
    }

    @PutMapping ("/{id}")
    @Operation (summary = "Editar uma tarefa", description = "Atualiza os dados de uma tarefa existente com base no ID fornecido")
    @ApiResponses (value = {
            @ApiResponse (responseCode = "200", description = "Tarefa atualizada com sucesso"),
            @ApiResponse (responseCode = "404", description = "Tarefa não encontrada")
    })
    Tarefa editarTarefa(@PathVariable Long id, @RequestBody Tarefa tarefaDados) {
        return tarefaService.Atualizar(id, tarefaDados);
    }

    @DeleteMapping ("/{id}")
    @Operation (summary = "Deletar uma tarefa", description = "Remove uma tarefa existente com base no ID fornecido")
    @ApiResponses (value = {
            @ApiResponse (responseCode = "200", description = "Tarefa deletada com sucesso"),
            @ApiResponse (responseCode = "404", description = "Tarefa não encontrada")
    })
    public ResponseEntity<Map<String, Boolean>> deletarTarefa(@PathVariable Long id) {
        tarefaService.deletar(id);

        Map<String, Boolean> reposnse = new HashMap<>();
        reposnse.put("deletado", Boolean.TRUE);

        return ResponseEntity.ok(reposnse);
    }

    @GetMapping ("/{id}")
    @Operation (summary = "Buscar tarefa por ID", description = "Retorna os dados de uma tarefa específica com base no ID fornecido")
    @ApiResponses (value = {
            @ApiResponse (responseCode = "200", description = "Tarefa encontrada com sucesso"),
            @ApiResponse (responseCode = "404", description = "Tarefa não encontrada")
    })
    public Tarefa buscarPorId(@PathVariable Long id) {
        return tarefaService.buscarPorId(id);
    }

    @GetMapping ("/buscar")
    @Operation (summary = "Buscar tarefas por filtro", description = "Retorna uma lista de tarefas que correspondem aos critérios de filtro fornecidos")
    @ApiResponses (value = {
            @ApiResponse (responseCode = "200", description = "Lista de tarefas retornada com sucesso"),
            @ApiResponse (responseCode = "404", description = "Nenhum resultado encontrado com essa pesquisa")
    })
    public List<Tarefa> buscar(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) Long status) {
        return tarefaService.buscarPorFiltro(titulo, status);
    }

}
