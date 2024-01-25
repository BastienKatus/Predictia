package com.predictia.soccermanager.service;

import com.predictia.dto.CompetitionDTO;
import com.predictia.soccermanager.mapper.CompetitionMapper;
import com.predictia.soccermanager.model.CompetitionModel;
import com.predictia.soccermanager.repository.CompetitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CompetitionService {

    @Autowired
    private CompetitionRepository competitionRepository;

    @Autowired
    private CompetitionMapper competitionMapper;

    static final String TYPE_LEAGUE = "domestic_league";

    public List<CompetitionDTO> getAllCompetitions()  {
        Iterable<CompetitionModel> competitionModels =  competitionRepository.findAllByType(TYPE_LEAGUE);
        List<CompetitionModel> competitionModelList = new ArrayList<>();
        competitionModels.forEach(competitionModelList::add);
        return new ArrayList<>(competitionMapper.listCompetitionEntityToCompetitionDTO(competitionModelList));

    }

    public CompetitionDTO getCompetitionById(Integer id)  {
        Optional<CompetitionModel> competitionModel = competitionRepository.findById(id);
        return competitionModel.map(model -> competitionMapper.competitionEntityToCompetitionDTO(model)).orElse(null);
    }
}
