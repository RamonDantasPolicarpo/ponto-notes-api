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
@Table(name = "status_tarefa", schema = "ponto")
public class StatusTarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "id_status_tarefa")
    private Long idStatusTarefa;

    @Column(name = "descricao_status")
    private String descricaoStatus;
}
