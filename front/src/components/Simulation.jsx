import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TwoHandleSliderRangeInput from "./TwoHandleSliderRangeInput";

const Simulation = (props) => {
  const [teamList, setTeamList] = useState([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [selectedHomeLeague, setSelectedHomeLeague] = useState('');
  const [selectedAwayLeague, setSelectedAwayLeague] = useState('');
  const [homeLeagueList, setHomeLeagueList] = useState([]);
  const [awayLeagueList, setAwayLeagueList] = useState([]);
  const [filteredHomeTeamList, setFilteredHomeTeamList] = useState([]);
  const [filteredAwayTeamList, setFilteredAwayTeamList] = useState([]);
  const [zonesValues, setZonesValues] = useState([0, 100]);
  const [bet, setBet] = useState(10);

  const [predictionResult, setPredictionResult] = useState(null);

  const dataReducer = useSelector(state => state.dataReducer)
  const userReducer = useSelector(state => state.userReducer);

  useEffect(() => {
    setTeamList(dataReducer.teams)
  }, [dataReducer.teams]);

  useEffect(() => {
    const filteredCompetitions = dataReducer.competitions.filter(
      (league) => league.competitionId === 'ES1' || league.competitionId === 'FR1' || league.competitionId === 'NL1' || league.competitionId === 'PO1' || league.competitionId === 'IT1' || league.competitionId === 'L1' || league.competitionId === 'GB1'
    );
    setHomeLeagueList(filteredCompetitions);
    setAwayLeagueList(filteredCompetitions);
  }, [dataReducer.competitions]);

  useEffect(() => {
    if (selectedHomeLeague === "") {
      setFilteredHomeTeamList(dataReducer.teams)
    } else {
      const filteredTeams = teamList.filter(
        (team) => selectedHomeLeague !== '' && team.domesticCompetitionId === selectedHomeLeague
      );
      setFilteredHomeTeamList(filteredTeams);
    }
  }, [selectedHomeLeague]);

  useEffect(() => {
    if (selectedAwayLeague === "") {
      setFilteredAwayTeamList(dataReducer.teams)
    } else {
      const filteredTeams = teamList.filter(
        (team) => selectedAwayLeague !== '' && team.domesticCompetitionId === selectedAwayLeague
      );
      setFilteredAwayTeamList(filteredTeams);
    }
  }, [selectedAwayLeague]);

  useEffect(() => {
  }, [predictionResult]);


  useEffect(() => {
    console.log("userReducer.currentUser.credits", userReducer.currentUser.credits)
  }, [userReducer.currentUser.credits]);

  const handleZonesChange = (newValues) => {
    setZonesValues(newValues);
  };

  const handleBetChange = (e) => {
    setBet(e.target.value);
  };

  const handleHomeLeagueChange = (e) => {
    setSelectedHomeLeague(e.target.value);
  };

  const handleAwayLeagueChange = (e) => {
    setSelectedAwayLeague(e.target.value);
  };

  const handleHomeTeamChange = (e) => {
    setHomeTeam(e.target.value);
  };

  const handleAwayTeamChange = (e) => {
    setAwayTeam(e.target.value);
  };

  const handleApplyPrediction = (e) => {
    let predictionURL = "/soccerManager/games/predict?homeTeamId=" + homeTeam + "&awayTeamId=" + awayTeam;
    fetch(predictionURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        console.log("json", json);
        setPredictionResult(json);
      })
  };

  const handleBetAgainstIA = (e) => {
    console.log("bet againstIA")
    if(userReducer.userId && homeTeam && awayTeam){
      fetch("/game/betgames/bet", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "userId":userReducer.userId,
          "clubHomeId": homeTeam,
          "clubAwayId": awayTeam,
          "betWinHomeClub": zonesValues[0],
          "betWinAwayClub": zonesValues[1],
          "betDraw": (100 - zonesValues[1]-zonesValues[0]),
          "bet": bet
        }),
      })
        .then(response => response.json())
        .then(json => {
          console.log("json", json);
          let predictionResult = {
            "probabilite_victoire":json['predictionResultWinHomeClub'],
            "probabilite_nul":json['predictionResultDraw'],
            "probabilite_defaite":json['predictionResultWinAwayClub']
          }
          setPredictionResult(predictionResult);
        })
    }
  };

  return (
    <div>
      <div>
        <div>
          <label>
            Ligue de l'équipe à domicile:
            <select value={selectedHomeLeague} onChange={handleHomeLeagueChange}>
              <option value="">Toutes les ligues</option>
              {homeLeagueList.map((league) => (
                <option key={league.competitionId} value={league.competitionId}>
                  {league.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Equipe domicile :
            <select onChange={handleHomeTeamChange}>
              <option value="">Sélectionner l'équipe à domicile</option>
              {filteredHomeTeamList.map((team) => (
                <option key={team.clubId} value={team.clubId}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            Ligue de l'équipe visiteur:
            <select value={selectedAwayLeague} onChange={handleAwayLeagueChange}>
              <option value="">Toutes les ligues</option>
              {homeLeagueList.map((league) => (
                <option key={league.competitionId} value={league.competitionId}>
                  {league.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Equipe visiteur :
            <select onChange={handleAwayTeamChange}>
              <option value="">Sélectionner l'équipe des visiteurs</option>
              {filteredAwayTeamList.map((team) => (
                <option key={team.clubId} value={team.clubId}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <label>
        Résultat prédit par notre IA
      </label>
      {
        predictionResult !== null && (
          <div className="percentage-bar">
            <div className="percentage" style={{width: `${predictionResult.probabilite_victoire * 100}%`}}>
              {Math.round(predictionResult.probabilite_victoire * 100)}%
            </div>
            <div className="percentage2" style={{width: `${predictionResult.probabilite_nul * 100}%`}}>
              {Math.round(predictionResult.probabilite_nul * 100)}%
            </div>
            <div className="percentage3" style={{width: `${predictionResult.probabilite_defaite * 100}%`}}>
              {Math.round(predictionResult.probabilite_defaite * 100)}%
            </div>
          </div>
        )
      }

      <button onClick={handleApplyPrediction}>Simulation simple</button>
      <button onClick={handleBetAgainstIA}>Parier contre l'IA</button>

      <TwoHandleSliderRangeInput values={zonesValues} onChange={handleZonesChange} />


      <div>
        <label>
          Montant de la mise :
          <input type="number" value={bet} onChange={handleBetChange}/>
        </label>
      </div>
    </div>
  )
    ;
};

export default Simulation;