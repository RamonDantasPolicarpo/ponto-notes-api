package com.example.ponto_notes_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table (name = "prioridade_tarefa", schema = "ponto")
public class PrioridadeTarefa {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "id_prioridade_tarefa")
    private Long idPrioridadeTarefa;

    @Column (name = "descricao_prioridade")
    private String descricaoPrioridade;
}
