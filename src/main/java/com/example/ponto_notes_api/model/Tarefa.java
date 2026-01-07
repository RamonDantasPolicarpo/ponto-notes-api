package com.example.ponto_notes_api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tarefa", schema ="ponto")
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarefa")
    @Schema(description = "Identificador único da tarefa", example = "1")
    private Long idTarefa;

    @Schema(description = "Título da tarefa", example = "Comprar mantimentos")
    private String titulo;
    @Schema(description = "Descrição detalhada da tarefa", example = "Comprar frutas, vegetais e pão na padaria")
    private String descricao;

    @Column(name = "data_vencimento")
    @Schema(description = "Data de vencimento da tarefa", example = "2024-12-31")
    private LocalDate dataVencimento;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_status_tarefa", nullable = false)
    @Schema(description = "Status atual da tarefa")
    private StatusTarefa statusTarefa;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_prioridade_tarefa", nullable = false)
    @Schema(description = "Prioridade da tarefa")
    private PrioridadeTarefa prioridadeTarefa;


}
